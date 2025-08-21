"use client";

import { useState } from "react";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setInternalValue(newValue);
        onChange?.(newValue);
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            onSearch?.(internalValue);
        }
    };

    const handleMobileToggle = (show: boolean) => {
        onToggleMobileSearch?.(show);
        if (!show) {
            setInternalValue("");
            onChange?.("");
        }
    };

    return (
        <>
            {/* Desktop Search */}
            <div className={`hidden md:flex flex-1 max-w-lg mx-4 ${className}`}>
                <div className="relative w-full">
                    <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder={placeholder}
                        value={onChange ? value : internalValue}
                        onChange={handleChange}
                        onKeyPress={handleKeyPress}
                        className="w-full px-4 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 transition-all text-sm outline-none"
                    />
                </div>
            </div>

            {/* Mobile Search Toggle */}
            <div className="md:hidden relative flex items-center">
                {showMobileSearch ? (
                    <div className="flex items-center w-full">
                        <button
                            onClick={() => handleMobileToggle(false)}
                            className="p-2 mr-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            <XMarkIcon className="w-5 h-5" />
                        </button>
                        <div className="relative flex-grow">
                            <input
                                type="text"
                                placeholder={placeholder}
                                value={onChange ? value : internalValue}
                                onChange={handleChange}
                                onKeyPress={handleKeyPress}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 text-sm outline-none"
                                autoFocus={autoFocus}
                            />
                            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>
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
