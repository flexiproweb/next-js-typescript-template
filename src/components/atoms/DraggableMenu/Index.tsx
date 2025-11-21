import React, { useState } from "react";
import Link from "next/link";
import { ChevronRightIcon } from "@heroicons/react/24/outline";

interface SubItem {
    name: string;
    href: string;
}

interface NavigationItem {
    name: string;
    href: string;
    icon: any;
    hasSubmenu?: boolean;
    subItems?: SubItem[];
}

interface DraggableMenuItemProps {
    /* common */
    isActive: boolean;
    onClose: () => void;

    /* parent */
    item?: NavigationItem;
    index?: number;
    isCollapsed?: boolean;
    isDesktop?: boolean;
    isSubmenuOpen?: boolean;
    onToggleSubmenu?: (name: string) => void;
    onParentDragStart?: (index: number) => void;
    onParentDragOver?: (index: number) => void;
    onParentDragEnd?: () => void;

    /* child */
    subItem?: SubItem;
    parentIndex?: number;
    subIndex?: number;
    onSubDragStart?: (parentIndex: number, subIndex: number) => void;
    onSubDragOver?: (parentIndex: number, subIndex: number) => void;
    onSubDragEnd?: () => void;

    type: "parent" | "child";
}

export const DraggableMenuItem = (props: DraggableMenuItemProps) => {
    /* drag always enabled – no double-click required */
    const [isDragging, setIsDragging] = useState(false);

    /* ------------- parent ------------- */
    if (props.type === "parent" && props.item) {
        const {
            item,
            index,
            isActive,
            isCollapsed,
            isDesktop,
            isSubmenuOpen,
            onToggleSubmenu,
            onClose,
            onParentDragStart,
            onParentDragOver,
            onParentDragEnd,
        } = props;

        const onDragStart = (e: React.DragEvent<HTMLDivElement>) => {
            setIsDragging(true);
            if (onParentDragStart && index !== undefined) onParentDragStart(index);
            e.dataTransfer.effectAllowed = "move";
        };

        const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            e.stopPropagation();
            if (onParentDragOver && index !== undefined) onParentDragOver(index);
        };

        const onDragEnd = () => {
            setIsDragging(false);
            if (onParentDragEnd) onParentDragEnd();
        };

        return (
            <div
                draggable
                onDragStart={onDragStart}
                onDragOver={onDragOver}
                onDragEnd={onDragEnd}
                onDrop={(e) => e.preventDefault()}
                className={`select-none transition-all duration-200 ${
                    isDragging ? "opacity-40 scale-95" : "opacity-100 scale-100"
                } cursor-move hover:ring-2 hover:ring-primary-300 rounded-lg`}
                title="Drag to reorder"
            >
                <div
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
                    {item.hasSubmenu && (!isDesktop || !isCollapsed) ? (
                        <button
                            onClick={() => onToggleSubmenu?.(item.name)}
                            className="w-full flex items-center justify-between"
                        >
                            <div className="flex items-center">
                                <item.icon
                                    className={`h-5 w-5 flex-shrink-0 ${
                                        isDesktop && isCollapsed ? "" : "mr-3"
                                    } ${isActive ? "text-white" : "text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300"}`}
                                />
                                {(!isDesktop || !isCollapsed) && (
                                    <span className="truncate whitespace-nowrap overflow-hidden text-sm font-medium">
                                        {item.name}
                                    </span>
                                )}
                            </div>
                            {(!isDesktop || !isCollapsed) && (
                                <div
                                    className={`transform transition-transform ${
                                        isSubmenuOpen ? "rotate-90" : "rotate-0"
                                    }`}
                                >
                                    <ChevronRightIcon
                                        className={`w-5 h-5 ${isActive ? "text-white" : "text-gray-500"}`}
                                    />
                                </div>
                            )}
                        </button>
                    ) : (
                        <Link
                            href={item.href}
                            onClick={() => onClose()}
                            className="w-full flex items-center"
                        >
                            <item.icon
                                className={`h-5 w-5 flex-shrink-0 ${
                                    isDesktop && isCollapsed ? "" : "mr-3"
                                } ${
                                    isActive
                                        ? "text-white"
                                        : "text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300"
                                }`}
                            />
                            {(!isDesktop || !isCollapsed) && (
                                <span className="truncate whitespace-nowrap overflow-hidden text-sm font-medium">
                                    {item.name}
                                </span>
                            )}
                        </Link>
                    )}

                    {isDesktop && isCollapsed && (
                        <div className="absolute left-full ml-3 top-1/2 transform -translate-y-1/2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg shadow-lg whitespace-nowrap z-50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            {item.name}
                            <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1 border-4 border-transparent border-r-gray-900 dark:border-r-gray-700" />
                        </div>
                    )}
                </div>
            </div>
        );
    }

    /* ------------- child ------------- */
    if (props.type === "child" && props.subItem) {
        const {
            subItem,
            parentIndex,
            subIndex,
            isActive,
            onClose,
            onSubDragStart,
            onSubDragOver,
            onSubDragEnd,
        } = props;

        const onDragStart = (e: React.DragEvent<HTMLDivElement>) => {
            e.stopPropagation();
            setIsDragging(true);
            if (onSubDragStart && parentIndex !== undefined && subIndex !== undefined)
                onSubDragStart(parentIndex, subIndex);
            e.dataTransfer.effectAllowed = "move";
        };

        const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            e.stopPropagation();
            if (onSubDragOver && parentIndex !== undefined && subIndex !== undefined)
                onSubDragOver(parentIndex, subIndex);
        };

        const onDragEnd = () => {
            setIsDragging(false);
            if (onSubDragEnd) onSubDragEnd();
        };

        return (
            <div
                draggable
                onDragStart={onDragStart}
                onDragOver={onDragOver}
                onDragEnd={onDragEnd}
                onDrop={(e) => e.preventDefault()}
                className={`select-none transition-all duration-200 ${
                    isDragging ? "opacity-40 scale-95" : "opacity-100 scale-100"
                } cursor-move hover:ring-2 hover:ring-primary-300 rounded-lg`}
                title="Drag to reorder"
            >
                <Link
                    href={subItem.href}
                    onClick={() => onClose()}
                    className={`block px-3 py-2 text-sm rounded-lg transition-all duration-200 ${
                        isActive
                            ? "bg-primary-100 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300"
                            : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-300"
                    }`}
                >
                    {subItem.name}
                </Link>
            </div>
        );
    }

    return null;
};