"use client";

import { useState } from "react";
import { Filter, ChevronDown, Eye, RotateCw, CheckCircle2, Search } from "lucide-react";
import StaticPage from "@/components/layout/StaticDemoPage";
import { Modal } from "@/components/ui/Modal";

// ─── Types ────────────────────────────────────────────────────────────────────

type LogStage = "Extraction" | "Analysis" | "Output" | "Completed";
type LogStatus = "Success" | "Failed";

interface AILog {
  id: string;
  fileName: string;
  projectName: string;
  stage: LogStage;
  status: LogStatus;
  errorMessage: string | null;
  timestampDate: string;
  timestampTime: string;
  duration: string;
  documentId: string;
  owner: string;
  divisionSelected: string;
  instructionGiven: string;
  outputVersion: string;
}

// ─── Dummy Data ───────────────────────────────────────────────────────────────

const AI_LOGS: AILog[] = [
  {
    id: "1",
    fileName: "Door Schedule Addendum-4582.pdf",
    projectName: "City Mall Tender",
    stage: "Extraction",
    status: "Success",
    errorMessage: null,
    timestampDate: "2026-04-25",
    timestampTime: "14:30:22",
    duration: "12s",
    documentId: "DOC-8942",
    owner: "Akash Madbor",
    divisionSelected: "Division 08 - Doors and Windows",
    instructionGiven: "Extract all door specifications and pricing information",
    outputVersion: "v1.2"
  },
  {
    id: "2",
    fileName: "Door Schedule Addendum-4582.pdf",
    projectName: "Office Fitout",
    stage: "Analysis",
    status: "Success",
    errorMessage: null,
    timestampDate: "2026-04-25",
    timestampTime: "14:30:22",
    duration: "45s",
    documentId: "DOC-8943",
    owner: "Akash Madbor",
    divisionSelected: "Division 09 - Finishes",
    instructionGiven: "Extract all door specifications and pricing information",
    outputVersion: "v1.2"
  },
  {
    id: "3",
    fileName: "Door Schedule Addendum-4582.pdf",
    projectName: "Hotel Renovation",
    stage: "Extraction",
    status: "Failed",
    errorMessage: "PDF parsing error:\ncorrupted file structure",
    timestampDate: "2026-04-25",
    timestampTime: "14:30:22",
    duration: "8s",
    documentId: "DOC-8944",
    owner: "Jane Doe",
    divisionSelected: "Division 08 - Doors and Windows",
    instructionGiven: "Extract all door specifications and pricing information",
    outputVersion: "v1.0"
  },
  {
    id: "4",
    fileName: "Door Schedule Addendum-4582.pdf",
    projectName: "Shopping Center",
    stage: "Output",
    status: "Success",
    errorMessage: null,
    timestampDate: "2026-04-25",
    timestampTime: "14:30:22",
    duration: "23s",
    documentId: "DOC-8945",
    owner: "John Smith",
    divisionSelected: "Division 08 - Doors and Windows",
    instructionGiven: "Extract all door specifications and pricing information",
    outputVersion: "v1.5"
  },
  {
    id: "5",
    fileName: "Door Schedule Addendum-4582.pdf",
    projectName: "School Building",
    stage: "Completed",
    status: "Failed",
    errorMessage: "AI model timeout:exceeded\n60s processin limit",
    timestampDate: "2026-04-25",
    timestampTime: "14:30:22",
    duration: "60s",
    documentId: "DOC-8946",
    owner: "Akash Madbor",
    divisionSelected: "Division 08 - Doors and Windows",
    instructionGiven: "Extract all door specifications and pricing information",
    outputVersion: "v1.1"
  },
  {
    id: "6",
    fileName: "Door Schedule Addendum-4582.pdf",
    projectName: "Residential Complex",
    stage: "Output",
    status: "Success",
    errorMessage: null,
    timestampDate: "2026-04-25",
    timestampTime: "14:30:22",
    duration: "34s",
    documentId: "DOC-8947",
    owner: "Sarah Jane",
    divisionSelected: "Division 08 - Doors and Windows",
    instructionGiven: "Extract all door specifications and pricing information",
    outputVersion: "v1.2"
  }
];

// ─── Status Badges ────────────────────────────────────────────────────────────

function StageBadge({ stage }: { stage: LogStage }) {
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-lg text-[13px] font-semibold whitespace-nowrap bg-[#DCFCE7] dark:bg-[#0082361A] text-[#008236]">
      {stage}
    </span>
  );
}

function StatusBadge({ status }: { status: LogStatus }) {
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
  const [selectedLog, setSelectedLog] = useState<AILog | null>(null);
  
  // Search and filter states
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [projectFilter, setProjectFilter] = useState("All Projects");

  const filteredLogs = AI_LOGS.filter(log => {
    const matchesSearch = search === "" || 
      log.fileName.toLowerCase().includes(search.toLowerCase()) || 
      log.projectName.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === "All Status" || log.status === statusFilter;
    const matchesProject = projectFilter === "All Projects" || log.projectName === projectFilter;
    
    return matchesSearch && matchesStatus && matchesProject;
  });

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
            placeholder="Search by file or project..."
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary shadow-sm transition-colors"
          />
        </div>
        
        <div className="flex items-center gap-3">
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
                className="appearance-none pl-3 pr-8 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary text-sm text-gray-700 dark:text-gray-200 transition-colors cursor-pointer"
            >
                <option value="All Projects">All Projects</option>
                {Array.from(new Set(AI_LOGS.map(log => log.projectName))).map(project => (
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
                {["File Name", "Project Name", "Stage", "Status", "Error Message", "Timestamp", "Duration", "Actions"].map((heading) => (
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
              {filteredLogs.length === 0 ? (
                <tr>
                    <td colSpan={8} className="text-center py-16 text-slate-400 dark:text-gray-500 text-sm">
                        No logs match your filters.
                    </td>
                </tr>
              ) : filteredLogs.map((log) => (
                <tr
                  key={log.id}
                  className="hover:bg-gray-50/50 dark:hover:bg-gray-900/50 transition-colors"
                >
                  <td className="px-6 py-5 text-sm font-medium text-gray-900 dark:text-white whitespace-normal max-w-[180px] transition-colors">
                    {log.fileName}
                  </td>
                  <td className="whitespace-nowrap px-6 py-5 text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors">
                    {log.projectName}
                  </td>
                  <td className="whitespace-nowrap px-6 py-5">
                    <StageBadge stage={log.stage} />
                  </td>
                  <td className="whitespace-nowrap px-6 py-5">
                    <StatusBadge status={log.status} />
                  </td>
                  <td className="px-6 py-5 text-[12px] font-medium whitespace-pre-wrap max-w-[200px]">
                    {log.errorMessage ? (
                      <span className="text-red-400">{log.errorMessage}</span>
                    ) : (
                      <span className="text-red-400">-</span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-6 py-5 text-xs font-medium text-gray-500 dark:text-gray-400 leading-tight transition-colors">
                    <div className="flex flex-col gap-0.5">
                      <span>{log.timestampDate}</span>
                      <span>{log.timestampTime}</span>
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
              ))}
            </tbody>
          </table>
        </div>
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
              <div><span className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">File name</span><span className="font-semibold text-gray-900 dark:text-white transition-colors">{selectedLog.fileName}</span></div>
              <div><span className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">Document Id</span><span className="font-medium text-gray-900 dark:text-white transition-colors">{selectedLog.documentId}</span></div>
              <div><span className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">Project Name</span><span className="font-medium text-gray-900 dark:text-white transition-colors">{selectedLog.projectName}</span></div>
              <div><span className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">Owner</span><span className="font-medium text-gray-900 dark:text-white transition-colors">{selectedLog.owner}</span></div>
              <div><span className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Processing Stage</span><StageBadge stage={selectedLog.stage} /></div>
              <div><span className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Status</span><StatusBadge status={selectedLog.status} /></div>
            </div>
            
            <hr className="border-gray-200 dark:border-gray-800 transition-colors" />
            
            <div>
              <span className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">Division Selected</span>
              <span className="font-medium text-gray-900 dark:text-white transition-colors">{selectedLog.divisionSelected}</span>
            </div>
            
            <hr className="border-gray-200 dark:border-gray-800 transition-colors" />
            
            <div>
              <span className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">Instruction given</span>
              <span className="font-medium text-gray-900 dark:text-white transition-colors">{selectedLog.instructionGiven}</span>
            </div>

            <hr className="border-gray-200 dark:border-gray-800 transition-colors" />

            <div className="grid grid-cols-3 gap-y-4 gap-x-6">
              <div><span className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">Duration</span><span className="font-medium text-gray-900 dark:text-white transition-colors">{selectedLog.duration}</span></div>
              <div><span className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">Output Version</span><span className="font-medium text-gray-900 dark:text-white transition-colors">{selectedLog.outputVersion}</span></div>
              <div><span className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">Timestamp</span><span className="font-medium text-gray-900 dark:text-white transition-colors">{selectedLog.timestampDate} {selectedLog.timestampTime}</span></div>
            </div>

            <hr className="border-gray-200 dark:border-gray-800 transition-colors" />

            <div className="flex items-center gap-4 pt-2">
              <button className="flex-1 rounded-lg bg-secondary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 active:bg-secondary/80">
                View Output
              </button>
              <button className="flex-1 rounded-lg border border-secondary px-4 py-2.5 text-sm font-semibold text-secondary transition-colors hover:bg-secondary/5 focus:outline-none focus:ring-2 focus:ring-secondary/50">
                Review and Fix
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
