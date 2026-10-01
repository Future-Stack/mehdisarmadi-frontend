import React, { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Edit3, Trash2, Check, X, Loader2, ShieldAlert, AlertTriangle, AlertCircle, Info } from "lucide-react";
import { toast } from "sonner";
import { useGetProjectRisksQuery, useUpdateProjectAnalysisSectionMutation, RiskPayload } from "@/store/api/projectApi";
import { SectionSkeleton, SectionError, getRiskBadgeColor, ReanalyzeBlock, DeleteConfirmationModal, PdfReferenceLink, getSectionPayload } from "./shared";

interface Props {
  projectId: string;
}

function getSeverityBadge(severity?: string) {
  switch (severity?.toLowerCase()) {
    case "critical":
    case "high":
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
  const risks = getSectionPayload<RiskPayload>(data);

  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [deleteItemId, setDeleteItemId] = useState<string | number | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingDesc, setEditingDesc] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const handleStartEdit = (risk: any) => {
    setEditingId(risk.id);
    setEditingTitle(risk.title || "");
    setEditingDesc(risk.description || "");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingTitle("");
    setEditingDesc("");
  };

  const handleSaveEdit = async (risk: any) => {
    if (!risks?.items) return;
    const newItems = risks.items.map((i: any) =>
      i.id === risk.id ? { ...i, title: editingTitle, description: editingDesc } : i
    );
    try {
      await updateSection({
        projectId,
        section: "risks",
        data: { payload: { ...risks, items: newItems }, note: "Manual edits from estimator" },
      }).unwrap();
      toast.success("Risk updated.");
      handleCancelEdit();
    } catch {
      toast.error("Failed to update risk.");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!risks?.items || !deleteItemId) return;
    const newItems = risks.items.filter((i: any) => i.id !== deleteItemId);
    try {
      await updateSection({
        projectId,
        section: "risks",
        data: {
          payload: { ...risks, items: newItems, total_items: newItems.length },
          note: "Manual edits from estimator",
        },
      }).unwrap();
      toast.success("Risk deleted.");
      setDeleteItemId(null);
    } catch {
      toast.error("Failed to delete risk.");
    }
  };

  // Build filter options dynamically combining API filters and categories found in items
  const filterOptions = useMemo(() => {
    const list: Array<{ code: string; label: string }> = [];

    // Add API filters if present
    if (risks?.filters?.length) {
      risks.filters.forEach((f: any) => {
        list.push({ code: f.code || f.label?.toLowerCase() || "all", label: f.label });
      });
    } else {
      list.push({ code: "all", label: "All Risks" });
    }

    // Add categories from items if not already present
    if (risks?.items?.length) {
      risks.items.forEach((item: any) => {
        if (item.category) {
          const cat = item.category.trim();
          const code = cat.toLowerCase();
          if (!list.some((f) => f.code.toLowerCase() === code || f.label.toLowerCase() === code)) {
            list.push({ code, label: cat });
          }
        }
      });
    }

    return list;
  }, [risks?.filters, risks?.items]);

  const filteredItems = useMemo(() => {
    if (!risks?.items) return [];
    if (activeFilter.toLowerCase() === "all") return risks.items;
    return risks.items.filter((r: any) => {
      const cat = (r.category || "").trim().toLowerCase();
      return cat === activeFilter.toLowerCase();
    });
  }, [risks?.items, activeFilter]);

  if (isLoading) return <SectionSkeleton />;
  if (isError)
    return <SectionError message="Failed to load risks. Please try again." onRetry={refetch} />;

  return (
    <div className="space-y-6 pb-8 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 rounded-3xl p-6 md:p-8 shadow-sm">
        {/* Dynamic Header & Intelligence Badges */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-gray-100 dark:border-gray-800 pb-5">
          <div className="space-y-1">
            <h2 className="text-[20px] font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-500" />
              {risks?.title || "Risks & Coordination Items"}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
              {risks?.subtitle || "Issues flagged from tender analysis"}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {risks?.confidence && (
              <span
                className={cn(
                  "text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border",
                  risks.confidence.toLowerCase() === "high"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
                    : risks.confidence.toLowerCase() === "medium"
                    ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800"
                    : "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800"
                )}
              >
                {risks.confidence} confidence
              </span>
            )}

            {risks?.completeness && (
              <span
                className={cn(
                  "text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border",
                  risks.completeness.toLowerCase() === "complete"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
                    : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800"
                )}
              >
                {risks.completeness}
              </span>
            )}

            <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
              {risks?.showing
                ? `Showing ${risks.showing}`
                : `Showing ${filteredItems.length} of ${risks?.total_items || risks?.items?.length || 0}`}
            </span>
          </div>
        </div>

        {/* Dynamic Validation Errors Banner */}
        {Boolean(risks?.validation_errors?.length) && (
          <div className="bg-amber-50/90 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/60 rounded-2xl p-4 mb-6 flex gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
            <div className="space-y-1 flex-1">
              <h4 className="text-[14px] font-bold text-amber-900 dark:text-amber-300">
                Validation Notices
              </h4>
              <div className="space-y-0.5">
                {risks?.validation_errors?.map((err, i) => (
                  <p key={i} className="text-[13px] text-amber-800/90 dark:text-amber-300">
                    • {err}
                  </p>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Warnings Banner */}
        {Boolean(risks?.warnings?.length) && (
          <div className="bg-orange-50/90 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800/60 rounded-2xl p-4 mb-6 flex gap-3">
            <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5 shrink-0" />
            <div className="space-y-1 flex-1">
              <h4 className="text-[14px] font-bold text-orange-900 dark:text-orange-300">
                Warnings
              </h4>
              <div className="space-y-0.5">
                {risks?.warnings?.map((w, i) => (
                  <p key={i} className="text-[13px] text-orange-800/90 dark:text-orange-300">
                    • {w}
                  </p>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Missing Information Banner */}
        {Boolean(risks?.missing_information?.length) && (
          <div className="bg-blue-50/90 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/60 rounded-2xl p-4 mb-6 flex gap-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
            <div className="space-y-1 flex-1">
              <h4 className="text-[14px] font-bold text-blue-900 dark:text-blue-300">
                Missing Information
              </h4>
              <div className="space-y-0.5">
                {risks?.missing_information?.map((m, i) => (
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

        {/* Risk Items List */}
        <div className="space-y-4">
          {filteredItems.length ? (
            filteredItems.map((risk: any) => {
              const severityLower = (risk.severity || "").toLowerCase();
              const isCriticalOrHigh = severityLower === "critical" || severityLower === "high";
              const isMedium = severityLower === "medium";

              return (
                <div
                  key={risk.id}
                  className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-900/60 p-5 md:p-6 shadow-sm group space-y-3.5 transition-colors"
                >
                  {/* Left Colored Border based on severity */}
                  <div
                    className={cn(
                      "absolute inset-y-0 left-0 w-1.5 h-full",
                      isCriticalOrHigh ? "bg-red-500" : isMedium ? "bg-amber-500" : "bg-blue-500"
                    )}
                  />

                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      {editingId === risk.id ? (
                        <input
                          value={editingTitle}
                          onChange={(e) => setEditingTitle(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg border border-blue-300 dark:border-blue-700 bg-white dark:bg-gray-800 text-[15px] font-bold focus:outline-none focus:border-blue-500 text-gray-900 dark:text-white"
                        />
                      ) : (
                        <h4 className="text-[15px] font-bold text-gray-900 dark:text-white flex items-center gap-2">
                          <ShieldAlert
                            className={cn(
                              "w-4 h-4 shrink-0",
                              isCriticalOrHigh ? "text-red-500" : isMedium ? "text-amber-500" : "text-blue-500"
                            )}
                          />
                          {risk.title}
                        </h4>
                      )}

                      {risk.trigger && (
                        <p className="text-[12px] text-gray-500 dark:text-gray-400 mt-1">
                          <span className="font-semibold text-gray-700 dark:text-gray-300">Trigger:</span>{" "}
                          {risk.trigger}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
                      {risk.severity && (
                        <span
                          className={cn(
                            "text-[10px] font-bold px-2.5 py-1 rounded-md tracking-wide uppercase",
                            getSeverityBadge(risk.severity)
                          )}
                        >
                          {risk.severity} severity
                        </span>
                      )}
                      {risk.category && (
                        <span
                          className={cn(
                            "text-[10px] font-bold px-2.5 py-1 rounded-md tracking-wide",
                            getRiskBadgeColor(risk.category)
                          )}
                        >
                          {risk.category}
                        </span>
                      )}

                      {/* Edit/Delete Actions */}
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-1">
                        {editingId === risk.id ? (
                          <>
                            <button
                              onClick={() => handleSaveEdit(risk)}
                              disabled={isUpdating}
                              className="p-1.5 text-emerald-600 hover:text-emerald-700 transition-colors rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/30"
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
                              onClick={() => handleStartEdit(risk)}
                              className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30"
                              title="Edit"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeleteItemId(risk.id)}
                              disabled={isUpdating}
                              className="p-1.5 text-gray-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 disabled:opacity-50"
                              title="Delete"
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
                      className="w-full p-2.5 rounded-lg border border-blue-200 dark:border-blue-800 bg-white dark:bg-gray-800 text-[13px] leading-relaxed resize-none focus:outline-none focus:border-blue-500 text-gray-900 dark:text-white"
                    />
                  ) : (
                    <p className="text-[13px] text-gray-700 dark:text-gray-300 leading-relaxed">
                      {risk.description}
                    </p>
                  )}

                  {/* Additional Dynamic Risk Details Grid */}
                  {(risk.mitigation ||
                    risk.cost_impact ||
                    risk.schedule_impact ||
                    risk.contingency_guidance ||
                    risk.quote_protection ||
                    risk.probability) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-3 border-t border-gray-100 dark:border-gray-800/80 text-[12px]">
                      {risk.mitigation && (
                        <div className="bg-emerald-50/50 dark:bg-emerald-950/20 p-2.5 rounded-lg border border-emerald-100/50 dark:border-emerald-900/30">
                          <span className="font-bold text-emerald-800 dark:text-emerald-300 block mb-0.5">
                            Mitigation Strategy:
                          </span>
                          <span className="text-emerald-900/80 dark:text-emerald-200/80 leading-relaxed">
                            {risk.mitigation}
                          </span>
                        </div>
                      )}
                      {risk.cost_impact && (
                        <div className="bg-red-50/50 dark:bg-red-950/20 p-2.5 rounded-lg border border-red-100/50 dark:border-red-900/30">
                          <span className="font-bold text-red-800 dark:text-red-300 block mb-0.5">
                            Cost Impact:
                          </span>
                          <span className="text-red-900/80 dark:text-red-200/80 leading-relaxed">
                            {risk.cost_impact}
                          </span>
                        </div>
                      )}
                      {risk.schedule_impact && (
                        <div className="bg-amber-50/50 dark:bg-amber-950/20 p-2.5 rounded-lg border border-amber-100/50 dark:border-amber-900/30">
                          <span className="font-bold text-amber-800 dark:text-amber-300 block mb-0.5">
                            Schedule Impact:
                          </span>
                          <span className="text-amber-900/80 dark:text-amber-200/80 leading-relaxed">
                            {risk.schedule_impact}
                          </span>
                        </div>
                      )}
                      {risk.contingency_guidance && (
                        <div className="bg-blue-50/50 dark:bg-blue-950/20 p-2.5 rounded-lg border border-blue-100/50 dark:border-blue-900/30">
                          <span className="font-bold text-blue-800 dark:text-blue-300 block mb-0.5">
                            Contingency Guidance:
                          </span>
                          <span className="text-blue-900/80 dark:text-blue-200/80 leading-relaxed">
                            {risk.contingency_guidance}
                          </span>
                        </div>
                      )}
                      {risk.quote_protection && (
                        <div className="bg-purple-50/50 dark:bg-purple-950/20 p-2.5 rounded-lg border border-purple-100/50 dark:border-purple-900/30">
                          <span className="font-bold text-purple-800 dark:text-purple-300 block mb-0.5">
                            Quote Protection:
                          </span>
                          <span className="text-purple-900/80 dark:text-purple-200/80 leading-relaxed">
                            {risk.quote_protection}
                          </span>
                        </div>
                      )}
                      {risk.probability && (
                        <div className="bg-gray-50 dark:bg-gray-800/40 p-2.5 rounded-lg border border-gray-200/50 dark:border-gray-700/50 flex items-center justify-between">
                          <span className="font-bold text-gray-700 dark:text-gray-300">
                            Probability:
                          </span>
                          <span className="capitalize font-semibold text-gray-900 dark:text-gray-100">
                            {risk.probability}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* PDF Reference Link */}
                  {risk.reference?.file && (
                    <div className="pt-1">
                      <PdfReferenceLink projectId={projectId} reference={risk.reference} />
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <p className="text-[13px] text-gray-500 py-6 text-center">
              No risks identified matching the selected criteria.
            </p>
          )}
        </div>
      </div>

      {/* Dynamic Reanalyze Block */}
      <ReanalyzeBlock projectId={projectId} section="risks" data={data?.data} />

      {/* Delete Confirmation Modal */}
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
