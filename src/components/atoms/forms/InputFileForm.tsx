"use client";

import React from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

interface InputFileFormProps {
  label?: string;
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
  accept?: string;
  multiple?: boolean;
  className?: string;
}

export default function InputFileForm({
  label,
  name,
  onChange,
  error,
  required = false,
  accept,
  multiple = false,
  className = ''
}: InputFileFormProps) {
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
        type="file"
        id={name}
        name={name}
        accept={accept}
        multiple={multiple}
        onChange={onChange}
        className={`w-full px-4 py-3 border-0 border-b-2 bg-transparent text-gray-900 dark:text-white 
          focus:ring-0 focus:border-b-primary-500 focus:outline-none transition-all text-sm cursor-pointer
          file:mr-6 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium 
          file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 
          dark:file:bg-primary-900/20 dark:file:text-primary-300 dark:hover:file:bg-primary-800/30 
          placeholder:text-gray-500 dark:placeholder:text-gray-400 ${
          error 
            ? 'border-b-red-500 dark:border-b-red-400' 
            : 'border-b-gray-300 dark:border-b-gray-600 hover:border-b-gray-400 dark:hover:border-b-gray-500'
        }`}
      />
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 flex items-center mt-2">
          <ExclamationCircleIcon className="w-4 h-4 mr-1" />
          {error}
        </p>
      )}
    </div>
  );
}
