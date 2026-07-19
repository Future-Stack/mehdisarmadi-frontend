"use client";

import { useState, useMemo, useEffect } from "react";
import { Filter, ChevronDown, ChevronLeft, ChevronRight, Eye, RotateCw, CheckCircle2, Search, Loader2 } from "lucide-react";
import StaticPage from "@/components/layout/StaticDemoPage";
import { Modal } from "@/components/ui/Modal";
import { useGetAILogsQuery, AILogItem } from "@/store/api/admin/AILogs/getAiLogs";
import { useGetAdminUsersQuery } from "@/store/api/admin/Users/getAdminUsers";
import { useGetDivisionsQuery } from "@/store/api/admin/Division/getDivision";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTimestamp(ts: string) {
  if (!ts) return { date: "-", time: "-" };
  const parts = ts.split(" ");
  if (parts.length === 2) {
    return { date: parts[0], time: parts[1] };
  }
  return { date: ts, time: "" };
}

// ─── Status Badges ────────────────────────────────────────────────────────────

function StageBadge({ stage }: { stage: string }) {
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-lg text-[13px] font-semibold whitespace-nowrap bg-[#DCFCE7] dark:bg-[#0082361A] text-[#008236]">
      {stage}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === "Success") {
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-lg text-[13px] font-semibold whitespace-nowrap bg-[#DCFCE7] dark:bg-[#0082361A] text-[#008236]">
        {status}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-lg text-[13px] font-semibold whitespace-nowrap bg-[#FEE2E2] dark:bg-[#E7000B1A] text-[#991B1B]">
      {status}
    </span>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AILogs() {
  const [selectedLog, setSelectedLog] = useState<AILogItem | null>(null);

  // Search and filter states
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [projectFilter, setProjectFilter] = useState("All Tenders");

  const { data, isLoading } = useGetAILogsQuery();
  const apiLogs = data?.data || [];

  const filteredLogs = useMemo(() => {
    return apiLogs.filter(log => {
      const matchesSearch = search === "" ||
        (log.file_name && log.file_name.toLowerCase().includes(search.toLowerCase())) ||
        (log.project_name && log.project_name.toLowerCase().includes(search.toLowerCase()));

      const matchesStatus = statusFilter === "All Status" || log.status === statusFilter;
      const matchesProject = projectFilter === "All Tenders" || log.project_name === projectFilter;

      return matchesSearch && matchesStatus && matchesProject;
    });
  }, [apiLogs, search, statusFilter, projectFilter]);

  const uniqueProjects = useMemo(() => {
    const projects = new Set(apiLogs.map(log => log.project_name).filter(Boolean));
    return Array.from(projects);
  }, [apiLogs]);

  const [page, setPage] = useState(1);
  const limit = 10;

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, projectFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / limit));
  const paginatedLogs = filteredLogs.slice((page - 1) * limit, page * limit);

  // Fetch users and divisions to map IDs to names
  const { data: usersData, isLoading: isLoadingUsers, error: usersError } = useGetAdminUsersQuery({ page: 1, limit: 100 });
  const { data: divisionsData, isLoading: isLoadingDivisions } = useGetDivisionsQuery({ page: 1, limit: 100 });
  console.log("usersData", usersData);
  


  const ownerMap = useMemo(() => {
    const map = new Map<string, string>();
    const items = usersData?.data?.items;
    if (Array.isArray(items)) {
      items.forEach((u: any) => {
        if (u.id && u.fullName) {
          map.set(u.id, u.fullName);
        }
      });
    }
    return map;
  }, [usersData]);

    const divisionMap = useMemo(() => {
        const map = new Map<string, { code: string; name: string }>();
        if (divisionsData?.data?.items) {
          divisionsData.data.items.forEach(d => {
            map.set(d.id, { code: d.code, name: d.name });
          });
        }
        return map;
    }, [divisionsData]);

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <StaticPage
        title="AI Processing Logs"
        description="Track and review all AI processing activities"
      />

      {/* ── Filter Bar ── */}
      <div className="flex flex-wrap items-center gap-3 p-4 dark:bg-[#101828] bg-white rounded-2xl border border-[#E4E4E7] dark:border-gray-800 shadow-sm w-full transition-colors">
        <div className="relative flex-1 min-w-[200px]">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Search size={16} />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by file or tender..."
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary shadow-sm transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Filter className="w-5 h-5 text-gray-500 dark:text-gray-400 shrink-0" />
          <span className="text-sm font-semibold text-[#364153] dark:text-gray-300 whitespace-nowrap transition-colors">Filters:</span>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary text-sm text-gray-700 dark:text-gray-200 transition-colors cursor-pointer"
            >
              <option value="All Status">All Status</option>
              <option value="Success">Success</option>
              <option value="Failed">Failed</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>
          <div className="relative">
            <select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              className="appearance-none max-w-[120px] pl-3 pr-8 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary text-sm text-gray-700 dark:text-gray-200 transition-colors cursor-pointer"
            >
              <option value="All Tenders">All Tenders</option>
              {uniqueProjects.map(project => (
                <option key={project} value={project}>{project}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* ── Table Card ── */}
      <div className="card-premium overflow-hidden bg-white dark:bg-[#101828]">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#E5E7EB] dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 transition-colors">
                {["File Name", "Tender Name", "Stage", "Status", "Error Message", "Timestamp", "Duration", "Actions"].map((heading) => (
                  <th
                    key={heading}
                    scope="col"
                    className="whitespace-nowrap px-6 py-4 text-left text-[12px] font-bold uppercase tracking-tight text-[#4A5565] dark:text-gray-500 transition-colors"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-[#E5E7EB] dark:divide-gray-800 transition-colors">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="text-center py-16 text-slate-400 dark:text-gray-500 text-sm">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-secondary" />
                    Loading logs...
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-16 text-slate-400 dark:text-gray-500 text-sm">
                    No logs match your filters.
                  </td>
                </tr>
              ) : paginatedLogs.map((log, index) => {
                const { date, time } = formatTimestamp(log.timestamp);
                return (
                  <tr
                    key={index}
                    className="hover:bg-gray-50/50 dark:hover:bg-gray-900/50 transition-colors"
                  >
                    <td className="px-6 py-5 text-sm font-medium text-gray-900 dark:text-white whitespace-normal max-w-[180px] transition-colors">
                      {log.file_name}
                    </td>
                    <td className="px-6 py-5 text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors max-w-[200px]">
                      {log.project_name || "-"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-5">
                      <StageBadge stage={log.stage} />
                    </td>
                    <td className="whitespace-nowrap px-6 py-5">
                      <StatusBadge status={log.status} />
                    </td>
                    <td className="px-6 py-5 text-[12px] font-medium whitespace-pre-wrap max-w-[200px]">
                      {log.error_message ? (
                        <span className="text-red-400">{log.error_message}</span>
                      ) : (
                        <span className="text-red-400">-</span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-6 py-5 text-xs font-medium text-gray-500 dark:text-gray-400 leading-tight transition-colors">
                      <div className="flex flex-col gap-0.5">
                        <span>{date}</span>
                        <span>{time}</span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-5 text-sm font-medium text-gray-900 dark:text-white transition-colors">
                      {log.duration}
                    </td>
                    <td className="whitespace-nowrap px-6 py-5">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          aria-label="View log"
                          onClick={() => setSelectedLog(log)}
                          className="rounded-md p-1 text-[#008236] transition-colors hover:bg-secondary/10 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:ring-offset-1"
                        >
                          <Eye size={18} strokeWidth={2.5} />
                        </button>
                        {log.status === "Failed" && (
                          <>
                            <button
                              type="button"
                              aria-label="Retry processing"
                              className="rounded-md p-1 text-blue-500 transition-colors hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1"
                            >
                              <RotateCw size={16} strokeWidth={2.5} />
                            </button>
                            <button
                              type="button"
                              aria-label="Mark as resolved"
                              className="rounded-md p-1 text-secondary transition-colors hover:bg-secondary/10 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:ring-offset-1"
                            >
                              <CheckCircle2 size={16} strokeWidth={2.5} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* ── Pagination Controls ── */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-[#E5E7EB] dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 transition-colors">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg text-slate-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 hover:shadow-sm border border-transparent hover:border-slate-200 dark:hover:border-gray-700 disabled:opacity-40 disabled:pointer-events-none transition"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .reduce((acc: (number | string)[], p) => {
                  if (p === 1 || p === totalPages || Math.abs(page - p) <= 1) {
                    acc.push(p);
                  } else if (acc[acc.length - 1] !== "…") {
                    acc.push("…");
                  }
                  return acc;
                }, [])
                .map((p, i) =>
                  p === "…" ? (
                    <span key={`e${i}`} className="px-1 text-xs text-slate-400">…</span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setPage(p as number)}
                      className={`w-7 h-7 rounded-lg text-xs font-medium transition ${
                        page === p
                          ? "bg-secondary text-white shadow-sm"
                          : "text-slate-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 hover:shadow-sm border border-transparent hover:border-slate-200 dark:hover:border-gray-700"
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}
            </div>

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg text-slate-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 hover:shadow-sm border border-transparent hover:border-slate-200 dark:hover:border-gray-700 disabled:opacity-40 disabled:pointer-events-none transition"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* ── Details Modal ── */}
      <Modal
        open={!!selectedLog}
        onClose={() => setSelectedLog(null)}
        title="AI Processing Details"
        size="lg"
      >
        {selectedLog && (
          <div className="mt-4 space-y-6 text-sm text-gray-700 dark:text-gray-300 transition-colors">
            <hr className="border-gray-200 dark:border-gray-800 transition-colors" />

            <div className="grid grid-cols-2 gap-y-4 gap-x-6">
              <div><span className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">File name</span><span className="font-semibold text-gray-900 dark:text-white transition-colors">{selectedLog.file_name}</span></div>
              <div><span className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">Document Id</span><span className="font-medium text-gray-900 dark:text-white transition-colors">{selectedLog.details.document.document_id}</span></div>
              <div><span className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">Tender Name</span><span className="font-medium text-gray-900 dark:text-white transition-colors">{selectedLog.project_name || "-"}</span></div>
              <div>
                <span className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">Owner</span>
                <span className="font-medium text-gray-900 dark:text-white transition-colors">
                  {ownerMap.get(selectedLog.details.project.user_owner) || "Unknown"}
                </span>
              </div>
              <div><span className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Processing Stage</span><StageBadge stage={selectedLog.stage} /></div>
              <div><span className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Status</span><StatusBadge status={selectedLog.status} /></div>
            </div>

            <hr className="border-gray-200 dark:border-gray-800 transition-colors" />

            <div>
              <span className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">Division Selected</span>
              <div className="flex flex-wrap gap-2">
                {selectedLog.details.processing.divisions_selected.length > 0
                  ? selectedLog.details.processing.divisions_selected.map(id => {
                      const division = divisionMap.get(id);
                      return (
                        <div key={id} className="bg-black/5 dark:bg-white/5 px-3 py-1 rounded shadow-sm text-sm flex items-center gap-2 w-full">
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#DBEAFE] text-[#1E40AF] dark:bg-blue-900/30 dark:text-blue-400">
                            {division ? `${division.code}` : "Unknown"}
                          </span>
                          <span className="text-[11px] font-bold px-2 py-0.5">
                            {division ? `${division.name}` : "Unknown"}
                          </span>
                        </div>
                      );
                    })
                  : <span className="text-gray-400">-</span>}
              </div>
            </div>
            <hr className="border-gray-200 dark:border-gray-800 transition-colors" />

            <div>
              <span className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">Instruction given</span>
              <span className="font-medium text-gray-900 dark:text-white transition-colors">{selectedLog.details.processing.instructions_given || "-"}</span>
            </div>

            <hr className="border-gray-200 dark:border-gray-800 transition-colors" />

            <div className="grid grid-cols-3 gap-y-4 gap-x-6">
              <div><span className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">Duration</span><span className="font-medium text-gray-900 dark:text-white transition-colors">{selectedLog.duration}</span></div>
              <div><span className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">Output Version</span><span className="font-medium text-gray-900 dark:text-white transition-colors">{selectedLog.details.output.output_version}</span></div>
              <div><span className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">Timestamp</span><span className="font-medium text-gray-900 dark:text-white transition-colors">{selectedLog.timestamp}</span></div>
            </div>

            {/* <hr className="border-gray-200 dark:border-gray-800 transition-colors" /> */}

            {/* <div className="flex items-center gap-4 pt-2">
              <button className="flex-1 rounded-lg bg-secondary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 active:bg-secondary/80">
                View Output
              </button>
              <button className="flex-1 rounded-lg border border-secondary px-4 py-2.5 text-sm font-semibold text-secondary transition-colors hover:bg-secondary/5 focus:outline-none focus:ring-2 focus:ring-secondary/50">
                Review and Fix
              </button>
            </div> */}
          </div>
        )}
      </Modal>
    </div>
  );
}
