"use client";

import { useAppSelector } from "@/store/hooks";
import { useLogout } from "@/features/auth/hooks/useAuth";
import { Badge } from "@/components/ui";

export default function Navbar() {
  const user = useAppSelector((s) => s.auth.user);
  const { mutate: logout, isPending } = useLogout();

  return (
    <header className="sticky top-0 z-10 flex h-20 shrink-0 items-center justify-between border-b border-gray-100 bg-white px-6">
      {/* Page Title Placeholder (Empty in image) */}
      <div className="w-1/4" />

      {/* Centered Search */}
      <div className="flex-1 flex justify-center">
        <div className="relative w-full max-w-md group">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            type="text" 
            placeholder="Search..." 
            className="h-10 w-full rounded-lg border border-gray-200 bg-white pl-10 pr-4 text-sm transition-all focus:border-secondary focus:outline-none focus:ring-4 focus:ring-secondary/5"
          />
        </div>
      </div>

      {/* Right section */}
      <div className="w-1/4 flex items-center justify-end gap-6">
        {/* Notification bell (Red in image) */}
        <button
          type="button"
          aria-label="Notifications"
          className="relative p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 border-2 border-white" />
        </button>

        {/* User profile */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-gray-900 leading-none">
              Admin User
            </p>
            <p className="mt-1 text-[10px] font-medium text-gray-500 uppercase tracking-tighter">
              Md ismam Nibir
            </p>
          </div>
          <div className="relative h-10 w-10 overflow-hidden rounded-full ring-2 ring-gray-100">
             <img 
               src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Nibir`} 
               alt="Avatar" 
               className="h-full w-full object-cover bg-gray-200"
             />
          </div>
          <button
            type="button"
            disabled={isPending}
            onClick={() => logout()}
            className="text-gray-400 hover:text-red-500 transition-colors"
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
