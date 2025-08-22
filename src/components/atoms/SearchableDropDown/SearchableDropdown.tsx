"use client";

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { 
  MagnifyingGlassIcon, 
  XMarkIcon, 
  ChevronDownIcon, 
  ExclamationCircleIcon,
  ChevronRightIcon 
} from '@heroicons/react/24/outline';
import { useDropdown } from './useDropdown';
import DropdownMenu from './DropdownMenu';
import { debounce } from '../../../utils/debounce';
import { searchProducts, searchUsers, searchPosts, searchAll } from '../../../services/apiService';
import type { SearchableDropdownProps, SearchableDropdownOption } from './SearchableDropdown.types';

export function SearchableDropdown({
  name = '',
  value = '',
  onChange,
  onSearch,
  placeholder = 'Type to search...',
  className = '',
  disabled = false,
  autoFocus = false,
  
  // Select props
  label,
  error,
  required = false,
  isClearable = false,
  
  // Data
  options = [],
  
  // Mode
  mode = 'search',
  
  // Search specific
  enableAutocomplete = true,
  maxSuggestions = 15,
  
  // API specific
  apiSearchType = 'products', // 'products', 'users', 'posts', 'all'
  enableApiSearch = true,
  debounceDelay = 300,
  
  // Styling
  maxHeight = 300,
  showCategoryIcons = true,
  
  // Callbacks
  onFocus,
  onBlur
}: SearchableDropdownProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [autocompleteText, setAutocompleteText] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [textWidth, setTextWidth] = useState(0);
  const [apiOptions, setApiOptions] = useState<SearchableDropdownOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const lastValueRef = useRef(value);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  
  const isSelectMode = mode === 'select';
  const isSearchMode = mode === 'search';
  
  // Find selected option for select mode
  const selectedOption = isSelectMode && value ? 
    options.find(option => option.value === value) : null;

  // Get API search function based on type
  const getApiSearchFunction = useCallback(() => {
    switch (apiSearchType) {
      case 'products': return searchProducts;
      case 'users': return searchUsers;
      case 'posts': return searchPosts;
      case 'all': return searchAll;
      default: return searchProducts;
    }
  }, [apiSearchType]);

  // API search function with debouncing
  const debouncedApiSearch = useMemo(
    () => debounce(async (query: string) => {
      if (!query.trim() || !enableApiSearch || !isSearchMode) {
        setApiOptions([]);
        setIsLoading(false);
        return;
      }

      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller
      abortControllerRef.current = new AbortController();

      try {
        setIsLoading(true);
        setApiError(null);
        
        const searchFunction = getApiSearchFunction();
        const results = await searchFunction(query);
        
        // Check if request was aborted
        if (abortControllerRef.current?.signal.aborted) {
          return;
        }
        
        setApiOptions(results);
      } catch (err: unknown) {
        if (err instanceof Error && err.name !== 'AbortError') {
          console.error('API search error:', err);
          setApiError('Failed to fetch search results');
          setApiOptions([]);
        }
      } finally {
        setIsLoading(false);
      }
    }, debounceDelay),
    [enableApiSearch, isSearchMode, getApiSearchFunction, debounceDelay]
  );

  // Combine static options with API options
  const combinedOptions = useMemo(() => {
    if (!isSearchMode || !enableApiSearch) {
      return options;
    }
    
    // For search mode, prioritize API results
    return [...apiOptions, ...options];
  }, [options, apiOptions, isSearchMode, enableApiSearch]);

  // Dark mode detection
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };

    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  // Cleanup abort controller on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Create a hidden canvas for precise text measurement
  useEffect(() => {
    if (!canvasRef.current) {
      canvasRef.current = document.createElement('canvas');
    }
  }, []);

  // Measure text width precisely
  const measureText = useCallback((text: string) => {
    if (!canvasRef.current || !text) return 0;
    
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return 0;

    // Match the input's font exactly
    const inputElement = dropdown.inputRef.current;
    if (inputElement) {
      const styles = window.getComputedStyle(inputElement);
      context.font = `${styles.fontSize} ${styles.fontFamily}`;
    } else {
      // Fallback font
      context.font = '14px ui-sans-serif, system-ui, sans-serif';
    }

    return context.measureText(text).width;
  }, []);

  // Filter function for dropdown options
  const filterFunction = useMemo(() => {
    return (items: SearchableDropdownOption[], query: string) => {
      if (!query.trim()) {
        return isSelectMode ? items : [];
      }
      
      const filtered = items.filter(item =>
        item.label.toLowerCase().includes(query.toLowerCase()) ||
        (item.category && item.category.toLowerCase().includes(query.toLowerCase()))
      );
      
      return isSearchMode ? filtered.slice(0, maxSuggestions) : filtered;
    };
  }, [isSelectMode, isSearchMode, maxSuggestions]);

  // Dropdown hook
  const dropdown = useDropdown({
    items: combinedOptions,
    filterFn: filterFunction,
    onSelect: (option) => {
      const newValue = option.value;
      onChange?.(newValue, option);
      
      if (isSearchMode) {
        onSearch?.(newValue);
      }
      
      setAutocompleteText("");
    },
    isDisabled: disabled
  });

  // Update cursor position and text width
  const updateCursorPosition = useCallback(() => {
    const inputElement = dropdown.inputRef.current;
    if (!inputElement) return;

    const cursorPos = inputElement.selectionStart || 0;
    const textBeforeCursor = dropdown.inputValue.substring(0, cursorPos);
    const width = measureText(textBeforeCursor);
    
    setCursorPosition(cursorPos);
    setTextWidth(width);
  }, [dropdown.inputRef, dropdown.inputValue, measureText]);

  // Set up cursor position tracking
  useEffect(() => {
    const inputElement = dropdown.inputRef.current;
    if (!inputElement) return;

    // Update on input change
    updateCursorPosition();

    // Update on cursor movement
    const handleSelectionChange = () => {
      setTimeout(updateCursorPosition, 0);
    };

    inputElement.addEventListener('keyup', handleSelectionChange);
    inputElement.addEventListener('mouseup', handleSelectionChange);
    inputElement.addEventListener('focus', handleSelectionChange);
    inputElement.addEventListener('input', handleSelectionChange);

    return () => {
      inputElement.removeEventListener('keyup', handleSelectionChange);
      inputElement.removeEventListener('mouseup', handleSelectionChange);
      inputElement.removeEventListener('focus', handleSelectionChange);
      inputElement.removeEventListener('input', handleSelectionChange);
    };
  }, [updateCursorPosition]);

  // Initialize component
  useEffect(() => {
    if (!isInitialized) {
      const displayValue = isSelectMode && selectedOption ? selectedOption.label : value;
      dropdown.setInputValueSilent(displayValue);
      setIsInitialized(true);
      lastValueRef.current = value;
    }
  }, [selectedOption, isInitialized, dropdown, value, isSelectMode]);

  // Update display value when prop value changes (for select mode)
  useEffect(() => {
    if (isInitialized && lastValueRef.current !== value) {
      if (isSelectMode) {
        const displayValue = selectedOption ? selectedOption.label : '';
        if (!dropdown.isOpen) {
          dropdown.setInputValueSilent(displayValue);
        }
      } else {
        dropdown.setInputValueSilent(value);
      }
      lastValueRef.current = value;
    }
  }, [value, selectedOption, isInitialized, dropdown, isSelectMode]);

  // Handle input changes
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    const cursorPos = e.target.selectionStart || 0;
    
    dropdown.setInputValue(newValue);
    
    if (isSearchMode) {
      onChange?.(newValue);
      
      // Trigger API search with debouncing
      if (enableApiSearch) {
        debouncedApiSearch(newValue);
      }
    }
    
    // Handle autocomplete for both modes
    if (enableAutocomplete) {
      setAutocompleteText("");
      
      if (newValue.trim()) {
        // Only show autocomplete if cursor is at the end of input
        if (cursorPos === newValue.length) {
          const firstMatch = combinedOptions.find(item => 
            item.label.toLowerCase().startsWith(newValue.toLowerCase()) &&
            item.label.toLowerCase() !== newValue.toLowerCase()
          );
          
          if (firstMatch && newValue.length > 0) {
            setTimeout(() => {
              const currentInput = dropdown.inputRef.current;
              if (currentInput && 
                  currentInput.value === newValue && 
                  newValue.trim() &&
                  (currentInput.selectionStart || 0) === newValue.length) {
                const stillMatches = firstMatch.label.toLowerCase().startsWith(newValue.toLowerCase());
                if (stillMatches) {
                  setAutocompleteText(firstMatch.label);
                }
              }
            }, 50);
          }
        }
      }
    }
  }, [dropdown, isSearchMode, enableAutocomplete, combinedOptions, onChange, enableApiSearch, debouncedApiSearch]);

  // Accept autocomplete suggestion
  const acceptAutocomplete = useCallback(() => {
    if (autocompleteText && autocompleteText.toLowerCase().startsWith(dropdown.inputValue.toLowerCase())) {
      const matchingOption = combinedOptions.find(option => 
        option.label.toLowerCase() === autocompleteText.toLowerCase()
      );
      
      if (matchingOption) {
        if (isSelectMode) {
          // For select mode, update the selected value
          onChange?.(matchingOption.value, matchingOption);
          dropdown.setInputValueSilent(matchingOption.label);
        } else {
          // For search mode, just update the input
          dropdown.setInputValue(autocompleteText);
          onChange?.(autocompleteText);
        }
      }
      
      setAutocompleteText("");
      dropdown.close();
    }
  }, [autocompleteText, dropdown, onChange, combinedOptions, isSelectMode]);

  // Handle key presses
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      dropdown.close();
      
      if (isSelectMode) {
        const displayValue = selectedOption ? selectedOption.label : '';
        dropdown.setInputValueSilent(displayValue);
      }
      
      dropdown.inputRef.current?.blur();
      setAutocompleteText("");
      return;
    }
    
    // Enhanced autocomplete handling
    if (enableAutocomplete && autocompleteText) {
      const inputElement = e.target as HTMLInputElement;
      const cursorPos = inputElement.selectionStart || 0;
      const isAtEnd = cursorPos === dropdown.inputValue.length;
      
      if ((e.key === 'Tab' || (e.key === 'ArrowRight' && isAtEnd)) && 
          autocompleteText.toLowerCase().startsWith(dropdown.inputValue.toLowerCase())) {
        e.preventDefault();
        acceptAutocomplete();
        return;
      }
      
      // Clear autocomplete on cursor movement keys
      if (['ArrowLeft', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(e.key)) {
        setAutocompleteText("");
      }
    }
    
    if (isSearchMode) {
      if (e.key === 'Enter') {
        if (dropdown.highlightedIndex === -1) {
          if (enableAutocomplete && autocompleteText && autocompleteText.toLowerCase().startsWith(dropdown.inputValue.toLowerCase())) {
            acceptAutocomplete();
          } else {
            onSearch?.(dropdown.inputValue);
            dropdown.close();
          }
        }
      }
    } else if (isSelectMode) {
      if (e.key === 'Enter') {
        if (dropdown.highlightedIndex === -1 && enableAutocomplete && autocompleteText && autocompleteText.toLowerCase().startsWith(dropdown.inputValue.toLowerCase())) {
          acceptAutocomplete();
          return;
        }
      }
    }
    
    dropdown.handleKeyDown(e);
  }, [dropdown, isSelectMode, isSearchMode, selectedOption, autocompleteText, onSearch, enableAutocomplete, acceptAutocomplete]);

  // Handle input focus
  const handleInputFocus = useCallback(() => {
    if (!disabled) {
      if (isSelectMode || (isSearchMode && dropdown.inputValue.trim() && dropdown.filteredItems.length > 0)) {
        dropdown.open();
      }
      setAutocompleteText("");
      onFocus?.();
    }
  }, [disabled, isSelectMode, isSearchMode, dropdown, onFocus]);

  // Handle input click
  const handleInputClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Clear autocomplete when clicking to change cursor position
    setTimeout(() => {
      const inputElement = dropdown.inputRef.current;
      if (inputElement) {
        const cursorPos = inputElement.selectionStart || 0;
        if (cursorPos !== dropdown.inputValue.length) {
          setAutocompleteText("");
        }
      }
    }, 0);
    
    if (!disabled && !dropdown.isOpen) {
      dropdown.open();
    }
  }, [disabled, dropdown]);

  // Handle clear button
  const handleClear = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    dropdown.setInputValueSilent('');
    dropdown.close();
    onChange?.('');
    setAutocompleteText("");
    setApiOptions([]);
    setApiError(null);
  }, [dropdown, onChange]);

  // Handle dropdown toggle (for select mode)
  const handleDropdownToggle = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (disabled) return;
    
    if (dropdown.isOpen) {
      dropdown.close();
      if (isSelectMode) {
        const displayValue = selectedOption ? selectedOption.label : '';
        dropdown.setInputValueSilent(displayValue);
      }
    } else {
      dropdown.open();
    }
  }, [dropdown, disabled, isSelectMode, selectedOption]);

  // Get category icon - Only show icons for select mode
  const getCategoryIcon = useCallback((category?: string) => {
    // Remove icons for search mode
    if (isSearchMode || !showCategoryIcons || !category) return '';
    
    switch (category) {
      case 'Electronics': return '📱';
      case 'Fashion': return '👕';
      case 'Photography': return '📷';
      case 'Gaming': return '🎮';
      case 'Automotive': return '🚗';
      case 'Users': return '👤';
      case 'Posts': return '📝';
      case 'Help': return '❓';
      case 'Support': return '💬';
      case 'Account': return '⚙️';
      default: return '';
    }
  }, [showCategoryIcons, isSearchMode]);

  // Render dropdown item - Unified styling for both modes
  const renderDropdownItem = useCallback((option: SearchableDropdownOption, index: number, isHighlighted: boolean) => {
    const isSelected = isSelectMode && option.value === value;
    
    return (
      <div
        style={{
          backgroundColor: isSelected
            ? '#3b82f6'
            : isHighlighted
              ? (isDarkMode ? 'rgba(55, 65, 81, 0.5)' : '#f3f4f6')
              : 'transparent',
          color: isSelected
            ? 'white'
            : isDarkMode 
              ? '#f9fafb' 
              : '#111827',
          fontSize: '14px',
          fontFamily: 'ui-sans-serif, system-ui, sans-serif',
          borderRadius: '6px',
          margin: '2px 0',
          padding: isSearchMode ? '12px 16px' : '8px 12px',
          cursor: 'pointer',
          transition: 'background-color 0.15s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          {/* Category icon - only for select mode */}
          {isSelectMode && getCategoryIcon(option.category) && (
            <span style={{ fontSize: '16px', marginRight: '8px' }}>
              {getCategoryIcon(option.category)}
            </span>
          )}
          
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <span style={{ fontWeight: '500' }}>
                {option.label}
              </span>
              
              {/* Type badge - only for search mode */}
              {isSearchMode && option.type && (
                <span style={{
                  padding: '2px 8px',
                  fontSize: '11px',
                  borderRadius: '12px',
                  fontWeight: '500',
                  backgroundColor: option.type === 'product' 
                    ? (isDarkMode ? 'rgba(34, 197, 94, 0.3)' : '#dcfce7')
                    : option.type === 'user' 
                    ? (isDarkMode ? 'rgba(59, 130, 246, 0.3)' : '#dbeafe')
                    : option.type === 'post' 
                    ? (isDarkMode ? 'rgba(168, 85, 247, 0.3)' : '#f3e8ff')
                    : (isDarkMode ? 'rgba(107, 114, 128, 0.3)' : '#f3f4f6'),
                  color: option.type === 'product' 
                    ? (isDarkMode ? '#86efac' : '#166534')
                    : option.type === 'user' 
                    ? (isDarkMode ? '#93c5fd' : '#1d4ed8')
                    : option.type === 'post' 
                    ? (isDarkMode ? '#c4b5fd' : '#7c3aed')
                    : (isDarkMode ? '#d1d5db' : '#374151')
                }}>
                  {option.type}
                </span>
              )}
            </div>
            
            {/* Category text - only for search mode */}
            {isSearchMode && option.category && (
              <div style={{ 
                fontSize: '12px', 
                color: isDarkMode ? '#9ca3af' : '#6b7280',
                marginTop: '4px'
              }}>
                in {option.category}
              </div>
            )}
          </div>
        </div>
        
        {/* Right arrow - only for search mode */}
        {isSearchMode && (
          <ChevronRightIcon style={{ 
            width: '16px', 
            height: '16px', 
            color: isDarkMode ? '#6b7280' : '#9ca3af',
            marginLeft: '8px',
            flexShrink: 0
          }} />
        )}
      </div>
    );
  }, [isSelectMode, isSearchMode, value, isDarkMode, getCategoryIcon]);

  // Render no items message
  const renderNoItems = useCallback(() => {
    if (isLoading) {
      return (
        <div
          style={{
            padding: '8px 12px',
            color: isDarkMode ? '#9ca3af' : '#6b7280',
            fontSize: '14px',
            fontFamily: 'ui-sans-serif, system-ui, sans-serif',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500"></div>
          Searching...
        </div>
      );
    }
    
    if (apiError) {
      return (
        <div
          style={{
            padding: '8px 12px',
            color: '#ef4444',
            fontSize: '14px',
            fontFamily: 'ui-sans-serif, system-ui, sans-serif'
          }}
        >
          {apiError}
        </div>
      );
    }
    
    return (
      <div
        style={{
          padding: '8px 12px',
          color: isDarkMode ? '#9ca3af' : '#6b7280',
          fontSize: '14px',
          fontFamily: 'ui-sans-serif, system-ui, sans-serif'
        }}
      >
        {isSelectMode ? 'No options found' : 'No suggestions found'}
      </div>
    );
  }, [isDarkMode, isSelectMode, isLoading, apiError]);

  // Render search footer (for search mode only)
  const renderFooter = useCallback(() => {
    if (!isSearchMode || !dropdown.inputValue.trim()) return null;
    
    return (
      <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <button
          onClick={() => {
            onSearch?.(dropdown.inputValue);
            dropdown.close();
          }}
          className="w-full flex items-center px-6 py-4 text-base text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors rounded-b-xl font-medium font-tertiary"
        >
          <MagnifyingGlassIcon className="w-5 h-5 mr-3" />
          Search for "{dropdown.inputValue}"
        </button>
      </div>
    );
  }, [isSearchMode, dropdown.inputValue, onSearch, dropdown]);

  // Autocomplete display component with Google-like positioning
  const AutocompleteDisplay = () => {
    if (!enableAutocomplete ||
        !autocompleteText || 
        !dropdown.inputValue || 
        !autocompleteText.toLowerCase().startsWith(dropdown.inputValue.toLowerCase()) ||
        autocompleteText.toLowerCase() === dropdown.inputValue.toLowerCase() ||
        cursorPosition !== dropdown.inputValue.length) {
      return null;
    }
    
    const remainingText = autocompleteText.slice(dropdown.inputValue.length);
    
    // Calculate precise positioning
    const leftOffset = isSearchMode ? 40 : 16; // Account for search icon
    const topOffset = isSelectMode ? 8 : 8; // Vertical centering
    
    return (
      <div 
        className="absolute pointer-events-none select-none z-10"
        style={{ 
          left: `${leftOffset + textWidth}px`,
          top: `${topOffset}px`,
          fontSize: '14px',
          lineHeight: '20px',
          fontFamily: 'inherit',
          height: '20px',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <span 
          className="bg-blue-200 dark:bg-blue-800/60 text-blue-800 dark:text-blue-200 rounded-sm px-0.5"
          style={{
            fontSize: '14px',
            fontFamily: 'inherit',
            fontWeight: 'normal'
          }}
        >
          {remainingText}
        </span>
      </div>
    );
  };

  // Loading state for select mode
  if (isSelectMode && !isInitialized) {
    return (
      <div className={`space-y-2 ${className}`}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <div className="h-[37px] border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 animate-pulse" />
      </div>
    );
  }

  return (
    <div className={`${isSelectMode ? 'space-y-2' : ''} ${className}`}>
      {/* Label for select mode */}
      {isSelectMode && label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div ref={dropdown.containerRef} className="relative">
        <div
          className={isSearchMode ? 'w-full px-4 py-2 pl-10 pr-10 border border-gray-300 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-500 transition-all backdrop-blur-sm font-tertiary text-sm outline-none relative' : 'relative'}
          style={isSelectMode ? {
            minHeight: '37px',
            height: '37px',
            borderRadius: '8px',
            border: `1px solid ${error 
              ? '#ef4444' 
              : isDarkMode 
                ? '#4b5563' 
                : '#d1d5db'}`,
            backgroundColor: isDarkMode ? 'rgba(31, 41, 55, 0.5)' : 'white',
            backdropFilter: isDarkMode ? 'blur(4px)' : 'none',
            fontSize: '14px',
            fontFamily: 'ui-sans-serif, system-ui, sans-serif',
            cursor: disabled ? 'not-allowed' : 'text',
            opacity: disabled ? 0.5 : 1
          } : {}}
        >
          {/* Left icon */}
          {isSearchMode && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-20">
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-400"></div>
              ) : (
                <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
              )}
            </div>
          )}

          {/* Input field */}
          <div
            style={isSelectMode ? {
              height: '35px',
              padding: '0 16px',
              paddingLeft: '16px',
              paddingRight: (isClearable && selectedOption) ? '60px' : '40px',
              display: 'flex',
              alignItems: 'center'
            } : {}}
          >
            <input
              ref={dropdown.inputRef}
              type="text"
              name={name}
              value={dropdown.inputValue}
              onChange={handleInputChange}
              onClick={handleInputClick}
              onFocus={handleInputFocus}
              onBlur={onBlur}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={disabled}
              autoComplete="off"
              autoFocus={autoFocus}
              style={isSelectMode ? {
                border: 'none',
                outline: 'none',
                background: 'transparent',
                width: '100%',
                margin: '0px',
                color: isDarkMode ? '#f9fafb' : '#111827',
                fontFamily: 'inherit',
                fontSize: '14px',
                zIndex: 2,
                position: 'relative'
              } : {
                border: 'none',
                outline: 'none',
                background: 'transparent',
                width: '100%',
                color: 'inherit',
                fontFamily: 'inherit',
                fontSize: 'inherit',
                zIndex: 2,
                position: 'relative'
              }}
              className="placeholder:text-gray-400 dark:placeholder:text-gray-500"
            />
          </div>

          {/* Autocomplete display */}
          <AutocompleteDisplay />

          {/* Right controls */}
          <div
            style={isSelectMode ? {
              height: '35px',
              position: 'absolute',
              right: 0,
              top: 0,
              display: 'flex',
              alignItems: 'center',
              paddingRight: '8px',
              zIndex: 20
            } : {
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              display: 'flex',
              alignItems: 'center',
              zIndex: 20
            }}
          >
            {/* Clear button */}
            {((isClearable && isSelectMode && selectedOption) || (isSearchMode && dropdown.inputValue)) && !disabled && (
              <button
                type="button"
                onClick={handleClear}
                style={{
                  padding: '4px',
                  marginRight: '4px',
                  color: isDarkMode ? '#9ca3af' : '#6b7280',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                className="hover:opacity-70"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            )}

            {/* Dropdown toggle (for select mode) */}
            {isSelectMode && (
              <button
                type="button"
                onClick={handleDropdownToggle}
                disabled={disabled}
                style={{
                  padding: '4px',
                  color: isDarkMode ? '#9ca3af' : '#6b7280',
                  cursor: disabled ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: dropdown.isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease'
                }}
              >
                <ChevronDownIcon className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Dropdown menu */}
        <DropdownMenu
          isOpen={dropdown.isOpen}
          items={dropdown.filteredItems}
          highlightedIndex={dropdown.highlightedIndex}
          onItemSelect={dropdown.handleItemSelect}
          onItemHover={dropdown.setHighlightedIndex}
          renderItem={renderDropdownItem}
          renderNoItems={renderNoItems}
          renderFooter={renderFooter}
          containerRef={dropdown.containerRef}
          dropdownRef={dropdown.dropdownRef}
          selectedValue={value}
          isDarkMode={isDarkMode}
          maxHeight={maxHeight}
          className={isSearchMode ? "top-full" : ""}
        />
      </div>
      
      {/* Error message for select mode */}
      {isSelectMode && error && (
        <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
          <ExclamationCircleIcon className="w-4 h-4 mr-1" />
          {error}
        </p>
      )}
    </div>
  );
}
