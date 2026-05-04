import dynamic from "next/dynamic";
import Navbar from "@/components/layout/Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#F8FAFC]">
      <Navbar />
      <main
        id="main-content"
        className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8"
      >
        {children}
      </main>
    </div>
  );
}
