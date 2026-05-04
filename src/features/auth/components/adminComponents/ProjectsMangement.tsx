"use client";

import { useState } from "react";
import { Eye } from "lucide-react";
import StaticPage from "@/components/layout/StaticDemoPage";
import { Modal } from "@/components/ui/Modal";

// ─── Types ────────────────────────────────────────────────────────────────────

type ProjectStatus = "Completed" | "Processing" | "Failed";

interface Project {
  id: number;
  name: string;
  owner: string;
  filesCount: number;
  addendaCount: number;
  status: ProjectStatus;
  lastActivity: string;
  createdDate: string;
}

// ─── Static Data ──────────────────────────────────────────────────────────────

const PROJECTS: Project[] = [
  {
    id: 1,
    name: "City Mall Tender",
    owner: "John Smith",
    filesCount: 12,
    addendaCount: 12,
    status: "Completed",
    lastActivity: "2 hours ago",
    createdDate: "2026-03-15",
  },
  {
    id: 2,
    name: "Office Fitout",
    owner: "Sarah Johnson",
    filesCount: 8,
    addendaCount: 8,
    status: "Processing",
    lastActivity: "30 minutes ago",
    createdDate: "2026-03-15",
  },
  {
    id: 3,
    name: "Complex",
    owner: "Mike Wilson",
    filesCount: 15,
    addendaCount: 15,
    status: "Completed",
    lastActivity: "1 day ago",
    createdDate: "2026-03-15",
  },
  {
    id: 4,
    name: "Hotel Renovation",
    owner: "Mike Wilson",
    filesCount: 5,
    addendaCount: 5,
    status: "Failed",
    lastActivity: "3 hours ago",
    createdDate: "2026-03-15",
  },
  {
    id: 5,
    name: "Shopping Center",
    owner: "David Brown",
    filesCount: 10,
    addendaCount: 10,
    status: "Processing",
    lastActivity: "1 hour ago",
    createdDate: "2026-03-15",
  },
  {
    id: 6,
    name: "School Building",
    owner: "John Smith",
    filesCount: 20,
    addendaCount: 20,
    status: "Completed",
    lastActivity: "1 hour ago",
    createdDate: "2026-03-15",
  },
];

// ─── Status Badge ─────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<ProjectStatus, string> = {
  Completed: "bg-[#DDFFEB] text-[#008236]",
  Processing: "bg-[#FFFADA] text-[#92400E]",
  Failed: "bg-[#FEE2E2] text-[#991B1B]",
};

function StatusBadge({ status }: { status: ProjectStatus }) {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-semibold whitespace-nowrap ${STATUS_STYLES[status]}`}
    >
      {status}
    </span>
  );
}

// ─── Table Headings ───────────────────────────────────────────────────────────

const TABLE_HEADINGS = [
  "Project Name",
  "Owner",
  "Files Count",
  "Addenda Count",
  "Status",
  "Last Activity",
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
  description = "Manage user accounts, roles, and permissions" 
}: ProjectsManagementProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col">
        <StaticPage title={title!} description={description!} />
      </div>

      {/* ── Table Card ── */}
      <div className="card-premium overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 transition-colors">
                {TABLE_HEADINGS.map((heading) => (
                  <th
                    key={heading}
                    scope="col"
                    className="whitespace-nowrap px-6 py-4 text-left text-[12px] font-bold uppercase tracking-tight text-[#968C8C] dark:text-gray-500 transition-colors"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50 dark:divide-gray-800 transition-colors">
              {PROJECTS.map((project) => (
                <tr
                  key={project.id}
                  className="hover:bg-gray-50/50 dark:hover:bg-gray-900/50 transition-colors"
                >
                  <td className="whitespace-nowrap px-6 py-5 text-sm font-semibold text-gray-900 dark:text-white transition-colors">
                    {project.name}
                  </td>
                  <td className="whitespace-nowrap px-6 py-5 text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors">
                    {project.owner}
                  </td>
                  <td className="whitespace-nowrap px-6 py-5 text-center text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors">
                    {String(project.filesCount).padStart(2, "0")}
                  </td>
                  <td className="whitespace-nowrap px-6 py-5 text-center text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors">
                    {String(project.addendaCount).padStart(2, "0")}
                  </td>
                  <td className="whitespace-nowrap px-6 py-5">
                    <StatusBadge status={project.status} />
                  </td>
                  <td className="whitespace-nowrap px-6 py-5 text-sm font-medium text-[#968C8C] dark:text-gray-500 transition-colors">
                    {project.lastActivity}
                  </td>
                  <td className="whitespace-nowrap px-6 py-5 text-sm font-medium text-[#968C8C] dark:text-gray-500 transition-colors">
                    {project.createdDate}
                  </td>
                  <td className="whitespace-nowrap px-6 py-5">
                    <button
                      type="button"
                      aria-label={`View ${project.name}`}
                      onClick={() => setSelectedProject(project)}
                      className="rounded-md p-1 text-secondary transition-colors hover:bg-secondary/10 hover:text-secondary focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:ring-offset-1"
                    >
                      <Eye size={18} strokeWidth={2} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
              <div><span className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">Owner</span><span className="font-medium text-gray-900 dark:text-white transition-colors">{selectedProject.owner}</span></div>
              <div><span className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">Files count</span><span className="font-medium text-gray-900 dark:text-white transition-colors">{selectedProject.filesCount}</span></div>
              <div><span className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">Addenda Count</span><span className="font-medium text-gray-900 dark:text-white transition-colors">{selectedProject.addendaCount}</span></div>
              <div><span className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Status</span><StatusBadge status={selectedProject.status} /></div>
              <div><span className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Analysis Status</span><span className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-semibold whitespace-nowrap bg-[#FFFADA] text-[#92400E] dark:bg-yellow-900/30 dark:text-yellow-400 transition-colors">Pending</span></div>
              <div><span className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Quote Draft</span><span className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-semibold whitespace-nowrap bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300 transition-colors">No</span></div>
              <div><span className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">Created Date</span><span className="font-medium text-gray-900 dark:text-white transition-colors">{selectedProject.createdDate}</span></div>
              <div><span className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">Last Activity</span><span className="font-medium text-gray-900 dark:text-white transition-colors">{selectedProject.lastActivity}</span></div>
            </div>
            
            <hr className="border-gray-200" />
            
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">Uploaded Files</h3>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                  <div className="flex items-center justify-center w-8 h-8 rounded bg-red-100 dark:bg-red-950/30 text-red-500 font-bold text-[10px]">PDF</div>
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">architectural_drawings.pdf</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                  <div className="flex items-center justify-center w-8 h-8 rounded bg-blue-100 dark:bg-blue-950/30 text-blue-500 font-bold text-[10px]">DOCX</div>
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">structural_specifications.docx</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                  <div className="flex items-center justify-center w-8 h-8 rounded bg-blue-100 dark:bg-blue-950/30 text-blue-500 font-bold text-[10px]">DOC</div>
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">client_requirements_v2.doc</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}