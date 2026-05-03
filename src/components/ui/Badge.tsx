import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type BadgeVariant =
  | "default"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "outline";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default:
    "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200",
  success:
    "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",
  warning:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
  danger:
    "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
  info:
    "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
  outline:
    "border border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300",
};

/**
 * Small status badge — use for roles, statuses, labels, etc.
 */
export function Badge({
  children,
  variant = "default",
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
