"use client";

import { useState, useEffect } from "react";
import { Bars3Icon, BellIcon, MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from "@headlessui/react";
import { useTheme } from "./ClientThemeProvider";
import SearchHeader from "./atoms/header/SearchHeader";

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

    // Sample notification data
    const notifications = [
        { id: 1, title: "New message", message: "You have a new message from John", time: "2 min ago", unread: true },
        { id: 2, title: "System update", message: "System maintenance scheduled for tonight", time: "1 hour ago", unread: true },
        { id: 3, title: "Welcome!", message: "Welcome to our platform", time: "1 day ago", unread: false },
    ];

    const unreadCount = notifications.filter(n => n.unread).length;

    const handleSearch = (query: string) => {
        console.log("Searching for:", query);
        // Add your search logic here
    };

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

                    <SearchHeader
                        value={searchQuery}
                        onChange={setSearchQuery}
                        onSearch={handleSearch}
                        showMobileSearch={showMobileSearch}
                        onToggleMobileSearch={setShowMobileSearch}
                    />

                    <div className="flex items-center space-x-2 sm:space-x-3">
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
        <header className={`bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 w-full ${className}`}>
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

                {/* Reusable Search Component */}
                <SearchHeader
                    value={searchQuery}
                    onChange={setSearchQuery}
                    onSearch={handleSearch}
                    showMobileSearch={showMobileSearch}
                    onToggleMobileSearch={setShowMobileSearch}
                    autoFocus={true}
                />

                <div className="flex items-center space-x-2 sm:space-x-3">
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

                    {/* Notifications Dropdown */}
                    <Menu as="div" className="relative">
                        <MenuButton className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative">
                            <BellIcon className="w-5 h-5" />
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                            )}
                        </MenuButton>

                        <Transition
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                        >
                            <MenuItems className="absolute right-0 mt-2 w-96 sm:w-[28rem] lg:w-[32rem] origin-top-right divide-y divide-gray-100 dark:divide-gray-700 rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black/5 focus:outline-none z-50">
                                <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                                    <div className="flex items-center justify-between">
                                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                            Notifications
                                        </p>
                                        {unreadCount > 0 && (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300">
                                                {unreadCount} new
                                            </span>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="max-h-96 overflow-y-auto">
                                    {notifications.length === 0 ? (
                                        <div className="px-6 py-12 text-center">
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                No notifications yet
                                            </p>
                                        </div>
                                    ) : (
                                        notifications.map((notification) => (
                                            <MenuItem key={notification.id}>
                                                {({ focus }) => (
                                                    <div
                                                        className={`${
                                                            focus ? 'bg-gray-50 dark:bg-gray-700' : ''
                                                        } ${
                                                            notification.unread ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                                                        } px-6 py-4 cursor-pointer transition-colors`}
                                                    >
                                                        <div className="flex justify-between items-start">
                                                            <div className="flex-1 pr-4">
                                                                <div className="flex items-center justify-between mb-2">
                                                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                                                        {notification.title}
                                                                    </p>
                                                                    {notification.unread && (
                                                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                                    )}
                                                                </div>
                                                                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 leading-relaxed">
                                                                    {notification.message}
                                                                </p>
                                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                                    {notification.time}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </MenuItem>
                                        ))
                                    )}
                                </div>

                                <div className="px-6 py-3 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                                    <div className="flex items-center justify-between">
                                        <MenuItem>
                                            {({ focus }) => (
                                                <button
                                                    className={`${
                                                        focus ? 'text-blue-800 dark:text-blue-300' : 'text-blue-600 dark:text-blue-400'
                                                    } text-sm font-medium hover:underline`}
                                                >
                                                    Mark all as read
                                                </button>
                                            )}
                                        </MenuItem>
                                        <MenuItem>
                                            {({ focus }) => (
                                                <button
                                                    className={`${
                                                        focus ? 'text-gray-800 dark:text-gray-200' : 'text-gray-600 dark:text-gray-400'
                                                    } text-sm hover:underline`}
                                                >
                                                    View all notifications
                                                </button>
                                            )}
                                        </MenuItem>
                                    </div>
                                </div>
                            </MenuItems>
                        </Transition>
                    </Menu>

                    {/* Profile Dropdown */}
                    <Menu as="div" className="relative">
                        <MenuButton className="w-9 h-9 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-medium text-sm hover:opacity-80 transition-opacity">
                            U
                        </MenuButton>

                        <Transition
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                        >
                            <MenuItems className="absolute right-0 mt-2 w-96 sm:w-[28rem] lg:w-[32rem] origin-top-right divide-y divide-gray-100 dark:divide-gray-700 rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black/5 focus:outline-none z-50">
                                <div className="px-6 py-4">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-14 h-14 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                                            JD
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-base font-semibold text-gray-900 dark:text-white">
                                                John Doe
                                            </p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                john@example.com
                                            </p>
                                            <div className="flex items-center mt-1">
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300">
                                                    Premium Plan
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="py-2">
                                    <MenuItem>
                                        {({ focus }) => (
                                            <a
                                                href="#"
                                                className={`${
                                                    focus ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'
                                                } flex items-center px-6 py-4 text-sm transition-colors`}
                                            >
                                                <div className="w-6 h-6 mr-4 text-gray-400">
                                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="font-medium">View Profile</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">Manage your personal information</p>
                                                </div>
                                            </a>
                                        )}
                                    </MenuItem>
                                    <MenuItem>
                                        {({ focus }) => (
                                            <a
                                                href="#"
                                                className={`${
                                                    focus ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'
                                                } flex items-center px-6 py-4 text-sm transition-colors`}
                                            >
                                                <div className="w-6 h-6 mr-4 text-gray-400">
                                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="font-medium">Account Settings</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">Privacy, security, and preferences</p>
                                                </div>
                                            </a>
                                        )}
                                    </MenuItem>
                                    <MenuItem>
                                        {({ focus }) => (
                                            <a
                                                href="#"
                                                className={`${
                                                    focus ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'
                                                } flex items-center px-6 py-4 text-sm transition-colors`}
                                            >
                                                <div className="w-6 h-6 mr-4 text-gray-400">
                                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="font-medium">Billing & Payments</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">Manage subscription and invoices</p>
                                                </div>
                                            </a>
                                        )}
                                    </MenuItem>
                                    <MenuItem>
                                        {({ focus }) => (
                                            <a
                                                href="#"
                                                className={`${
                                                    focus ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'
                                                } flex items-center px-6 py-4 text-sm transition-colors`}
                                            >
                                                <div className="w-6 h-6 mr-4 text-gray-400">
                                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="font-medium">Help & Support</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">Get help and contact support</p>
                                                </div>
                                            </a>
                                        )}
                                    </MenuItem>
                                </div>
                                
                                <div className="py-2">
                                    <MenuItem>
                                        {({ focus }) => (
                                            <button
                                                className={`${
                                                    focus ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400' : 'text-red-600 dark:text-red-400'
                                                } flex items-center w-full text-left px-6 py-4 text-sm transition-colors`}
                                            >
                                                <div className="w-6 h-6 mr-4">
                                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="font-medium">Sign Out</p>
                                                    <p className="text-xs text-gray-400 dark:text-gray-500">Log out of your account</p>
                                                </div>
                                            </button>
                                        )}
                                    </MenuItem>
                                </div>
                            </MenuItems>
                        </Transition>
                    </Menu>
                </div>
            </div>
        </header>
    );
}
