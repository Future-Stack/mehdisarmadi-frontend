import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#ECFDF5] via-[#FFFFFF] to-[#EFF6FF] p-4">
      <div className="w-full max-w-[571px]">
        <div className="rounded-[32px] border border-white bg-white/70 p-1 shadow-[0_20px_50px_rgba(0,0,0,0.04)] backdrop-blur-xl">
          <div className="bg-white rounded-[30px] p-8 md:p-10 border border-gray-50   shadow-xl shadow-[#00000040]">
            {children}
          </div>
        </div>
      </div>
    </main>
  );
}
