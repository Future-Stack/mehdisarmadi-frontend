import type { Metadata } from "next";
import { StatCard } from "@/features/dashboard/components/StatCard";

export const metadata: Metadata = { title: "Dashboard" };

// Mock stats — replace with useQuery from a dashboardService
const STATS = [
  {
    title: "Total Users",
    value: "12,480",
    change: "8.2%",
    changeType: "positive" as const,
    description: "Registered accounts",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    title: "Active Sessions",
    value: "3,241",
    change: "2.1%",
    changeType: "positive" as const,
    description: "Online right now",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    title: "Revenue",
    value: "$48,295",
    change: "12.5%",
    changeType: "positive" as const,
    description: "This month",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "Error Rate",
    value: "0.4%",
    change: "0.1%",
    changeType: "negative" as const,
    description: "API error rate",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-black tracking-tight text-black">
          Overview
        </h1>
        <p className="mt-1 text-sm font-medium text-black/70">
          Welcome back! Here&apos;s what&apos;s happening with your platform.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Placeholder for charts / activity feed */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="col-span-2 card-premium p-6">
          <h2 className="mb-4 text-lg font-black text-black">
            Activity Feed
          </h2>
          <p className="text-sm text-gray-500">
            Connect your analytics service to display real-time charts here.
          </p>
        </div>
        <div className="card-premium p-6">
          <h2 className="mb-4 text-lg font-black text-black">
            Quick Actions
          </h2>
          <p className="text-sm text-gray-500">
            Shortcuts and pending tasks will appear here.
          </p>
        </div>
      </div>
    </div>
  );
}
