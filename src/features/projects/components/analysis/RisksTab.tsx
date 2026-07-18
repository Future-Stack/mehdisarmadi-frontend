import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { FileText, Edit3, Trash2, Check, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useGetProjectRisksQuery, useUpdateProjectAnalysisSectionMutation } from "@/store/api/projectApi";
import { SectionSkeleton, SectionError, getRiskBadgeColor, ReanalyzeBlock, DeleteConfirmationModal } from "./shared";

interface Props {
  projectId: string;
}

export default function RisksTab({ projectId }: Props) {
  const { data, isLoading, isError, refetch } = useGetProjectRisksQuery(projectId);
  const [updateSection, { isLoading: isUpdating }] = useUpdateProjectAnalysisSectionMutation();
  const risks = data?.data?.payload || data?.data;

  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
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
        {risks?.filters?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setActiveFilter("all")}
              className={cn(
                "px-3 py-1.5 rounded-full text-[12px] font-bold transition-colors",
                activeFilter === "all"
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-gray-900 dark:hover:text-white"
              )}
            >
              All
            </button>
            {risks.filters.map((f: any) => (
              <button
                key={f.code}
                onClick={() => setActiveFilter(f.code === "all" ? "all" : f.label?.toLowerCase())}
                className={cn(
                  "px-3 py-1.5 rounded-full text-[12px] font-bold transition-colors",
                  f.active && activeFilter !== "all"
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-gray-900 dark:hover:text-white"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        )}

        <div className="space-y-4">
          {filteredItems.length ? (
            filteredItems.map((risk: any) => (
              <div
                key={risk.id}
                className="relative overflow-hidden rounded-xl border border-gray-100 bg-gray-50/50 p-5 dark:border-gray-800 dark:bg-gray-800/30 group"
              >
                {/* Left Colored Border */}
                <div className="absolute inset-y-0 left-0 w-1 bg-red-500" />

                <div className="flex justify-between items-start gap-4 mb-2">
                  {editingId === risk.id ? (
                    <input
                      value={editingTitle}
                      onChange={e => setEditingTitle(e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded-lg border border-blue-300 dark:border-blue-700 bg-transparent text-[15px] font-bold focus:outline-none focus:border-blue-500"
                    />
                  ) : (
                    <h4 className="text-[15px] font-bold text-gray-900 dark:text-white">
                      {risk.title}
                    </h4>
                  )}

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={cn(
                        "text-[10px] font-bold px-2.5 py-1 rounded-md tracking-wide whitespace-nowrap",
                        getRiskBadgeColor(risk.category)
                      )}
                    >
                      {risk.category}
                    </span>

                    {/* Edit/Delete Buttons - visible on hover */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
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
                    onChange={e => setEditingDesc(e.target.value)}
                    rows={3}
                    className="w-full p-2 rounded-lg border border-blue-200 dark:border-blue-800 bg-transparent text-[13px] leading-relaxed resize-none focus:outline-none focus:border-blue-500 mb-2"
                  />
                ) : (
                  <p className="text-[13px] text-gray-600 dark:text-gray-300 leading-relaxed mb-3">
                    {risk.description}
                  </p>
                )}

                {risk.reference?.file && (
                  <div className="flex items-center gap-1.5 text-[11px] font-medium text-gray-400">
                    <FileText className="w-3.5 h-3.5" />
                    {risk.reference.file}
                    {risk.reference.page && ` • p.${risk.reference.page}`}
                    {risk.reference.section && ` • ${risk.reference.section}`}
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
        title="Delete Risk"
        description="Are you sure you want to delete this risk? This action cannot be undone."
      />
    </div>
  );
}
