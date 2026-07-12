"use client";

import { useState } from "react";
import { Eye, Search, Filter, ChevronLeft, ChevronRight, Loader } from "lucide-react";
import StaticPage from "@/components/layout/StaticDemoPage";
import { Modal } from "@/components/ui/Modal";
import { useGetProjectsQuery } from "@/store/api/projectApi";

// ─── Types ────────────────────────────────────────────────────────────────────

type ProjectStatus = "Completed" | "Processing" | "Failed" | string;

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: ProjectStatus }) {
  let styles = "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300";
  const s = status?.toLowerCase() || "";
  
  if (s === "completed" || s === "done") {
    styles = "bg-[#DDFFEB] dark:bg-[#0082361A] text-[#008236]";
  } else if (s === "processing" || s === "pending") {
    styles = "bg-[#FFFADA] dark:bg-[#92400E1A] text-[#92400E]";
  } else if (s === "failed" || s === "error") {
    styles = "bg-[#FEE2E2] dark:bg-[#E7000B1A] text-[#991B1B]";
  }

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-semibold whitespace-nowrap ${styles}`}
    >
      {status || "Unknown"}
    </span>
  );
}

// ─── Table Headings ───────────────────────────────────────────────────────────

const TABLE_HEADINGS = [
  "#",
  "Project Name",
  "Owner",
  "Files Count",
  "Addenda Count",
  "Status",
  "Created Date",
  "Actions",
];

// ─── Main Component ───────────────────────────────────────────────────────────

interface ProjectsManagementProps {
  title?: string;
  description?: string;
}

export default function ProjectsManagement({ 
  title = "Projects Management", 
  description = "Manage and track all user projects" 
}: ProjectsManagementProps) {
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const limit = 10;

  const { data, isLoading, isFetching } = useGetProjectsQuery({
    page,
    limit,
    search,
    status: statusFilter !== "All" ? statusFilter : "",
  });

  const projects = data?.data?.items || [];
  const totalPages = data?.data?.totalPages || 1;
  const total = data?.data?.total || 0;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  };

  return (
    <div className="space-y-6 min-h-screen bg-slate-50 dark:bg-[#0B0F1A]">
      {/* ── Header ── */}
      <div className="flex flex-col">
        <StaticPage title={title!} description={description!} />
      </div>

      {/* ── Toolbar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <form onSubmit={handleSearch} className="relative w-full max-w-lg">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <Search className="w-4 h-4"/>
          </span>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              if (e.target.value.trim() === "") {
                setPage(1);
                setSearch("");
              }
            }}
            placeholder="Search projects…"
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-[#D1D5DC] dark:border-gray-700 bg-white dark:bg-gray-900 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent shadow-sm transition"
          />
        </form>

        <div className="flex items-center gap-3">
          <div className="relative">
            <select 
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="appearance-none pl-4 pr-10 py-2 rounded-xl border border-[#D1D5DC] dark:border-gray-700 bg-white dark:bg-gray-900 text-sm font-medium text-slate-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent shadow-sm transition cursor-pointer"
            >
              <option value="">All Statuses</option>
              <option value="Completed">Completed</option>
              <option value="Processing">Processing</option>
              <option value="Failed">Failed</option>
            </select>
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
          </div>
          {total > 0 && (
            <p className="text-xs text-slate-400 shrink-0">
                {total} project{total !== 1 ? "s" : ""}
            </p>
          )}
        </div>
      </div>

      {/* ── Table Card ── */}
      <div className="bg-white dark:bg-[#101828] rounded-2xl border border-[#E5E7EB] dark:border-gray-800 shadow-sm ring-1 ring-slate-200 dark:ring-gray-800 overflow-hidden mt-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800 bg-slate-50/60 dark:bg-gray-900/50 transition-colors">
                {TABLE_HEADINGS.map((heading) => (
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

            <tbody className="divide-y divide-gray-50 dark:divide-gray-800 transition-colors">
              {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i}>
                          {[40, 140, 100, 80, 80, 100, 100, 60].map((w, j) => (
                              <td key={j} className="px-6 py-5">
                                  <div className="h-3.5 rounded-full bg-slate-100 dark:bg-gray-800 animate-pulse" style={{ width: w }} />
                              </td>
                          ))}
                      </tr>
                  ))
              ) : projects.length === 0 ? (
                  <tr>
                      <td colSpan={8} className="text-center py-16 text-slate-400 dark:text-gray-500 text-sm">
                          {search ? `No projects match "${search}".` : "No projects found."}
                      </td>
                  </tr>
              ) : (
                projects.map((project: any, idx: number) => (
                  <tr
                    key={project.id}
                    className={`hover:bg-gray-50/50 dark:hover:bg-gray-900/50 transition-colors ${isFetching ? "opacity-60" : ""}`}
                  >
                    <td className="whitespace-nowrap px-6 py-5 text-sm font-medium text-slate-400 transition-colors">
                      {(page - 1) * limit + idx + 1}
                    </td>
                    <td className="whitespace-nowrap px-6 py-5 text-sm font-semibold text-gray-900 dark:text-white transition-colors">
                      {project.name}
                    </td>
                    <td className="whitespace-nowrap px-6 py-5 text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors">
                      {project.clientName || project.owner || "Unknown"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-5 text-center text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors">
                      {String(project.fileCount || project.filesCount || 0).padStart(2, "0")}
                    </td>
                    <td className="whitespace-nowrap px-6 py-5 text-center text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors">
                      {String(project.addendumFileCount || project.addendaCount || 0).padStart(2, "0")}
                    </td>
                    <td className="whitespace-nowrap px-6 py-5">
                      <StatusBadge status={project.statusLabel || project.status} />
                    </td>
                    <td className="whitespace-nowrap px-6 py-5 text-sm font-medium text-[#968C8C] dark:text-gray-500 transition-colors">
                      {new Date(project.createdAt || project.createdDate).toLocaleDateString()}
                    </td>
                    <td className="whitespace-nowrap px-6 py-5">
                      <button
                        type="button"
                        aria-label={`View ${project.name}`}
                        onClick={() => setSelectedProject(project)}
                        className="rounded-md p-1.5 text-secondary dark:text-emerald-500 transition-colors hover:bg-secondary/10 dark:hover:bg-emerald-900/30 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:ring-offset-1"
                      >
                        <Eye size={18} strokeWidth={2} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-3.5 border-t border-slate-100 dark:border-gray-800 bg-slate-50/40 dark:bg-gray-900/40">
                <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg text-slate-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 hover:shadow-sm border border-transparent hover:border-slate-200 dark:hover:border-gray-700 disabled:opacity-40 disabled:pointer-events-none transition"
                >
                    <ChevronLeft className="w-4 h-4"/> Previous
                </button>

                <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                        .reduce<(number | "…")[]>((acc, p, i, arr) => {
                            if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("…");
                            acc.push(p);
                            return acc;
                        }, [])
                        .map((p, i) =>
                            p === "…" ? (
                                <span key={`e${i}`} className="px-1 text-xs text-slate-400">…</span>
                            ) : (
                                <button
                                    key={p}
                                    onClick={() => setPage(p as number)}
                                    className={`w-7 h-7 rounded-lg text-xs font-medium transition ${page === p
                                        ? "bg-indigo-600 dark:bg-emerald-600 text-white shadow-sm"
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
                    Next <ChevronRight className="w-4 h-4"/>
                </button>
            </div>
        )}
      </div>

      {/* ── Details Modal ── */}
      <Modal
        open={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        title="Project Details"
        size="lg"
      >
        {selectedProject && (
          <div className="mt-4 space-y-6 text-sm text-gray-700 dark:text-gray-300">
            <div className="grid grid-cols-2 gap-y-4 gap-x-6">
              <div><span className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">Project Name</span><span className="font-semibold text-gray-900 dark:text-white transition-colors">{selectedProject.name}</span></div>
              <div><span className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">Owner / Client</span><span className="font-medium text-gray-900 dark:text-white transition-colors">{selectedProject.clientName || selectedProject.owner || "Unknown"}</span></div>
              <div><span className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">Files count</span><span className="font-medium text-gray-900 dark:text-white transition-colors">{selectedProject.fileCount || 0}</span></div>
              <div><span className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">Addenda Count</span><span className="font-medium text-gray-900 dark:text-white transition-colors">{selectedProject.addendumFileCount || 0}</span></div>
              <div><span className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Status</span><StatusBadge status={selectedProject.statusLabel || selectedProject.status} /></div>
              <div><span className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">Created Date</span><span className="font-medium text-gray-900 dark:text-white transition-colors">{new Date(selectedProject.createdAt || selectedProject.createdDate).toLocaleDateString()}</span></div>
              
              {selectedProject.address && (
                <div className="col-span-2"><span className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">Address</span><span className="font-medium text-gray-900 dark:text-white transition-colors">{selectedProject.address}</span></div>
              )}
              {selectedProject.description && (
                <div className="col-span-2"><span className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">Description</span><span className="font-medium text-gray-900 dark:text-white transition-colors">{selectedProject.description}</span></div>
              )}
            </div>
            
            <hr className="border-gray-200 dark:border-gray-800" />
            
            <div className="flex justify-end gap-2">
                <button
                    onClick={() => setSelectedProject(null)}
                    className="px-4 py-2 text-sm font-medium rounded-lg bg-slate-100 dark:bg-gray-800 text-slate-700 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-gray-700 transition-colors"
                >
                    Close
                </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}