import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Edit3, Trash2, Check, X, Loader2, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { useGetProjectRisksQuery, useUpdateProjectAnalysisSectionMutation } from "@/store/api/projectApi";
import { SectionSkeleton, SectionError, getRiskBadgeColor, ReanalyzeBlock, DeleteConfirmationModal, PdfReferenceLink } from "./shared";

interface Props {
  projectId: string;
}

function getSeverityBadge(severity?: string) {
  switch (severity?.toLowerCase()) {
    case "high":
    case "critical":
      return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800/50";
    case "medium":
      return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50";
    default:
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50";
  }
}

export default function RisksTab({ projectId }: Props) {
  const { data, isLoading, isError, refetch } = useGetProjectRisksQuery(projectId);
  const [updateSection, { isLoading: isUpdating }] = useUpdateProjectAnalysisSectionMutation();
  const risks = data?.data?.payload;

  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [deleteItemId, setDeleteItemId] = useState<string | number | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingDesc, setEditingDesc] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const handleStartEdit = (risk: any) => {
    setEditingId(risk.id);
    setEditingTitle(risk.title);
    setEditingDesc(risk.description);
  };

  const handleSaveEdit = async (risk: any) => {
    if (!risks?.items) return;
    const newItems = risks.items.map((i: any) =>
      i.id === risk.id ? { ...i, title: editingTitle, description: editingDesc } : i
    );
    try {
      await updateSection({ projectId, section: "risks", data: { payload: { items: newItems }, note: "Manual edits from estimator" } }).unwrap();
      toast.success("Risk updated.");
      setEditingId(null);
    } catch {
      toast.error("Failed to update risk.");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!risks?.items || !deleteItemId) return;
    const newItems = risks.items.filter((i: any) => i.id !== deleteItemId);
    try {
      await updateSection({ projectId, section: "risks", data: { payload: { items: newItems }, note: "Manual edits from estimator" } }).unwrap();
      toast.success("Risk deleted.");
      setDeleteItemId(null);
    } catch {
      toast.error("Failed to delete risk.");
    }
  };

  const filteredItems = risks?.items?.filter((r: any) => {
    if (activeFilter === "all") return true;
    return r.category?.toLowerCase() === activeFilter;
  }) ?? [];

  if (isLoading) return <SectionSkeleton />;
  if (isError)
    return <SectionError message="Failed to load risks. Please try again." onRetry={refetch} />;

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 rounded-3xl p-6 md:p-8 shadow-sm">

        <div className="mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">
          <h2 className="text-[20px] font-bold text-gray-900 dark:text-white mb-1">
            {risks?.title || "Risks & Coordination Items"}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            {risks?.subtitle || "Issues flagged from tender documents."}
          </p>
        </div>

        {/* Filters */}
        {Boolean(risks?.filters?.length) && (
          <div className="flex flex-wrap gap-2 mb-6">
            {risks?.filters?.map((f: any) => {
              const filterValue = f.code === "all" ? "all" : f.label?.toLowerCase();
              return (
                <button
                  key={f.code}
                  onClick={() => setActiveFilter(filterValue)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-[12px] font-bold transition-colors",
                    activeFilter === filterValue
                      ? "bg-emerald-600 text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-gray-900 dark:hover:text-white"
                  )}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        )}

        <div className="space-y-4">
          {filteredItems.length ? (
            filteredItems.map((risk: any) => (
              <div
                key={risk.id}
                className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-900/60 p-5 md:p-6 shadow-sm group space-y-3"
              >
                {/* Left Colored Border */}
                <div
                  className={cn(
                    "absolute inset-y-0 left-0 w-1.5 h-full",
                    risk.severity === "high" ? "bg-red-500" : risk.severity === "medium" ? "bg-amber-500" : "bg-blue-500"
                  )}
                />

                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    {editingId === risk.id ? (
                      <input
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-blue-300 dark:border-blue-700 bg-transparent text-[15px] font-bold focus:outline-none focus:border-blue-500"
                      />
                    ) : (
                      <h4 className="text-[15px] font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4 text-red-500 shrink-0" />
                        {risk.title}
                      </h4>
                    )}

                    {risk.trigger && (
                      <p className="text-[12px] text-gray-500 dark:text-gray-400 mt-1">
                        <span className="font-semibold text-gray-700 dark:text-gray-300">Trigger:</span> {risk.trigger}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {risk.severity && (
                      <span className={cn("text-[10px] font-bold px-2.5 py-1 rounded-md tracking-wide uppercase", getSeverityBadge(risk.severity))}>
                        {risk.severity} severity
                      </span>
                    )}
                    <span className={cn("text-[10px] font-bold px-2.5 py-1 rounded-md tracking-wide", getRiskBadgeColor(risk.category))}>
                      {risk.category}
                    </span>

                    {/* Edit/Delete Actions */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                      {editingId === risk.id ? (
                        <>
                          <button
                            onClick={() => handleSaveEdit(risk)}
                            disabled={isUpdating}
                            className="p-1.5 text-emerald-600 hover:text-emerald-700 transition-colors rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/30"
                          >
                            {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="p-1.5 text-gray-400 hover:text-gray-700 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleStartEdit(risk)}
                            className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteItemId(risk.id)}
                            disabled={isUpdating}
                            className="p-1.5 text-gray-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 disabled:opacity-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {editingId === risk.id ? (
                  <textarea
                    value={editingDesc}
                    onChange={(e) => setEditingDesc(e.target.value)}
                    rows={3}
                    className="w-full p-2 rounded-lg border border-blue-200 dark:border-blue-800 bg-transparent text-[13px] leading-relaxed resize-none focus:outline-none focus:border-blue-500"
                  />
                ) : (
                  <p className="text-[13px] text-gray-700 dark:text-gray-300 leading-relaxed">
                    {risk.description}
                  </p>
                )}

                {/* Additional Risk Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-3 border-t border-gray-100 dark:border-gray-800/80 text-[12px]">
                  {risk.mitigation && (
                    <div className="bg-emerald-50/50 dark:bg-emerald-950/20 p-2.5 rounded-lg border border-emerald-100/50 dark:border-emerald-900/30">
                      <span className="font-bold text-emerald-800 dark:text-emerald-300 block mb-0.5">Mitigation Strategy:</span>
                      <span className="text-emerald-900/80 dark:text-emerald-200/80">{risk.mitigation}</span>
                    </div>
                  )}
                  {risk.cost_impact && (
                    <div className="bg-red-50/50 dark:bg-red-950/20 p-2.5 rounded-lg border border-red-100/50 dark:border-red-900/30">
                      <span className="font-bold text-red-800 dark:text-red-300 block mb-0.5">Cost Impact:</span>
                      <span className="text-red-900/80 dark:text-red-200/80">{risk.cost_impact}</span>
                    </div>
                  )}
                  {risk.schedule_impact && (
                    <div className="bg-amber-50/50 dark:bg-amber-950/20 p-2.5 rounded-lg border border-amber-100/50 dark:border-amber-900/30">
                      <span className="font-bold text-amber-800 dark:text-amber-300 block mb-0.5">Schedule Impact:</span>
                      <span className="text-amber-900/80 dark:text-amber-200/80">{risk.schedule_impact}</span>
                    </div>
                  )}
                  {risk.contingency_guidance && (
                    <div className="bg-blue-50/50 dark:bg-blue-950/20 p-2.5 rounded-lg border border-blue-100/50 dark:border-blue-900/30">
                      <span className="font-bold text-blue-800 dark:text-blue-300 block mb-0.5">Contingency Guidance:</span>
                      <span className="text-blue-900/80 dark:text-blue-200/80">{risk.contingency_guidance}</span>
                    </div>
                  )}
                  {risk.quote_protection && (
                    <div className="bg-purple-50/50 dark:bg-purple-950/20 p-2.5 rounded-lg border border-purple-100/50 dark:border-purple-900/30">
                      <span className="font-bold text-purple-800 dark:text-purple-300 block mb-0.5">Quote Protection:</span>
                      <span className="text-purple-900/80 dark:text-purple-200/80">{risk.quote_protection}</span>
                    </div>
                  )}
                  {risk.probability && (
                    <div className="bg-gray-50 dark:bg-gray-800/40 p-2.5 rounded-lg border border-gray-200/50 dark:border-gray-700/50 flex items-center justify-between">
                      <span className="font-bold text-gray-700 dark:text-gray-300">Probability:</span>
                      <span className="capitalize font-semibold text-gray-900 dark:text-gray-100">{risk.probability}</span>
                    </div>
                  )}
                </div>

                {/* PDF Reference Link */}
                {risk.reference?.file && (
                  <div className="pt-1">
                    <PdfReferenceLink projectId={projectId} reference={risk.reference} />
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-[13px] text-gray-500">No risks identified.</p>
          )}
        </div>
      </div>

      <ReanalyzeBlock projectId={projectId} section="risks" data={data?.data} />

      <DeleteConfirmationModal
        isOpen={!!deleteItemId}
        onClose={() => setDeleteItemId(null)}
        onConfirm={handleDeleteConfirm}
        isDeleting={isUpdating}
        title="Delete Risk Item"
        description="Are you sure you want to delete this risk item? This action cannot be undone."
      />
    </div>
  );
}
