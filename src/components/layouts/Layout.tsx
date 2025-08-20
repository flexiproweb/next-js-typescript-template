"use client";

import { useState } from "react";
import Sidebar from "../Sidebar";
import SafeHeader from "../SafeHeader";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const sidebarWidth = sidebarCollapsed ? 72 : 256;

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Sidebar - Only takes space on desktop */}
      <div 
        className={`hidden lg:block transition-all duration-300 z-40 flex-shrink-0`}
        style={{ width: `${sidebarWidth}px` }}
      >
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="h-full w-full"
        />
      </div>

      {/* Mobile sidebar - Rendered but only shows as overlay */}
      <div className="lg:hidden">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>

      {/* Main content area - Header + Content */}
      <div className="flex flex-col flex-1 min-w-0 h-full">
        {/* Header - Full width on mobile, partial width on desktop */}
        <SafeHeader
          onMenuClick={() => setSidebarOpen(true)}
          isCollapsed={sidebarCollapsed}
          className="h-[73px] flex-shrink-0"
        />

        {/* Main Content - Below header with controlled height */}
        <main className="flex-1 overflow-auto bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 h-[calc(100vh-73px)]">
          <div className="min-h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
