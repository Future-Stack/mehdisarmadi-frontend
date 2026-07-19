"use client";

import { useState, useRef } from "react";
import { Eye, Download, Upload, GitCompare, File } from "lucide-react";
import StaticPage from "@/components/layout/StaticDemoPage";
import { Modal } from "@/components/ui/Modal";

// ─── Types ────────────────────────────────────────────────────────────────────

type AddendumStatus = "Original" | "Addendum";

interface Addendum {
  id: number;
  projectName: string;
  addendumNumber: string;
  fileName: string;
  uploadDate: string;
  status: AddendumStatus;
  revisedFrom: string;
  changesDetected: number | null;
}

// ─── Dummy Data ───────────────────────────────────────────────────────────────

const ADDENDA: Addendum[] = [
  {
    id: 1,
    projectName: "City Mall Tender",
    addendumNumber: "Original",
    fileName: "Door Schedule Original.pdf",
    uploadDate: "2026-03-15",
    status: "Original",
    revisedFrom: "-",
    changesDetected: null,
  },
  {
    id: 2,
    projectName: "Office Fitout",
    addendumNumber: "Addendum 01",
    fileName: "Door Schedule Original.pdf",
    uploadDate: "2026-03-15",
    status: "Addendum",
    revisedFrom: "Original",
    changesDetected: 12,
  },
  {
    id: 3,
    projectName: "Complex",
    addendumNumber: "Addendum 02",
    fileName: "Door Schedule Original.pdf",
    uploadDate: "2026-03-15",
    status: "Addendum",
    revisedFrom: "Addendum 01",
    changesDetected: null,
  },
  {
    id: 4,
    projectName: "Hotel Renovation",
    addendumNumber: "Original",
    fileName: "Door Schedule Original.pdf",
    uploadDate: "2026-03-15",
    status: "Original",
    revisedFrom: "-",
    changesDetected: 8,
  },
  {
    id: 5,
    projectName: "Shopping Center",
    addendumNumber: "Addendum 01",
    fileName: "Door Schedule Original.pdf",
    uploadDate: "2026-03-15",
    status: "Addendum",
    revisedFrom: "Original",
    changesDetected: null,
  },
  {
    id: 6,
    projectName: "School Building",
    addendumNumber: "Addendum 01",
    fileName: "Door Schedule Original.pdf",
    uploadDate: "2026-03-15",
    status: "Addendum",
    revisedFrom: "Addendum 01",
    changesDetected: 5,
  },
];

// ─── Status Badges ────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<AddendumStatus, string> = {
  Original: "bg-[#DBEAFE] text-[#1E40AF]", // Light blue
  Addendum: "bg-[#DCFCE7] text-[#166534]", // Light green
};

function StatusBadge({ status }: { status: AddendumStatus }) {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-lg text-[13px] font-semibold whitespace-nowrap ${STATUS_STYLES[status]}`}
    >
      {status}
    </span>
  );
}

function ChangesBadge({ changes }: { changes: number | null }) {
  if (changes === null) return <span className="text-gray-900 dark:text-gray-400 font-medium">-</span>;
  
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-lg text-[13px] font-semibold whitespace-nowrap bg-[#FEF9C3] text-[#A16207] dark:bg-yellow-900/30 dark:text-yellow-400">
      {String(changes).padStart(2, '0')} changes
    </span>
  );
}

// ─── Table Headings ───────────────────────────────────────────────────────────

const TABLE_HEADINGS = [
  "Tender Name",
  "Addendum Number",
  "File Name",
  "Upload Date",
  "Status",
  "Revised From",
  "Changes Detected",
  "Actions",
];

// ─── Component ────────────────────────────────────────────────────────────────

interface AddendaManagementProps {
  title?: string;
  description?: string;
}

export default function AddendaManagement({ 
  title = "Addenda Management", 
  description = "Track original documents and addenda revisions" 
}: AddendaManagementProps) {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<globalThis.File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <StaticPage title={title!} description={description!} />

        <button
          type="button"
          onClick={() => setIsUploadModalOpen(true)}
          className="inline-flex items-center gap-2 self-start rounded-lg bg-secondary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 active:bg-secondary/80"
        >
          <Upload size={16} strokeWidth={2.5} />
          Upload Addendum
        </button>
      </div>

      {/* ── Table Card ── */}
      <div className="card-premium overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
                {TABLE_HEADINGS.map((heading) => (
                  <th
                    key={heading}
                    scope="col"
                    className="whitespace-nowrap px-6 py-4 text-left text-[12px] font-bold uppercase tracking-tight text-[#968C8C] dark:text-gray-500"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50 dark:divide-gray-800 transition-colors">
              {ADDENDA.map((addendum) => (
                <tr
                  key={addendum.id}
                  className="hover:bg-gray-50/50 dark:hover:bg-gray-900/50 transition-colors"
                >
                  <td className="whitespace-nowrap px-6 py-5 text-sm font-semibold text-gray-900 dark:text-white transition-colors">
                    {addendum.projectName}
                  </td>
                  <td className="whitespace-nowrap px-6 py-5 text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors">
                    {addendum.addendumNumber}
                  </td>
                  <td className="px-6 py-5 text-sm font-medium text-gray-500 dark:text-gray-400 whitespace-normal min-w-[150px] transition-colors">
                    {addendum.fileName}
                  </td>
                  <td className="whitespace-nowrap px-6 py-5 text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors">
                    {addendum.uploadDate}
                  </td>
                  <td className="whitespace-nowrap px-6 py-5">
                    <StatusBadge status={addendum.status} />
                  </td>
                  <td className="whitespace-nowrap px-6 py-5 text-sm font-medium text-gray-900 dark:text-white transition-colors">
                    {addendum.revisedFrom}
                  </td>
                  <td className="whitespace-nowrap px-6 py-5">
                    <ChangesBadge changes={addendum.changesDetected} />
                  </td>
                  <td className="whitespace-nowrap px-6 py-5">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        aria-label={`View ${addendum.projectName}`}
                        className="rounded-md p-1 text-secondary transition-colors hover:bg-secondary/10 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:ring-offset-1"
                      >
                        <Eye size={18} strokeWidth={2} />
                      </button>
                      <button
                        type="button"
                        aria-label={`Compare ${addendum.projectName}`}
                        className="rounded-md p-1 text-[#3b82f6] transition-colors hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1"
                      >
                        <GitCompare size={18} strokeWidth={2} />
                      </button>
                      <button
                        type="button"
                        aria-label={`Download ${addendum.projectName}`}
                        className="rounded-md p-1 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1"
                      >
                        <Download size={18} strokeWidth={2} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Upload Modal ── */}
      <Modal
        open={isUploadModalOpen}
        onClose={() => {
          setIsUploadModalOpen(false);
          setSelectedFile(null);
        }}
        title="Upload Addendum"
        size="md"
      >
        <hr className="mb-4 border-gray-200" />
        <div className="space-y-5 text-sm text-gray-700 dark:text-gray-300">
          <div className="space-y-1.5">
            <label className="block font-semibold text-gray-900 dark:text-white">Tender</label>
            <select className="w-full rounded-lg border border-gray-200 dark:border-gray-800 p-2.5 text-sm focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-all bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200">
              <option value="" disabled selected>Select a tender</option>
              <option>City Mall Tender</option>
              <option>Office Fitout</option>
              <option>Complex</option>
              <option>Hotel Renovation</option>
            </select>
          </div>
          
          <div className="space-y-1.5">
            <label className="block font-semibold text-gray-900 dark:text-white">Addendum Type</label>
            <select className="w-full rounded-lg border border-gray-200 dark:border-gray-800 p-2.5 text-sm focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-all bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200">
              <option value="" disabled selected>Select a type</option>
              <option>Documents</option>
              <option>Drawings</option>
              <option>Specifications</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block font-semibold text-gray-900 dark:text-white">Upload file</label>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
            />
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl p-8 bg-gray-50/50 dark:bg-gray-900/50 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer group"
            >
              {selectedFile ? (
                <>
                  <File className="w-8 h-8 text-secondary mb-3 transition-colors" />
                  <p className="text-gray-900 dark:text-white font-semibold text-center">{selectedFile.name}</p>
                  <p className="text-xs text-gray-400 mt-1">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                </>
              ) : (
                <>
                  <Upload className="w-8 h-8 text-gray-400 group-hover:text-secondary mb-3 transition-colors" />
                  <p className="text-gray-600 dark:text-gray-400 font-medium">
                    <span className="text-secondary hover:underline">Click to upload</span> or Drag and drop
                  </p>
                  <p className="text-xs text-gray-400 mt-1">PDF, DOC, DOCX up to 10MB</p>
                </>
              )}
            </div>
          </div>

          <div className="pt-2">
            <button className="w-full rounded-lg bg-secondary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 active:bg-secondary/80">
              Upload
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
