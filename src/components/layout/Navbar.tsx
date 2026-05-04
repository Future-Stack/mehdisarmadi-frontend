"use client";

import { useAppSelector } from "@/store/hooks";
import { useLogout } from "@/features/auth/hooks/useAuth";
import Logo from "@/components/Reuseable/Logo";
import { Plus, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function Navbar() {
  const { mutate: logout, isPending } = useLogout();

  return (
    <header className="sticky top-0 z-30 flex h-20 w-full items-center justify-between border-b border-emerald-100 bg-white px-8 shadow-sm shadow-emerald-200">
      <Logo />
      
      <div className="flex items-center gap-4">
        <Button 
          variant="primary" 
          className="h-11 px-5 rounded-xl font-bold shadow-sm shadow-emerald-100"
        >
          <Plus className="w-4 h-4" /> Create New Project
        </Button>
        <Button 
          variant="secondary" 
          className="h-11 px-5 rounded-xl font-bold border-gray-100"
        >
          <Settings className="w-4 h-4" /> Settings
        </Button>
        <Button 
          variant="secondary"
          onClick={() => logout()}
          isLoading={isPending}
          className="h-11 px-5 rounded-xl font-bold border-gray-100 hover:bg-red-50 hover:text-red-600 hover:border-red-100"
        >
          <LogOut className="w-4 h-4" /> Logout
        </Button>
      </div>
    </header>
  );
}
