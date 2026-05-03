import dynamic from "next/dynamic";
import Navbar from "@/components/layout/Navbar";

// Sidebar is client-only (reads Redux); lazy-load it
const Sidebar = dynamic(() => import("@/components/layout/Sidebar"), {
  loading: () => (
    <div className="hidden w-64 shrink-0 bg-gray-900 lg:block" />
  ),
});

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar />
        <main
          id="main-content"
          className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
