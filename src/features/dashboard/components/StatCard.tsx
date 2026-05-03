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
    <div className="card-premium p-8 flex items-center justify-between min-h-[140px]">
      <div className="space-y-2">
        <p className="text-[13px] font-semibold text-[#968C8C] uppercase tracking-wider">
          {title}
        </p>
        <p className="text-3xl font-bold text-black">
          {value}
        </p>
        {description && (
          <p className="text-[12px] font-medium text-[#968C8C]">
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
