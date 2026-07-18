import { cn } from "@/lib/utils";
import { useGetProjectSummaryQuery } from "@/store/api/projectApi";
import { SectionSkeleton, SectionError, getHighlightStyle, ReanalyzeBlock, DeleteConfirmationModal } from "./shared";
import { Edit3, Trash2, Check, X, Loader2 } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { useUpdateProjectAnalysisSectionMutation } from "@/store/api/projectApi";

interface Props {
  projectId: string;
}

export default function SummaryTab({ projectId }: Props) {
  const { data, isLoading, isError, refetch } = useGetProjectSummaryQuery(projectId);
  const [updateSection, { isLoading: isUpdating }] = useUpdateProjectAnalysisSectionMutation();
  const summary = data?.data?.payload || data?.data;

  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingDescription, setEditingDescription] = useState("");

  const handleStartEdit = (highlight: any) => {
    setEditingId(highlight.id || highlight.type);
    setEditingTitle(highlight.title);
    setEditingDescription(highlight.description);
  };

  const handleSaveEdit = async (highlight: any) => {
    if (!summary?.key_highlights) return;
    const highlightId = highlight.id || highlight.type;
    const newItems = summary.key_highlights.map((i: any) =>
      (i.id || i.type) === highlightId ? { ...i, title: editingTitle, description: editingDescription } : i
    );
    try {
      await updateSection({ projectId, section: "summary", data: { payload: { key_highlights: newItems }, note: "Manual edits from estimator" } }).unwrap();
      toast.success("Highlight updated.");
      setEditingId(null);
    } catch {
      toast.error("Failed to update highlight.");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!summary?.key_highlights || !deleteItemId) return;
    const newItems = summary.key_highlights.filter((i: any) => (i.id || i.type) !== deleteItemId);
    try {
      await updateSection({ projectId, section: "summary", data: { payload: { key_highlights: newItems }, note: "Manual edits from estimator" } }).unwrap();
      toast.success("Highlight deleted.");
      setDeleteItemId(null);
    } catch {
      toast.error("Failed to delete highlight.");
    }
  };

  if (isLoading) return <SectionSkeleton />;
  if (isError)
    return <SectionError message="Failed to load summary. Please try again." onRetry={refetch} />;

  return (
    <div className="space-y-8">
      {/* Key Highlights */}
      <div className="space-y-4">
        <h2 className="text-[20px] font-bold text-gray-900 dark:text-white mb-2">Key Highlights</h2>
        <div className="bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm shadow-[#00000010]">
          <div className="space-y-3">
            {summary?.key_highlights?.length ? (
              summary.key_highlights.map((highlight: any) => {
                const styles = getHighlightStyle(highlight.type);

                return (
                  <div
                    key={highlight.id || highlight.type}
                    className={cn(
                      "relative overflow-hidden rounded-2xl border p-5 group",
                      styles.card
                    )}
                  >
                    {/* Left Highlight Border */}
                    <div
                      className={cn(
                        "absolute inset-y-0 left-0 w-1",
                        styles.extraborder
                      )}
                    />
                    
                    {/* Actions */}
                    <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {editingId === (highlight.id || highlight.type) ? (
                        <>
                          <button onClick={() => handleSaveEdit(highlight)} disabled={isUpdating} className="p-1.5 text-emerald-600 hover:bg-emerald-100 rounded-lg">
                            {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                          </button>
                          <button onClick={() => setEditingId(null)} className="p-1.5 text-gray-500 hover:bg-gray-200 rounded-lg">
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => handleStartEdit(highlight)} className="p-1.5 text-blue-500 hover:bg-blue-100 rounded-lg">
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button onClick={() => setDeleteItemId(highlight.id || highlight.type)} className="p-1.5 text-red-500 hover:bg-red-100 rounded-lg">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>

                    {editingId === (highlight.id || highlight.type) ? (
                      <div className="space-y-2 pr-16">
                        <input
                          value={editingTitle}
                          onChange={e => setEditingTitle(e.target.value)}
                          className={cn("w-full px-2 py-1 rounded border bg-transparent focus:outline-none", styles.title, "border-gray-300 dark:border-gray-700")}
                        />
                        <textarea
                          value={editingDescription}
                          onChange={e => setEditingDescription(e.target.value)}
                          rows={2}
                          className={cn("w-full px-2 py-1 rounded border bg-transparent resize-none focus:outline-none", styles.desc, "border-gray-300 dark:border-gray-700")}
                        />
                      </div>
                    ) : (
                      <>
                        <h4 className={cn("mb-1 text-[15px] font-bold pr-12", styles.title)}>
                          {highlight.title}
                        </h4>
                        <p className={cn("text-[13px] pr-12", styles.desc)}>
                          {highlight.description}
                        </p>
                      </>
                    )}
                  </div>
                );
              })
            ) : (
              <p className="text-[13px] text-gray-500">
                No highlights found.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Estimated Value", value: summary?.estimated_value != null ? `$${summary.estimated_value.toLocaleString()}` : "N/A" },
          { label: "Total Items", value: summary?.total_items ?? "N/A" },
          { label: "Duration", value: summary?.duration_weeks ? `${summary.duration_weeks} wks` : "N/A" },
          { label: "Labor Hours", value: summary?.labor_hours || "N/A" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 rounded-2xl p-4 shadow-sm text-center"
          >
            <div className="text-[12px] font-bold text-gray-400 uppercase tracking-wider mb-1">{stat.label}</div>
            <div className="text-[20px] font-black text-gray-900 dark:text-white">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Selected Divisions */}
      <div className="bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm">
        <h3 className="text-[15px] font-bold text-gray-900 dark:text-white mb-1">Selected Divisions</h3>
        <p className="text-[13px] text-gray-500 dark:text-gray-400 mb-5">Division breakdown and allocation</p>
        <div className="flex flex-wrap gap-3">
          {summary?.selected_divisions?.length ? (
            summary.selected_divisions.map((div: any) => (
              <div
                key={div.id || div.code}
                className="flex items-center border border-emerald-200 dark:border-emerald-800 rounded-lg shadow-[#A4F4CF] px-3 py-1.5 bg-emerald-50/30 dark:bg-emerald-900/10"
              >
                <span className="text-[11px] font-bold text-white bg-emerald-500 rounded px-1.5 py-0.5 mr-2">
                  Div {div.code}
                </span>
                <span className="text-[13px] font-bold text-gray-700 dark:text-gray-300">{div.name}</span>
              </div>
            ))
          ) : (
            <p className="text-[13px] text-gray-500">No divisions selected.</p>
          )}
        </div>
      </div>

      {/* <ReanalyzeBlock projectId={projectId} section="summary" data={data?.data} /> */}
      <DeleteConfirmationModal
        isOpen={!!deleteItemId}
        onClose={() => setDeleteItemId(null)}
        onConfirm={handleDeleteConfirm}
        isDeleting={isUpdating}
        title="Delete Highlight"
        description="Are you sure you want to delete this highlight? This action cannot be undone."
      />
    </div>
  );
}
