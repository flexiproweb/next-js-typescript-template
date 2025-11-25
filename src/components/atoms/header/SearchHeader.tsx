"use client";

import React from 'react';
import { XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import SearchableDropdown from '../SearchableDropDown/SearchableDropdown';
import suggestionData from "../../../../suggestions.json";
// import type { SearchHeaderProps, Suggestion } from './SearchHeader.types';
export interface SearchHeaderProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (query: string) => void;
  className?: string;
  showMobileSearch?: boolean;
  onToggleMobileSearch?: (show: boolean) => void;
  autoFocus?: boolean;
}

export interface Suggestion {
  id: number;
  name: string;
  category: string;
  type: 'product' | 'query';
}


// const dummySuggestions: Suggestion[] = suggestionData as Suggestion[];

export function SearchHeader({
  // placeholder = "Search...",
  value = "",
  onChange,
  onSearch,
  className = "",
  showMobileSearch = false,
  onToggleMobileSearch,
  // autoFocus = false
}: SearchHeaderProps) {
  // Convert Suggestion[] to SearchableDropdownOption[]


const handleChange = React.useCallback((
  newValue: string | string[],
 
) => {
  if (typeof newValue === "string") {
    onChange?.(newValue);
  } else {
    onChange?.(newValue.join(", "));
  }
}, [onChange]);


  // const handleSearch = React.useCallback((query: string) => {
  //   onSearch?.(query);
  // }, [onSearch]);

  // Mobile search toggle handler
  const handleMobileToggle = React.useCallback((show: boolean) => {
    onToggleMobileSearch?.(show);
    if (!show) {
      onChange?.("");
    }
  }, [onToggleMobileSearch, onChange]);

  return (
    <>
      {/* Desktop Search */}
      <div className={`hidden md:flex flex-1 max-w-2xl mx-8 ${className} relative`}>
        <SearchableDropdown
          mode="search"
          dataMode="async"
          apiUrl="https://dummyjson.com/products/search"
          apiMethod="GET"
          debounceMs={500}
          minCharsForSearch={1}
          value={value}
          onChange={handleChange}
          placeholder="Search products..."
          label="Product Search (Async)"
          maxSuggestions={10}
          objectKey="products"
          valueKey="id"
          labelKey="title"
          className="w-full min-w-[500px] max-w-[700px]" 
        />
      </div>

      {/* Mobile Search Toggle */}
      <div className="md:hidden relative flex items-center">
        {showMobileSearch ? (
          <div className="flex items-center w-full relative">
            <button
              onClick={() => handleMobileToggle(false)}
              className="p-2 mr-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
            <div className="flex-grow min-w-[280px]">
              <SearchableDropdown
                mode="search"
                dataMode="async"
                apiUrl="https://dummyjson.com/products/search"
                apiMethod="GET"
                debounceMs={500}
                minCharsForSearch={1}
                value={value}
                onChange={handleChange}
                placeholder="Search products..."
                label="Product Search (Async)"
                maxSuggestions={10}
                objectKey="products"
                valueKey="id"
                labelKey="title"
              />
            </div>
          </div>
        ) : (
          <button
            onClick={() => handleMobileToggle(true)}
            className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <MagnifyingGlassIcon className="w-5 h-5" />
          </button>
        )}
      </div>
    </>
  );
}
