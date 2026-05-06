import SubUserNavbar from "@/components/layout/SubUserNavbar";

export default function SubUserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#F8FAFC] dark:bg-[#0B0F1A] transition-colors duration-300">
      <SubUserNavbar />
      <main
        id="main-content"
        className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8"
      >
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
