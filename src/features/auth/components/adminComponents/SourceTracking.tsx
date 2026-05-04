"use client";

import { Search, ChevronDown, FileText } from "lucide-react";
import StaticPage from "@/components/layout/StaticDemoPage";

// ─── Types ────────────────────────────────────────────────────────────────────

interface MappedSection {
  title: string;
  pages: string;
}

interface SourceDocument {
  id: string;
  fileName: string;
  type: string;
  typeColor: string; // Tailwind class for the badge
  projectName: string;
  date: string;
  mappedSections: MappedSection[];
}

// ─── Dummy Data ───────────────────────────────────────────────────────────────

const SOURCE_DOCUMENTS: SourceDocument[] = [
  {
    id: "1",
    fileName: "Door_Schedule_Addendum_02.pdf",
    type: "Addendum",
    typeColor: "bg-[#DCFCE7] text-[#166534]", // Green
    projectName: "City Mall Tender",
    date: "2026-03-25",
    mappedSections: [
      { title: "Division 08 - Doors & Windows", pages: "Pages: 1-5, 12-15" },
      { title: "Division 09 - Finishes", pages: "Pages: 6-11" },
    ]
  },
  {
    id: "2",
    fileName: "Architectural_Drawings_A1-A20.pdf",
    type: "Drawing",
    typeColor: "bg-[#DBEAFE] text-[#1E40AF]", // Blue
    projectName: "Office Fitout",
    date: "2026-04-01",
    mappedSections: [
      { title: "Floor Plans", pages: "Pages: A1-A5" },
      { title: "Elevations", pages: "Pages: A6-A12" },
      { title: "Details", pages: "Pages: A13-A20" },
    ]
  },
  {
    id: "3",
    fileName: "Technical_Specifications.pdf",
    type: "Spec",
    typeColor: "bg-[#F3E8FF] text-[#6B21A8]", // Purple
    projectName: "Residential Complex",
    date: "2026-02-20",
    mappedSections: []
  }
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function SourceTracking() {
  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <StaticPage 
          title="Source Tracking System" 
          description="Track and verify AI output against source documents" 
        />
        {/* Upload button specifically omitted per user request */}
      </div>

      {/* ── Search & Filter Bar ── */}
      <div className="flex flex-col sm:flex-row gap-4 pt-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors" />
          <input 
            type="text"
            placeholder="Search by file name or project..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all text-sm text-gray-900 dark:text-white placeholder:text-gray-400"
          />
        </div>
        <div className="relative sm:w-[180px]">
          <select className="w-full appearance-none px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary text-sm text-gray-600 dark:text-gray-200 transition-colors cursor-pointer">
            <option>All Types</option>
            <option>Addendum</option>
            <option>Drawing</option>
            <option>Spec</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
        </div>
      </div>

      {/* ── Document List ── */}
      <div className="space-y-4">
        {SOURCE_DOCUMENTS.map((doc) => (
          <div key={doc.id} className="card-premium overflow-hidden bg-white dark:bg-gray-900 p-6 transition-colors border border-gray-100 dark:border-gray-800">
            <div className="flex items-start gap-4">
              <FileText className="w-6 h-6 text-secondary mt-1 shrink-0" />
              <div className="flex-1">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight transition-colors">{doc.fileName}</h2>
                <div className="flex flex-wrap items-center gap-2 mt-2 text-[13px] text-gray-500 dark:text-gray-400 transition-colors">
                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold transition-colors ${doc.typeColor.includes('bg-[#DCFCE7]') ? 'dark:bg-green-900/30 dark:text-green-400' : doc.typeColor.includes('bg-[#DBEAFE]') ? 'dark:bg-blue-900/30 dark:text-blue-400' : 'dark:bg-purple-900/30 dark:text-purple-400'} ${doc.typeColor}`}>
                    {doc.type}
                  </span>
                  <span>{doc.projectName}</span>
                  <span className="text-gray-300 dark:text-gray-700">•</span>
                  <span>{doc.date}</span>
                </div>

                {doc.mappedSections.length > 0 && (
                  <div className="mt-8">
                    <p className="text-[13px] text-gray-500 dark:text-gray-400 font-medium mb-3 transition-colors">Mapped Sections:</p>
                    <div className="space-y-1.5">
                      {doc.mappedSections.map((section, idx) => (
                        <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-lg bg-gray-50/80 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                          <span className="font-medium text-gray-700 dark:text-gray-200 text-sm transition-colors">{section.title}</span>
                          <span className="text-[13px] font-medium text-gray-500 dark:text-gray-400 transition-colors">{section.pages}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <button className="px-4 py-2 rounded-md border border-gray-200 dark:border-gray-800 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200">
                    View Document
                  </button>
                  <button className="px-4 py-2 rounded-md border border-secondary text-sm font-semibold text-secondary hover:bg-secondary/5 transition-colors focus:outline-none focus:ring-2 focus:ring-secondary/50">
                    Verify AI Output
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
