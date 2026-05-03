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
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-gray-200/60 bg-white/80 p-8 shadow-xl backdrop-blur-sm dark:border-gray-700/60 dark:bg-gray-900/80">
          {children}
        </div>
      </div>
    </main>
  );
}
