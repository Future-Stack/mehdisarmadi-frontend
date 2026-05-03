"use client";

import { useAppSelector } from "@/store/hooks";
import { useLogout } from "@/features/auth/hooks/useAuth";
import { Badge } from "@/components/ui";

export default function Navbar() {
  const user = useAppSelector((s) => s.auth.user);
  const { mutate: logout, isPending } = useLogout();

  return (
    <header className="sticky top-0 z-10 flex h-20 shrink-0 items-center justify-between border-b border-white/5 bg-white/60 px-6 backdrop-blur-md dark:bg-[#0f172a]/60">
      {/* Page Title or Breadcrumb Placeholder */}
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Overview
        </h2>
        <Badge variant="success" className="bg-green-500/10 text-green-500 border-none">
          Live
        </Badge>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-6">
        {/* Search Placeholder */}
        <div className="hidden md:flex relative group">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-[#4ade80]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            type="text" 
            placeholder="Search activities..." 
            className="h-10 w-64 rounded-full border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm transition-all focus:border-[#4ade80] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#4ade80]/10 dark:border-white/5 dark:bg-white/5 dark:focus:bg-white/10"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Notifications"
            className="relative rounded-xl p-2.5 text-gray-500 transition-all hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-white/5 dark:hover:text-white"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </svg>
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-[#4ade80] border-2 border-white dark:border-[#0f172a]" />
          </button>
        </div>

        {/* User profile */}
        <div className="flex items-center gap-3 pl-6 border-l border-gray-200 dark:border-white/10">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-gray-900 dark:text-white leading-none">
              {user?.name ?? "User"}
            </p>
            <p className="mt-1 text-[11px] font-medium text-gray-500 uppercase tracking-wider">
              {user?.role ?? "Member"}
            </p>
          </div>
          <div className="relative h-10 w-10 overflow-hidden rounded-xl bg-gray-100 dark:bg-white/10 p-1 ring-1 ring-gray-200 dark:ring-white/5">
             <img 
               src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`} 
               alt="Avatar" 
               className="h-full w-full rounded-lg object-cover"
             />
          </div>
          <button
            type="button"
            id="logout-btn"
            aria-label="Sign out"
            disabled={isPending}
            onClick={() => logout()}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-400 transition-all hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
