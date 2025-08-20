"use client";

import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
    HomeIcon,
    UsersIcon,
    DocumentTextIcon,
    ChartBarIcon,
    CogIcon,
    XMarkIcon,
    ChevronDoubleLeftIcon,
    ChevronDoubleRightIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const navigation = [
    { name: "Dashboard", href: "/", icon: HomeIcon },
    { name: "Users", href: "/users", icon: UsersIcon },
    { name: "Documents", href: "/documents", icon: DocumentTextIcon },
    { name: "Analytics", href: "/analytics", icon: ChartBarIcon },
    { name: "Settings", href: "/settings", icon: CogIcon },
];

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    isCollapsed: boolean;
    onToggleCollapse: () => void;
    className?: string;
}

export default function Sidebar({ isOpen, onClose, isCollapsed, onToggleCollapse, className = "" }: SidebarProps) {
    const pathname = usePathname();

    const SidebarContent = ({ isDesktop = false }: { isDesktop?: boolean }) => (
        <div className="flex flex-col h-full bg-white dark:bg-gray-900">
            {/* Logo Section - EXACTLY 73px height to match header */}
            <div className="flex items-center justify-center px-4 border-b border-gray-200 dark:border-gray-700 h-[73px] flex-shrink-0">
                {isDesktop && isCollapsed ? (
                    // Collapsed: Show only icon
                    <motion.div
                        key="logo-mini"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                        className="relative group"
                    >
                        <div className="w-10 h-10 bg-gradient-to-r from-primary-600 to-secondary-500 rounded-lg flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-xl font-secondary">I</span>
                        </div>

                        {/* Collapse Toggle Button */}
                        <motion.button
                            onClick={onToggleCollapse}
                            className="absolute -right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 shadow-sm hover:shadow-md transition-all"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <ChevronDoubleRightIcon className="w-3 h-3" />
                        </motion.button>

                        {/* Tooltip */}
                        <div className="absolute left-full ml-3 top-1/2 transform -translate-y-1/2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg shadow-lg whitespace-nowrap z-50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            Intellinum Dashboard
                            <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1 border-4 border-transparent border-r-gray-900 dark:border-r-gray-700"></div>
                        </div>
                    </motion.div>
                ) : (
                    // Expanded: Show full logo and toggle button
                    <div className="flex items-center justify-between w-full">
                        <motion.div
                            key="logo-full"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.2 }}
                            className="flex items-center"
                        >
                            <Image
                                src="https://www.intellinum.com/wp-content/uploads/2024/07/Intellinum.png"
                                alt="Intellinum Logo"
                                width={140}
                                height={35}
                                className="h-9 w-auto"
                                priority
                            />
                        </motion.div>

                        {/* Collapse Toggle Button - Desktop Only */}
                        {isDesktop && (
                            <motion.button
                                onClick={onToggleCollapse}
                                className="p-1.5 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <ChevronDoubleLeftIcon className="w-5 h-5" />
                            </motion.button>
                        )}
                    </div>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
                {navigation.map((item, index) => {
                    const isActive = pathname === item.href;
                    return (
                        <motion.div
                            key={item.name}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                            <Link
                                href={item.href}
                                onClick={() => onClose()}
                                className={`group relative flex items-center transition-all duration-200 ${
                                    isDesktop && isCollapsed
                                        ? "px-3 py-3 mx-1 justify-center rounded-lg"
                                        : "px-3 py-3 rounded-lg"
                                } ${
                                    isActive
                                        ? "bg-gradient-to-r from-primary-600 to-secondary-500 text-white shadow-lg"
                                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                                }`}
                            >
                                <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    className="flex items-center"
                                >
                                    <item.icon
                                        className={`h-5 w-5 flex-shrink-0 transition-colors ${
                                            isDesktop && isCollapsed ? "" : "mr-3"
                                        } ${
                                            isActive 
                                                ? "text-white" 
                                                : "text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300"
                                        }`}
                                    />
                                </motion.div>

                                {/* Text - Only show when not collapsed or on mobile */}
                                {(!isDesktop || !isCollapsed) && (
                                    <motion.span
                                        initial={{ opacity: 0, width: 0 }}
                                        animate={{ opacity: 1, width: "auto" }}
                                        exit={{ opacity: 0, width: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="truncate whitespace-nowrap overflow-hidden text-sm font-medium"
                                    >
                                        {item.name}
                                    </motion.span>
                                )}

                                {/* Tooltip for collapsed desktop state */}
                                {isDesktop && isCollapsed && (
                                    <div className="absolute left-full ml-3 top-1/2 transform -translate-y-1/2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg shadow-lg whitespace-nowrap z-50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                        {item.name}
                                        <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1 border-4 border-transparent border-r-gray-900 dark:border-r-gray-700"></div>
                                    </div>
                                )}
                            </Link>
                        </motion.div>
                    );
                })}
            </nav>

            {/* Footer - Hide when collapsed */}
            {(!isDesktop || !isCollapsed) && (
                <motion.div
                    className="px-3 py-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                        © 2025 Intellinum
                    </div>
                </motion.div>
            )}
        </div>
    );

    return (
        <>
            {/* Mobile sidebar - Only shows as overlay */}
            <Transition.Root show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50 lg:hidden" onClose={onClose}>
                    <Transition.Child
                        as={Fragment}
                        enter="transition-opacity ease-linear duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition-opacity ease-linear duration-300"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm" />
                    </Transition.Child>

                    <div className="fixed inset-0 flex">
                        <Transition.Child
                            as={Fragment}
                            enter="transition ease-in-out duration-300 transform"
                            enterFrom="-translate-x-full"
                            enterTo="translate-x-0"
                            leave="transition ease-in-out duration-300 transform"
                            leaveFrom="translate-x-0"
                            leaveTo="-translate-x-full"
                        >
                            <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                                <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                                    <button 
                                        type="button" 
                                        className="-m-2.5 p-2.5 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors" 
                                        onClick={onClose}
                                    >
                                        <span className="sr-only">Close sidebar</span>
                                        <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                                    </button>
                                </div>
                                <div className="flex grow flex-col overflow-y-auto shadow-2xl">
                                    <SidebarContent />
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition.Root>

            {/* Desktop sidebar - FIXED: Only visible on desktop */}
            <div className={`hidden lg:flex lg:flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 shadow-lg ${className}`}>
                <SidebarContent isDesktop />
            </div>
        </>
    );
}
