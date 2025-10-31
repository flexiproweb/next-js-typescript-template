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
  
  // Detect dark mode and client-side mounting
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Mark component as mounted (client-side)
    setIsMounted(true);
    
    // Check if dark mode is active
    const checkDarkMode = () => {
      if (typeof window !== 'undefined') {
        setIsDarkMode(document.documentElement.classList.contains('dark'));
      }
    };

    // Initial check
    checkDarkMode();

    // Create observer to watch for theme changes
    const observer = new MutationObserver(checkDarkMode);
    if (typeof window !== 'undefined') {
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class']
      });
    }

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

  // Updated styles with NO focus effects
  const getCustomStyles = () => ({
    control: (provided: any, state: any) => ({
      ...provided,
      minHeight: '37px',
      height: '37px',
      borderColor: isDarkMode ? '#4b5563' : '#d1d5db',
      borderRadius: '8px',
      backgroundColor: isDarkMode ? 'rgba(31, 41, 55, 0.5)' : 'white',
      backdropFilter: isDarkMode ? 'blur(4px)' : 'none',
      boxShadow: 'none',
      outline: 'none',
      '&:hover': {
        borderColor: isDarkMode ? '#4b5563' : '#d1d5db',
      },
      fontSize: '14px',
      fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif'
    }),
    valueContainer: (provided: any) => ({
      ...provided,
      height: '35px',
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
      height: '35px',
      color: isDarkMode ? '#9ca3af' : '#6b7280'
    }),
    dropdownIndicator: (provided: any) => ({
      ...provided,
      color: isDarkMode ? '#9ca3af' : '#6b7280',
      '&:hover': {
        color: isDarkMode ? '#9ca3af' : '#6b7280'
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

  // Don't render until component is mounted on client
  if (!isMounted) {
    return null;
  }

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
        menuPortalTarget={typeof window !== 'undefined' ? document.body : undefined}
        menuPosition="fixed"
        theme={(theme) => ({
          ...theme,
          colors: {
            ...theme.colors,
            primary: isDarkMode ? '#4b5563' : '#d1d5db',
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
    </div>
  );
}
