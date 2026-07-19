"use client";

import { useLogout } from "@/features/auth/hooks/useAuth";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { setTheme } from "@/store/slices/uiSlice";
import Logo from "@/components/Reuseable/Logo";
import { Plus, Settings, LogOut, LayoutDashboard, FolderKanban, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function SubUserNavbar() {
  const { logout, isLoading } = useLogout();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const theme = useAppSelector((s) => s.ui.theme);

  const navLinks = [
    { label: "Dashboard", href: "/sub-user", icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: "Tenders", href: "/sub-user/projects", icon: <FolderKanban className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-30 flex h-16 md:h-20 w-full items-center border-b border-emerald-200 dark:border-gray-800 bg-white dark:bg-[#0B0F1A]/80 dark:backdrop-blur-md shadow-lg shadow-[#009966]/30 dark:shadow-none transition-all duration-300">
      <div className="w-full flex items-center justify-between px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">

        {/* Left: Logo + Theme Toggle */}
        <div className="flex items-center gap-3 sm:gap-6">
          <Link href="/sub-user" prefetch={false} className="dark:bg-white dark:rounded-lg dark:px-2 dark:py-1 transition-all flex-shrink-0">
            <Logo />
          </Link>

          {/* Theme Toggle */}
          <div className="hidden sm:flex items-center gap-0.5 p-1 bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 rounded-xl transition-all">
            {/* Light */}
            <button
              onClick={() => dispatch(setTheme("light"))}
              title="Light mode"
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all",
                theme === "light"
                  ? "bg-white text-emerald-600 shadow-sm"
                  : "text-gray-400 hover:text-gray-600"
              )}
            >
              <Sun size={14} />
              <span className="hidden sm:inline">Light</span>
            </button>

            {/* Dark */}
            <button
              onClick={() => dispatch(setTheme("dark"))}
              title="Dark mode"
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all",
                theme === "dark"
                  ? "bg-gray-800 text-white shadow-sm"
                  : "text-gray-400 hover:text-gray-300"
              )}
            >
              <Moon size={14} />
              <span className="hidden sm:inline">Dark</span>
            </button>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-3">

          {/* Create New Project */}
          <Link href="/sub-user/projects/new">
            <Button
              variant="primary"
              className="h-9 md:h-10 px-3 md:px-4 rounded-xl font-medium shadow-sm shadow-emerald-100 text-sm"
            >
              <Plus className="w-4 h-4 flex-shrink-0" />
              <span className="hidden md:inline ml-1.5 whitespace-nowrap dark:text-white">Create New Tender</span>
              <span className="inline md:hidden ml-0 sr-only">New</span>
            </Button>
          </Link>

          {/* Settings */}
          <Link href="/sub-user/settings">
            <Button
              variant="secondary"
              className="h-9 md:h-10 px-3 md:px-4 rounded-xl font-medium border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 text-sm bg-white dark:bg-[#0B0F1A]"
            >
              <Settings className="w-4 h-4 flex-shrink-0" />
              <span className="hidden md:inline ml-2">Settings</span>
            </Button>
          </Link>

          {/* Logout */}
          <Button
            variant="secondary"
            onClick={() => logout()}
            isLoading={isLoading}
            className="h-9 md:h-10 px-3 md:px-4 rounded-xl font-medium border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 text-sm hover:bg-red-50 hover:text-red-600 hover:border-red-100 bg-white dark:bg-[#0B0F1A]"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            <span className="hidden md:inline ml-2">Logout</span>
          </Button>
        </div>

      </div>
    </header>
  );
}
