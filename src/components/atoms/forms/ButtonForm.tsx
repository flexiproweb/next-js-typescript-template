"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface ButtonFormProps {
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  loadingText?: string;
  onClick?: () => void;
  className?: string;
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  hoverBackgroundColor?: string;
  hoverTextColor?: string;
}

export default function ButtonForm({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  loadingText = 'Loading...',
  onClick,
  className = '',
  backgroundColor,
  textColor,
  borderColor,
  hoverBackgroundColor,
  hoverTextColor
}: ButtonFormProps) {
  
  // Size variations
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base'
  };

  // Variant styles
  const getVariantClasses = () => {
    if (backgroundColor || textColor || borderColor) {
      // Custom styling via props
      return '';
    }

    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-r from-primary-600 to-secondary-500 text-white hover:from-primary-700 hover:to-secondary-600 focus:ring-primary-500 shadow-lg hover:shadow-xl';
      case 'secondary':
        return 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 focus:ring-gray-500';
      case 'outline':
        return 'border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800 focus:ring-gray-500';
      case 'ghost':
        return 'text-gray-700 dark:text-gray-300 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 focus:ring-gray-500';
      default:
        return 'bg-gradient-to-r from-primary-600 to-secondary-500 text-white hover:from-primary-700 hover:to-secondary-600 focus:ring-primary-500 shadow-lg hover:shadow-xl';
    }
  };

  // Custom style object for prop-based styling
  const customStyle = {
    ...(backgroundColor && { backgroundColor }),
    ...(textColor && { color: textColor }),
    ...(borderColor && { borderColor }),
  };

  const customHoverStyle = {
    ...(hoverBackgroundColor && { backgroundColor: hoverBackgroundColor }),
    ...(hoverTextColor && { color: hoverTextColor }),
  };

  // Base classes
  const baseClasses = `
    ${sizeClasses[size]}
    rounded-xl font-medium transition-all duration-300 
    focus:outline-none focus:ring-2 focus:ring-offset-2 
    disabled:opacity-50 disabled:cursor-not-allowed
    transform hover:scale-[1.02] active:scale-[0.98]
    ${getVariantClasses()}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <motion.button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      style={customStyle}
      whileHover={!disabled && !loading ? { 
        scale: 1.02,
        ...customHoverStyle
      } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      className={baseClasses}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
          {loadingText}
        </div>
      ) : (
        children
      )}
    </motion.button>
  );
}
