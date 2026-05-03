"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleSidebar } from "@/store/slices/uiSlice";
import { ROUTES } from "@/constants";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: ROUTES.DASHBOARD,
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
  },
  {
    label: "Projects",
    href: "/dashboard/projects",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6.75h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
      </svg>
    ),
  },
  {
    label: "Addenda",
    href: "/dashboard/addenda",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
  },
  {
    label: "Source Tracking",
    href: "/dashboard/source-tracking",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
    ),
  },
  {
    label: "AI Logs",
    href: "/dashboard/ai-logs",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
  },
  {
    label: "Quote Templates",
    href: "/dashboard/quote-templates",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12l-3-3m0 0l-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
  },
  {
    label: "Users",
    href: ROUTES.USERS,
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-2.533-4.656 6.853 6.853 0 01-10.937 0 4.125 4.125 0 00-2.533 4.656 9.367 9.367 0 004.121.952 9.38 9.38 0 002.625-.372M7.5 7.5a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0z" />
      </svg>
    ),
  },
  {
    label: "Notifications",
    href: "/dashboard/notifications",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
      </svg>
    ),
  },
  {
    label: "Global Settings",
    href: "/dashboard/global-settings",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9s2.015-9 4.5-9m0 18c4.97 0 9-4.03 9-9s-4.03-9-9-9m0 18c-4.97 0-9-4.03-9-9s4.03-9 9-9" />
      </svg>
    ),
  },
  {
    label: "System Settings",
    href: "/dashboard/system-settings",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077l1.41-.513m14.095-5.13l1.41-.513M5.106 17.785l1.15-.964m11.49-9.642l1.149-.964M7.501 19.795l.75-1.3m7.5-12.99l.75-1.3m-10.64 15.057l-.513-1.41m9.37-14.095l-.513-1.41M12 21v-1.5m0-15V3m0 18v-1.5m0-15V3m4.543 17.785l-1.15-.964m-11.49-9.642l-1.149-.964m14.095 5.13l1.41-.513M4.5 12H3m16.5 0H21m-1.5 0H12" />
      </svg>
    ),
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((s) => s.ui.sidebarOpen);

  return (
    <aside
      className={cn(
        "relative z-40 flex flex-col bg-white text-gray-900 transition-all duration-300 ease-in-out border-r border-gray-100 shadow-sm",
        isOpen ? "w-64" : "w-20"
      )}
    >
      {/* Logo Area */}
      <div className="flex h-24 shrink-0 items-center justify-center relative py-6">
        <Link href="/" className="flex flex-col items-center gap-1">
          <div className={cn(
            "relative transition-all duration-500",
            isOpen ? "h-10 w-32" : "h-10 w-10 overflow-hidden"
          )}>
            <img 
              src="/Images/Renofield.png" 
              alt="Renofield Logo" 
              className="h-full w-full object-contain"
            />
          </div>
          {isOpen && (
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-900 mt-1">
              Renofield
            </span>
          )}
        </Link>

        {/* Toggle Handle */}
        <button
          onClick={() => dispatch(toggleSidebar())}
          className={cn(
            "absolute -right-4 top-1/2 -translate-y-1/2 z-50 flex h-8 w-8 items-center justify-center rounded-lg bg-white border border-gray-100 shadow-md transition-all hover:scale-110 active:scale-95",
            !isOpen && "rotate-180"
          )}
          aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
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
                  className={cn(
                    "group relative flex items-center gap-3 rounded-lg px-3 py-3 transition-all duration-200",
                    isOpen ? "justify-start" : "justify-center",
                    isActive
                      ? "bg-secondary text-white shadow-lg shadow-secondary/20"
                      : "text-gray-500 hover:bg-gray-50 hover:text-secondary"
                  )}
                >
                  <div className={cn(
                    "shrink-0 transition-transform duration-200 group-hover:scale-110",
                    isActive ? "text-white" : "group-hover:text-secondary"
                  )}>
                    {item.icon}
                  </div>
                  
                  {isOpen && (
                    <span className="whitespace-nowrap text-[13px] font-medium animate-in slide-in-from-left-2 fade-in duration-300">
                      {item.label}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer Section */}
      <div className="mt-auto border-t border-gray-50 p-4 bg-gray-50/50">
        {isOpen ? (
          <div className="flex flex-col gap-1.5 px-2">
            <div className="flex items-center justify-between text-[10px] text-gray-400 uppercase tracking-widest font-bold">
              <span>System Health</span>
              <span>100%</span>
            </div>
            <div className="h-1 w-full rounded-full bg-gray-200">
              <div className="h-full w-full rounded-full bg-secondary/60" />
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
          </div>
        )}
      </div>
    </aside>
  );
}
