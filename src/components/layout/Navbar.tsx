"use client";

import { useAppSelector } from "@/store/hooks";
import Image from "next/image";
import { useLogout } from "@/features/auth/hooks/useAuth";
import { Bell } from "lucide-react";

export default function Navbar() {
  const user = useAppSelector((s) => s.auth.user);
  const { mutate: logout, isPending } = useLogout();

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-gray-100 bg-white px-8">
      <div className="flex items-center gap-6">
        {/* Search bar */}
        <div className="relative hidden lg:block">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search projects, files or users..."
            className="w-[589px] h-[42px] rounded-xl border border-[#99A1AF] bg-gray-50/30 pl-11 pr-4 text-sm focus:border-secondary focus:bg-white focus:outline-none transition-all placeholder:text-[#968C8C]"
          />
        </div>
      </div>

      <div className="flex w-[283px] h-[48px] items-center gap-6 justify-end pr-8">
        {/* Notification bell (Red in image) */}
        <button
          type="button"
          aria-label="Notifications"
          className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50/50 transition-all hover:bg-red-50 group"
        >
          <Bell size={22} className="text-[#EF4444] transition-transform group-hover:scale-110" />
        </button>

        {/* User profile */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs font-bold text-black">Admin User</p>
            <p className="text-[11px] font-medium text-[#968C8C]">
              Akash Abrrar
            </p>
          </div>
          <div className="relative h-10 w-10 overflow-hidden rounded-full ring-2 ring-gray-100">
             <Image 
               src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Akash`} 
               alt="Avatar" 
               width={40}
               height={40}
               unoptimized
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
