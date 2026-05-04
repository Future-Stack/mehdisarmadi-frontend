"use client";

import { useState } from "react";
import { FileText, Edit2, Copy, Trash2, Plus, ChevronDown } from "lucide-react";
import StaticPage from "@/components/layout/StaticDemoPage";
import { Modal } from "@/components/ui/Modal";

// ─── Types ────────────────────────────────────────────────────────────────────

interface QuoteTemplate {
  id: string;
  title: string;
  subtitle: string;
  sections: string[];
  createdDate: string;
  isDefault?: boolean;
}

// ─── Dummy Data ───────────────────────────────────────────────────────────────

const QUOTE_TEMPLATES: QuoteTemplate[] = [
  {
    id: "1",
    title: "Standard Quote Template",
    subtitle: "Standard",
    sections: ["Cover Page", "Executive Summary", "Terms", "Pricing", "Scope of Work"],
    createdDate: "2026-01-15",
    isDefault: true,
  },
  {
    id: "2",
    title: "Division-Based Template",
    subtitle: "Section-Based",
    sections: ["Division 08", "Division 09", "Division 15", "Division 16"],
    createdDate: "2026-01-15",
    isDefault: false,
  },
  {
    id: "3",
    title: "Quick Summary Template",
    subtitle: "Summary",
    sections: ["Executive Summary", "Total Pricing", "Timeline"],
    createdDate: "2026-01-15",
    isDefault: false,
  }
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function QuoteTemplates() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<QuoteTemplate | null>(null);

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <StaticPage 
          title="Quote Templates" 
          description="Manage quote templates and branding" 
        />
        <button
          type="button"
          onClick={() => {
            setEditingTemplate(null);
            setIsCreateModalOpen(true);
          }}
          className="inline-flex items-center gap-2 self-start rounded-lg bg-secondary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 active:bg-secondary/80"
        >
          <Plus size={16} strokeWidth={2.5} />
          Create Template
        </button>
      </div>

      {/* ── Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
        {QUOTE_TEMPLATES.map((template) => (
          <div 
            key={template.id} 
            className={`card-premium p-6 flex flex-col h-full bg-white dark:bg-gray-900 relative transition-all ${
              template.isDefault 
                ? "border-[2px] border-secondary shadow-md" 
                : "border border-gray-200 dark:border-gray-800"
            }`}
          >
            {/* Top Row: Icon & Badge */}
            <div className="flex items-center justify-between mb-4">
              <FileText className="w-7 h-7 text-secondary" strokeWidth={2.5} />
              {template.isDefault && (
                <span className="inline-flex items-center px-3 py-1 rounded text-[12px] font-bold tracking-wide bg-[#DCFCE7] text-[#166534] dark:bg-green-900/30 dark:text-green-400 transition-colors">
                  Default
                </span>
              )}
            </div>

            {/* Title & Subtitle */}
            <div className="mb-6">
              <h3 className="text-[17px] font-bold text-gray-900 dark:text-white mb-1.5 tracking-tight transition-colors">{template.title}</h3>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors">{template.subtitle}</p>
            </div>

            {/* Sections */}
            <div className="flex-1 mb-8">
              <p className="text-[13px] font-medium text-gray-500 dark:text-gray-400 mb-3 transition-colors">Sections:</p>
              <div className="flex flex-wrap gap-2">
                {template.sections.map((section, idx) => (
                  <span 
                    key={idx} 
                    className="inline-flex items-center px-2.5 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-[12px] font-semibold text-gray-600 dark:text-gray-300 transition-colors"
                  >
                    {section}
                  </span>
                ))}
              </div>
            </div>

            {/* Created Date */}
            <p className="text-[13px] font-medium text-gray-400 mb-6">
              Created: {template.createdDate}
            </p>

            {/* Actions Footer */}
            <div className="flex items-center gap-2 mt-auto">
              <button 
                onClick={() => {
                  setEditingTemplate(template);
                  setIsCreateModalOpen(true);
                }}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-800 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
              <button 
                aria-label="Duplicate template"
                className="flex items-center justify-center p-2.5 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200"
              >
                <Copy className="w-4 h-4" />
              </button>
              {!template.isDefault && (
                <button 
                  aria-label="Delete template"
                  className="flex items-center justify-center p-2.5 rounded-lg border border-red-200 dark:border-red-900/30 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors focus:outline-none focus:ring-2 focus:ring-red-200"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ── Create/Edit Template Modal ── */}
      <Modal
        open={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingTemplate(null);
        }}
        title={editingTemplate ? "Edit Template" : "Create Template"}
        size="md"
      >
        <div className="mt-6 space-y-6">
          {/* Template Name */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Template Name</label>
            <input 
              type="text" 
              defaultValue={editingTemplate ? editingTemplate.title : ""}
              placeholder="e.g standard Quote Template"
              className="w-full rounded-lg border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-colors"
            />
          </div>

          {/* Template Type */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Template Type</label>
            <div className="relative">
              <select className="w-full appearance-none rounded-lg border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-colors cursor-pointer">
                <option>Standard Template</option>
                <option>Division-Based Template</option>
                <option>Summary Template</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Company Logo */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Company Logo</label>
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl p-6 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer group">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-0.5 transition-colors">Upload company logo</p>
              <p className="text-xs text-gray-400 transition-colors">PNG, JPG (max 2MB)</p>
            </div>
          </div>

          {/* Header Color */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Header Color</label>
            <div className="relative rounded-lg border border-gray-300 dark:border-gray-800 p-1 bg-white dark:bg-gray-900 overflow-hidden flex items-center h-[46px] transition-colors">
              <input 
                type="color" 
                defaultValue="#008236"
                className="w-full h-full cursor-pointer rounded bg-transparent border-none p-0 outline-none block"
              />
            </div>
          </div>

          {/* Sections to Include */}
          <div className="space-y-3 pt-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Sections to Include</label>
            {[
              "Cover Page",
              "Executive Summary",
              "Scope of Work",
              "Pricing",
              "Terms",
              "Exclusions",
              "Assumptions"
            ].map((section, idx) => (
              <label key={idx} className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  defaultChecked={editingTemplate ? editingTemplate.sections.includes(section) : true}
                  className="w-5 h-5 rounded-[4px] border-gray-300 dark:border-gray-800 text-secondary focus:ring-secondary/50 accent-secondary transition-colors cursor-pointer"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                  {section}
                </span>
              </label>
            ))}
          </div>

          {/* Update Button */}
          <div className="pt-4">
            <button className="w-full rounded-lg bg-secondary px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 active:bg-secondary/80">
              {editingTemplate ? "Update Template" : "Create Template"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
