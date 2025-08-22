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
  name = '', value = '', onChange, onSearch, placeholder = 'Type to search...',
  className = '', disabled = false, autoFocus = false, label, error, required = false,
  isClearable = false, options = [], mode = 'search', enableAutocomplete = true,
  maxSuggestions = 15, apiSearchType = 'products', enableApiSearch = true,
  debounceDelay = 300, maxHeight = 300, showCategoryIcons = true, onFocus, onBlur
}: SearchableDropdownProps) {
  
  const [state, setState] = useState({
    isDarkMode: false,
    autocompleteText: "",
    isInitialized: false,
    cursorPosition: 0,
    textWidth: 0,
    apiOptions: [] as SearchableDropdownOption[],
    isLoading: false,
    apiError: null as string | null
  });
  
  const abortControllerRef = useRef<AbortController | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isSelectMode = mode === 'select';
  const isSearchMode = mode === 'search';
  const selectedOption = isSelectMode && value ? options.find(option => option.value === value) : null;

  // Create canvas for text measurement
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
      context.font = '14px ui-sans-serif, system-ui, sans-serif';
    }

    return context.measureText(text).width;
  }, []);

  // API search functions
  const apiSearchFunctions = { products: searchProducts, users: searchUsers, posts: searchPosts, all: searchAll };
  
  const debouncedApiSearch = useMemo(() => debounce(async (query: string) => {
    if (!query.trim() || !enableApiSearch || !isSearchMode) {
      setState(prev => ({ ...prev, apiOptions: [], isLoading: false }));
      return;
    }

    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();

    try {
      setState(prev => ({ ...prev, isLoading: true, apiError: null }));
      const results = await apiSearchFunctions[apiSearchType](query);
      if (!abortControllerRef.current?.signal.aborted) {
        setState(prev => ({ ...prev, apiOptions: results }));
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setState(prev => ({ ...prev, apiError: 'Failed to fetch search results', apiOptions: [] }));
      }
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, debounceDelay), [enableApiSearch, isSearchMode, apiSearchType, debounceDelay]);

  const combinedOptions = useMemo(() => 
    !isSearchMode || !enableApiSearch ? options : [...state.apiOptions, ...options],
    [options, state.apiOptions, isSearchMode, enableApiSearch]
  );

  const filterFunction = useCallback((items: SearchableDropdownOption[], query: string) => {
    if (!query.trim()) return isSelectMode ? items : [];
    const filtered = items.filter(item =>
      item.label.toLowerCase().includes(query.toLowerCase()) ||
      (item.category && item.category.toLowerCase().includes(query.toLowerCase()))
    );
    return isSearchMode ? filtered.slice(0, maxSuggestions) : filtered;
  }, [isSelectMode, isSearchMode, maxSuggestions]);

  const dropdown = useDropdown({
    items: combinedOptions,
    filterFn: filterFunction,
    onSelect: (option) => {
      onChange?.(option.value, option);
      if (isSearchMode) onSearch?.(option.value);
      setState(prev => ({ ...prev, autocompleteText: "" }));
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
    
    setState(prev => ({ ...prev, cursorPosition: cursorPos, textWidth: width }));
  }, [dropdown.inputRef, dropdown.inputValue, measureText]);

  // Set up cursor position tracking
  useEffect(() => {
    const inputElement = dropdown.inputRef.current;
    if (!inputElement) return;

    updateCursorPosition();

    const handleSelectionChange = () => {
      setTimeout(updateCursorPosition, 0);
    };

    ['keyup', 'mouseup', 'focus', 'input'].forEach(event => 
      inputElement.addEventListener(event, handleSelectionChange)
    );

    return () => {
      ['keyup', 'mouseup', 'focus', 'input'].forEach(event =>
        inputElement.removeEventListener(event, handleSelectionChange)
      );
    };
  }, [updateCursorPosition]);

  // Dark mode detection
  useEffect(() => {
    const checkDarkMode = () => setState(prev => ({ 
      ...prev, 
      isDarkMode: document.documentElement.classList.contains('dark') 
    }));
    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // Initialize and update display value
  useEffect(() => {
    if (!state.isInitialized) {
      const displayValue = isSelectMode && selectedOption ? selectedOption.label : value;
      dropdown.setInputValueSilent(displayValue);
      setState(prev => ({ ...prev, isInitialized: true }));
    } else if (isSelectMode && !dropdown.isOpen) {
      const displayValue = selectedOption ? selectedOption.label : '';
      dropdown.setInputValueSilent(displayValue);
    }
  }, [selectedOption, state.isInitialized, dropdown, value, isSelectMode]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    const cursorPos = e.target.selectionStart || 0;
    
    dropdown.setInputValue(newValue);
    
    if (isSearchMode) {
      onChange?.(newValue);
      if (enableApiSearch) debouncedApiSearch(newValue);
    }
    
    // Enhanced autocomplete logic
    if (enableAutocomplete) {
      setState(prev => ({ ...prev, autocompleteText: "" }));
      
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
                  setState(prev => ({ ...prev, autocompleteText: firstMatch.label }));
                }
              }
            }, 50);
          }
        }
      }
    }
  }, [dropdown, isSearchMode, enableAutocomplete, combinedOptions, onChange, enableApiSearch, debouncedApiSearch]);

  const acceptAutocomplete = useCallback(() => {
    if (state.autocompleteText && state.autocompleteText.toLowerCase().startsWith(dropdown.inputValue.toLowerCase())) {
      const matchingOption = combinedOptions.find(option => 
        option.label.toLowerCase() === state.autocompleteText.toLowerCase()
      );
      
      if (matchingOption) {
        if (isSelectMode) {
          onChange?.(matchingOption.value, matchingOption);
          dropdown.setInputValueSilent(matchingOption.label);
        } else {
          dropdown.setInputValue(state.autocompleteText);
          onChange?.(state.autocompleteText);
        }
      }
      setState(prev => ({ ...prev, autocompleteText: "" }));
      dropdown.close();
    }
  }, [state.autocompleteText, dropdown, onChange, combinedOptions, isSelectMode]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      dropdown.close();
      if (isSelectMode) {
        const displayValue = selectedOption ? selectedOption.label : '';
        dropdown.setInputValueSilent(displayValue);
      }
      dropdown.inputRef.current?.blur();
      setState(prev => ({ ...prev, autocompleteText: "" }));
      return;
    }
    
    // Enhanced autocomplete handling
    if (enableAutocomplete && state.autocompleteText) {
      const inputElement = e.target as HTMLInputElement;
      const cursorPos = inputElement.selectionStart || 0;
      const isAtEnd = cursorPos === dropdown.inputValue.length;
      
      if ((e.key === 'Tab' || (e.key === 'ArrowRight' && isAtEnd)) && 
          state.autocompleteText.toLowerCase().startsWith(dropdown.inputValue.toLowerCase())) {
        e.preventDefault();
        acceptAutocomplete();
        return;
      }
      
      // Clear autocomplete on cursor movement keys
      if (['ArrowLeft', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(e.key)) {
        setState(prev => ({ ...prev, autocompleteText: "" }));
      }
    }
    
    if (e.key === 'Enter' && dropdown.highlightedIndex === -1) {
      if (enableAutocomplete && state.autocompleteText && state.autocompleteText.toLowerCase().startsWith(dropdown.inputValue.toLowerCase())) {
        acceptAutocomplete();
      } else if (isSearchMode) {
        onSearch?.(dropdown.inputValue);
        dropdown.close();
      }
    }
    
    dropdown.handleKeyDown(e);
  }, [dropdown, isSelectMode, selectedOption, state.autocompleteText, onSearch, enableAutocomplete, acceptAutocomplete]);

  const handleInputClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Clear autocomplete when clicking to change cursor position
    setTimeout(() => {
      const inputElement = dropdown.inputRef.current;
      if (inputElement) {
        const cursorPos = inputElement.selectionStart || 0;
        if (cursorPos !== dropdown.inputValue.length) {
          setState(prev => ({ ...prev, autocompleteText: "" }));
        }
      }
    }, 0);
    
    if (!disabled && !dropdown.isOpen) {
      dropdown.open();
    }
  }, [disabled, dropdown]);

  const handleClear = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    dropdown.setInputValueSilent('');
    dropdown.close();
    onChange?.('');
    setState(prev => ({ ...prev, autocompleteText: "", apiOptions: [], apiError: null }));
  }, [dropdown, onChange]);

  const getCategoryIcon = (category?: string) => {
    if (isSearchMode || !showCategoryIcons || !category) return '';
    const icons = {
      'Electronics': '📱', 'Fashion': '👕', 'Photography': '📷', 'Gaming': '🎮',
      'Automotive': '🚗', 'Users': '👤', 'Posts': '📝', 'Help': '❓',
      'Support': '💬', 'Account': '⚙️'
    };
    return icons[category as keyof typeof icons] || '';
  };

  // Autocomplete display component with precise positioning
  const AutocompleteDisplay = () => {
    if (!enableAutocomplete ||
        !state.autocompleteText || 
        !dropdown.inputValue || 
        !state.autocompleteText.toLowerCase().startsWith(dropdown.inputValue.toLowerCase()) ||
        state.autocompleteText.toLowerCase() === dropdown.inputValue.toLowerCase() ||
        state.cursorPosition !== dropdown.inputValue.length) {
      return null;
    }
    
    const remainingText = state.autocompleteText.slice(dropdown.inputValue.length);
    const leftOffset = isSearchMode ? 40 : 16; // Account for search icon
    const topOffset = 8; // Vertical centering
    
    return (
      <div 
        className="absolute pointer-events-none select-none z-10"
        style={{ 
          left: `${leftOffset + state.textWidth}px`,
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

  const renderDropdownItem = (option: SearchableDropdownOption, index: number, isHighlighted: boolean) => {
    const isSelected = isSelectMode && option.value === value;
    const bgColor = isSelected ? '#3b82f6' : isHighlighted ? (state.isDarkMode ? 'rgba(55, 65, 81, 0.5)' : '#f3f4f6') : 'transparent';
    const textColor = isSelected ? 'white' : state.isDarkMode ? '#f9fafb' : '#111827';
    
    return (
      <div style={{
        backgroundColor: bgColor, color: textColor, fontSize: '14px', borderRadius: '6px',
        margin: '2px 0', padding: isSearchMode ? '12px 16px' : '8px 12px', cursor: 'pointer',
        transition: 'background-color 0.15s ease', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          {isSelectMode && getCategoryIcon(option.category) && (
            <span style={{ fontSize: '16px', marginRight: '8px' }}>{getCategoryIcon(option.category)}</span>
          )}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <span style={{ fontWeight: '500' }}>{option.label}</span>
              {isSearchMode && option.type && (
                <span style={{
                  padding: '2px 8px', fontSize: '11px', borderRadius: '12px', fontWeight: '500',
                  backgroundColor: option.type === 'product' ? (state.isDarkMode ? 'rgba(34, 197, 94, 0.3)' : '#dcfce7') :
                                 option.type === 'user' ? (state.isDarkMode ? 'rgba(59, 130, 246, 0.3)' : '#dbeafe') :
                                 option.type === 'post' ? (state.isDarkMode ? 'rgba(168, 85, 247, 0.3)' : '#f3e8ff') :
                                 (state.isDarkMode ? 'rgba(107, 114, 128, 0.3)' : '#f3f4f6')
                }}>
                  {option.type}
                </span>
              )}
            </div>
            {isSearchMode && option.category && (
              <div style={{ fontSize: '12px', color: state.isDarkMode ? '#9ca3af' : '#6b7280', marginTop: '4px' }}>
                in {option.category}
              </div>
            )}
          </div>
        </div>
        {isSearchMode && <ChevronRightIcon style={{ width: '16px', height: '16px', color: state.isDarkMode ? '#6b7280' : '#9ca3af' }} />}
      </div>
    );
  };

  const renderNoItems = () => {
    if (state.isLoading) return <div style={{ padding: '8px 12px', color: state.isDarkMode ? '#9ca3af' : '#6b7280' }}>Searching...</div>;
    if (state.apiError) return <div style={{ padding: '8px 12px', color: '#ef4444' }}>{state.apiError}</div>;
    return <div style={{ padding: '8px 12px', color: state.isDarkMode ? '#9ca3af' : '#6b7280' }}>
      {isSelectMode ? 'No options found' : 'No suggestions found'}
    </div>;
  };

  const renderFooter = () => {
    if (!isSearchMode || !dropdown.inputValue.trim()) return null;
    return (
      <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <button onClick={() => { onSearch?.(dropdown.inputValue); dropdown.close(); }}
                className="w-full flex items-center px-6 py-4 text-base text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors rounded-b-xl font-medium">
          <MagnifyingGlassIcon className="w-5 h-5 mr-3" />
          Search for "{dropdown.inputValue}"
        </button>
      </div>
    );
  };

  if (isSelectMode && !state.isInitialized) {
    return (
      <div className={`space-y-2 ${className}`}>
        {label && <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label} {required && <span className="text-red-500">*</span>}
        </label>}
        <div className="h-[37px] border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 animate-pulse" />
      </div>
    );
  }

  return (
    <div className={`${isSelectMode ? 'space-y-2' : ''} ${className}`}>
      {isSelectMode && label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div ref={dropdown.containerRef} className="relative">
        <div className={isSearchMode ? 
          'w-full px-4 py-2 pl-10 pr-10 border border-gray-300 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-500 transition-all backdrop-blur-sm font-tertiary text-sm outline-none relative' : 
          'relative'
        } style={isSelectMode ? {
          minHeight: '37px', height: '37px', borderRadius: '8px',
          border: `1px solid ${error ? '#ef4444' : state.isDarkMode ? '#4b5563' : '#d1d5db'}`,
          backgroundColor: state.isDarkMode ? 'rgba(31, 41, 55, 0.5)' : 'white',
          cursor: disabled ? 'not-allowed' : 'text', opacity: disabled ? 0.5 : 1
        } : {}}>
          
          {isSearchMode && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-20">
              {state.isLoading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-400"></div> :
               <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />}
            </div>
          )}

          <div style={isSelectMode ? { height: '35px', padding: '0 16px', paddingRight: (isClearable && selectedOption) ? '60px' : '40px', display: 'flex', alignItems: 'center' } : {}}>
            <input ref={dropdown.inputRef} type="text" name={name} value={dropdown.inputValue}
                   onChange={handleInputChange} onClick={handleInputClick} 
                   onFocus={() => { if (!disabled) { dropdown.open(); onFocus?.(); } }}
                   onBlur={onBlur} onKeyDown={handleKeyDown} placeholder={placeholder} disabled={disabled}
                   autoComplete="off" autoFocus={autoFocus}
                   style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', 
                           color: isSelectMode ? (state.isDarkMode ? '#f9fafb' : '#111827') : 'inherit',
                           fontSize: isSelectMode ? '14px' : 'inherit', zIndex: 2, position: 'relative' }}
                   className="placeholder:text-gray-400 dark:placeholder:text-gray-500" />
          </div>

          {/* Autocomplete display with precise positioning */}
          <AutocompleteDisplay />

          <div style={{ position: 'absolute', right: isSelectMode ? 0 : '12px', 
                       top: isSelectMode ? 0 : '50%', transform: isSelectMode ? 'none' : 'translateY(-50%)',
                       height: isSelectMode ? '35px' : 'auto', display: 'flex', alignItems: 'center',
                       paddingRight: isSelectMode ? '8px' : '0', zIndex: 20 }}>
            {((isClearable && isSelectMode && selectedOption) || (isSearchMode && dropdown.inputValue)) && !disabled && (
              <button type="button" onClick={handleClear} className="p-1 text-gray-500 hover:opacity-70 mr-1">
                <XMarkIcon className="w-5 h-5" />
              </button>
            )}
            {isSelectMode && (
              <button type="button" onClick={(e) => { e.preventDefault(); disabled || (dropdown.isOpen ? dropdown.close() : dropdown.open()); }}
                      disabled={disabled} className="p-1 text-gray-500 transition-transform"
                      style={{ transform: dropdown.isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                <ChevronDownIcon className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        <DropdownMenu isOpen={dropdown.isOpen} items={dropdown.filteredItems} highlightedIndex={dropdown.highlightedIndex}
                      onItemSelect={dropdown.handleItemSelect} onItemHover={dropdown.setHighlightedIndex}
                      renderItem={renderDropdownItem} renderNoItems={renderNoItems} renderFooter={renderFooter}
                      containerRef={dropdown.containerRef} dropdownRef={dropdown.dropdownRef} selectedValue={value}
                      isDarkMode={state.isDarkMode} maxHeight={maxHeight} className={isSearchMode ? "top-full" : ""} />
      </div>
      
      {isSelectMode && error && (
        <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
          <ExclamationCircleIcon className="w-4 h-4 mr-1" /> {error}
        </p>
      )}
    </div>
  );
}
