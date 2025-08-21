"use client";

import { useState, useRef, useEffect } from "react";
import { MagnifyingGlassIcon, XMarkIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import suggestionData from "../../../../suggestions.json";
// import type { Suggestion } from "../../../types/suggestions";

interface SearchHeaderProps {
    placeholder?: string;
    value?: string;
    onChange?: (value: string) => void;
    onSearch?: (query: string) => void;
    className?: string;
    showMobileSearch?: boolean;
    onToggleMobileSearch?: (show: boolean) => void;
    autoFocus?: boolean;
}
export interface Suggestion {
    id: number;
    name: string;
    category: string;
    type: 'product' | 'query';
}


// Import suggestions data
const dummySuggestions: Suggestion[] = suggestionData as Suggestion[];

export default function SearchHeader({
    placeholder = "Search...",
    value = "",
    onChange,
    onSearch,
    className = "",
    showMobileSearch = false,
    onToggleMobileSearch,
    autoFocus = false
}: SearchHeaderProps) {
    const [internalValue, setInternalValue] = useState(value);
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [autocompleteText, setAutocompleteText] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const mobileInputRef = useRef<HTMLInputElement>(null);
    const suggestionsRef = useRef<HTMLDivElement>(null);

    const currentValue = onChange ? value : internalValue;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setInternalValue(newValue);
        onChange?.(newValue);
        
        // Always clear autocomplete when user is typing
        setAutocompleteText("");

        // Filter suggestions based on input
        if (newValue.trim()) {
            const filtered = dummySuggestions.filter(item =>
                item.name.toLowerCase().includes(newValue.toLowerCase())
            ).slice(0, 15);
            setSuggestions(filtered);
            setShowSuggestions(true);
            setSelectedIndex(-1);

            // Set autocomplete text but don't show it immediately
            const firstMatch = filtered.find(item => 
                item.name.toLowerCase().startsWith(newValue.toLowerCase()) &&
                item.name.toLowerCase() !== newValue.toLowerCase()
            );
            
            if (firstMatch && newValue.length > 0) {
                // Set autocomplete text but don't display it during typing
                setTimeout(() => {
                    // Only show if the input hasn't changed and matches the beginning
                    const currentInput = inputRef.current || mobileInputRef.current;
                    if (currentInput && currentInput.value === newValue && newValue.trim()) {
                        const stillMatches = firstMatch.name.toLowerCase().startsWith(newValue.toLowerCase());
                        if (stillMatches) {
                            setAutocompleteText(firstMatch.name);
                        }
                    }
                }, 300); // Small delay to avoid showing during rapid typing
            }
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
            setAutocompleteText("");
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (selectedIndex >= 0 && suggestions[selectedIndex]) {
                selectSuggestion(suggestions[selectedIndex]);
            } else if (autocompleteText && autocompleteText.toLowerCase().startsWith(currentValue.toLowerCase())) {
                acceptAutocomplete();
            } else {
                onSearch?.(currentValue);
                setShowSuggestions(false);
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : -1));
            setAutocompleteText(""); // Clear autocomplete when navigating
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => (prev > 0 ? prev - 1 : suggestions.length - 1));
            setAutocompleteText(""); // Clear autocomplete when navigating
        } else if (e.key === 'Escape') {
            setShowSuggestions(false);
            setSelectedIndex(-1);
            setAutocompleteText("");
        } else if (e.key === 'Tab' && autocompleteText && autocompleteText.toLowerCase().startsWith(currentValue.toLowerCase())) {
            e.preventDefault();
            acceptAutocomplete();
        } else if (e.key === 'ArrowRight' && autocompleteText && autocompleteText.toLowerCase().startsWith(currentValue.toLowerCase())) {
            const input = e.target as HTMLInputElement;
            const cursorPosition = input.selectionStart || 0;
            if (cursorPosition === currentValue.length) {
                e.preventDefault();
                acceptAutocomplete();
            }
        } else {
            // Clear autocomplete on any other key press (typing)
            setAutocompleteText("");
        }
    };

    const acceptAutocomplete = () => {
        if (autocompleteText && autocompleteText.toLowerCase().startsWith(currentValue.toLowerCase())) {
            setInternalValue(autocompleteText);
            onChange?.(autocompleteText);
            setAutocompleteText("");
        }
    };

    const selectSuggestion = (suggestion: Suggestion) => {
        setInternalValue(suggestion.name);
        onChange?.(suggestion.name);
        setShowSuggestions(false);
        setSelectedIndex(-1);
        setAutocompleteText("");
        onSearch?.(suggestion.name);
    };

    const handleMobileToggle = (show: boolean) => {
        onToggleMobileSearch?.(show);
        if (!show) {
            setInternalValue("");
            onChange?.("");
            setShowSuggestions(false);
            setAutocompleteText("");
        }
    };

    const handleInputFocus = () => {
        if (currentValue.trim() && suggestions.length > 0) {
            setShowSuggestions(true);
        }
        // Clear autocomplete on focus
        setAutocompleteText("");
    };

    const handleInputClick = () => {
        // Clear autocomplete when clicking on input
        setAutocompleteText("");
    };

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
                setSelectedIndex(-1);
                setAutocompleteText("");
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'Electronics': return '📱';
            case 'Fashion': return '👕';
            case 'Photography': return '📷';
            case 'Gaming': return '🎮';
            case 'Automotive': return '🚗';
            case 'Help': return '❓';
            case 'Support': return '💬';
            case 'Account': return '⚙️';
            default: return '🔍';
        }
    };

    // Google-style autocomplete component
    const AutocompleteDisplay = ({ isMobile = false }: { isMobile?: boolean }) => {
        // Only show if we have autocomplete text and it starts with current value
        if (!autocompleteText || 
            !currentValue || 
            !autocompleteText.toLowerCase().startsWith(currentValue.toLowerCase()) ||
            autocompleteText.toLowerCase() === currentValue.toLowerCase()) {
            return null;
        }
        
        const remainingText = autocompleteText.slice(currentValue.length);
        
        return (
            <div 
                className={`absolute top-0 left-0 w-full ${isMobile ? 'pl-10 pr-4' : 'pl-10 pr-10'} py-2 pointer-events-none select-none z-10`}
                style={{ 
                    fontSize: '14px',
                    lineHeight: '20px',
                    fontFamily: 'inherit'
                }}
            >
                <span className="invisible font-tertiary">{currentValue}</span>
                <span className="bg-blue-200 dark:bg-blue-600 text-gray-900 dark:text-white font-tertiary rounded-sm px-0.5">
                    {remainingText}
                </span>
            </div>
        );
    };

    const SuggestionsList = ({ isDesktop = true }: { isDesktop?: boolean }) => (
        showSuggestions && suggestions.length > 0 && (
            <div 
                ref={suggestionsRef}
                className={`absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl shadow-xl max-h-96 overflow-y-auto ${
                    isDesktop ? 'top-full' : 'top-full'
                }`}
                style={{ minHeight: '300px' }}
            >
                <div className="py-2">
                    {suggestions.map((suggestion, index) => (
                        <div
                            key={suggestion.id}
                            className={`flex items-center justify-between px-6 py-4 cursor-pointer transition-all duration-150 ${
                                index === selectedIndex 
                                    ? 'bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500' 
                                    : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                            onClick={() => selectSuggestion(suggestion)}
                        >
                            <div className="flex items-center flex-1">
                                <span className="text-xl mr-4">{getCategoryIcon(suggestion.category)}</span>
                                <div className="flex-1">
                                    <div className="flex items-center">
                                        <p className="text-base font-medium text-gray-900 dark:text-white font-tertiary">
                                            {suggestion.name}
                                        </p>
                                        {suggestion.type === 'query' && (
                                            <span className="ml-3 px-2.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs rounded-full font-medium">
                                                Help
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-tertiary">
                                        in {suggestion.category}
                                    </p>
                                </div>
                            </div>
                            <ChevronRightIcon className="w-5 h-5 text-gray-400" />
                        </div>
                    ))}
                </div>
                
                <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750">
                    <button
                        onClick={() => {
                            onSearch?.(currentValue);
                            setShowSuggestions(false);
                        }}
                        className="w-full flex items-center px-6 py-4 text-base text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors rounded-b-xl font-medium font-tertiary"
                    >
                        <MagnifyingGlassIcon className="w-5 h-5 mr-3" />
                        Search for "{currentValue}"
                    </button>
                </div>
            </div>
        )
    );

    return (
        <>
            {/* Desktop Search */}
            <div className={`hidden md:flex flex-1 max-w-lg mx-4 ${className} relative`}>
                <div className="relative w-full min-w-[280px]">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-20">
                        <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
                    </div>
                    
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder={placeholder}
                        value={currentValue}
                        onChange={handleChange}
                        onKeyDown={handleKeyPress}
                        onFocus={handleInputFocus}
                        onClick={handleInputClick}
                        className="w-full px-4 py-2 pl-10 pr-10 border border-gray-300 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-500 transition-all backdrop-blur-sm font-tertiary text-sm outline-none relative"
                        style={{ zIndex: 2 }}
                    />

                    <AutocompleteDisplay isMobile={false} />
                    
                    {currentValue && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 z-20">
                            <button
                                onClick={() => {
                                    setInternalValue("");
                                    onChange?.("");
                                    setSuggestions([]);
                                    setShowSuggestions(false);
                                    setAutocompleteText("");
                                }}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                <XMarkIcon className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>
                <SuggestionsList isDesktop={true} />
            </div>

            {/* Mobile Search Toggle */}
            <div className="md:hidden relative flex items-center">
                {showMobileSearch ? (
                    <div className="flex items-center w-full relative">
                        <button
                            onClick={() => handleMobileToggle(false)}
                            className="p-2 mr-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            <XMarkIcon className="w-5 h-5" />
                        </button>
                        <div className="relative flex-grow min-w-[280px]">
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-20">
                                <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
                            </div>
                            
                            <input
                                ref={mobileInputRef}
                                type="text"
                                placeholder={placeholder}
                                value={currentValue}
                                onChange={handleChange}
                                onKeyDown={handleKeyPress}
                                onFocus={handleInputFocus}
                                onClick={handleInputClick}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-500 transition-all backdrop-blur-sm font-tertiary text-sm outline-none relative"
                                style={{ zIndex: 2 }}
                                autoFocus={autoFocus}
                            />

                            <AutocompleteDisplay isMobile={true} />
                        </div>
                        <SuggestionsList isDesktop={false} />
                    </div>
                ) : (
                    <button
                        onClick={() => handleMobileToggle(true)}
                        className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        <MagnifyingGlassIcon className="w-5 h-5" />
                    </button>
                )}
            </div>
        </>
    );
}
