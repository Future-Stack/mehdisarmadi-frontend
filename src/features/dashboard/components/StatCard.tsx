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
    <div className="card-premium p-6 flex items-center justify-between">
      <div className="space-y-1">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-tight">
          {title}
        </p>
        <p className="text-3xl font-bold text-black">
          {value}
        </p>
        {description && (
          <p className="text-[10px] font-medium text-gray-400">
            {description}
          </p>
        )}
      </div>
      <div className={cn(
        "flex h-12 w-12 shrink-0 items-center justify-center rounded-full",
        changeType === "negative" ? "bg-red-50 text-red-500" : "bg-secondary/10 text-secondary"
      )}>
        {icon}
      </div>
    </div>
  );
}
