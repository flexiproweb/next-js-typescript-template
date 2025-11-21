"use client";

import { Fragment, useState } from "react";
import {
    DndContext,
    DragEndEvent,
    closestCenter,
} from "@dnd-kit/core";
import {
    SortableContext,
    verticalListSortingStrategy,
    useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
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
import { usePathname } from "next/navigation";
import { Dialog, Transition } from "@headlessui/react";

/* ------------------ TYPES ------------------ */
interface SubItem {
    name: string;
    href: string;
}
interface NavItem {
    name: string;
    href: string;
    icon: any;
    hasSubmenu?: boolean;
    subItems?: SubItem[];
}

/* ===================================================================
                       SORTABLE PARENT ITEM
=================================================================== */
function ParentItem({
    item,
    isActive,
    isCollapsed,
    isDesktop,
    isSubmenuOpen,
    isDragActive,
    onToggleSubmenu,
    onDoubleActivate,
}: {
    item: NavItem;
    isActive: boolean;
    isCollapsed?: boolean;
    isDesktop?: boolean;
    isSubmenuOpen?: boolean;
    isDragActive: boolean;
    onToggleSubmenu: (name: string) => void;
    onDoubleActivate: (name: string) => void;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: item.name });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} className="select-none">
            <div
                onDoubleClick={(e) => {
                    e.stopPropagation();
                    onDoubleActivate(item.name);
                }}
                className={`group relative flex items-center transition-all duration-200 ${
                    isDesktop && isCollapsed
                        ? "px-3 py-3 mx-1 justify-center rounded-lg"
                        : "px-3 py-3 rounded-lg"
                } ${
                    isActive
                        ? "bg-gradient-to-r from-primary-600 to-secondary-500 text-white shadow-lg"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                } ${
                    isDragging || isDragActive
                        ? "shadow-xl ring-2 ring-primary-400/70"
                        : ""
                }`}
                {...attributes}
                {...listeners}
            >
                {item.hasSubmenu && (!isDesktop || !isCollapsed) ? (
                    <div className="w-full flex items-center justify-between">
                        {/* LEFT SIDE (LABEL + ICON) */}
                        <div className="flex items-center">
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
                        </div>

                        {/* CHEVRON: ONLY EXPAND/COLLAPSE */}
                        <div
                            onClick={(e) => {
                                e.stopPropagation();
                                onToggleSubmenu(item.name);
                            }}
                            onPointerDown={(e) => {
                                // prevent drag from starting when grabbing chevron
                                e.stopPropagation();
                            }}
                            className="cursor-pointer p-1 select-none"
                        >
                            <ChevronDoubleRightIcon
                                className={`w-5 h-5 transform transition-transform ${
                                    isSubmenuOpen ? "rotate-90" : "rotate-0"
                                } ${isActive ? "text-white" : "text-gray-500"}`}
                            />
                        </div>
                    </div>
                ) : (
                    // PARENT WITHOUT SUBMENU – JUST A LABEL (NO NAVIGATION)
                    <div className="w-full flex items-center">
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
                    </div>
                )}

                {/* Tooltip when collapsed */}
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

/* ===================================================================
                       SORTABLE CHILD ITEM
=================================================================== */
function ChildItem({
    sub,
    isActive,
    parentId,
    isDragActive,
    onDoubleActivate,
}: {
    sub: SubItem;
    isActive: boolean;
    parentId: string;
    isDragActive: boolean;
    onDoubleActivate: (fullId: string) => void;
}) {
    const fullId = `${parentId}__${sub.name}`;

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: fullId,
    });

    const style = { transform: CSS.Transform.toString(transform), transition };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="select-none ml-6 mt-1 border-l border-gray-200 dark:border-gray-700 pl-3"
        >
            <div
                onDoubleClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onDoubleActivate(fullId);
                }}
                className={`block px-3 py-2 text-sm rounded-lg transition-all duration-200 ${
                    isActive
                        ? "bg-primary-100 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-300"
                } ${
                    isDragging || isDragActive
                        ? "shadow-md ring-2 ring-primary-400/70"
                        : ""
                }`}
                {...attributes}
                {...listeners}
            >
                {sub.name}
            </div>
        </div>
    );
}

/* ===================================================================
                           SIDEBAR
=================================================================== */
interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    isCollapsed: boolean;
    onToggleCollapse: () => void;
    className?: string;
}

export default function Sidebar({
    isOpen,
    onClose,
    isCollapsed,
    onToggleCollapse,
    className = "",
}: SidebarProps) {
    const pathname = usePathname();
    const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>(
        {}
    );

    const [navigation, setNavigation] = useState<NavItem[]>([
        { name: "Dashboard", href: "/", icon: HomeIcon },
        {
            name: "Users",
            href: "/users",
            icon: UsersIcon,
            hasSubmenu: true,
            subItems: [
                { name: "All Users", href: "/users" },
                { name: "Active Users", href: "/users/active" },
                { name: "Inactive Users", href: "/users/inactive" },
                { name: "User Roles", href: "/users/roles" },
                { name: "Add New User", href: "/users/create" },
            ],
        },
        { name: "Documents", href: "/documents", icon: DocumentTextIcon },
        { name: "Analytics", href: "/analytics", icon: ChartBarIcon },
        { name: "Settings", href: "/settings", icon: CogIcon },
    ]);

    // purely visual "drag activated" states
    const [activeDragParent, setActiveDragParent] = useState<string | null>(
        null
    );
    const [activeDragChild, setActiveDragChild] = useState<string | null>(null);

    const toggleSubmenu = (name: string) =>
        setOpenSubmenus((p) => ({ ...p, [name]: !p[name] }));

    const handleParentActivate = (name: string) =>
        setActiveDragParent((prev) => (prev === name ? null : name));

    const handleChildActivate = (fullId: string) =>
        setActiveDragChild((prev) => (prev === fullId ? null : fullId));

    /* ------------ unified drag-end handler ------------ */
    const handleDragEnd = (e: DragEndEvent) => {
        const { active, over } = e;
        if (!over) return;

        const activeId = String(active.id);
        const overId = String(over.id);

        if (activeId === overId) return;

        const isChild = activeId.includes("__");

        if (!isChild) {
            // PARENT REORDER
            const oldIndex = navigation.findIndex((i) => i.name === activeId);
            const newIndex = navigation.findIndex((i) => i.name === overId);

            if (oldIndex === -1 || newIndex === -1) return;

            const newNav = [...navigation];
            const [moved] = newNav.splice(oldIndex, 1);
            newNav.splice(newIndex, 0, moved);
            setNavigation(newNav);
            return;
        }

        // CHILD REORDER (within same parent)
        const [activeParentId, activeSubName] = activeId.split("__");
        const [overParentId, overSubName] = overId.split("__");

        if (!activeParentId || !overParentId) return;
        if (activeParentId !== overParentId) {
            // child cannot move to another parent
            return;
        }

        const parentIndex = navigation.findIndex(
            (p) => p.name === activeParentId
        );
        if (parentIndex === -1) return;

        const parent = { ...navigation[parentIndex] };
        if (!parent.subItems) return;

        const subs = [...parent.subItems];
        const oldIdx = subs.findIndex((s) => s.name === activeSubName);
        const newIdx = subs.findIndex((s) => s.name === overSubName);

        if (oldIdx === -1 || newIdx === -1) return;
        if (oldIdx === newIdx) return;

        const [moved] = subs.splice(oldIdx, 1);
        subs.splice(newIdx, 0, moved);

        parent.subItems = subs;
        const newNav = [...navigation];
        newNav[parentIndex] = parent;
        setNavigation(newNav);
    };

    /* ------------ content wrapper ------------ */
    const SidebarContent = ({ isDesktop = false }: { isDesktop?: boolean }) => (
        <div className="flex flex-col h-full bg-white dark:bg-gray-900">
            {/* ---- logo ---- */}
            <div className="flex items-center justify-center px-4 border-b border-gray-200 dark:border-gray-700 h-[73px] flex-shrink-0">
                {isDesktop && isCollapsed ? (
                    <div className="relative group">
                        <div className="w-10 h-10 bg-gradient-to-r from-primary-600 to-secondary-500 rounded-lg flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-xl">I</span>
                        </div>
                        <button
                            onClick={onToggleCollapse}
                            className="absolute -right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 shadow-sm hover:shadow-md transition-all"
                        >
                            <ChevronDoubleRightIcon className="w-3 h-3" />
                        </button>
                        <div className="absolute left-full ml-3 top-1/2 transform -translate-y-1/2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg shadow-lg whitespace-nowrap z-50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            Intellinum Dashboard
                            <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1 border-4 border-transparent border-r-gray-900 dark:border-r-gray-700" />
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center">
                            <Image
                                src="https://www.intellinum.com/wp-content/uploads/2024/07/Intellinum.png"
                                alt="Intellinum Logo"
                                width={140}
                                height={35}
                                className="h-9 w-auto"
                                priority
                            />
                        </div>
                        {isDesktop && (
                            <button
                                onClick={onToggleCollapse}
                                className="p-1.5 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                                <ChevronDoubleLeftIcon className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* ---- navigation ---- */}
            <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto relative">
                <DndContext
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    {/* PARENTS SORTABLE CONTEXT */}
                    <SortableContext
                        items={navigation.map((i) => i.name)}
                        strategy={verticalListSortingStrategy}
                    >
                        {navigation.map((item) => {
                            const isActive =
                                pathname === item.href ||
                                (item.subItems &&
                                    item.subItems.some((s) => pathname === s.href));
                            const isSubOpen = openSubmenus[item.name];

                            return (
                                <div key={item.name}>
                                    <ParentItem
                                        item={item}
                                        isActive={!!isActive}
                                        isCollapsed={isCollapsed}
                                        isDesktop={isDesktop}
                                        isSubmenuOpen={isSubOpen}
                                        isDragActive={activeDragParent === item.name}
                                        onToggleSubmenu={toggleSubmenu}
                                        onDoubleActivate={handleParentActivate}
                                    />

                                    {/* CHILDREN SORTABLE CONTEXT PER PARENT */}
                                    {item.subItems &&
                                        isSubOpen &&
                                        (!isDesktop || !isCollapsed) && (
                                            <SortableContext
                                                items={item.subItems.map(
                                                    (s) =>
                                                        `${item.name}__${s.name}`
                                                )}
                                                strategy={
                                                    verticalListSortingStrategy
                                                }
                                            >
                                                <div className="ml-6 mt-1 space-y-1 border-l border-gray-200 dark:border-gray-700 pl-3">
                                                    {item.subItems.map((sub) => {
                                                        const fullId = `${item.name}__${sub.name}`;
                                                        return (
                                                            <ChildItem
                                                                key={sub.name}
                                                                sub={sub}
                                                                isActive={
                                                                    pathname ===
                                                                    sub.href
                                                                }
                                                                parentId={
                                                                    item.name
                                                                }
                                                                isDragActive={
                                                                    activeDragChild ===
                                                                    fullId
                                                                }
                                                                onDoubleActivate={
                                                                    handleChildActivate
                                                                }
                                                            />
                                                        );
                                                    })}
                                                </div>
                                            </SortableContext>
                                        )}
                                </div>
                            );
                        })}
                    </SortableContext>
                </DndContext>
            </nav>

            {/* ---- footer ---- */}
            {(!isDesktop || !isCollapsed) && (
                <div className="px-3 py-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
                    <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                        © 2025 Intellinum
                    </div>
                </div>
            )}
        </div>
    );

    /* ------------ mobile / desktop render ------------ */
    return (
        <>
            {/* mobile drawer */}
            <Transition.Root show={isOpen} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-50 lg:hidden"
                    onClose={onClose}
                >
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
                                <div className="absolute top-0 right-0 flex justify-center pt-5 pr-5">
                                    <button
                                        type="button"
                                        className="-m-2.5 p-2.5 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
                                        onClick={onClose}
                                    >
                                        <span className="sr-only">
                                            Close sidebar
                                        </span>
                                        <XMarkIcon
                                            className="h-6 w-6 text-white"
                                            aria-hidden="true"
                                        />
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

            {/* desktop sidebar */}
            <div
                className={`hidden lg:flex lg:flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 shadow-lg ${className}`}
            >
                <SidebarContent isDesktop />
            </div>
        </>
    );
}
