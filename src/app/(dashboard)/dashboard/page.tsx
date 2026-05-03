import type { Metadata } from "next";
import { StatCard } from "@/features/dashboard/components/StatCard";
import { Badge } from "@/components/ui";
import { cn } from "@/lib/utils";
import { User, FolderKanban, CheckCircle, CircleAlert } from "lucide-react";

export const metadata: Metadata = { title: "System Overview" };

const STATS = [
  {
    title: "Total Users",
    value: "24",
    description: "Active Users",
    icon: <User size={20} />,
  },
  {
    title: "Active Projects",
    value: "18",
    description: "Ongoing",
    icon: <FolderKanban size={20} />,
  },
  {
    title: "Completed Analyses",
    value: "120",
    description: "Completed",
    icon: <CheckCircle size={20} />,
  },
  {
    title: "AI Errors",
    value: "02",
    changeType: "negative" as const,
    description: "Issues Detected",
    icon: <CircleAlert size={20} />,
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
        <p className="text-[14px] font-medium text-[#968C8C]">
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
                <th className="px-6 py-4 text-[12px] font-bold uppercase tracking-tight text-[#968C8C]">Project Name</th>
                <th className="px-6 py-4 text-[12px] font-bold uppercase tracking-tight text-[#968C8C] text-center">Files</th>
                <th className="px-6 py-4 text-[12px] font-bold uppercase tracking-tight text-[#968C8C] text-center">Addenda</th>
                <th className="px-6 py-4 text-[12px] font-bold uppercase tracking-tight text-[#968C8C] text-center">Status</th>
                <th className="px-6 py-4 text-[12px] font-bold uppercase tracking-tight text-[#968C8C] text-center">Quote</th>
                <th className="px-6 py-4 text-[12px] font-bold uppercase tracking-tight text-[#968C8C] text-right">Last Updated</th>
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
                      "inline-flex items-center px-3 py-1 rounded-lg text-sm font-semibold whitespace-nowrap",
                      p.status === "Completed" 
                        ? "bg-[#DDFFEB] text-[#008236]" 
                        : "bg-[#FFFADA] text-[#92400E]"
                    )}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className={cn(
                      "inline-flex items-center px-4 py-1 rounded-lg text-sm font-semibold whitespace-nowrap",
                      p.quote === "Yes" 
                        ? "bg-[#DDFFEB] text-[#008236]" 
                        : "bg-[#D1D5DC] text-[#4B5563]"
                    )}>
                      {p.quote}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-sm font-medium text-[#968C8C] text-right">{p.updated}</td>
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
                    <p className="text-[11px] font-medium text-[#968C8C] mt-1">{item.time}</p>
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
