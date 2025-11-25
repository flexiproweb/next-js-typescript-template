import { Fragment, useState, useMemo, useCallback } from "react";
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

/* ==================== TYPES ==================== */
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

interface SortableItemProps {
  id: string;
  isActive: boolean;
  isDragActive: boolean;
  className?: string;
  onDoubleClick: () => void;
  children: React.ReactNode;
}

interface TooltipProps {
  text: string;
  show: boolean;
}

/* ==================== HOOKS ==================== */
const useNavigation = (initialNav: NavItem[]) => {
  const [navigation, setNavigation] = useState<NavItem[]>(initialNav);
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({});

  const toggleSubmenu = useCallback((name: string) => {
    setOpenSubmenus((prev) => ({ ...prev, [name]: !prev[name] }));
  }, []);

  const reorderParents = useCallback((activeId: string, overId: string) => {
    setNavigation((prev) => {
      const oldIndex = prev.findIndex((i) => i.name === activeId);
      const newIndex = prev.findIndex((i) => i.name === overId);
      if (oldIndex === -1 || newIndex === -1) return prev;

      const newNav = [...prev];
      const [moved] = newNav.splice(oldIndex, 1);
      newNav.splice(newIndex, 0, moved);
      return newNav;
    });
  }, []);

  const reorderChildren = useCallback((activeId: string, overId: string) => {
    const [activeParentId, activeSubName] = activeId.split("__");
    const [overParentId, overSubName] = overId.split("__");

    if (activeParentId !== overParentId) return;

    setNavigation((prev) => {
      const parentIndex = prev.findIndex((p) => p.name === activeParentId);
      if (parentIndex === -1) return prev;

      const parent = { ...prev[parentIndex] };
      if (!parent.subItems) return prev;

      const subs = [...parent.subItems];
      const oldIdx = subs.findIndex((s) => s.name === activeSubName);
      const newIdx = subs.findIndex((s) => s.name === overSubName);

      if (oldIdx === -1 || newIdx === -1 || oldIdx === newIdx) return prev;

      const [moved] = subs.splice(oldIdx, 1);
      subs.splice(newIdx, 0, moved);

      parent.subItems = subs;
      const newNav = [...prev];
      newNav[parentIndex] = parent;
      return newNav;
    });
  }, []);

  return {
    navigation,
    openSubmenus,
    toggleSubmenu,
    reorderParents,
    reorderChildren,
  };
};

const useActiveDrag = () => {
  const [activeParent, setActiveParent] = useState<string | null>(null);
  const [activeChild, setActiveChild] = useState<string | null>(null);

  const toggleParent = useCallback((name: string) => {
    setActiveParent((prev) => (prev === name ? null : name));
  }, []);

  const toggleChild = useCallback((id: string) => {
    setActiveChild((prev) => (prev === id ? null : id));
  }, []);

  return { activeParent, activeChild, toggleParent, toggleChild };
};

/* ==================== UTILITY COMPONENTS ==================== */
const Tooltip: React.FC<TooltipProps> = ({ text, show }) => {
  if (!show) return null;

  return (
    <div className="absolute left-full ml-3 top-1/2 transform -translate-y-1/2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg shadow-lg whitespace-nowrap z-50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
      {text}
      <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1 border-4 border-transparent border-r-gray-900 dark:border-r-gray-700" />
    </div>
  );
};

const SortableItem: React.FC<SortableItemProps> = ({
  id,
  isActive,
  isDragActive,
  className = "",
  onDoubleClick,
  children,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const dragStyle = isDragging || isDragActive ? "shadow-xl ring-2 ring-primary-400/70" : "";

  return (
    <div ref={setNodeRef} style={style} className="select-none">
      <div
        onDoubleClick={(e) => {
          e.stopPropagation();
          onDoubleClick();
        }}
        className={`${className} ${dragStyle}`}
        {...attributes}
        {...listeners}
      >
        {children}
      </div>
    </div>
  );
};

/* ==================== NAV COMPONENTS ==================== */
interface NavIconProps {
  icon: any;
  isActive: boolean;
  isCollapsed?: boolean;
  isDesktop?: boolean;
}

const NavIcon: React.FC<NavIconProps> = ({ icon: Icon, isActive, isCollapsed, isDesktop }) => (
  <Icon
    className={`h-5 w-5 flex-shrink-0 ${isDesktop && isCollapsed ? "" : "mr-3"} ${
      isActive
        ? "text-white"
        : "text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300"
    }`}
  />
);

interface ParentItemProps {
  item: NavItem;
  isActive: boolean;
  isCollapsed?: boolean;
  isDesktop?: boolean;
  isSubmenuOpen?: boolean;
  isDragActive: boolean;
  onToggleSubmenu: (name: string) => void;
  onDoubleActivate: (name: string) => void;
}

const ParentItem: React.FC<ParentItemProps> = ({
  item,
  isActive,
  isCollapsed,
  isDesktop,
  isSubmenuOpen,
  isDragActive,
  onToggleSubmenu,
  onDoubleActivate,
}) => {
  const baseClasses = `group relative flex items-center transition-all duration-200 ${
    isDesktop && isCollapsed
      ? "px-3 py-3 mx-1 justify-center rounded-lg"
      : "px-3 py-3 rounded-lg"
  }`;

  const activeClasses = isActive
    ? "bg-gradient-to-r from-primary-600 to-secondary-500 text-white shadow-lg"
    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800";

  return (
    <SortableItem
      id={item.name}
      isActive={isActive}
      isDragActive={isDragActive}
      className={`${baseClasses} ${activeClasses}`}
      onDoubleClick={() => onDoubleActivate(item.name)}
    >
      {item.hasSubmenu && (!isDesktop || !isCollapsed) ? (
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center">
            <NavIcon icon={item.icon} isActive={isActive} isCollapsed={isCollapsed} isDesktop={isDesktop} />
            {(!isDesktop || !isCollapsed) && (
              <span className="truncate whitespace-nowrap overflow-hidden text-sm font-medium">
                {item.name}
              </span>
            )}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleSubmenu(item.name);
            }}
            onPointerDown={(e) => e.stopPropagation()}
            className="cursor-pointer p-1 select-none"
          >
            <ChevronDoubleRightIcon
              className={`w-5 h-5 transform transition-transform ${
                isSubmenuOpen ? "rotate-90" : "rotate-0"
              } ${isActive ? "text-white" : "text-gray-500"}`}
            />
          </button>
        </div>
      ) : (
        <div className="w-full flex items-center">
          <NavIcon icon={item.icon} isActive={isActive} isCollapsed={isCollapsed} isDesktop={isDesktop} />
          {(!isDesktop || !isCollapsed) && (
            <span className="truncate whitespace-nowrap overflow-hidden text-sm font-medium">
              {item.name}
            </span>
          )}
        </div>
      )}
      <Tooltip text={item.name} show={!!(isDesktop && isCollapsed)} />
    </SortableItem>
  );
};

interface ChildItemProps {
  sub: SubItem;
  isActive: boolean;
  parentId: string;
  isDragActive: boolean;
  onDoubleActivate: (id: string) => void;
}

const ChildItem: React.FC<ChildItemProps> = ({
  sub,
  isActive,
  parentId,
  isDragActive,
  onDoubleActivate,
}) => {
  const fullId = `${parentId}__${sub.name}`;

  const activeClasses = isActive
    ? "bg-primary-100 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300"
    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-300";

  return (
    <SortableItem
      id={fullId}
      isActive={isActive}
      isDragActive={isDragActive}
      className={`block px-3 py-2 text-sm rounded-lg transition-all duration-200 ${activeClasses}`}
      onDoubleClick={() => onDoubleActivate(fullId)}
    >
      {sub.name}
    </SortableItem>
  );
};

/* ==================== HEADER COMPONENTS ==================== */
interface LogoProps {
  isCollapsed: boolean;
  isDesktop: boolean;
  onToggleCollapse: () => void;
}

const Logo: React.FC<LogoProps> = ({ isCollapsed, isDesktop, onToggleCollapse }) => {
  if (isDesktop && isCollapsed) {
    return (
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
        <Tooltip text="Intellinum Dashboard" show />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center">
        <img
          src="https://www.intellinum.com/wp-content/uploads/2024/07/Intellinum.png"
          alt="Intellinum Logo"
          className="h-9 w-auto"
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
  );
};

/* ==================== NAVIGATION ==================== */
interface NavigationListProps {
  navigation: NavItem[];
  pathname: string;
  openSubmenus: Record<string, boolean>;
  isCollapsed: boolean;
  isDesktop: boolean;
  activeDragParent: string | null;
  activeDragChild: string | null;
  onToggleSubmenu: (name: string) => void;
  onParentActivate: (name: string) => void;
  onChildActivate: (id: string) => void;
}

const NavigationList: React.FC<NavigationListProps> = ({
  navigation,
  pathname,
  openSubmenus,
  isCollapsed,
  isDesktop,
  activeDragParent,
  activeDragChild,
  onToggleSubmenu,
  onParentActivate,
  onChildActivate,
}) => (
  <SortableContext
    items={navigation.map((i) => i.name)}
    strategy={verticalListSortingStrategy}
  >
    {navigation.map((item) => {
      const isActive =
        pathname === item.href ||
        (item.subItems?.some((s) => pathname === s.href) ?? false);
      const isSubOpen = openSubmenus[item.name];

      return (
        <div key={item.name}>
          <ParentItem
            item={item}
            isActive={isActive}
            isCollapsed={isCollapsed}
            isDesktop={isDesktop}
            isSubmenuOpen={isSubOpen}
            isDragActive={activeDragParent === item.name}
            onToggleSubmenu={onToggleSubmenu}
            onDoubleActivate={onParentActivate}
          />

          {item.subItems && isSubOpen && (!isDesktop || !isCollapsed) && (
            <SortableContext
              items={item.subItems.map((s) => `${item.name}__${s.name}`)}
              strategy={verticalListSortingStrategy}
            >
              <div className="ml-6 mt-1 space-y-1 border-l border-gray-200 dark:border-gray-700 pl-3">
                {item.subItems.map((sub) => {
                  const fullId = `${item.name}__${sub.name}`;
                  return (
                    <ChildItem
                      key={sub.name}
                      sub={sub}
                      isActive={pathname === sub.href}
                      parentId={item.name}
                      isDragActive={activeDragChild === fullId}
                      onDoubleActivate={onChildActivate}
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
);

/* ==================== SIDEBAR CONTENT ==================== */
interface SidebarContentProps {
  navigation: NavItem[];
  pathname: string;
  openSubmenus: Record<string, boolean>;
  isCollapsed: boolean;
  isDesktop: boolean;
  activeDragParent: string | null;
  activeDragChild: string | null;
  onToggleCollapse: () => void;
  onToggleSubmenu: (name: string) => void;
  onParentActivate: (name: string) => void;
  onChildActivate: (id: string) => void;
  onDragEnd: (e: DragEndEvent) => void;
}

const SidebarContent: React.FC<SidebarContentProps> = ({
  navigation,
  pathname,
  openSubmenus,
  isCollapsed,
  isDesktop,
  activeDragParent,
  activeDragChild,
  onToggleCollapse,
  onToggleSubmenu,
  onParentActivate,
  onChildActivate,
  onDragEnd,
}) => (
  <div className="flex flex-col h-full bg-white dark:bg-gray-900">
    <div className="flex items-center justify-center px-4 border-b border-gray-200 dark:border-gray-700 h-[73px] flex-shrink-0">
      <Logo
        isCollapsed={isCollapsed}
        isDesktop={isDesktop}
        onToggleCollapse={onToggleCollapse}
      />
    </div>

    <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
      <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <NavigationList
          navigation={navigation}
          pathname={pathname}
          openSubmenus={openSubmenus}
          isCollapsed={isCollapsed}
          isDesktop={isDesktop}
          activeDragParent={activeDragParent}
          activeDragChild={activeDragChild}
          onToggleSubmenu={onToggleSubmenu}
          onParentActivate={onParentActivate}
          onChildActivate={onChildActivate}
        />
      </DndContext>
    </nav>

    {(!isDesktop || !isCollapsed) && (
      <div className="px-3 py-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
          © 2025 Intellinum
        </div>
      </div>
    )}
  </div>
);

/* ==================== MOBILE DIALOG ==================== */
interface MobileDialogProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const MobileDialog: React.FC<MobileDialogProps> = ({ isOpen, onClose, children }) => (
  <div className={`fixed inset-0 z-50 lg:hidden ${isOpen ? 'block' : 'hidden'}`}>
    <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm" onClick={onClose} />
    <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-white dark:bg-gray-900 shadow-2xl transform transition-transform duration-300">
      <button
        onClick={onClose}
        className="absolute top-5 right-5 p-2.5 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
      >
        <XMarkIcon className="h-6 w-6 text-white" />
      </button>
      {children}
    </div>
  </div>
);

/* ==================== MAIN SIDEBAR ==================== */
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
  const pathname = "/";

  const initialNav: NavItem[] = useMemo(
    () => [
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
    ],
    []
  );

  const {
    navigation,
    openSubmenus,
    toggleSubmenu,
    reorderParents,
    reorderChildren,
  } = useNavigation(initialNav);

  const { activeParent, activeChild, toggleParent, toggleChild } = useActiveDrag();

  const handleDragEnd = useCallback(
    (e: DragEndEvent) => {
      const { active, over } = e;
      if (!over || active.id === over.id) return;

      const activeId = String(active.id);
      const overId = String(over.id);
      const isChild = activeId.includes("__");

      if (isChild) {
        reorderChildren(activeId, overId);
      } else {
        reorderParents(activeId, overId);
      }
    },
    [reorderParents, reorderChildren]
  );

  const sidebarContentProps = {
    navigation,
    pathname,
    openSubmenus,
    isCollapsed,
    activeDragParent: activeParent,
    activeDragChild: activeChild,
    onToggleCollapse,
    onToggleSubmenu: toggleSubmenu,
    onParentActivate: toggleParent,
    onChildActivate: toggleChild,
    onDragEnd: handleDragEnd,
  };

  return (
    <>
      <MobileDialog isOpen={isOpen} onClose={onClose}>
        <SidebarContent {...sidebarContentProps} isDesktop={false} />
      </MobileDialog>

      <div
        className={`hidden lg:flex lg:flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 shadow-lg ${className}`}
      >
        <SidebarContent {...sidebarContentProps} isDesktop />
      </div>
    </>
  );
}