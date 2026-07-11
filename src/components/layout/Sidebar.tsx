"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleSidebar } from "@/store/slices/uiSlice";
import { ROUTES } from "@/constants";

import {
  LayoutDashboard,
  FolderKanban,
  Network,
  Search,
  Database,
  ClipboardList,
  Users,
  Bell,
  Cog,
  Settings,
  ChartBarStacked,
  X,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: ROUTES.DASHBOARD,
    icon: <LayoutDashboard size={18} />,
  },
  {
    label: "Projects",
    href: "/admin/projects",
    icon: <FolderKanban size={18} />,
  },
  // {
  //   label: "Addenda",
  //   href: "/admin/addenda",
  //   icon: <Network size={18} />,
  // },
  {
    label: "Division",
    href: "/admin/division",
    icon: <ChartBarStacked size={18} />,
  },
  {
    label: "Source Tracking",
    href: "/admin/source-tracking",
    icon: <Search size={18} />,
  },
  {
    label: "AI Logs",
    href: "/admin/ai-logs",
    icon: <Database size={18} />,
  },
  // {
  //   label: "Quote Templates",
  //   href: "/admin/quote-templates",
  //   icon: <ClipboardList size={18} />,
  // },
  {
    label: "Users",
    href: ROUTES.USERS,
    icon: <Users size={18} />,
  },
  {
    label: "Notifications",
    href: "/admin/notifications",
    icon: <Bell size={18} />,
  },
  {
    label: "Global Settings",
    href: "/admin/global-settings",
    icon: <Cog size={18} />,
  },
  {
    label: "System Settings",
    href: "/admin/system-settings",
    icon: <Settings size={18} />,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((s) => s.ui.sidebarOpen);

  const sidebarContent = (
    <aside
      className={cn(
        "relative z-40 flex flex-col bg-white text-gray-900 transition-all duration-300 ease-in-out border-r border-gray-100 shadow-sm dark:bg-gray-950 dark:text-white dark:border-gray-800 h-full",
        isOpen ? "w-64" : "w-20"
      )}
    >
      {/* Logo Area */}
      <div className="flex h-24 shrink-0 items-center justify-center relative py-6">
        <Link href="/" className="flex flex-col items-center gap-1">
          <div className={cn(
            "relative transition-all duration-500 flex items-center justify-center",
            isOpen ? "w-[157px] h-[38px]" : "h-10 w-10 overflow-hidden"
          )}>
            <Image
              src="/Images/Renofield.png"
              alt="Renofield Logo"
              width={157}
              height={38}
              priority
              className="w-full h-auto object-contain"
            />
          </div>
          {isOpen && (
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-900 dark:text-white mt-1 transition-colors">
              Renofield
            </span>
          )}
        </Link>

        {/* Toggle Handle — hidden on mobile (close via overlay click instead) */}
        <button
          onClick={() => dispatch(toggleSidebar())}
          className={cn(
            "hidden md:flex absolute -right-9 top-1/2 -translate-y-1/2 z-50 h-9 w-9 items-center justify-center rounded-r-xl bg-white border border-l-0 border-gray-100 transition-all hover:bg-gray-50 active:scale-95 dark:bg-gray-950 dark:border-gray-800 dark:hover:bg-gray-900"
          )}
          aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          <svg
            className={cn(
              "h-4 w-4 text-black dark:text-white transition-transform duration-300",
              !isOpen && "rotate-180"
            )}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* Nav Section */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 scrollbar-hide">
        <ul className="flex flex-col items-center gap-1 px-3">
          {navItems.map((item) => {
            const isActive =
              item.href === ROUTES.DASHBOARD
                ? pathname === item.href
                : pathname.startsWith(item.href);

            return (
              <li key={item.href} className="w-full">
                <Link
                  href={item.href}
                  title={!isOpen ? item.label : undefined}
                  onClick={() => {
                    // Close mobile drawer on nav
                    if (typeof window !== "undefined" && window.innerWidth < 768 && isOpen) {
                      dispatch(toggleSidebar());
                    }
                  }}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-lg px-3 py-3 transition-all duration-200",
                    isOpen ? "justify-start" : "justify-center",
                    isActive
                      ? "bg-secondary text-white shadow-lg shadow-secondary/20"
                      : "text-gray-500 hover:bg-gray-50 hover:text-secondary dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-white"
                  )}
                >
                  <div className={cn(
                    "shrink-0 transition-transform duration-200 group-hover:scale-110",
                    isActive ? "text-white" : "group-hover:text-secondary dark:text-gray-400 dark:group-hover:text-white"
                  )}>
                    {item.icon}
                  </div>

                  {isOpen && (
                    <span className="whitespace-nowrap text-[13px] font-medium animate-in slide-in-from-left-2 fade-in duration-300 dark:text-gray-300 dark:group-hover:text-white transition-colors">
                      {item.label}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

    </aside>
  );

  return (
    <>
      {/* Desktop sidebar — always in flow */}
      <div className="hidden md:flex h-screen sticky top-0 flex-shrink-0">
        {sidebarContent}
      </div>

      {/* Mobile sidebar — overlay drawer */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => dispatch(toggleSidebar())}
          />
          {/* Drawer */}
          <div className="relative z-10 w-64 h-full shadow-2xl">
            {/* Close button inside drawer on mobile */}
            <button
              onClick={() => dispatch(toggleSidebar())}
              className="absolute top-4 right-4 z-20 flex h-8 w-8 items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Close sidebar"
            >
              <X size={18} className="text-gray-500 dark:text-gray-400" />
            </button>
            <aside className="flex flex-col bg-white text-gray-900 dark:bg-gray-950 dark:text-white h-full w-full border-r border-gray-100 dark:border-gray-800">
              {/* Logo */}
              <div className="flex h-20 shrink-0 items-center justify-center py-4">
                <Link href="/" className="flex flex-col items-center gap-1">
                  <div className="relative w-[140px] h-[34px]">
                    <Image
                      src="/Images/Renofield.png"
                      alt="Renofield Logo"
                      width={140}
                      height={34}
                      priority
                      className="w-full h-auto object-contain"
                    />
                  </div>
                </Link>
              </div>
              {/* Nav */}
              <nav className="flex-1 overflow-y-auto py-4 scrollbar-hide">
                <ul className="flex flex-col gap-1 px-3">
                  {navItems.map((item) => {
                    const isActive =
                      item.href === ROUTES.DASHBOARD
                        ? pathname === item.href
                        : pathname.startsWith(item.href);
                    return (
                      <li key={item.href} className="w-full">
                        <Link
                          href={item.href}
                          onClick={() => dispatch(toggleSidebar())}
                          className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-3 transition-all duration-200",
                            isActive
                              ? "bg-secondary text-white shadow-lg shadow-secondary/20"
                              : "text-gray-500 hover:bg-gray-50 hover:text-secondary dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-white"
                          )}
                        >
                          <div className={cn("shrink-0", isActive ? "text-white" : "")}>
                            {item.icon}
                          </div>
                          <span className="text-[14px] font-medium">{item.label}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </aside>
          </div>
        </div>
      )}
    </>
  );
}
