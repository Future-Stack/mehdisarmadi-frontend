import type { Metadata } from "next";
import { StatCard } from "@/features/dashboard/components/StatCard";
import { Badge } from "@/components/ui";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "System Overview" };

const STATS = [
  {
    title: "Total Users",
    value: "24",
    description: "Active Users",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-2.533-4.656 6.853 6.853 0 01-10.937 0 4.125 4.125 0 00-2.533 4.656 9.367 9.367 0 004.121.952 9.38 9.38 0 002.625-.372M7.5 7.5a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0z" />
      </svg>
    ),
  },
  {
    title: "Active Projects",
    value: "18",
    description: "Ongoing",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.625-1.25a3.375 3.375 0 00-3.375 3.375h1.5A1.125 1.125 0 0112 16.5v1.5a3.375 3.375 0 00-3.375-3.375H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
  },
  {
    title: "Completed Analyses",
    value: "120",
    description: "Completed",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "AI Errors",
    value: "02",
    changeType: "negative" as const,
    description: "Issues Detected",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
      </svg>
    ),
  },
];

const PROJECTS = [
  { name: "City Mall Tender", files: 12, addenda: 3, status: "Completed", quote: "Yes", updated: "2 hours ago" },
  { name: "Office Fitout", files: 8, addenda: 1, status: "Processing", quote: "No", updated: "30 min ago" },
  { name: "Shopping Center", files: 10, addenda: 2, status: "Processing", quote: "No", updated: "1 hour ago" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-10">
      {/* Page header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          System Overview
        </h1>
        <p className="text-sm font-medium text-gray-400">
          Monitor platform activity and AI processing performance
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Recent Projects Table */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900">Recent Projects</h2>
        <div className="card-premium overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-tight text-gray-400">Project Name</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-tight text-gray-400 text-center">Files</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-tight text-gray-400 text-center">Addenda</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-tight text-gray-400 text-center">Status</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-tight text-gray-400 text-center">Quote</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-tight text-gray-400 text-right">Last Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {PROJECTS.map((p, i) => (
                <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-5 text-sm font-semibold text-gray-900">{p.name}</td>
                  <td className="px-6 py-5 text-sm font-medium text-gray-500 text-center">{p.files}</td>
                  <td className="px-6 py-5 text-sm font-medium text-gray-500 text-center">{p.addenda}</td>
                  <td className="px-6 py-5 text-center">
                    <span className={cn(
                      "text-sm font-bold",
                      p.status === "Completed" ? "text-green-500" : "text-amber-500"
                    )}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <Badge className={cn(
                      "font-bold px-4 py-1 border-none rounded-lg",
                      p.quote === "Yes" ? "bg-[#E6F6ED] text-[#008236]" : "bg-gray-200 text-gray-500"
                    )}>
                      {p.quote}
                    </Badge>
                  </td>
                  <td className="px-6 py-5 text-sm font-medium text-gray-400 text-right">{p.updated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3 space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
          <div className="card-premium p-8 h-full">
            <ul className="space-y-6">
              {[
                { text: 'Project "City Mall Tender" analyzed', time: "2 minutes ago" },
                { text: "New user registered", time: "15 minutes ago" },
                { text: 'AI processing completed for "Office Fitout"', time: "1 hour ago" },
                { text: 'Error detected in Document #4582', time: "2 hours ago" },
              ].map((item, i) => (
                <li key={i} className="flex gap-4">
                  <div className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{item.text}</p>
                    <p className="text-[11px] font-medium text-gray-400 mt-1">{item.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-gray-900">System Alerts</h2>
          <div className="card-premium p-8 space-y-4 h-full">
            <div className="flex items-center gap-4 rounded-xl border border-[#FEE2E2] bg-[#FEF2F2] p-4 transition-all hover:scale-[1.02]">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#EF4444] border border-[#FEE2E2] shadow-sm">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0 3.75h.008v.008H12v-.008z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25z" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-[#991B1B]">AI failed to process document (Project ID #1023)</p>
            </div>
            <div className="flex items-center gap-4 rounded-xl border border-[#FEF3C7] bg-[#FFFBEB] p-4 transition-all hover:scale-[1.02]">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#F59E0B] border border-[#FEF3C7] shadow-sm">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0 3.75h.008v.008H12v-.008z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25z" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-[#92400E]">Large file upload delay detected</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
