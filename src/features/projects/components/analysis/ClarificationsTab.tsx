/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo } from "react";
import {
  Edit3,
  Check,
  X,
  Loader2,
  Copy,
  Trash2,
  HelpCircle,
  AlertTriangle,
  AlertCircle,
  Info,
} from "lucide-react";
import { toast } from "sonner";
import {
  useGetProjectClarificationsQuery,
  useUpdateProjectAnalysisSectionMutation,
  ClarificationPayload,
} from "@/store/api/projectApi";
import {
  SectionSkeleton,
  SectionError,
  ReanalyzeBlock,
  DeleteConfirmationModal,
  PdfReferenceLink,
  getSectionPayload,
} from "./shared";
import { cn } from "@/lib/utils";

interface Props {
  projectId: string;
}

function getPriorityBadge(priority?: string) {
  switch (priority?.toLowerCase()) {
    case "critical":
    case "high":
      return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800/50";
    case "medium":
      return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50";
    default:
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50";
  }
}

export default function ClarificationsTab({ projectId }: Props) {
  const { data, isLoading, isError, refetch } = useGetProjectClarificationsQuery(projectId);
  const [updateSection, { isLoading: isUpdating }] = useUpdateProjectAnalysisSectionMutation();
  const clarifications = getSectionPayload<ClarificationPayload>(data);

  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [deleteItemId, setDeleteItemId] = useState<string | number | null>(null);
  const [editingText, setEditingText] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const filterOptions = useMemo(() => {
    const list: Array<{ code: string; label: string }> = [];

    if (clarifications?.filters?.length) {
      clarifications.filters.forEach((f: any) => {
        list.push({ code: f.code || "all", label: f.label });
      });
    } else {
      list.push({ code: "all", label: "All Clarifications" });
    }

    if (clarifications?.items?.length) {
      clarifications.items.forEach((item: any) => {
        if (item.priority) {
          const code = item.priority.toLowerCase();
          const label = `${item.priority.charAt(0).toUpperCase() + item.priority.slice(1)} Priority`;
          if (!list.some((f) => f.code.toLowerCase() === code || f.label.toLowerCase() === label.toLowerCase())) {
            list.push({ code, label });
          }
        }
      });
    }

    return list;
  }, [clarifications?.filters, clarifications?.items]);

  const filteredItems = useMemo(() => {
    if (!clarifications?.items) return [];
    if (activeFilter.toLowerCase() === "all") return clarifications.items;
    return clarifications.items.filter((item: any) => {
      const priority = (item.priority || "").toLowerCase();
      const requestedFrom = (item.requested_from || "").toLowerCase();
      return priority === activeFilter.toLowerCase() || requestedFrom.includes(activeFilter.toLowerCase());
    });
  }, [clarifications?.items, activeFilter]);

  const handleStartEdit = (item: any) => {
    setEditingId(item.id);
    setEditingText(item.question || "");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingText("");
  };

  const handleSaveEdit = async (item: any) => {
    if (!clarifications?.items) return;
    const newItems = clarifications.items.map((i: any) =>
      i.id === item.id ? { ...i, question: editingText } : i
    );
    try {
      await updateSection({
        projectId,
        section: "clarifications",
        data: {
          payload: { ...clarifications, items: newItems },
          note: "Estimator updated clarification question",
        },
      }).unwrap();
      toast.success("Clarification updated.");
      handleCancelEdit();
    } catch {
      toast.error("Failed to update clarification.");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!clarifications?.items || !deleteItemId) return;
    const newItems = clarifications.items.filter((i: any) => i.id !== deleteItemId);
    try {
      await updateSection({
        projectId,
        section: "clarifications",
        data: {
          payload: { ...clarifications, items: newItems, total_items: newItems.length },
          note: "Estimator deleted clarification",
        },
      }).unwrap();
      toast.success("Clarification deleted successfully.");
      setDeleteItemId(null);
    } catch {
      toast.error("Failed to delete clarification.");
    }
  };

  if (isLoading) return <SectionSkeleton />;
  if (isError)
    return <SectionError message="Failed to load clarifications. Please try again." onRetry={refetch} />;

  return (
    <div className="space-y-6 pb-8 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 rounded-3xl p-6 md:p-8 shadow-sm">
        {/* Dynamic Header & Intelligence Badges */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-gray-100 dark:border-gray-800 pb-5">
          <div className="space-y-1">
            <h2 className="text-[20px] font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-emerald-600" />
              {clarifications?.title || "Clarifications Needed"}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
              {clarifications?.subtitle || "Items requiring clarification from owner/architect"}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {clarifications?.confidence && (
              <span
                className={cn(
                  "text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border",
                  clarifications.confidence.toLowerCase() === "high"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
                    : clarifications.confidence.toLowerCase() === "medium"
                    ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800"
                    : "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800"
                )}
              >
                {clarifications.confidence} confidence
              </span>
            )}

            {clarifications?.completeness && (
              <span
                className={cn(
                  "text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border",
                  clarifications.completeness.toLowerCase() === "complete"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
                    : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800"
                )}
              >
                {clarifications.completeness}
              </span>
            )}

            <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
              {clarifications?.showing
                ? `Showing ${clarifications.showing}`
                : `Showing ${filteredItems.length} of ${clarifications?.items?.length || 0}`}
            </span>
          </div>
        </div>

        {/* Dynamic Validation Errors Banner */}
        {Boolean(clarifications?.validation_errors?.length) && (
          <div className="bg-amber-50/90 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/60 rounded-2xl p-4 mb-6 flex gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
            <div className="space-y-1 flex-1">
              <h4 className="text-[14px] font-bold text-amber-900 dark:text-amber-300">
                Validation Notices
              </h4>
              <div className="space-y-0.5">
                {clarifications?.validation_errors?.map((err, i) => (
                  <p key={i} className="text-[13px] text-amber-800/90 dark:text-amber-300">
                    • {err}
                  </p>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Warnings Banner */}
        {Boolean(clarifications?.warnings?.length) && (
          <div className="bg-orange-50/90 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800/60 rounded-2xl p-4 mb-6 flex gap-3">
            <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5 shrink-0" />
            <div className="space-y-1 flex-1">
              <h4 className="text-[14px] font-bold text-orange-900 dark:text-orange-300">
                Warnings
              </h4>
              <div className="space-y-0.5">
                {clarifications?.warnings?.map((w, i) => (
                  <p key={i} className="text-[13px] text-orange-800/90 dark:text-orange-300">
                    • {w}
                  </p>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Risk Cross-Check Notice */}
        {Boolean(clarifications?.risk_cross_check?.warning) && (
          <div className="bg-purple-50/90 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800/60 rounded-2xl p-4 mb-6 flex gap-3">
            <Info className="w-5 h-5 text-purple-600 mt-0.5 shrink-0" />
            <div className="space-y-1 flex-1">
              <h4 className="text-[14px] font-bold text-purple-900 dark:text-purple-300">
                Risk Cross-Check
              </h4>
              <p className="text-[13px] text-purple-800/90 dark:text-purple-300">
                {clarifications?.risk_cross_check?.warning}
              </p>
            </div>
          </div>
        )}

        {/* Dynamic Missing Information Banner */}
        {Boolean(clarifications?.missing_information?.length) && (
          <div className="bg-blue-50/90 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/60 rounded-2xl p-4 mb-6 flex gap-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
            <div className="space-y-1 flex-1">
              <h4 className="text-[14px] font-bold text-blue-900 dark:text-blue-300">
                Missing Information
              </h4>
              <div className="space-y-0.5">
                {clarifications?.missing_information?.map((m, i) => (
                  <p key={i} className="text-[13px] text-blue-800/90 dark:text-blue-300">
                    • {m}
                  </p>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Filters */}
        {filterOptions.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {filterOptions.map((f) => {
              const isSelected = activeFilter.toLowerCase() === f.code.toLowerCase();
              return (
                <button
                  key={f.code}
                  onClick={() => setActiveFilter(f.code)}
                  className={cn(
                    "px-3.5 py-1.5 rounded-full text-[12px] font-bold transition-all shadow-sm",
                    isSelected
                      ? "bg-emerald-600 text-white shadow-emerald-200 dark:shadow-none"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                  )}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Clarifications List */}
        <div className="space-y-4">
          {filteredItems.length ? (
            filteredItems.map((item: any, idx: number) => {
              const isEditing = editingId === item.id;

              return (
                <div
                  key={item.id ?? idx}
                  className="p-5 rounded-2xl border border-emerald-100 dark:border-emerald-900/30 bg-emerald-50/30 dark:bg-emerald-950/10 space-y-3 group transition-colors"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex gap-3 flex-1">
                      <HelpCircle className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                      <div className="flex-1">
                        {isEditing ? (
                          <textarea
                            value={editingText}
                            onChange={(e) => setEditingText(e.target.value)}
                            rows={2}
                            className="w-full p-2.5 rounded-lg border border-emerald-300 dark:border-emerald-700 bg-white dark:bg-gray-800 text-[14px] font-bold text-gray-900 dark:text-white resize-none focus:outline-none focus:border-emerald-500"
                          />
                        ) : (
                          <h4 className="text-[15px] font-bold text-emerald-950 dark:text-emerald-100 leading-snug">
                            {item.question}
                          </h4>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
                      {item.priority && (
                        <span
                          className={cn(
                            "text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wide",
                            getPriorityBadge(item.priority)
                          )}
                        >
                          {item.priority} Priority
                        </span>
                      )}
                      {item.requested_from && (
                        <span className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 text-[10px] font-bold px-2.5 py-1 rounded-md">
                          {item.requested_from}
                        </span>
                      )}

                      {/* Actions */}
                      <div className="flex items-center gap-1.5 ml-2">
                        {isEditing ? (
                          <>
                            <button
                              onClick={() => handleSaveEdit(item)}
                              disabled={isUpdating}
                              className="p-1.5 text-emerald-600 hover:text-emerald-700 transition-colors rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/30"
                              title="Save"
                            >
                              {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="p-1.5 text-gray-400 hover:text-gray-700 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                              title="Cancel"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleStartEdit(item)}
                              className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30"
                              title="Edit"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                navigator.clipboard?.writeText(item.question || "");
                                toast.success("Copied to clipboard.");
                              }}
                              className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                              title="Copy"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeleteItemId(item.id)}
                              disabled={isUpdating}
                              className="p-1.5 text-red-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 disabled:opacity-50"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Additional Dynamic Details */}
                  {(item.reason || item.impact_if_unresolved || item.linked_risk_title || item.risk_category) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-2 text-[12px]">
                      {item.reason && (
                        <div className="bg-white/80 dark:bg-gray-900/50 p-2.5 rounded-lg border border-emerald-100/60 dark:border-emerald-900/30">
                          <span className="font-bold text-gray-800 dark:text-gray-200 block mb-0.5">Reason:</span>
                          <span className="text-gray-600 dark:text-gray-400 leading-relaxed">{item.reason}</span>
                        </div>
                      )}
                      {item.impact_if_unresolved && (
                        <div className="bg-amber-50/60 dark:bg-amber-950/20 p-2.5 rounded-lg border border-amber-200/50 dark:border-amber-900/30">
                          <span className="font-bold text-amber-800 dark:text-amber-300 block mb-0.5">
                            Impact if Unresolved:
                          </span>
                          <span className="text-amber-900/80 dark:text-amber-200/80 leading-relaxed">
                            {item.impact_if_unresolved}
                          </span>
                        </div>
                      )}
                      {item.linked_risk_title && (
                        <div className="bg-blue-50/60 dark:bg-blue-950/20 p-2.5 rounded-lg border border-blue-100 dark:border-blue-900/30">
                          <span className="font-bold text-blue-800 dark:text-blue-300 block mb-0.5">
                            Linked Risk:
                          </span>
                          <span className="text-blue-900/80 dark:text-blue-200/80 leading-relaxed">
                            {item.linked_risk_title}
                          </span>
                        </div>
                      )}
                      {item.risk_category && (
                        <div className="bg-purple-50/60 dark:bg-purple-950/20 p-2.5 rounded-lg border border-purple-100 dark:border-purple-900/30">
                          <span className="font-bold text-purple-800 dark:text-purple-300 block mb-0.5">
                            Category:
                          </span>
                          <span className="text-purple-900/80 dark:text-purple-200/80 leading-relaxed">
                            {item.risk_category}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* PDF Reference Link */}
                  {item.reference?.file && item.reference.file !== "null" && (
                    <div className="pt-1">
                      <PdfReferenceLink projectId={projectId} reference={item.reference} />
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <p className="text-[13px] text-gray-500 py-6 text-center">
              No clarifications needed matching the selected criteria.
            </p>
          )}
        </div>
      </div>

      <ReanalyzeBlock projectId={projectId} section="clarifications" data={data?.data} />

      <DeleteConfirmationModal
        isOpen={!!deleteItemId}
        onClose={() => setDeleteItemId(null)}
        onConfirm={handleDeleteConfirm}
        isDeleting={isUpdating}
        title="Delete Clarification"
        description="Are you sure you want to delete this clarification? This action cannot be undone."
      />
    </div>
  );
}
