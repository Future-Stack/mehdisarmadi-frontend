"use client";

import { StatCard } from "@/features/dashboard/components/StatCard";

import { cn } from "@/lib/utils";
import { User, FolderKanban, CheckCircle, Users } from "lucide-react";
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
  console.log("projects", projectsData);
  const stats = [
    {
      title: "Total Users",
      value: data?.data.cards.totalUsers.value ?? 0,
      description: "Active Users",
      icon: <Users size={24} />,
    },
    {
      title: "Active Tenders",
      value: data?.data.cards.activeProjects.value ?? 0,
      description: "Ongoing",
      icon: <FolderKanban size={24} />,
    },
    {
      title: "Completed Analyses",
      value: data?.data.cards.completedAnalyses.value ?? 0,
      description: "Completed",
      icon: <CheckCircle size={24} />,
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

      {/* Recent Tenders Table */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-[#101828] dark:text-white transition-colors">
          Recent Tenders
        </h2>
        <div className="card-premium overflow-hidden border border-[#DED5D5] dark:border-gray-800 transition-colors">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#DED5D5] dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 transition-colors">
                <th className="px-6 py-4 text-[12px] font-bold uppercase tracking-tight text-gray-600 dark:text-gray-500">
                  Tender Name
                </th>
                <th className="px-6 py-4 text-[12px] font-bold uppercase tracking-tight text-gray-600 dark:text-gray-500 text-center">
                  Files
                </th>
                <th className="px-6 py-4 text-[12px] font-bold uppercase tracking-tight text-gray-600 dark:text-gray-500 text-center">
                  Addenda
                </th>
                <th className="px-6 py-4 text-[12px] font-bold uppercase tracking-tight text-gray-600 dark:text-gray-500 text-center">
                  Status
                </th>
                <th className="px-6 py-4 text-[12px] font-bold uppercase tracking-tight text-gray-600 dark:text-gray-500 text-center">
                  Quote
                </th>
                <th className="px-6 py-4 text-[12px] font-bold uppercase tracking-tight text-gray-600 dark:text-gray-500 text-right">
                  Last Updated
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#DED5D5] dark:divide-gray-800">
              {projectsLoading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : projects.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">
                    No recent tenders found.
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
          <div className="card-premium max-w-[700px] p-8 h-full bg-white border border-[#DED5D5] dark:bg-gray-900 dark:border-gray-800 transition-colors">
          <h2 className="text-xl font-semibold text-[#101828] dark:text-white transition-colors mb-6">
            Recent Activity
          </h2>
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
                    <div className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-[#008236]" />

                    <div>
                      <p className="text-base font-normal text-[#101828] dark:text-white">
                        {item.description}
                      </p>

                      <p className="text-[14px] font-normal text-[#6A7282] dark:text-gray-500 mt-0.5">
                        {item.relativeTime}
                      </p>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
