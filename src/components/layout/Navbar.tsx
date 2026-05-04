"use client";

import { useState, useRef, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import Image from "next/image";
import { useLogout } from "@/features/auth/hooks/useAuth";
import { Bell, Sun, Moon, LogOut, User, Settings } from "lucide-react";
import { setTheme } from "@/store/slices/uiSlice";
import { cn } from "@/lib/utils";

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
    <header className="sticky top-0 z-30 flex h-20 w-full items-center border-b border-emerald-100 bg-white shadow-sm shadow-emerald-200">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between px-6 lg:px-8">
        <Link href={"/dashboard"}>
          <Logo />
        </Link>

        <div className="flex items-center gap-3 lg:gap-4">
          <Link href="/dashboard/projects/new">
            <Button
              variant="primary"
              className="h-10 lg:h-11 px-4 lg:px-5 rounded-xl font-bold shadow-sm shadow-emerald-100"
            >
              <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Create New Project</span>
              <span className="sm:hidden">Create</span>
            </Button>
          </Link>
          <Button
            variant="secondary"
            className="h-10 lg:h-11 px-4 lg:px-5 rounded-xl font-bold border-gray-100"
          >
            <Settings className="w-4 h-4" /> <span className="hidden md:inline">Settings</span>
          </Button>
          <Button
            variant="secondary"
            onClick={() => logout()}
            isLoading={isPending}
            className="h-10 lg:h-11 px-4 lg:px-5 rounded-xl font-bold border-gray-100 hover:bg-red-50 hover:text-red-600 hover:border-red-100"
          >
            <LogOut className="w-4 h-4" /> <span className="hidden md:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
