"use client";

import { useState, useRef, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import Image from "next/image";
import Link from "next/link";
import { useLogout } from "@/features/auth/hooks/useAuth";
import { Bell, Sun, Moon, LogOut, User, Settings, Plus } from "lucide-react";
import { setTheme } from "@/store/slices/uiSlice";
import { cn } from "@/lib/utils";
import Logo from "@/components/Reuseable/Logo";
import { Button } from "@/components/ui/Button";

export default function Navbar() {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((s) => s.ui.theme);
  const user = useAppSelector((s) => s.auth.user);
  const { mutate: logout, isPending } = useLogout();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-gray-100 bg-white px-8 dark:bg-gray-900 dark:border-gray-800 transition-colors duration-300">
      <div className="flex items-center gap-6">
        {/* Search bar */}
        <div className="relative hidden lg:block ml-4">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search projects, files or users..."
            className="w-[589px] h-[42px] rounded-xl border border-[#99A1AF] bg-gray-50/30 pl-11 pr-4 text-sm focus:border-secondary focus:outline-none transition-all placeholder:text-[#968C8C] dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder:text-gray-400 text-gray-900 focus:bg-white dark:focus:bg-gray-700"
          />
        </div>
      </div>

      <div className="flex items-center gap-6 justify-end pr-8">
        {/* Notification bell */}
        <button
          type="button"
          aria-label="Notifications"
          className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50/50 transition-all hover:bg-red-50 group dark:bg-gray-800 dark:hover:bg-red-950/30"
        >
          <Bell size={22} className="text-[#EF4444] transition-transform group-hover:scale-110" />
        </button>

        {/* User profile dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 p-1 rounded-xl transition-all hover:bg-gray-50 dark:hover:bg-gray-800 group"
          >
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-black dark:text-white transition-colors">Admin User</p>
              <p className="text-[11px] font-medium text-[#968C8C] dark:text-gray-400 transition-colors">
                Akash Abrrar
              </p>
            </div>
            <div className="relative h-10 w-10 overflow-hidden rounded-full ring-2 ring-gray-100 dark:ring-gray-700 transition-all group-hover:ring-secondary/50">
               <Image 
                 src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Akash`} 
                 alt="Avatar" 
                 width={40}
                 height={40}
                 unoptimized
                 className="h-full w-full object-cover bg-gray-200"
               />
            </div>
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-2xl bg-white p-2 shadow-xl ring-1 ring-black/5 focus:outline-none dark:bg-gray-900 dark:ring-white/10 animate-in fade-in zoom-in-95 duration-200">
              <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-800 mb-1">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Appearance</p>
                <div className="flex items-center gap-1 mt-2 p-1 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <button
                    onClick={() => dispatch(setTheme("light"))}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 py-1.5 rounded-lg text-xs font-bold transition-all",
                      theme === "light" ? "bg-white text-secondary shadow-sm dark:bg-gray-700 dark:text-white" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    )}
                  >
                    <Sun size={14} />
                    Light
                  </button>
                  <button
                    onClick={() => dispatch(setTheme("dark"))}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 py-1.5 rounded-lg text-xs font-bold transition-all",
                      theme === "dark" ? "bg-white text-secondary shadow-sm dark:bg-gray-700 dark:text-white" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    )}
                  >
                    <Moon size={14} />
                    Dark
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors">
                  <User size={18} className="text-gray-400" />
                  My Profile
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors">
                  <Settings size={18} className="text-gray-400" />
                  Account Settings
                </button>
                <hr className="border-gray-100 dark:border-gray-800 mx-2" />
                <button
                  onClick={() => logout()}
                  disabled={isPending}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                >
                  <LogOut size={18} />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
