// components/DropdownMenu.tsx
import React from 'react';

interface DropdownMenuProps<T> {
  isOpen: boolean;
  items: T[];
  highlightedIndex: number;
  onItemSelect: (item: T) => void;
  onItemHover: (index: number) => void;
  renderItem: (item: T, index: number, isHighlighted: boolean, isSelected?: boolean) => React.ReactNode;
  renderNoItems?: () => React.ReactNode;
  renderFooter?: () => React.ReactNode;
  containerRef: React.RefObject<HTMLDivElement>;
  dropdownRef: React.RefObject<HTMLDivElement>;
  className?: string;
  maxHeight?: number;
  selectedValue?: string;
  isDarkMode?: boolean;
}

export default function DropdownMenu<T>({
  isOpen,
  items,
  highlightedIndex,
  onItemSelect,
  onItemHover,
  renderItem,
  renderNoItems,
  renderFooter,
  containerRef,
  dropdownRef,
  className = '',
  maxHeight = 200,
  selectedValue,
  isDarkMode = false
}: DropdownMenuProps<T>) {
  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className={`absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl shadow-xl overflow-hidden ${className}`}
      style={{
        minWidth: containerRef.current?.offsetWidth || 'auto',
        backgroundColor: isDarkMode ? 'rgba(31, 41, 55, 0.95)' : 'white',
        backdropFilter: isDarkMode ? 'blur(8px)' : 'none',
        border: isDarkMode ? '1px solid #4b5563' : '1px solid #d1d5db'
      }}
    >
      <div 
        className="overflow-y-auto"
        style={{ maxHeight: `${maxHeight}px` }}
      >
        {items.length > 0 ? (
          <div className="py-1">
            {items.map((item, index) => (
              <div
                key={index}
                onClick={() => onItemSelect(item)}
                onMouseEnter={() => onItemHover(index)}
                className="cursor-pointer"
              >
                {renderItem(item, index, index === highlightedIndex)}
              </div>
            ))}
          </div>
        ) : (
          renderNoItems?.() || (
            <div className="py-2 px-3 text-gray-500 dark:text-gray-400 text-sm">
              No items found
            </div>
          )
        )}
        
        {renderFooter?.()}
      </div>
    </div>
  );
}
