"use client";

import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
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

const TABS = ["Summary", "Scope", "Pricing", "Risks", "Clarifications", "Assumptions", "Exclusions", "Addenda"];

export default function AIAnalysisResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [activeTab, setActiveTab] = useState("Summary");

  // Used only for the subtitle in the header
  const { data: summaryData } = useGetProjectSummaryQuery(id);
  const divisionLabel = summaryData?.data?.selected_divisions
    ?.map((d: any) => d.name)
    .join(" • ");

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link
            href={`/sub-user/projects/${id}`}
            className="inline-flex items-center gap-1 text-sm font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Project
          </Link>
          <h1 className="text-[28px] font-bold text-gray-900 dark:text-white leading-tight">
            AI Analysis Results
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            {divisionLabel || "Loading…"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* <Link href={`/sub-user/projects/${id}/quote`}>
            <Button
              variant="secondary"
              className="h-11 px-5 rounded-xl font-bold bg-white dark:bg-[#111827] border-gray-200 dark:border-gray-700 shadow-sm text-gray-700 dark:text-gray-200"
            >
              Open Quote Builder
            </Button>
          </Link> */}
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
      <div className="flex flex-wrap gap-2 pb-2">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-5 py-2.5 rounded-full text-[13px] font-bold transition-all shadow-sm",
              activeTab === tab
                ? "bg-emerald-600 text-white shadow-emerald-200 dark:shadow-none"
                : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
            )}
          >
            {tab}
          </button>
        ))}
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

    </div>
  );
}
