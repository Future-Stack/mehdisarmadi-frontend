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
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
  },
  {
    label: "Portfolio",
    href: "/portfolio",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-5.25v9" />
      </svg>
    ),
  },
  {
    label: "Market",
    href: "/market",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
      </svg>
    ),
  },
  {
    label: "Analytics",
    href: "/analytics",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
      </svg>
    ),
  },
  {
    label: "Wallet",
    href: "/wallet",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
      </svg>
    ),
  },
  {
    label: "Users",
    href: ROUTES.USERS,
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-2.533-4.656 6.853 6.853 0 01-10.937 0 4.125 4.125 0 00-2.533 4.656 9.367 9.367 0 004.121.952 9.38 9.38 0 002.625-.372M7.5 7.5a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0z" />
      </svg>
    ),
  },
  {
    label: "Settings",
    href: ROUTES.SETTINGS,
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
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
        "relative z-40 flex flex-col bg-[#0b1426] text-white transition-all duration-300 ease-in-out border-r border-white/5",
        isOpen ? "w-64" : "w-20"
      )}
    >
      {/* Logo Area */}
      <div className="flex h-24 shrink-0 items-center justify-center relative">
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center">
            {/* Custom Green Star Logo */}
            <svg viewBox="0 0 40 40" className="h-full w-full">
              <path
                d="M20 0L24.5 11L36 11L27 18.5L31.5 29.5L20 22L8.5 29.5L13 18.5L4 11L15.5 11L20 0Z"
                className="fill-[#4ade80]"
              />
              <path
                d="M20 5L23 13H31L25 18L28 26L20 21L12 26L15 18L9 13H17L20 5Z"
                className="fill-[#22c55e]"
              />
            </svg>
          </div>
          {isOpen && (
            <span className="text-xl font-bold tracking-tight animate-in fade-in duration-500">
              Mahedi
            </span>
          )}
        </div>

        {/* Toggle Handle (Protruding arrow) */}
        <button
          onClick={() => dispatch(toggleSidebar())}
          className={cn(
            "absolute -right-4 top-1/2 -translate-y-1/2 z-50 flex h-8 w-8 items-center justify-center rounded-lg bg-[#0b1426] border border-white/10 shadow-xl transition-transform hover:scale-110 active:scale-95",
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
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4">
        <ul className="flex flex-col items-center gap-2 px-3">
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
                    "group relative flex items-center gap-4 rounded-xl px-3 py-3 transition-all duration-200",
                    isOpen ? "justify-start" : "justify-center",
                    isActive
                      ? "bg-[#1e293b] text-[#4ade80]"
                      : "text-gray-400 hover:bg-[#1e293b]/50 hover:text-white"
                  )}
                >
                  <div className={cn(
                    "shrink-0 transition-transform duration-200 group-hover:scale-110",
                    isActive && "text-[#4ade80]"
                  )}>
                    {item.icon}
                  </div>
                  
                  {isOpen && (
                    <span className="whitespace-nowrap text-sm font-medium animate-in slide-in-from-left-2 fade-in duration-300">
                      {item.label}
                    </span>
                  )}

                  {/* Active Indicator Dot */}
                  {isActive && !isOpen && (
                    <div className="absolute left-0 top-1/2 h-1 w-1 -translate-y-1/2 rounded-full bg-[#4ade80]" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer Section */}
      <div className="mt-auto border-t border-white/5 p-4">
        {isOpen ? (
          <div className="flex flex-col gap-1 px-2">
            <div className="h-1.5 w-full rounded-full bg-gray-800">
              <div className="h-full w-2/3 rounded-full bg-[#4ade80]" />
            </div>
            <p className="text-[10px] text-gray-500">Storage Used: 65%</p>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="h-2 w-2 rounded-full bg-[#4ade80] animate-pulse" />
          </div>
        )}
      </div>
    </aside>
  );
}
