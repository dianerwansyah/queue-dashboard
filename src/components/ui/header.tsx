"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ChevronDown, User, LogOut, Settings } from "lucide-react";
import { menuItems } from "@/config/menu-items";

interface HeaderProps {
  username: string;
  role: "admin" | "worker";
}

export default function Header({ username, role }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const currentMenu = menuItems.find((item) => pathname.startsWith(item.path));
  const currentTitle = currentMenu?.title || "Dashboard";

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    router.push("/login");
  };

  //   const menuItems = [
  //     {
  //       icon: <User className="h-4 w-4 mr-3 text-gray-500" />,
  //       label: "Profile Settings",
  //       href: "/profile"
  //     },
  //     {
  //       icon: <Settings className="h-4 w-4 mr-3 text-gray-500" />,
  //       label: "Settings",
  //       href: "/settings"
  //     }
  //   ]

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="h-16 px-8 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-bold text-gray-800">
            Queue Management System
          </h2>
          <div className="h-6 w-px bg-gray-200" />
          <span className="text-sm text-gray-500">{currentTitle}</span>
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-3 hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200"
          >
            <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center">
              <span className="text-sm text-white font-medium">
                {username[0].toUpperCase()}
              </span>
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-gray-700">{username}</p>
              <p className="text-xs text-gray-500 capitalize">{role}</p>
            </div>
            <ChevronDown
              className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <>
              {/* Overlay to close dropdown when clicking outside */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsDropdownOpen(false)}
              />

              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-1 z-20 border">
                <div className="px-4 py-3 border-b">
                  <p className="text-sm font-medium text-gray-900">
                    {username}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">{role}</p>
                </div>

                {/* <div className="py-1">
                  {menuItems.map((item, index) => (
                    <a
                      key={index}
                      href={item.href}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                    >
                      {item.icon}
                      {item.label}
                    </a>
                  ))}
                </div> */}

                <div className="border-t">
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
                  >
                    <LogOut className="h-4 w-4 mr-3" />
                    Sign out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
