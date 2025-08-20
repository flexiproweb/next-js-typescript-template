"use client";

import React from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

interface InputFormProps {
  label?: string;
  type?: string;
  name: string;
  value: string | number | readonly string[] | undefined;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  error?: string;
  required?: boolean;
  className?: string;
  textarea?: boolean;
  select?: boolean;
  options?: { value: string; label: string }[];
  accept?: string;
  min?: string;
  max?: string;
  rows?: number;
}

export default function InputForm({
  label,
  type = 'text',
  name,
  value,
  placeholder = '',
  onChange,
  error,
  required = false,
  className = '',
  textarea = false,
  select = false,
  options = [],
  accept,
  min,
  max,
  rows = 4,
}: InputFormProps) {
  // Updated styling to match SearchBar with backdrop-blur and semi-transparent background
  const sharedStyles = "w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all backdrop-blur-sm font-tertiary text-sm";

  const errorStyles = error ? "border-red-500 dark:border-red-400" : "";
  const combinedStyles = `${sharedStyles} ${errorStyles}`;

  if (textarea) {
    return (
      <div className={`space-y-2 ${className}`}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {label} {required && <span className="text-tertiary-500">*</span>}
          </label>
        )}
        <textarea
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          rows={rows}
          className={`${combinedStyles} resize-vertical`}
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

  if (select) {
    return (
      <div className={`space-y-2 ${className}`}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {label} {required && <span className="text-tertiary-500">*</span>}
          </label>
        )}
        <select
          name={name}
          value={value}
          onChange={onChange}
          className={combinedStyles}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
            <ExclamationCircleIcon className="w-4 h-4 mr-1" />
            {error}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label} {required && <span className="text-tertiary-500">*</span>}
        </label>
      )}
      <input
        type={type}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        className={combinedStyles}
        accept={accept}
        min={min}
        max={max}
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
