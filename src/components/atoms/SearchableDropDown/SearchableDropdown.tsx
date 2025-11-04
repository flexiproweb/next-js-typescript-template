"use client";

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
  MagnifyingGlassIcon,
  XMarkIcon,
  ChevronDownIcon,
  ExclamationCircleIcon,
  ChevronRightIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { useDropdown } from './useDropdown';
import DropdownMenu from './DropdownMenu';

export interface SearchableDropdownOption {
  id?: string | number;
  value: string;
  label: string;
  type?: 'product' | 'query' | 'option';
  icon?: string;
}

interface SearchableDropdownProps {
  name?: string;
  value?: string | string[];
  onChange?: (value: string | string[], option?: SearchableDropdownOption | SearchableDropdownOption[]) => void;
  onSearch?: (query: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  label?: string;
  error?: string;
  required?: boolean;
  isClearable?: boolean;
  options?: SearchableDropdownOption[];
  mode?: 'select' | 'search' | 'multiselect';
  dataMode?: 'sync' | 'async';
  apiUrl?: string;
  labelKey?: string;
  valueKey?: string;
  objectKey?: string;
  apiMethod?: 'GET' | 'POST';
  apiHeaders?: Record<string, string>;
  apiBodyTransform?: (query: string) => any;
  debounceMs?: number;
  minCharsForSearch?: number;
  maxSelections?: number;
  showSelectedCount?: boolean;
  enableAutocomplete?: boolean;
  maxSuggestions?: number;
  maxHeight?: number;
  onFocus?: () => void;
  onBlur?: () => void;
}

export default function SearchableDropdown({
  name = '',
  value = '',
  onChange,
  onSearch,
  placeholder = 'Type to search...',
  className = '',
  disabled = false,
  autoFocus = false,
  label,
  error,
  required = false,
  isClearable = false,
  options = [],
  mode = 'search',
  dataMode = 'sync',
  apiUrl,
  apiMethod = 'GET',
  apiHeaders,
  apiBodyTransform,
  debounceMs = 300,
  minCharsForSearch = dataMode === 'async' ? 1 : 2,
  labelKey = 'title',
  valueKey = 'id',
  objectKey = 'products',
  maxSelections,
  showSelectedCount = true,
  enableAutocomplete = true,
  maxSuggestions = 15,
  maxHeight = 300,
  onFocus,
  onBlur
}: SearchableDropdownProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [autocompleteText, setAutocompleteText] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);
  const lastValueRef = useRef(value);

  const isSelectMode = mode === 'select';
  const isSearchMode = mode === 'search';
  const isMultiSelectMode = mode === 'multiselect';
  const effectiveMinChars = dataMode === 'async' ? 1 : minCharsForSearch;

  const selectedValues = useMemo(() => {
    if (isMultiSelectMode) {
      return Array.isArray(value) ? value : (value ? [value as string] : []);
    }
    return [];
  }, [value, isMultiSelectMode]);

  const selectedOption = isSelectMode && value ?
    options.find(option => option.value === value) : null;

  const selectedOptions = isMultiSelectMode ?
    options.filter(option => selectedValues.includes(option.value)) : [];

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

  const filterFunction = useMemo(() => {
    return (items: SearchableDropdownOption[], query: string) => {
      if (!query.trim()) {
        return (isSelectMode || isMultiSelectMode) ? items : [];
      }

      const filtered = items.filter(item =>
        item.label.toLowerCase().includes(query.toLowerCase())
      );

      return isSearchMode ? filtered.slice(0, maxSuggestions) : filtered;
    };
  }, [isSelectMode, isSearchMode, isMultiSelectMode, maxSuggestions]);

  // Fixed API response transformer
  const apiResponseTransformer = useCallback((res: any) => {
    const dataArray = res?.[objectKey];

    // ❌ If dataArray is missing or not an array, throw an error
    if (!Array.isArray(dataArray)) {
      const receivedType = dataArray === undefined ? 'undefined' : typeof dataArray;
      throw new Error(`Invalid API response: expected an array at key "${objectKey}", but got ${receivedType}`);
    }

    // ✅ Transform valid array response
    return dataArray.slice(0, maxSuggestions).map((item: any) => ({
      value: item[valueKey]?.toString() || '',
      label: item[labelKey] || item.name || 'Unknown',
    }));
  }, [objectKey, valueKey, labelKey, maxSuggestions]);


  const handleApiError = useCallback((error: Error) => {
    console.error("❌ API Error:", error);
  }, []);

  const dropdown = useDropdown({
    items: options,
    filterFn: filterFunction,
    onSelect: (option) => {
      if (isMultiSelectMode) {
        const newSelectedValues = selectedValues.includes(option.value)
          ? selectedValues.filter(v => v !== option.value)
          : maxSelections && selectedValues.length >= maxSelections
            ? selectedValues
            : [...selectedValues, option.value];

        const newSelectedOptions = newSelectedValues.map(val =>
          options.find(opt => opt.value === val)!
        ).filter(Boolean);

        onChange?.(newSelectedValues, newSelectedOptions);
        dropdown.setInputValueSilent('');
      } else {
        // For search mode, set the label in the input (not the value)
        if (isSearchMode) {
          dropdown.setInputValueSilent(option.label);
          onChange?.(option.label, option);
          onSearch?.(option.label);
        } else {
          onChange?.(option.value, option);
        }

        dropdown.close();
      }

      setAutocompleteText("");
    },
    isDisabled: disabled,
    dataMode,
    apiUrl,
    apiMethod,
    apiHeaders,
    apiBodyTransform,
    apiResponseTransform: apiResponseTransformer,
    debounceMs,
    minCharsForSearch: effectiveMinChars,
    onApiError: handleApiError,
  });

  useEffect(() => {
    if (!isInitialized) {
      const displayValue = isMultiSelectMode ? '' : (isSelectMode && selectedOption ? selectedOption.label : value);
      dropdown.setInputValueSilent(displayValue as string);
      setIsInitialized(true);
      lastValueRef.current = value;
    }
  }, [selectedOption, isInitialized, dropdown, value, isSelectMode, isMultiSelectMode]);

  useEffect(() => {
    if (isInitialized && lastValueRef.current !== value) {
      if (isSelectMode) {
        const displayValue = selectedOption ? selectedOption.label : '';
        if (!dropdown.isOpen) {
          dropdown.setInputValueSilent(displayValue);
        }
      } else if (isSearchMode) {
        dropdown.setInputValueSilent(value as string);
      }
      lastValueRef.current = value;
    }
  }, [value, selectedOption, isInitialized, dropdown, isSelectMode, isSearchMode]);

  // Update autocomplete when filtered items change (for async mode)
  useEffect(() => {
    if (!enableAutocomplete || !dropdown.inputValue.trim()) {
      setAutocompleteText("");
      return;
    }

    // Use filtered items from dropdown (these are the API results)
    const candidateList = dropdown.filteredItems;

    if (candidateList.length === 0) {
      setAutocompleteText("");
      return;
    }

    const currentValue = dropdown.inputValue.toLowerCase();
    const firstMatch = candidateList.find(item =>
      item.label.toLowerCase().startsWith(currentValue) &&
      item.label.toLowerCase() !== currentValue
    );

    if (firstMatch) {
      setAutocompleteText(firstMatch.label);
    } else {
      setAutocompleteText("");
    }
  }, [dropdown.filteredItems, dropdown.inputValue, enableAutocomplete]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    dropdown.setInputValue(newValue);

    if (isSearchMode) {
      onChange?.(newValue);
    }

    // Clear autocomplete immediately on change
    // The useEffect above will set it based on new filtered items
    setAutocompleteText("");
  }, [dropdown, isSearchMode, onChange]);

  const removeSelection = useCallback((valueToRemove: string) => {
    if (isMultiSelectMode) {
      const newSelectedValues = selectedValues.filter(v => v !== valueToRemove);
      const newSelectedOptions = newSelectedValues.map(val =>
        options.find(opt => opt.value === val)!
      ).filter(Boolean);
      onChange?.(newSelectedValues, newSelectedOptions);
    }
  }, [isMultiSelectMode, selectedValues, options, onChange]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    // Handle Tab or Right Arrow for autocomplete
    if ((e.key === 'Tab' || e.key === 'ArrowRight') && enableAutocomplete && autocompleteText && dropdown.inputRef.current) {
      const currentVal = dropdown.inputRef.current.value;
      if (autocompleteText.toLowerCase().startsWith(currentVal.toLowerCase())) {
        e.preventDefault();
        dropdown.setInputValue(autocompleteText);
        setAutocompleteText("");
        return;
      }
    }

    if (e.key === 'Escape') {
      e.preventDefault();
      dropdown.close();

      if (isSelectMode) {
        const displayValue = selectedOption ? selectedOption.label : '';
        dropdown.setInputValueSilent(displayValue);
      } else if (isMultiSelectMode) {
        dropdown.setInputValueSilent('');
      }

      dropdown.inputRef.current?.blur();
      setAutocompleteText("");
      return;
    }

    if (isMultiSelectMode && e.key === 'Backspace' && dropdown.inputValue === '' && selectedValues.length > 0) {
      e.preventDefault();
      const lastValue = selectedValues[selectedValues.length - 1];
      removeSelection(lastValue);
      return;
    }

    dropdown.handleKeyDown(e);
  }, [dropdown, isSelectMode, isMultiSelectMode, selectedOption, selectedValues, removeSelection, enableAutocomplete, autocompleteText]);

  const handleInputFocus = useCallback(() => {
    if (!disabled) {
      if (isSelectMode || isMultiSelectMode || (isSearchMode && dropdown.inputValue.trim() && dropdown.filteredItems.length > 0)) {
        dropdown.open();
      }
      setAutocompleteText("");
      onFocus?.();
    }
  }, [disabled, isSelectMode, isMultiSelectMode, isSearchMode, dropdown, onFocus]);

  const handleInputClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (!disabled && !dropdown.isOpen) {
      dropdown.open();
    }
  }, [disabled, dropdown]);

  const handleClear = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    dropdown.setInputValueSilent('');
    dropdown.close();

    if (isMultiSelectMode) {
      onChange?.([], []);
    } else {
      onChange?.('');
    }

    setAutocompleteText("");
  }, [dropdown, onChange, isMultiSelectMode]);

  const handleDropdownToggle = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (disabled) return;

    if (dropdown.isOpen) {
      dropdown.close();
      if (isSelectMode) {
        const displayValue = selectedOption ? selectedOption.label : '';
        dropdown.setInputValueSilent(displayValue);
      } else if (isMultiSelectMode) {
        dropdown.setInputValueSilent('');
      }
    } else {
      dropdown.open();
    }
  }, [dropdown, disabled, isSelectMode, isMultiSelectMode, selectedOption]);

  const renderDropdownItem = useCallback((option: SearchableDropdownOption, index: number, isHighlighted: boolean, isSelected?: boolean) => {
    const itemIsSelected = isSelected ?? false;

    if (isSelectMode || isMultiSelectMode) {
      return (
        <div
          style={{
            backgroundColor: itemIsSelected
              ? '#3b82f6'
              : isHighlighted
                ? (isDarkMode ? 'rgba(55, 65, 81, 0.5)' : '#f3f4f6')
                : 'transparent',
            color: itemIsSelected
              ? 'white'
              : isDarkMode
                ? '#f9fafb'
                : '#111827',
            fontSize: '14px',
            fontFamily: 'ui-sans-serif, system-ui, sans-serif',
            borderRadius: '6px',
            margin: '2px 0',
            padding: '8px 12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <span>{option.label}</span>
          {isMultiSelectMode && selectedValues.includes(option.value) && (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </div>
      );
    } else {
      return (
        <div
          className={`flex items-center justify-between px-6 py-4 cursor-pointer transition-all duration-150 ${isHighlighted
            ? 'bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500'
            : 'hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
        >
          <div className="flex items-center flex-1">
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
            </div>
          </div>
          <ChevronRightIcon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
        </div>
      );
    }
  }, [isSelectMode, isMultiSelectMode, selectedValues, isDarkMode]);

  const renderNoItems = useCallback(() => {
    if (dropdown.isLoading) {
      return (
        <div
          style={{
            padding: '12px',
            color: isDarkMode ? '#9ca3af' : '#6b7280',
            fontSize: '14px',
            fontFamily: 'ui-sans-serif, system-ui, sans-serif',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <ArrowPathIcon className="w-5 h-5 mr-2 animate-spin" />
          Loading...
        </div>
      );
    }

    if (dropdown.error) {
      return (
        <div
          style={{
            padding: '12px',
            color: '#ef4444',
            fontSize: '14px',
            fontFamily: 'ui-sans-serif, system-ui, sans-serif'
          }}
        >
          <div className="flex items-center justify-between">
            <span className="flex items-center">
              <ExclamationCircleIcon className="w-5 h-5 mr-2" />
              {dropdown.error}
            </span>
            <button
              onClick={dropdown.retry}
              className="text-blue-600 hover:text-blue-700 underline text-sm"
            >
              Retry
            </button>
          </div>
        </div>
      );
    }

    if (dataMode === 'async' && dropdown.inputValue.length < effectiveMinChars) {
      return (
        <div
          style={{
            padding: '12px',
            color: isDarkMode ? '#9ca3af' : '#6b7280',
            fontSize: '14px',
            fontFamily: 'ui-sans-serif, system-ui, sans-serif',
            textAlign: 'center'
          }}
        >
          Type at least {effectiveMinChars} character{effectiveMinChars > 1 ? 's' : ''} to search
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
        {isSelectMode || isMultiSelectMode ? 'No options found' : 'No suggestions found'}
      </div>
    );
  }, [dropdown.isLoading, dropdown.error, dropdown.retry, dropdown.inputValue, dataMode, effectiveMinChars, isDarkMode, isSelectMode, isMultiSelectMode]);

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

  if ((isSelectMode || isMultiSelectMode) && !isInitialized) {
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
    <div className={`${(isSelectMode || isMultiSelectMode) ? 'space-y-2' : ''} ${className}`}>
      {(isSelectMode || isMultiSelectMode) && label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div ref={dropdown.containerRef} className="relative">
        <div
          className={isSearchMode ? 'w-full px-4 py-2 pl-10 pr-10 border border-gray-300 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-500 transition-all backdrop-blur-sm font-tertiary text-sm outline-none relative' : 'relative'}
          style={(isSelectMode || isMultiSelectMode) ? {
            minHeight: '37px',
            maxHeight: '37px',
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
            opacity: disabled ? 0.5 : 1,
            padding: '0',
            display: 'flex',
            alignItems: 'center',
            overflow: 'hidden'
          } : {}}
        >
          {isSearchMode && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-20">
              {dropdown.isLoading ? (
                <ArrowPathIcon className="w-5 h-5 text-gray-400 animate-spin" />
              ) : (
                <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
              )}
            </div>
          )}

          {isMultiSelectMode && selectedValues.length > 0 && (
            <div
              className="flex items-center gap-1 px-2 py-1 overflow-x-auto scrollbar-hide"
              style={{
                flexShrink: 0,
                maxWidth: 'calc(100% - 80px)',
                whiteSpace: 'nowrap',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
              }}
            >
              {selectedValues.map(val => {
                const option = options.find(opt => opt.value === val);
                return (
                  <div
                    key={val}
                    className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded text-xs whitespace-nowrap flex-shrink-0"
                  >
                    <span>{option ? option.label : val}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeSelection(val);
                      }}
                      className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5"
                      type="button"
                    >
                      <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          <div
            style={(isSelectMode || isMultiSelectMode) ? {
              flex: 1,
              minWidth: '60px',
              height: '35px',
              padding: '0 8px',
              paddingRight: (isClearable && (selectedOption || selectedValues.length > 0)) ? '60px' : '40px',
              display: 'flex',
              alignItems: 'center',
              position: 'relative',
            } : { position: 'relative' }}
          >
            {/* Ghost autocomplete overlay */}
            {enableAutocomplete && autocompleteText && dropdown.inputValue && (
              <div
                style={{
                  position: 'absolute',
                  left: isSearchMode ? '0' : '8px',
                  right: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: isDarkMode ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.25)',
                  fontFamily: 'inherit',
                  fontSize: '14px',
                  pointerEvents: 'none',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  zIndex: 1,
                }}
              >
                <span style={{ visibility: 'hidden' }}>{dropdown.inputValue}</span>
                <span>
                  {autocompleteText.slice(dropdown.inputValue.length)}
                </span>
              </div>
            )}

            {/* Actual input */}
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
              placeholder={isMultiSelectMode
                ? (selectedValues.length > 0 ? 'Add more...' : placeholder)
                : placeholder
              }
              disabled={disabled}
              autoComplete="off"
              autoFocus={autoFocus}
              style={{
                border: 'none',
                outline: 'none',
                background: 'transparent',
                width: '100%',
                color: isDarkMode ? '#f9fafb' : '#111827',
                fontFamily: 'inherit',
                fontSize: '14px',
                zIndex: 2,
                position: 'relative',
              }}
              className="placeholder:text-gray-400 dark:placeholder:text-gray-500"
            />
          </div>

          <div
            style={(isSelectMode || isMultiSelectMode) ? {
              position: 'absolute',
              right: 0,
              top: 0,
              height: '35px',
              display: 'flex',
              alignItems: 'center',
              paddingRight: '8px',
              zIndex: 20,
              backgroundColor: isDarkMode ? 'rgba(31, 41, 55, 0.5)' : 'white',
              borderTopRightRadius: '8px',
              borderBottomRightRadius: '8px'
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
            {((isClearable && isSelectMode && selectedOption) ||
              (isClearable && isMultiSelectMode && selectedValues.length > 0) ||
              (isSearchMode && dropdown.inputValue)) && !disabled && (
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

            {(isSelectMode || isMultiSelectMode) && (
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
          selectedValue={isMultiSelectMode ? selectedValues : value}
          isDarkMode={isDarkMode}
          maxHeight={maxHeight}
          className={isSearchMode ? "top-full" : ""}
        />
      </div>

      {(isSelectMode || isMultiSelectMode) && error && (
        <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
          <ExclamationCircleIcon className="w-4 h-4 mr-1" />
          {error}
        </p>
      )}
    </div>
  );
}