"use client";

import React from 'react';
import { XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { SearchableDropdown, SearchableDropdownOption } from '@/components/atoms/SearchableDropDown';
import suggestionData from "../../../..//suggestions.json";
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


const dummySuggestions: Suggestion[] = suggestionData as Suggestion[];

export function SearchHeader({
  placeholder = "Search...",
  value = "",
  onChange,
  onSearch,
  className = "",
  showMobileSearch = false,
  onToggleMobileSearch,
  autoFocus = false
}: SearchHeaderProps) {
  // Convert Suggestion[] to SearchableDropdownOption[]
  const searchableOptions: SearchableDropdownOption[] = React.useMemo(() =>
    dummySuggestions.map(suggestion => ({
      id: suggestion.id,
      value: suggestion.name,
      label: suggestion.name,
      category: suggestion.category,
      type: suggestion.type as 'product' | 'query',
    })), []);

  const handleChange = React.useCallback((newValue: string, selectedOption?: SearchableDropdownOption) => {
    onChange?.(newValue);
  }, [onChange]);

  const handleSearch = React.useCallback((query: string) => {
    onSearch?.(query);
  }, [onSearch]);

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
      <div className={`hidden md:flex flex-1 max-w-lg mx-4 ${className} relative`}>
        <SearchableDropdown
          mode="search"
          options={searchableOptions}
          value={value}
          onChange={handleChange}
          onSearch={handleSearch}
          placeholder={placeholder}
          enableAutocomplete={true}
          showCategoryIcons={true}
          maxSuggestions={15}
          maxHeight={300}
          className="w-full min-w-[280px]"
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
                options={searchableOptions}
                value={value}
                onChange={handleChange}
                onSearch={handleSearch}
                placeholder={placeholder}
                enableAutocomplete={true}
                showCategoryIcons={true}
                maxSuggestions={15}
                maxHeight={300}
                autoFocus={autoFocus}
                className="w-full"
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
