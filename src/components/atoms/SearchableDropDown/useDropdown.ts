import { useState, useEffect, useRef, useCallback, useMemo } from 'react';

interface UseDropdownOptions<T> {
  items: T[];
  filterFn: (items: T[], query: string) => T[];
  onSelect: (item: T) => void;
  isDisabled?: boolean;
}

export function useDropdown<T>({
  items,
  filterFn,
  onSelect,
  isDisabled = false
}: UseDropdownOptions<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  
  const containerRef = useRef<HTMLDivElement>(null!);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null!);
  const hasUserInteractedRef = useRef(false);

  // Memoize filtered items to prevent infinite loops
  const filteredItems = useMemo(() => {
    return filterFn(items, inputValue);
  }, [items, inputValue, filterFn]);

  // Reset highlighted index when filtered items change
  useEffect(() => {
    setHighlightedIndex(-1);
  }, [filteredItems.length]);

  // Handle clicks outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        hasUserInteractedRef.current = false;
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = useCallback((value: string) => {
    setInputValue(value);
    hasUserInteractedRef.current = true;
    
    // Open dropdown if user is typing and has content
    if (value.trim() !== '') {
      setIsOpen(true);
    }
  }, []);

  const handleItemSelect = useCallback((item: T) => {
    onSelect(item);
    setIsOpen(false);
    setHighlightedIndex(-1);
    hasUserInteractedRef.current = false;
  }, [onSelect]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (isDisabled) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          hasUserInteractedRef.current = true;
        } else {
          setHighlightedIndex(prev => 
            prev < filteredItems.length - 1 ? prev + 1 : prev
          );
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (isOpen) {
          setHighlightedIndex(prev => prev > 0 ? prev - 1 : prev);
        }
        break;
      case 'Enter':
        e.preventDefault();
        if (isOpen && highlightedIndex >= 0 && filteredItems[highlightedIndex]) {
          handleItemSelect(filteredItems[highlightedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setHighlightedIndex(-1);
        hasUserInteractedRef.current = false;
        break;
    }
  }, [isOpen, highlightedIndex, filteredItems, handleItemSelect, isDisabled]);

  const open = useCallback(() => {
    if (!isDisabled) {
      setIsOpen(true);
      hasUserInteractedRef.current = true;
      inputRef.current?.focus();
    }
  }, [isDisabled]);

  const close = useCallback(() => {
    setIsOpen(false);
    setHighlightedIndex(-1);
    hasUserInteractedRef.current = false;
  }, []);

  const setInputValueSilent = useCallback((value: string) => {
    setInputValue(value);
    // Don't set user interaction flag
  }, []);

  return {
    // State
    isOpen,
    inputValue,
    filteredItems,
    highlightedIndex,
    
    // Refs
    containerRef,
    inputRef,
    dropdownRef,
    
    // Actions
    setInputValue: handleInputChange,
    setInputValueSilent,
    setHighlightedIndex,
    handleKeyDown,
    handleItemSelect,
    open,
    close,
    
    // Computed
    hasItems: filteredItems.length > 0
  };
}
