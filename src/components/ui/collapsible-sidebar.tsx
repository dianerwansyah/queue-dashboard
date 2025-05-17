"use client";

import { useState } from "react";
import { Menu, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { menuItems } from "@/config/menu-items";

interface CollapsibleSidebarProps {
  isExpanded: boolean;
  onToggle: () => void;
}
export default function CollapsibleSidebar({
  isExpanded,
  onToggle,
}: CollapsibleSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`bg-white shadow-lg transition-all duration-300 ease-in-out h-screen ${
        isExpanded ? "w-54" : "w-20"
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Logo/Brand and Toggle */}
        <div
          className={`p-4 border-b flex items-center ${
            isExpanded ? "justify-between" : "justify-center"
          }`}
        >
          {isExpanded && (
            <div className="flex items-center">
              <Menu className="h-6 w-6 text-gray-500 mr-2" />
              <span className="font-bold text-xl">Menu</span>
            </div>
          )}
          <button
            onClick={onToggle}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
          >
            {isExpanded ? (
              <ChevronLeft className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronRight className="h-5 w-5 text-gray-500" />
            )}
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link
                  href={item.link}
                  className={`flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors ${
                    pathname === item.path ? "bg-gray-100" : ""
                  }`}
                  title={!isExpanded ? item.title : undefined}
                >
                  <span className="text-gray-500 mr-3">{item.icon}</span>
                  {isExpanded && (
                    <span className="font-medium">{item.title}</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Version or Additional Info */}
        {isExpanded && (
          <div className="p-4 border-t">
            <p className="text-xs text-gray-500">
              Queue Management System v1.0
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
