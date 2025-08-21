"use client";

import { useState, useEffect } from "react";
import { Bars3Icon, BellIcon, MagnifyingGlassIcon, MoonIcon, SunIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useTheme } from "./ClientThemeProvider";

interface SafeHeaderProps {
    onMenuClick: () => void;
    isCollapsed?: boolean;
    className?: string;
}

export default function SafeHeader({
    onMenuClick,
    isCollapsed = false,
    className = ""
}: SafeHeaderProps) {
    const { theme, toggleTheme, mounted } = useTheme();
    const [searchQuery, setSearchQuery] = useState("");
    const [showMobileSearch, setShowMobileSearch] = useState(false);

    if (!mounted) {
        return (
            <header className={`bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40 w-full ${className}`}>
                <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 h-[73px]">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={onMenuClick}
                            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors lg:hidden"
                        >
                            <Bars3Icon className="w-6 h-6" />
                        </button>

                        <div className="flex items-center lg:hidden md:hidden sm:hidden">
                            {/* Logo placeholder */}
                        </div>
                    </div>

                    <div className="hidden md:flex flex-1 max-w-lg mx-4">
                        <div className="relative w-full">
                            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm"
                            />
                        </div>
                    </div>

                    <div className="flex items-center space-x-2 sm:space-x-3">
                        <button className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
                            <MagnifyingGlassIcon className="w-5 h-5" />
                        </button>

                        <button className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
                            <MoonIcon className="w-5 h-5" />
                        </button>

                        <button className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors relative">
                            <BellIcon className="w-5 h-5" />
                            <span className="absolute -top-1 -right-1 w-3 h-3 bg-tertiary-500 rounded-full"></span>
                        </button>

                        <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                            U
                        </div>
                    </div>
                </div>
            </header>
        );
    }

    return (
        <header className={`bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700 ${className}`}>
            <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 h-[73px]">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={onMenuClick}
                        className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors lg:hidden"
                    >
                        <Bars3Icon className="w-6 h-6" />
                    </button>

                    <div className="flex items-center lg:hidden">
                        {/* Logo placeholder */}
                    </div>
                </div>

                {/* Desktop Search */}
                <div className="hidden md:flex flex-1 max-w-lg mx-4">
                    <div className="relative w-full">
                        <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-4 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 transition-all text-sm outline-none"
                        />
                    </div>
                </div>

                <div className="flex items-center space-x-2 sm:space-x-3">
                    {/* Mobile Search Toggle */}
                    <div className="md:hidden relative flex items-center">
                        {showMobileSearch ? (
                            <div className="flex items-center w-full">
                                <button
                                    onClick={() => setShowMobileSearch(false)}
                                    className="p-2 mr-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                >
                                    <XMarkIcon className="w-5 h-5" />
                                </button>
                                <div className="relative flex-grow">
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 text-sm outline-none"
                                        autoFocus
                                    />
                                     <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={() => setShowMobileSearch(true)}
                                className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                                <MagnifyingGlassIcon className="w-5 h-5" />
                            </button>
                        )}
                    </div>

                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        {theme === "light" ? (
                            <MoonIcon className="w-5 h-5" />
                        ) : (
                            <SunIcon className="w-5 h-5" />
                        )}
                    </button>

                    <button className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative">
                        <BellIcon className="w-5 h-5" />
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-tertiary-500 rounded-full"></span>
                    </button>

                    <div className="w-9 h-9 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                        U
                    </div>
                </div>
            </div>
        </header>
    );
}
