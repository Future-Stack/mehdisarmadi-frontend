"use client";

import React, { useState, useCallback } from "react";
import { Search, FileText, Share2, Clock, Filter, Calendar, ChevronDown, CheckCircle2, Download, AlertTriangle, Eye, Edit, Funnel, Calendar1, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useGetProjectDashboardStatsQuery, useGetProjectDashboardProjectsQuery } from "@/store/api/projectApi";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import AnalysisExportView from "@/features/projects/components/analysis/AnalysisExportView";
import { exportAnalysisPDF } from "@/features/projects/utils/exportUtils";

export default function SubUserDashboardPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [status, setStatus] = useState("all");
  const [timeRange, setTimeRange] = useState("all");
  const [search, setSearch] = useState("");

  const { data: statsData, isLoading: isStatsLoading } = useGetProjectDashboardStatsQuery();
  const { data: projectsData, isLoading: isProjectsLoading } = useGetProjectDashboardProjectsQuery({ page, limit, status, timeRange, search });

  const stats = statsData?.data;
  const projects = projectsData?.data?.items || [];
  const recentActivity = stats?.recentActivity || [];

  const [exportingId, setExportingId] = useState<string | null>(null);

  const handleExportClick = (projectId: string, projectName: string) => {
    setExportingId(projectId);
    toast.info(`Preparing export for ${projectName}...`);
  };

  const handleExportReady = useCallback(async () => {
    if (!exportingId) return;
    try {
      await exportAnalysisPDF(`Analysis-${exportingId}`);
      toast.success("PDF exported successfully!");
    } catch (error) {
      toast.error("Failed to export PDF.");
    } finally {
      setExportingId(null);
    }
  }, [exportingId]);

  const STATS_CARDS = [
    {
      title: "Total Tender",
      value: stats?.cards.totalTender.value || 0,
      subtitle: "All time",
      subtitleColor: "text-[#009966]",
      icon: <FileText className="w-4 h-4 text-[#009966]" />,
      bg: "bg-[#D0FAE5] dark:bg-emerald-500/10",
    },
    {
      title: "Active Quotes",
      value: stats?.cards.activeQuotes.value || 0,
      subtitle: "In Progress",
      subtitleColor: "text-[#155DFC]",
      icon: <Share2 className="w-4 h-4 text-[#155DFC]" />,
      bg: "bg-[#DBEAFE] dark:bg-blue-500/10",
    },
    {
      title: "Pending Reviews",
      value: stats?.cards.pendingReviews.value || 0,
      subtitle: "Need attention",
      subtitleColor: "text-[#D08700]",
      icon: <FileText className="w-4 h-4 text-[#D08700]" />,
      bg: "bg-[#FEF9C2] dark:bg-yellow-500/10",
    },
    {
      title: "Total Value",
      value: stats?.cards.totalValue.formattedValue || "$0",
      subtitle: "Combined quotes",
      subtitleColor: "text-[#9810FA]",
      icon: <span className="text-md font-semibold text-[#9810FA]">$</span>,
      bg: "bg-[#F3E8FF] dark:bg-purple-500/10",
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "quote":
        return {
          icon: Download,
          // bg: "bg-blue-50 dark:bg-blue-900/30",
          color: "text-blue-500",
        };

      case "analysis":
        return {
          icon: CheckCircle2,
          // bg: "bg-emerald-50 dark:bg-emerald-900/30",
          color: "text-emerald-500",
        };

      case "fileUpload":
        return {
          icon: FileText,
          // bg: "bg-violet-50 dark:bg-violet-900/30",
          color: "text-violet-500",
        };

      case "risk":
        return {
          icon: AlertTriangle,
          // bg: "bg-orange-50 dark:bg-orange-900/30",
          color: "text-orange-500",
        };

      default:
        return {
          icon: Clock,
          bg: "bg-gray-100 dark:bg-gray-800",
          color: "text-gray-500",
        };
    }
  };

  return (
    <div className="flex flex-col xl:flex-row gap-6 pb-12">
      {/* Left Main Content */}
      <div className="flex-1 space-y-8">
        {/* Header section */}
        <div>
          <div className="space-y-3">
            <h1 className="text-[28px] font-bold text-[#000000] dark:text-white tracking-tight">
              Tender Dashboard
            </h1>
            <p className="text-[#4A5565] dark:text-gray-400 max-w-5xl leading-relaxed text-base font-medium">
              Transform the way you manage construction tenders with AI-powered automation. Analyze documents, identify risks, and generate professional quotes in minutes.
            </p>
          </div>

          {/* 4 Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            {STATS_CARDS.map((stat, idx) => (
              <div key={idx} className="bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 rounded-2xl p-5 shadow-sm shadow-[#00000040] flex flex-col relative overflow-hidden ">
                <div className="text-sm font-medium text-[#2D3238] dark:text-gray-400  mb-1">{stat.title}</div>
                <div className="text-[24px] font-bold text-[#101828] dark:text-white leading-none mb-1">
                  {isStatsLoading ? "..." : stat.value}
                </div>
                <div className={cn("text-xs font-medium", stat.subtitleColor)}>{stat.subtitle}</div>

                <div className={cn("absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center", stat.bg)}>
                  {stat.icon}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col xl:flex-row gap-6 pb-12">
          <div className="space-y-8 flex-1">
            {/* Search & Filters */}
            <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden p-6">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="relative flex-1 w-full">
                  <div className="absolute inset-y-0 left-12 flex items-center pointer-events-none">
                    <Search className="w-3.5 h-3.5 text-[#6B7280]" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search Projects..........."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full h-10 pl-18 pr-4 bg-white dark:bg-[#111827] text-sm placeholder:text-[#6B7280] shadow-sm shadow-[#00000040] placeholder:font-medium border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm font-medium"
                  />
                </div>
                <div className="flex flex-row gap-3 w-full sm:w-auto">
                  <div className="relative w-full sm:w-48">
                    {/* Left Icon */}
                    <Funnel className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />

                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full appearance-none h-10 pl-10 pr-10 bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-200 shadow-sm shadow-[#00000040] hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none"
                    >
                      <option value="all">All Status</option>
                      <option value="notStarted">Not Started</option>
                      <option value="processing">Processing</option>
                      <option value="completed">Completed</option>
                      <option value="needsReview">Needs Review</option>
                      <option value="failed">Failed</option>
                    </select>

                    {/* Right Icon */}
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
                  </div>
                  <div className="relative w-full sm:w-48">
                    {/* Left Icon */}
                    <Calendar1 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />

                    <select
                      value={timeRange}
                      onChange={(e) => setTimeRange(e.target.value)}
                      className="w-full appearance-none h-10 pl-10 pr-10 bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-200 shadow-sm shadow-[#00000040] hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none"
                    >
                      <option value="all">All Time</option>
                      <option value="7d">Last 7 Days</option>
                      <option value="30d">Last 30 Days</option>
                      <option value="90d">Last 90 Days</option>
                      <option value="thisMonth">This Month</option>
                    </select>

                    {/* Right Icon */}
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
                  </div>

                </div>
              </div>
            </div>

            {/* Table container */}
            <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm shadow-[#00000040] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#F8F8F8] dark:bg-gray-800  border-b border-gray-100 dark:border-gray-800">
                      <th className="px-4 sm:px-6 py-4 text-[11px] font-bold text-[#364153] dark:text-gray-400 uppercase tracking-wider">Tender</th>
                      <th className="px-4 sm:px-6 py-4 text-[11px] font-bold text-[#364153] dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">Client</th>
                      <th className="px-4 sm:px-6 py-4 text-[11px] font-bold text-[#364153] dark:text-gray-400 uppercase tracking-wider">Status</th>
                      <th className="px-4 sm:px-6 py-4 text-[11px] font-bold text-[#364153] dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">Question Date</th>
                      <th className="px-4 sm:px-6 py-4 text-[11px] font-bold text-[#364153] dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">Closing Date</th>
                      <th className="px-4 sm:px-6 py-4 text-[11px] font-bold text-[#364153] dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">Value</th>
                      <th className="px-4 sm:px-6 py-4 text-[11px] font-bold text-[#364153] dark:text-gray-400 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {isProjectsLoading ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                          Loading projects...
                        </td>
                      </tr>
                    ) : projects.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                          No projects found.
                        </td>
                      </tr>
                    ) : (
                      projects.map((row) => (
                        <tr key={row.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors group">
                          <td className="px-4 sm:px-6 py-4">
                            <Link href={`/sub-user/projects/${row.id}`} className="block">
                              <div className="text-xs font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-emerald-600 transition-colors line-clamp-1">{row.name}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
                                {row.highPriority && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                                    High
                                  </span>
                                )}
                                {row.fileCount} files
                              </div>
                            </Link>
                          </td>
                          <td className="px-4 sm:px-6 py-4 hidden sm:table-cell">
                            <div className="text-sm text-gray-600 dark:text-gray-300 font-medium line-clamp-2">{row.clientName}</div>
                          </td>
                          <td className="px-4 sm:px-6 py-4">
                            <span className={cn(
                              "inline-flex items-center px-2.5 py-1 rounded-full text-[10px]",
                              row.status === "completed"
                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                                : row.status === "processing"
                                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                                  : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                            )}>
                              {row.statusLabel}
                            </span>
                          </td>
                          <td className="px-4 sm:px-6 py-4 text-sm text-gray-600 dark:text-gray-300 font-medium whitespace-nowrap hidden lg:table-cell">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-gray-400" />
                              {new Date(row.questionDate).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })}
                            </div>
                          </td>
                          <td className="px-4 sm:px-6 py-4 text-sm text-gray-600 dark:text-gray-300 font-medium whitespace-nowrap hidden lg:table-cell">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-gray-400" />
                              {new Date(row.closingDate).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })}
                            </div>
                          </td>
                          <td className="px-4 sm:px-6 py-4 text-sm font-bold text-[#364153] dark:text-white hidden md:table-cell">
                            {row.valueFormatted}
                          </td>
                          <td className="px-4 sm:px-6 py-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-2">
                              <Link href={`/sub-user/projects/${row.id}`} className="p-1.5 text-[#364153] hover:text-emerald-600 transition-colors">
                                <Eye className="w-4 h-4" />
                              </Link>
                              <button
                                onClick={() => router.push(`/sub-user/projects/${row.id}`)}
                                className="p-1.5 text-[#364153] hover:text-blue-600 transition-colors"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleExportClick(row.id, row.name)}
                                disabled={exportingId === row.id}
                                className="p-1.5 text-[#364153] hover:text-gray-900 dark:hover:text-white transition-colors"
                                title="Download AI Analysis Report"
                              >
                                {exportingId === row.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                                ) : (
                                  <Download className="w-4 h-4" />
                                )}
                              </button>

                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          {/* Right Sidebar */}
          <div className="w-full xl:w-[320px] 2xl:w-[360px] flex-shrink-0 flex flex-col gap-6">

            {/* Recent Activity */}
            <div className="bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 rounded-2xl p-5 shadow-sm">
              <h3 className="text-[15px] font-bold text-gray-900 dark:text-white mb-4">Recent Activity</h3>

              <div className="space-y-3 mb-5">
                {isStatsLoading ? (
                  <p className="text-sm text-gray-500">Loading activity...</p>
                ) : recentActivity.length === 0 ? (
                  <p className="text-sm text-gray-500">No recent activity.</p>
                ) : (
                  recentActivity.map((activity, idx) => {
                    const { icon: Icon, color } = getActivityIcon(activity.type);

                    return (
                      <div
                        key={activity.id}
                        className="flex gap-3 p-3 rounded-xl border border-[#E8E8E8] dark:border-gray-800 bg-[#F9FAFB] dark:bg-gray-800/30"
                      >
                        <div
                          className={cn(
                            "w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5",
                            // bg,
                            color
                          )}
                        >
                          <Icon className="w-4 h-4" />
                        </div>

                        <div className="flex-1">
                          <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 leading-snug mb-1">
                            {activity.title}
                          </p>

                          <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-1">
                            {activity.description}
                          </p>

                          <div className="flex items-center gap-1 text-[10px] font-medium text-gray-400">
                            <Clock className="w-3 h-3" />
                            {activity.relativeTime}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <Button
                onClick={() => router.push('/sub-user/projects')}
                variant="primary"
                className="w-full h-10 text-sm font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                View All Projects
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 rounded-2xl p-5 shadow-sm">
              <h3 className="text-[15px] font-bold text-gray-900 dark:text-white mb-4">Quick Stats</h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded flex items-center justify-center bg-emerald-50 dark:bg-emerald-900/30 text-emerald-500">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">AI Analyses</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    {isStatsLoading ? "..." : stats?.quickStats.aiAnalyses.value || 0}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded flex items-center justify-center bg-blue-50 dark:bg-blue-900/30 text-blue-500">
                      <Download className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">Quotes Exported</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    {isStatsLoading ? "..." : stats?.quickStats.quotesExported.value || 0}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded flex items-center justify-center bg-orange-50 dark:bg-orange-900/30 text-orange-500">
                      <Clock className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">Avg. Processing</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    {isStatsLoading ? "..." : stats?.quickStats.avgProcessing.label || "0 min"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Hidden export view for the currently selected project */}
      {exportingId && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: "-9999px",
            zIndex: -1,
            pointerEvents: "none",
          }}
        >
          <AnalysisExportView projectId={exportingId} onReady={handleExportReady} />
        </div>
      )}
    </div>
  );
}
