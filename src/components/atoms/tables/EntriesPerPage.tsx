"use client";

import React, { useEffect, useState } from 'react';
import Select, { SingleValue } from 'react-select';

interface Option {
  value: number;
  label: string;
}

interface EntriesPerPageProps {
  value: number;
  onChange: (value: number) => void;
  options?: number[];
  className?: string;
}

export default function EntriesPerPage({
  value,
  onChange,
  options = [5, 10, 20, 50],
  className = ""
}: EntriesPerPageProps) {
  
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

  // Convert numbers to options for react-select
  const selectOptions: Option[] = options.map(option => ({
    value: option,
    label: `${option} per page`
  }));

  // Find the selected option
  const selectedOption = selectOptions.find(option => option.value === value) || selectOptions[0];

  // Handle change from react-select
  const handleChange = (selectedOption: SingleValue<Option>) => {
    if (selectedOption) {
      onChange(selectedOption.value);
    }
  };

  // Dynamic styles based on theme - Updated with glass effect
  const getCustomStyles = () => ({
    control: (provided: any, state: any) => ({
      ...provided,
      minHeight: '40px',
      height: '40px',
      borderColor: state.isFocused 
        ? '#3b82f6' 
        : isDarkMode 
          ? '#4b5563' 
          : '#d1d5db',
      borderRadius: '12px',
      backgroundColor: isDarkMode ? 'rgba(31, 41, 55, 0.5)' : 'rgba(255, 255, 255, 0.5)',
      backdropFilter: 'blur(4px)',
      boxShadow: state.isFocused 
        ? '0 0 0 2px rgba(59, 130, 246, 0.5)' 
        : 'none',
      '&:hover': {
        borderColor: isDarkMode ? '#6b7280' : '#9ca3af',
      },
      fontSize: '14px',
      fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif'
    }),
    valueContainer: (provided: any) => ({
      ...provided,
      height: '38px',
      padding: '0 8px'
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
      height: '38px',
      color: isDarkMode ? '#9ca3af' : '#6b7280'
    }),
    dropdownIndicator: (provided: any) => ({
      ...provided,
      color: isDarkMode ? '#9ca3af' : '#6b7280',
      '&:hover': {
        color: isDarkMode ? '#d1d5db' : '#374151'
      }
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: isDarkMode ? '#9ca3af' : '#6b7280',
      fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif'
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: isDarkMode ? '#f9fafb' : '#111827',
      fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif'
    }),
    menu: (provided: any) => ({
      ...provided,
      backgroundColor: isDarkMode ? 'rgba(31, 41, 55, 0.95)' : 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(8px)',
      border: isDarkMode ? '1px solid #4b5563' : '1px solid #d1d5db',
      borderRadius: '12px',
      boxShadow: isDarkMode 
        ? '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.25)'
        : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
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
        ? (isDarkMode ? '#374151' : '#3b82f6')
        : state.isFocused 
          ? (isDarkMode ? 'rgba(55, 65, 81, 0.5)' : 'rgba(243, 244, 246, 0.8)')
          : 'transparent',
      color: state.isSelected 
        ? (isDarkMode ? '#e5e7eb' : 'white')
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
          ? (isDarkMode ? '#374151' : '#3b82f6')
          : isDarkMode 
            ? 'rgba(75, 85, 99, 0.5)' 
            : 'rgba(229, 231, 235, 0.8)'
      }
    })
  });

  return (
    <div className={className}>
      <Select
        options={selectOptions}
        value={selectedOption}
        onChange={handleChange}
        isSearchable={false}
        styles={getCustomStyles()}
        className="react-select-container min-w-[140px]"
        classNamePrefix="react-select"
        menuPortalTarget={document.body}
        menuPosition="fixed"
        theme={(theme) => ({
          ...theme,
          colors: {
            ...theme.colors,
            primary: '#3b82f6',
            primary75: '#60a5fa',
            primary50: '#93c5fd',
            primary25: '#dbeafe',
            neutral0: isDarkMode ? 'rgba(31, 41, 55, 0.5)' : 'rgba(255, 255, 255, 0.5)',
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
    </div>
  );
}
