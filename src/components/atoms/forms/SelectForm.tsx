"use client";

import React from "react";

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
}

export function SelectForm({
  label,
  name,
  options,
  value,
  onChange,
  error,
  required = false,
  placeholder = "Select...",
  isClearable = false,
  isDisabled = false,
  className = "",
}: SelectFormProps) {
  return (
    <div className={`flex flex-col space-y-1 ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className="text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {/* Native select element */}
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          disabled={isDisabled}
          required={required}
          className={`block w-full appearance-none rounded-lg border px-3 py-2 text-sm
            ${error
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-primary-500 focus:border-primary-500"}
            bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all outline-none
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          {/* Placeholder option */}
          {placeholder && (
            <option value="" disabled hidden>
              {placeholder}
            </option>
          )}

          {/* Optional clearable option */}
          {isClearable && (
            <option value="">— None —</option>
          )}

          {/* Render all available options */}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Dropdown arrow icon */}
        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}
