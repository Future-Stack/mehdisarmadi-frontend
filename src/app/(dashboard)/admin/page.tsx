"use client";

import { StatCard } from "@/features/dashboard/components/StatCard";

import { cn } from "@/lib/utils";
import { User, FolderKanban, CheckCircle } from "lucide-react";
import StaticPage from "@/components/layout/StaticDemoPage";
import { useGetDashboardDataQuery } from "@/store/api/admin/Dashboard/getDashboardData";
import { useGetRecentProjectsQuery } from "@/store/api/admin/Dashboard/recentProjects";

export default function DashboardPage() {
  const { data, isLoading } = useGetDashboardDataQuery();
  const recentActivities = data?.data.recentActivity ?? [];

  const { data: projectsData, isLoading: projectsLoading } =
    useGetRecentProjectsQuery({
      page: 1,
      limit: 5,
    });
  const projects = projectsData?.data.items ?? [];
  const stats = [
    {
      title: "Total Users",
      value: data?.data.cards.totalUsers.value ?? 0,
      description: "Active Users",
      icon: <User size={20} />,
    },
    {
      title: "Active Projects",
      value: data?.data.cards.activeProjects.value ?? 0,
      description: "Ongoing",
      icon: <FolderKanban size={20} />,
    },
    {
      title: "Completed Analyses",
      value: data?.data.cards.completedAnalyses.value ?? 0,
      description: "Completed",
      icon: <CheckCircle size={20} />,
    },
  ];
  return (
    <div className="space-y-10 min-h-screen">
      {/* Page header */}
      <StaticPage
        title="System Overview"
        description="Monitor platform activity and AI processing performance"
      />

      {/* Stats grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Recent Projects Table */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white transition-colors">
          Recent Projects
        </h2>
        <div className="card-premium overflow-hidden border border-gray-100 dark:border-gray-800 transition-colors">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 transition-colors">
                <th className="px-6 py-4 text-[12px] font-bold uppercase tracking-tight text-[#968C8C] dark:text-gray-500">
                  Project Name
                </th>
                <th className="px-6 py-4 text-[12px] font-bold uppercase tracking-tight text-[#968C8C] dark:text-gray-500 text-center">
                  Files
                </th>
                <th className="px-6 py-4 text-[12px] font-bold uppercase tracking-tight text-[#968C8C] dark:text-gray-500 text-center">
                  Addenda
                </th>
                <th className="px-6 py-4 text-[12px] font-bold uppercase tracking-tight text-[#968C8C] dark:text-gray-500 text-center">
                  Status
                </th>
                <th className="px-6 py-4 text-[12px] font-bold uppercase tracking-tight text-[#968C8C] dark:text-gray-500 text-center">
                  Quote
                </th>
                <th className="px-6 py-4 text-[12px] font-bold uppercase tracking-tight text-[#968C8C] dark:text-gray-500 text-right">
                  Last Updated
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {projectsLoading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : projects.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">
                    No recent projects found.
                  </td>
                </tr>
              ) : (
                projects.map((p) => (
                  <tr key={p.id}>
                    <td className="px-6 py-5 font-semibold">{p.projectName}</td>

                    <td className="px-6 py-5 text-center">{p.files}</td>

                    <td className="px-6 py-5 text-center">{p.addenda}</td>

                    <td className="px-6 py-5 text-center">
                      <span
                        className={cn(
                          "inline-flex items-center px-3 py-1 rounded-lg text-sm font-semibold",
                          p.status === "Completed"
                            ? "bg-[#DDFFEB] text-secondary"
                            : "bg-[#FFFADA] text-[#92400E]",
                        )}
                      >
                        {p.status}
                      </span>
                    </td>

                    <td className="px-6 py-5 text-center">
                      <span
                        className={cn(
                          "inline-flex items-center px-4 py-1 rounded-lg text-sm font-semibold",
                          p.quote
                            ? "bg-[#DDFFEB] text-secondary"
                            : "bg-[#D1D5DC] text-[#4B5563]",
                        )}
                      >
                        {p.quote ? "Yes" : "No"}
                      </span>
                    </td>

                    <td className="px-6 py-5 text-right text-[#968C8C]">
                      {p.relativeTime}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid gap-8 lg:grid-cols-5 pb-10">
        <div className="lg:col-span-3 space-y-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white transition-colors">
            Recent Activity
          </h2>
          <div className="card-premium p-8 h-full bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 transition-colors">
            <ul className="space-y-6">
              {isLoading ? (
                <p className="text-center py-6 text-sm text-gray-500">
                  Loading...
                </p>
              ) : recentActivities.length === 0 ? (
                <p className="text-center py-6 text-sm text-gray-500">
                  No recent activity found.
                </p>
              ) : (
                recentActivities.map((item) => (
                  <li key={item.id} className="flex gap-4">
                    <div className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" />

                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {item.description}
                      </p>

                      <p className="text-[11px] font-medium text-[#968C8C] dark:text-gray-500 mt-1">
                        {item.relativeTime}
                      </p>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>

        {/* <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white transition-colors">
            System Alerts
          </h2>
          <div className="card-premium p-8 space-y-4 h-full bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 transition-colors">
            <div className="flex items-center gap-4 rounded-xl border border-[#FEE2E2] dark:border-red-900/30 bg-[#FEF2F2] dark:bg-red-900/10 p-4 transition-all hover:scale-[1.02]">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white dark:bg-gray-800 text-[#EF4444] dark:text-red-400 border border-[#FEE2E2] dark:border-red-900/30 shadow-sm">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m0 3.75h.008v.008H12v-.008z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25z"
                  />
                </svg>
              </div>
              <p className="text-sm font-semibold text-[#991B1B] dark:text-red-300">
                AI failed to process document (Project ID #1023)
              </p>
            </div>
            <div className="flex items-center gap-4 rounded-xl border border-[#FEF3C7] dark:border-yellow-900/30 bg-[#FFFBEB] dark:bg-yellow-900/10 p-4 transition-all hover:scale-[1.02]">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white dark:bg-gray-800 text-[#F59E0B] dark:text-yellow-400 border border-[#FEF3C7] dark:border-yellow-900/30 shadow-sm">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m0 3.75h.008v.008H12v-.008z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25z"
                  />
                </svg>
              </div>
              <p className="text-sm font-semibold text-[#92400E] dark:text-yellow-300">
                AI processing delayed for Project #1024. Retrying...
              </p>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
}
