"use client";

import React, { useEffect, useState } from 'react';
import Select, { SingleValue } from 'react-select';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

interface Option {
  value: string;
  label: string;
}

interface SelectFormProps {
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
}

export default function SelectForm({
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
  className = ''
}: SelectFormProps) {
  
  // Detect dark mode
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check if dark mode is active
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };

    // Initial check
    checkDarkMode();

    // Create observer to watch for theme changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);
  
  // Find the selected option
  const selectedOption = options.find(option => option.value === value) || null;

  // Handle change from react-select
  const handleChange = (selectedOption: SingleValue<Option>) => {
    const fakeEvent = {
        target: {
            name,
            value: selectedOption ? selectedOption.value : '',
            type: 'select'
        }
    } as unknown as React.ChangeEvent<HTMLSelectElement>;
    
    onChange(fakeEvent);
  };

  // Updated styles with NO focus effects
  const getCustomStyles = () => ({
    control: (provided: any, state: any) => ({
      ...provided,
      minHeight: '37px',
      height: '37px',
      borderColor: error 
        ? '#ef4444' 
        : isDarkMode 
          ? '#4b5563' 
          : '#d1d5db',
      borderRadius: '8px',
      backgroundColor: isDarkMode ? 'rgba(31, 41, 55, 0.5)' : 'white',
      backdropFilter: isDarkMode ? 'blur(4px)' : 'none',
      boxShadow: 'none', // Removed focus shadow
      outline: 'none', // Removed outline
      '&:hover': {
        borderColor: error ? '#ef4444' : isDarkMode ? '#4b5563' : '#d1d5db', // No border change on hover
      },
      fontSize: '14px',
      fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif'
    }),
    valueContainer: (provided: any) => ({
      ...provided,
      height: '35px',
      padding: '0 16px'
    }),
    input: (provided: any) => ({
      ...provided,
      margin: '0px',
      color: isDarkMode ? '#f9fafb' : '#111827',
      fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif'
    }),
    indicatorSeparator: () => ({
      display: 'none',
    }),
    indicatorsContainer: (provided: any) => ({
      ...provided,
      height: '35px',
      color: isDarkMode ? '#9ca3af' : '#6b7280'
    }),
    dropdownIndicator: (provided: any) => ({
      ...provided,
      color: isDarkMode ? '#9ca3af' : '#6b7280',
      '&:hover': {
        color: isDarkMode ? '#9ca3af' : '#6b7280' // No color change on hover
      }
    }),
    clearIndicator: (provided: any) => ({
      ...provided,
      color: isDarkMode ? '#9ca3af' : '#6b7280',
      '&:hover': {
        color: isDarkMode ? '#9ca3af' : '#6b7280' // No color change on hover
      }
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: isDarkMode ? '#6b7280' : '#6b7280',
      fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif'
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: isDarkMode ? '#f9fafb' : '#111827',
      fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif'
    }),
    menu: (provided: any) => ({
      ...provided,
      backgroundColor: isDarkMode ? 'rgba(31, 41, 55, 0.95)' : 'white',
      backdropFilter: isDarkMode ? 'blur(8px)' : 'none',
      border: isDarkMode ? '1px solid #4b5563' : '1px solid #d1d5db',
      borderRadius: '8px',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      zIndex: 9999,
      fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif'
    }),
    menuList: (provided: any) => ({
      ...provided,
      padding: '4px',
      maxHeight: '200px'
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected 
        ? '#3b82f6'
        : state.isFocused 
          ? (isDarkMode ? 'rgba(55, 65, 81, 0.5)' : '#f3f4f6')
          : 'transparent',
      color: state.isSelected 
        ? 'white'
        : isDarkMode 
          ? '#f9fafb' 
          : '#111827',
      cursor: 'pointer',
      fontSize: '14px',
      fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
      borderRadius: '6px',
      margin: '2px 0',
      padding: '8px 12px',
      '&:active': {
        backgroundColor: state.isSelected 
          ? '#3b82f6'
          : isDarkMode 
            ? 'rgba(75, 85, 99, 0.5)' 
            : '#e5e7eb'
      }
    })
  });

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label} {required && <span className="text-tertiary-500">*</span>}
        </label>
      )}
      
      <Select
        name={name}
        options={options}
        value={selectedOption}
        onChange={handleChange}
        placeholder={placeholder}
        isClearable={isClearable}
        isDisabled={isDisabled}
        styles={getCustomStyles()}
        className="react-select-container"
        classNamePrefix="react-select"
        menuPortalTarget={document.body}
        menuPosition="fixed"
        theme={(theme) => ({
          ...theme,
          colors: {
            ...theme.colors,
            primary: isDarkMode ? '#4b5563' : '#d1d5db', // Changed primary to match border
            primary75: isDarkMode ? '#4b5563' : '#d1d5db',
            primary50: isDarkMode ? '#4b5563' : '#d1d5db',
            primary25: isDarkMode ? '#4b5563' : '#d1d5db',
            neutral0: isDarkMode ? 'rgba(31, 41, 55, 0.5)' : 'white',
            neutral10: isDarkMode ? '#374151' : '#f3f4f6',
            neutral20: isDarkMode ? '#4b5563' : '#e5e7eb',
            neutral30: isDarkMode ? '#6b7280' : '#d1d5db',
            neutral40: isDarkMode ? '#9ca3af' : '#9ca3af',
            neutral50: isDarkMode ? '#d1d5db' : '#6b7280',
            neutral60: isDarkMode ? '#e5e7eb' : '#4b5563',
            neutral70: isDarkMode ? '#f3f4f6' : '#374151',
            neutral80: isDarkMode ? '#f9fafb' : '#1f2937',
            neutral90: isDarkMode ? '#ffffff' : '#111827',
          },
        })}
      />
      
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
          <ExclamationCircleIcon className="w-4 h-4 mr-1" />
          {error}
        </p>
      )}
    </div>
  );
}
