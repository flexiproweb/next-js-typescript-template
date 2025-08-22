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
  const lastValueRef = useRef(value);
  
  const isSelectMode = mode === 'select';
  const isSearchMode = mode === 'search';
  
  // Find selected option for select mode
  const selectedOption = isSelectMode && value ? 
    options.find(option => option.value === value) : null;

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
    items: options,
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
    dropdown.setInputValue(newValue);
    
    if (isSearchMode) {
      onChange?.(newValue);
      
      // Handle autocomplete for search mode
      if (enableAutocomplete) {
        setAutocompleteText("");
        
        if (newValue.trim()) {
          const firstMatch = options.find(item => 
            item.label.toLowerCase().startsWith(newValue.toLowerCase()) &&
            item.label.toLowerCase() !== newValue.toLowerCase()
          );
          
          if (firstMatch && newValue.length > 0) {
            setTimeout(() => {
              const currentInput = dropdown.inputRef.current;
              if (currentInput && currentInput.value === newValue && newValue.trim()) {
                const stillMatches = firstMatch.label.toLowerCase().startsWith(newValue.toLowerCase());
                if (stillMatches) {
                  setAutocompleteText(firstMatch.label);
                }
              }
            }, 100);
          }
        }
      }
    } else if (isSelectMode) {
      // Handle autocomplete for select mode
      if (enableAutocomplete) {
        setAutocompleteText("");
        
        if (newValue.trim()) {
          const firstMatch = options.find(item => 
            item.label.toLowerCase().startsWith(newValue.toLowerCase()) &&
            item.label.toLowerCase() !== newValue.toLowerCase()
          );
          
          if (firstMatch && newValue.length > 0) {
            setTimeout(() => {
              const currentInput = dropdown.inputRef.current;
              if (currentInput && currentInput.value === newValue && newValue.trim()) {
                const stillMatches = firstMatch.label.toLowerCase().startsWith(newValue.toLowerCase());
                if (stillMatches) {
                  setAutocompleteText(firstMatch.label);
                }
              }
            }, 100);
          }
        }
      }
    }
  }, [dropdown, isSearchMode, isSelectMode, enableAutocomplete, options, onChange]);

  // Accept autocomplete suggestion
  const acceptAutocomplete = useCallback(() => {
    if (autocompleteText && autocompleteText.toLowerCase().startsWith(dropdown.inputValue.toLowerCase())) {
      const matchingOption = options.find(option => 
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
  }, [autocompleteText, dropdown, onChange, options, isSelectMode]);

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
    
    // Handle autocomplete for both search and select modes
    if (enableAutocomplete) {
      if (e.key === 'Tab' && autocompleteText && autocompleteText.toLowerCase().startsWith(dropdown.inputValue.toLowerCase())) {
        e.preventDefault();
        acceptAutocomplete();
        return;
      } else if (e.key === 'ArrowRight' && autocompleteText && autocompleteText.toLowerCase().startsWith(dropdown.inputValue.toLowerCase())) {
        const input = e.target as HTMLInputElement;
        const cursorPosition = input.selectionStart || 0;
        if (cursorPosition === dropdown.inputValue.length) {
          e.preventDefault();
          acceptAutocomplete();
          return;
        }
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
    if (!disabled && !dropdown.isOpen) {
      dropdown.open();
    }
    setAutocompleteText("");
  }, [disabled, dropdown]);

  // Handle clear button
  const handleClear = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    dropdown.setInputValueSilent('');
    dropdown.close();
    onChange?.('');
    setAutocompleteText("");
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

  // Get category icon
  const getCategoryIcon = useCallback((category?: string) => {
    if (!showCategoryIcons || !category) return isSearchMode ? '🔍' : '';
    
    switch (category) {
      case 'Electronics': return '📱';
      case 'Fashion': return '👕';
      case 'Photography': return '📷';
      case 'Gaming': return '🎮';
      case 'Automotive': return '🚗';
      case 'Help': return '❓';
      case 'Support': return '💬';
      case 'Account': return '⚙️';
      default: return '🔍';
    }
  }, [showCategoryIcons, isSearchMode]);

  // Render dropdown item
  const renderDropdownItem = useCallback((option: SearchableDropdownOption, index: number, isHighlighted: boolean) => {
    const isSelected = isSelectMode && option.value === value;
    
    if (isSelectMode) {
      // Select mode styling
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
            padding: '8px 12px'
          }}
        >
          {option.label}
        </div>
      );
    } else {
      // Search mode styling
      return (
        <div
          className={`flex items-center justify-between px-6 py-4 cursor-pointer transition-all duration-150 ${
            isHighlighted 
              ? 'bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500' 
              : 'hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
        >
          <div className="flex items-center flex-1">
            {showCategoryIcons && (
              <span className="text-xl mr-4">{getCategoryIcon(option.category)}</span>
            )}
            <div className="flex-1">
              <div className="flex items-center">
                <p className="text-base font-medium text-gray-900 dark:text-white font-tertiary">
                  {option.label}
                </p>
                {option.type === 'query' && (
                  <span className="ml-3 px-2.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs rounded-full font-medium">
                    Help
                  </span>
                )}
              </div>
              {option.category && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-tertiary">
                  in {option.category}
                </p>
              )}
            </div>
          </div>
          <ChevronRightIcon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
        </div>
      );
    }
  }, [isSelectMode, value, isDarkMode, showCategoryIcons, getCategoryIcon]);

  // Render no items message
  const renderNoItems = useCallback(() => (
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
  ), [isDarkMode, isSelectMode]);

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

  // Autocomplete display component
  const AutocompleteDisplay = () => {
    if (!enableAutocomplete ||
        !autocompleteText || 
        !dropdown.inputValue || 
        !autocompleteText.toLowerCase().startsWith(dropdown.inputValue.toLowerCase()) ||
        autocompleteText.toLowerCase() === dropdown.inputValue.toLowerCase()) {
      return null;
    }
    
    const remainingText = autocompleteText.slice(dropdown.inputValue.length);
    
    return (
      <div 
        className={`absolute top-0 left-0 w-full ${isSearchMode ? 'pl-10' : 'pl-4'} pr-10 py-2 pointer-events-none select-none z-10`}
        style={{ 
          fontSize: '14px',
          lineHeight: isSelectMode ? '35px' : '20px',
          fontFamily: 'inherit'
        }}
      >
        <span className="invisible font-tertiary">{dropdown.inputValue}</span>
        <span className="bg-blue-200 dark:bg-blue-600 text-gray-900 dark:text-white font-tertiary rounded-sm px-0.5">
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
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
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
