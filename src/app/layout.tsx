import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers/Providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Renofield",
    template: "%s | Renofield",
  },
  description: "A production-ready project management dashboard for Renofield.",
  icons: {
    icon: "/Images/Renofield.png",
  },
  robots: { index: false },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
