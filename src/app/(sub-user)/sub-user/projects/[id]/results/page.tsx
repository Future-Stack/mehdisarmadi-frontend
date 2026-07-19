"use client";

import React, { useState, useRef } from "react";
import { ArrowLeft, Download, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useGetProjectSummaryQuery } from "@/store/api/projectApi";
import SummaryTab from "@/features/projects/components/analysis/SummaryTab";
import ScopeTab from "@/features/projects/components/analysis/ScopeTab";
import PricingTab from "@/features/projects/components/analysis/PricingTab";
import RisksTab from "@/features/projects/components/analysis/RisksTab";
import ClarificationsTab from "@/features/projects/components/analysis/ClarificationsTab";
import AssumptionsTab from "@/features/projects/components/analysis/AssumptionsTab";
import ExclusionsTab from "@/features/projects/components/analysis/ExclusionsTab";
import AddendaTab from "@/features/projects/components/analysis/AddendaTab";
import AnalysisExportView from "@/features/projects/components/analysis/AnalysisExportView";
import { exportAnalysisPDF } from "@/features/projects/utils/exportUtils";
import { toast } from "sonner";

const TABS = ["Summary", "Scope", "Pricing", "Risks", "Clarifications", "Assumptions", "Exclusions", "Addenda"];

export default function AIAnalysisResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [activeTab, setActiveTab] = useState("Summary");
  const [isExporting, setIsExporting] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  // Used only for the subtitle in the header
  const { data: summaryData } = useGetProjectSummaryQuery(id);
  const divisionLabel = summaryData?.data?.selected_divisions
    ?.map((d: any) => d.name)
    .join(" • ");

  const handleExportPDF = async () => {
    setShowExportMenu(false);
    setIsExporting(true);
    toast.info("Preparing PDF export...");
    // Give time for the hidden export view to fully render
    await new Promise(res => setTimeout(res, 800));
    try {
      await exportAnalysisPDF(`Analysis-${id}`);
      toast.success("PDF exported successfully!");
    } catch (e) {
      toast.error("Failed to export PDF.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link
            href={`/sub-user/projects/${id}`}
            className="inline-flex items-center gap-1 text-sm font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Tender
          </Link>
          <h1 className="text-[28px] font-bold text-gray-900 dark:text-white leading-tight">
            AI Analysis Results
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            {divisionLabel || "Loading…"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Export Dropdown */}
          <div className="relative">
            {/* <Button
              variant="secondary"
              className="h-11 px-5 rounded-xl font-bold bg-white dark:bg-[#111827] border-gray-200 dark:border-gray-700 shadow-sm text-gray-700 dark:text-gray-200 flex items-center gap-2"
              onClick={() => setShowExportMenu(v => !v)}
              disabled={isExporting}
            >
              {isExporting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              Export
            </Button> */}
            {showExportMenu && (
              <div className="absolute right-0 top-12 z-50 bg-white dark:bg-[#1f2937] border border-gray-100 dark:border-gray-700 rounded-xl shadow-xl py-1 min-w-[150px]">
                <button
                  onClick={handleExportPDF}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <FileText className="w-4 h-4 text-red-500" />
                  Export as PDF
                </button>
              </div>
            )}
          </div>

          <Link href={`/sub-user/projects/${id}/quote`}>
            <Button
              variant="primary"
              className="h-11 px-6 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-200 dark:shadow-none"
            >
              Build Quote
            </Button>
          </Link>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="bg-white dark:bg-[#111827] rounded-[10px] border border-gray-100 dark:border-gray-800 p-3 shadow-sm shadow-[#00000014]  transition-colors duration-300 w-fit">

        <div className="flex flex-wrap gap-2">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-5 py-2.5 rounded-[14px] text-[13px] font-bold transition-all shadow-sm",
                activeTab === tab
                  ? "bg-[#009966] text-white shadow-emerald-200 dark:shadow-none"
                  : "bg-[#F2F2F2] dark:bg-gray-800 text-[#6A7282] dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      {/* Tab Content */}
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
        {activeTab === "Summary" && <SummaryTab projectId={id} />}
        {activeTab === "Scope" && <ScopeTab projectId={id} />}
        {activeTab === "Pricing" && <PricingTab projectId={id} />}
        {activeTab === "Risks" && <RisksTab projectId={id} />}
        {activeTab === "Clarifications" && <ClarificationsTab projectId={id} />}
        {activeTab === "Assumptions" && <AssumptionsTab projectId={id} />}
        {activeTab === "Exclusions" && <ExclusionsTab projectId={id} />}
        {activeTab === "Addenda" && <AddendaTab projectId={id} />}
      </div>

      {/* Hidden export view — always mounted so html2canvas can capture it */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: "-9999px",
          zIndex: -1,
          pointerEvents: "none",
        }}
      >
        <AnalysisExportView projectId={id} />
      </div>

    </div>
  );
}
