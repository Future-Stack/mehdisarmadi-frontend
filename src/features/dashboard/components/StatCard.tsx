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
    <div className="card-premium p-6">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-bold text-black uppercase tracking-tight">
            {title}
          </p>
          <p className="text-3xl font-black text-black">
            {value}
          </p>
          {description && (
            <p className="text-xs text-gray-400 dark:text-gray-500">
              {description}
            </p>
          )}
        </div>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
          {icon}
        </div>
      </div>
      {change && (
        <div className="mt-4 flex items-center gap-1">
          <span
            className={cn(
              "inline-flex items-center text-xs font-bold",
              changeType === "positive" && "text-secondary",
              changeType === "negative" && "text-red-600",
              changeType === "neutral" && "text-gray-500"
            )}
          >
            {changeType === "positive" && "↑ "}
            {changeType === "negative" && "↓ "}
            {change}
          </span>
          <span className="text-xs text-gray-400 dark:text-gray-500">
            vs last month
          </span>
        </div>
      )}
    </div>
  );
}
