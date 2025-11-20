// hooks/useDropdown.ts
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';

interface UseDropdownOptions<T> {
  items: T[];
  filterFn: (items: T[], query: string) => T[];
  onSelect: (item: T) => void;
  isDisabled?: boolean;
  
  // Async options
  dataMode?: 'sync' | 'async';
  apiUrl?: string;
  apiMethod?: 'GET' | 'POST';
  apiHeaders?: Record<string, string>;
  apiBodyTransform?: (query: string) => any;
  apiResponseTransform?: (response: any) => T[];
  debounceMs?: number;
  minCharsForSearch?: number;
  onApiError?: (error: Error) => void;
}

export function useDropdown<T>({
  items,
  filterFn,
  onSelect,
  isDisabled = false,
  
  // Async options with defaults
  dataMode = 'sync',
  apiUrl,
  apiMethod = 'GET',
  apiHeaders = {},
  apiBodyTransform,
  apiResponseTransform,
  debounceMs = 300,
  minCharsForSearch = dataMode === 'async' ? 1 : 2,
  onApiError
}: UseDropdownOptions<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [asyncItems, setAsyncItems] = useState<T[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null!);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null!);
  const hasUserInteractedRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastFetchedQueryRef = useRef<string>('');

  // Validate async mode configuration
  useEffect(() => {
    if (dataMode === 'async' && !apiUrl) {
      console.error('useDropdown: apiUrl is required when dataMode is "async"');
    }
  }, [dataMode, apiUrl]);

  // Fetch data from API
  const fetchAsyncData = useCallback(async (query: string) => {
    if (!apiUrl) return;

    // Trim and normalize the query
    const trimmedQuery = query.trim();
    
    // Don't fetch if query is empty or same as last fetch
    if (!trimmedQuery || lastFetchedQueryRef.current === trimmedQuery) {
      return;
    }

    // Check minimum characters
    if (trimmedQuery.length < minCharsForSearch) {
      setAsyncItems([]);
      setIsLoading(false);
      lastFetchedQueryRef.current = '';
      return;
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    setIsLoading(true);
    setError(null);

    try {
      const url = apiMethod === 'GET' 
        ? `${apiUrl}${apiUrl.includes('?') ? '&' : '?'}q=${encodeURIComponent(trimmedQuery)}`
        : apiUrl;

      const options: RequestInit = {
        method: apiMethod,
        headers: {
          'Content-Type': 'application/json',
          ...apiHeaders
        },
        signal: abortControllerRef.current.signal
      };

      if (apiMethod === 'POST') {
        options.body = JSON.stringify(
          apiBodyTransform ? apiBodyTransform(trimmedQuery) : { query: trimmedQuery }
        );
      }

      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const transformedData = apiResponseTransform ? apiResponseTransform(data) : data;
      
      // Only update if this is still the current query (trimmed comparison)
      if (inputRef.current?.value.trim() === trimmedQuery) {
        setAsyncItems(transformedData);
        lastFetchedQueryRef.current = trimmedQuery;
      }
      setIsLoading(false);
    } catch (err: any) {
      if (err.name === 'AbortError') {
        // Request was cancelled, ignore
        return;
      }
      
      const error = err as Error;
      setError(error.message);
      setIsLoading(false);
      setAsyncItems([]);
      onApiError?.(error);
      console.error('Dropdown API Error:', error);
    }
  }, [apiUrl, apiMethod, apiHeaders, apiBodyTransform, apiResponseTransform, minCharsForSearch, onApiError]);

  // Debounced API call for async mode
  useEffect(() => {
    if (dataMode !== 'async') return;

    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }

    const trimmedValue = inputValue.trim();

    // If input is empty, clear results
    if (trimmedValue === '') {
      setAsyncItems([]);
      setIsLoading(false);
      lastFetchedQueryRef.current = '';
      return;
    }

    // If below minimum characters, don't show loading or fetch
    if (trimmedValue.length < minCharsForSearch) {
      setIsLoading(false);
      setAsyncItems([]);
      lastFetchedQueryRef.current = '';
      return;
    }

    // If this query was already fetched, don't fetch again
    if (lastFetchedQueryRef.current === trimmedValue) {
      return;
    }

    // Only set loading if we're actually going to fetch
    setIsLoading(true);

    // Set new debounced timer
    debounceTimerRef.current = setTimeout(() => {
      fetchAsyncData(trimmedValue);
      debounceTimerRef.current = null;
    }, debounceMs);

    // Cleanup function
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
    };
  }, [inputValue, dataMode, debounceMs, minCharsForSearch, fetchAsyncData]);

  // Determine which items to use based on mode
  const sourceItems = useMemo(() => {
    return dataMode === 'async' ? asyncItems : items;
  }, [dataMode, asyncItems, items]);

  // Memoize filtered items
  const filteredItems = useMemo(() => {
    // For async mode, don't filter (already filtered by API)
    if (dataMode === 'async') {
      return sourceItems;
    }
    // For sync mode, use the filter function
    return filterFn(sourceItems, inputValue);
  }, [dataMode, sourceItems, inputValue, filterFn]);

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

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const handleInputChange = useCallback((value: string) => {
    setInputValue(value);
    hasUserInteractedRef.current = true;
    
    // Open dropdown if user is typing and has content
    if (value.trim() !== '' || dataMode === 'sync') {
      setIsOpen(true);
    }

    // Clear error when user starts typing
    if (error) {
      setError(null);
    }
  }, [dataMode, error]);

  const handleItemSelect = useCallback((item: T) => {
    onSelect(item);
    setIsOpen(false);
    setHighlightedIndex(-1);
    hasUserInteractedRef.current = false;
    lastFetchedQueryRef.current = '';
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
    lastFetchedQueryRef.current = '';
  }, []);

  const retry = useCallback(() => {
    if (dataMode === 'async' && inputValue.trim() !== '') {
      lastFetchedQueryRef.current = '';
      fetchAsyncData(inputValue.trim());
    }
  }, [dataMode, inputValue, fetchAsyncData]);

  return {
    // State
    isOpen,
    inputValue,
    filteredItems,
    highlightedIndex,
    isLoading,
    error,
    
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
    retry,
    
    // Computed
    hasItems: filteredItems.length > 0,
    dataMode
  };
}