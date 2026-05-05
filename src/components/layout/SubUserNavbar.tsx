"use client";

import { useAppSelector } from "@/store/hooks";
import { useLogout } from "@/features/auth/hooks/useAuth";
import Logo from "@/components/Reuseable/Logo";
import { Plus, Settings, LogOut, LayoutDashboard, FolderKanban } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function SubUserNavbar() {
  const { mutate: logout, isPending } = useLogout();
  const pathname = usePathname();

  const navLinks = [
    { label: "Dashboard", href: "/sub-user", icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: "Projects", href: "/sub-user/projects", icon: <FolderKanban className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-30 flex h-20 w-full items-center border-b border-emerald-100 bg-white shadow-sm shadow-emerald-200">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href={"/sub-user"}>
            <Logo />
          </Link>
          
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all",
                  pathname === link.href || (link.href !== "/sub-user" && pathname.startsWith(link.href))
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-gray-500 hover:bg-gray-50 hover:text-emerald-600"
                )}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3 lg:gap-4">
          <Link href="/sub-user/projects/new">
            <Button
              variant="primary"
              className="h-10 lg:h-11 px-4 lg:px-5 rounded-xl font-bold shadow-sm shadow-emerald-100"
            >
              <Plus className="w-4 h-4" /> <span className="hidden sm:inline">New Project</span>
              <span className="sm:hidden">New</span>
            </Button>
          </Link>
          <Button
            variant="secondary"
            className="h-10 lg:h-11 px-4 lg:px-5 rounded-xl font-bold border-gray-100 px-3"
          >
            <Settings className="w-4 h-4" />
          </Button>
          <Button
            variant="secondary"
            onClick={() => logout()}
            isLoading={isPending}
            className="h-10 lg:h-11 px-4 lg:px-5 rounded-xl font-bold border-gray-100 hover:bg-red-50 hover:text-red-600 hover:border-red-100 px-3"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
