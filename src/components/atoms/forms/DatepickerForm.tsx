"use client";

import React from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

interface DatepickerFormProps {
  label?: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
  min?: string;
  max?: string;
  className?: string;
}

export default function DatepickerForm({
  label,
  name,
  value,
  onChange,
  error,
  required = false,
  min,
  max,
  className = ''
}: DatepickerFormProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label 
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {label} {required && <span className="text-tertiary-500">*</span>}
        </label>
      )}
      <input
        type="date"
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        className={`w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800/50 text-gray-900 dark:text-white transition-all backdrop-blur-sm text-sm outline-none ${
          error ? 'border-red-500 dark:border-red-400' : ''
        }`}
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
