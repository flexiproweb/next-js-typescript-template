"use client";

import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  maxVisiblePages?: number;
  showInfo?: boolean;
  totalItems?: number;
  itemsPerPage?: number;
  className?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  maxVisiblePages = 5,
  showInfo = false,
  totalItems,
  itemsPerPage,
  className = ""
}: PaginationProps) {
  
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  // Generate pagination items with proper ellipsis
  const generatePaginationItems = () => {
    const items = [];
    
    if (totalPages <= maxVisiblePages) {
      // If total pages is less than max visible, show all pages
      for (let i = 1; i <= totalPages; i++) {
        items.push(i);
      }
    } else {
      // Always show first page
      items.push(1);
      
      // Calculate start and end of middle range
      const delta = Math.floor((maxVisiblePages - 4) / 2); // Reserve space for 1, ..., ..., last
      let start = Math.max(2, currentPage - delta);
      let end = Math.min(totalPages - 1, currentPage + delta);
      
      // Adjust range if too close to beginning or end
      if (currentPage - delta <= 2) {
        end = Math.min(totalPages - 1, maxVisiblePages - 2);
      }
      if (currentPage + delta >= totalPages - 1) {
        start = Math.max(2, totalPages - maxVisiblePages + 3);
      }
      
      // Add left ellipsis if needed
      if (start > 2) {
        items.push('ellipsis-left');
      }
      
      // Add middle pages
      for (let i = start; i <= end; i++) {
        items.push(i);
      }
      
      // Add right ellipsis if needed
      if (end < totalPages - 1) {
        items.push('ellipsis-right');
      }
      
      // Always show last page if more than 1 page
      if (totalPages > 1) {
        items.push(totalPages);
      }
    }
    
    return items;
  };

  const paginationItems = generatePaginationItems();
  const startIndex = (currentPage - 1) * (itemsPerPage || 0);
  const endIndex = Math.min(startIndex + (itemsPerPage || 0), totalItems || 0);

  return (
    <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 ${className}`}>
      {showInfo && totalItems && itemsPerPage && (
        <motion.div 
          className="text-xs text-gray-600 dark:text-gray-400 font-tertiary"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          Showing <span className="font-semibold text-gray-900 dark:text-white">{startIndex + 1}</span> to{' '}
          <span className="font-semibold text-gray-900 dark:text-white">{endIndex}</span> of{' '}
          <span className="font-semibold text-gray-900 dark:text-white">{totalItems}</span> results
        </motion.div>
      )}
      
      <nav className="flex items-center space-x-1">
        {/* Previous Button - Fixed icon size and color */}
        <motion.button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2.5 rounded-lg border-none border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          aria-label="Previous page"
          whileHover={currentPage > 1 ? { scale: 1.05 } : {}}
          whileTap={currentPage > 1 ? { scale: 0.95 } : {}}
        >
          <ChevronLeftIcon className="w-5 h-5" />
        </motion.button>

        {/* Page Numbers and Ellipsis */}
        <div className="flex items-center space-x-1">
          {paginationItems.map((item, index) => {
            if (item === 'ellipsis-left' || item === 'ellipsis-right') {
              return (
                <div
                  key={`ellipsis-${index}`}
                  className="px-2 py-2 text-gray-500 dark:text-gray-400 select-none"
                  aria-label="More pages"
                >
                  <span className="text-sm leading-none">...</span>
                </div>
              );
            }

            const pageNumber = item as number;
            const isActive = currentPage === pageNumber;

            return (
              <motion.button
                key={pageNumber}
                onClick={() => goToPage(pageNumber)}
                className={`px-3 py-2 text-xs font-medium rounded-lg transition-all duration-200 min-w-[32px] ${
                  isActive
                    ? "bg-gradient-to-r from-primary-600 to-secondary-500 text-white shadow-md hover:shadow-lg"
                    : "border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={false}
                animate={{
                  backgroundColor: isActive ? undefined : 'transparent',
                }}
              >
                {pageNumber}
              </motion.button>
            );
          })}
        </div>

        {/* Next Button - Fixed icon size and color */}
        <motion.button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2.5 rounded-lg border-none border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          aria-label="Next page"
          whileHover={currentPage < totalPages ? { scale: 1.05 } : {}}
          whileTap={currentPage < totalPages ? { scale: 0.95 } : {}}
        >
          <ChevronRightIcon className="w-5 h-5" />
        </motion.button>
      </nav>
    </div>
  );
}
