"use client";

import React from 'react';
import { SearchableDropdown, SearchableDropdownOption } from '@/components/atoms/SearchableDropDown';
export interface Option {
  value: string;
  label: string;
}

export interface SelectFormProps {
  label?: string;
  name: string;
  options: Option[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
  isClearable?: boolean;
  isDisabled?: boolean;
  className?: string;
  enableAutocomplete?: boolean;
}

// Helper type for your form data
export type SelectOptionArray = Option[];


export function SelectForm({
  label,
  name,
  options,
  value,
  onChange,
  error,
  required = false,
  placeholder = 'Select...',
  isClearable = false,
  isDisabled = false,
  className = '',
  enableAutocomplete = true
}: SelectFormProps) {
  // Convert Option[] to SearchableDropdownOption[] with proper typing
  const searchableOptions: SearchableDropdownOption[] = React.useMemo(() => 
    options.map(option => ({
      value: option.value,
      label: option.label,
      type: 'option' as const
    })), [options]
  );

  // Handle change to maintain compatibility with existing form systems
  const handleChange = React.useCallback((newValue: string, selectedOption?: SearchableDropdownOption) => {
    const target = { value: newValue, name };
    const syntheticEvent = {
      target,
      currentTarget: target,
      type: 'change',
      preventDefault: () => {},
      stopPropagation: () => {}
    } as React.ChangeEvent<HTMLSelectElement>;
    
    onChange(syntheticEvent);
  }, [name, onChange]);

  return (
    <SearchableDropdown
      mode="select"
      name={name}
      label={label}
      options={searchableOptions}
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      error={error}
      required={required}
      isClearable={isClearable}
      disabled={isDisabled}
      className={className}
      showCategoryIcons={false}
      maxHeight={200}
      enableAutocomplete={enableAutocomplete}
    />
  );
}
