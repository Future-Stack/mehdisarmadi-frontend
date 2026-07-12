import dynamic from "next/dynamic";
import Navbar from "@/components/layout/Navbar";
import { Toaster } from "sonner";

// Sidebar is client-only (reads Redux); lazy-load it
const Sidebar = dynamic(() => import("@/components/layout/Sidebar"), {
  loading: () => (
    <div className="hidden md:flex w-20 shrink-0 bg-white dark:bg-gray-950 border-r border-gray-100 dark:border-gray-800 shadow-lg shadow-[#00000015]" />
  ),
});


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#F9FAFB] dark:bg-[#0B0F1A] transition-colors duration-300">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar />
        <main
          id="main-content"
          className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8"
        >
          {children}
          <Toaster position="top-right" />
        </main>
      </div>
    </div>
  );
}
