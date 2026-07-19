"use client";

import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: React.ReactNode;
  description?: string;
}

export function StatCard({
  title,
  value,
  change,
  changeType = "neutral",
  icon,
  description,
}: StatCardProps) {
  return (
    <div className="card-premium p-8 flex items-center justify-between min-h-[140px] border border-[#0000001A]">
      <div className="space-y-2">
        <p className="text-[14px] font-semibold text-[#000000] dark:text-gray-400 Capitalize transition-colors">
          {title}
        </p>
        <p className="text-[24px] font-bold text-black dark:text-white transition-colors">
          {value}
        </p>
        {description && (
          <p className="text-[12px] font-normal text-[#717182] dark:text-gray-500 transition-colors">
            {description}
          </p>
        )}
      </div>
      <div className={cn(
        "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors",
        changeType === "negative" ? "bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400" : "bg-secondary/10 dark:bg-secondary/20 text-secondary"
      )}>
        {icon}
      </div>
    </div>
  );
}
