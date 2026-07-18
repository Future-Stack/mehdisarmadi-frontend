import React, { useState } from "react";
import { Edit3, FileText, Trash2, Check, X, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import { useGetProjectClarificationsQuery, useUpdateProjectAnalysisSectionMutation } from "@/store/api/projectApi";
import { SectionSkeleton, SectionError, ReanalyzeBlock, DeleteConfirmationModal } from "./shared";

interface Props {
  projectId: string;
}

export default function ClarificationsTab({ projectId }: Props) {
  const { data, isLoading, isError, refetch } = useGetProjectClarificationsQuery(projectId);
  const [updateSection, { isLoading: isUpdating }] = useUpdateProjectAnalysisSectionMutation();
  const clarifications = data?.data?.payload || data?.data;

  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");

  const handleStartEdit = (item: any) => {
    setEditingId(item.id);
    setEditingText(item.question);
  };

  const handleSaveEdit = async (item: any) => {
    if (!clarifications?.items) return;
    const newItems = clarifications.items.map((i: any) =>
      i.id === item.id ? { ...i, question: editingText } : i
    );
    try {
      await updateSection({ projectId, section: "clarifications", data: { payload: { items: newItems }, note: "Manual edits from estimator" } }).unwrap();
      toast.success("Clarification updated.");
      setEditingId(null);
    } catch {
      toast.error("Failed to update clarification.");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!clarifications?.items || !deleteItemId) return;
    const newItems = clarifications.items.filter((i: any) => i.id !== deleteItemId);
    try {
      await updateSection({ projectId, section: "clarifications", data: { payload: { items: newItems }, note: "Manual edits from estimator" } }).unwrap();
      toast.success("Clarification deleted.");
      setDeleteItemId(null);
    } catch {
      toast.error("Failed to delete clarification.");
    }
  };

  if (isLoading) return <SectionSkeleton />;
  if (isError)
    return (
      <SectionError message="Failed to load clarifications. Please try again." onRetry={refetch} />
    );

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 rounded-3xl p-6 md:p-8 shadow-sm">

        <div className="flex justify-between items-center mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">
          <div>
            <h2 className="text-[20px] font-bold text-gray-900 dark:text-white mb-1">
              {clarifications?.title || "Clarifications Needed"}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
              {clarifications?.subtitle || "Items requiring clarification from owner/architect."}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {clarifications?.items?.length ? (
            clarifications.items.map((item: any) => (
              <div
                key={item.id}
                className="flex gap-4 p-4 rounded-xl border border-emerald-100 dark:border-emerald-900/30 bg-emerald-50/30 dark:bg-emerald-900/10 group"
              >
                <span className="text-[14px] font-bold text-emerald-600 mt-0.5 shrink-0">{item.id}.</span>
                <div className="flex-1">
                  {editingId === item.id ? (
                    <textarea
                      value={editingText}
                      onChange={e => setEditingText(e.target.value)}
                      rows={2}
                      className="w-full p-2 rounded-lg border border-emerald-300 dark:border-emerald-700 bg-transparent text-[13px] font-medium text-emerald-900 dark:text-emerald-100 resize-none focus:outline-none focus:border-emerald-500"
                    />
                  ) : (
                    <h4 className="text-[14px] font-bold text-emerald-900 dark:text-emerald-100 mb-1">{item.question}</h4>
                  )}
                  {item.reference?.file && item.reference.file !== "null" && (
                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-gray-400 mt-1">
                      <FileText className="w-3.5 h-3.5" />
                      {item.reference.file}
                      {item.reference.page && ` • p.${item.reference.page}`}
                      {item.reference.section && ` • ${item.reference.section}`}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity self-start">
                  {editingId === item.id ? (
                    <>
                      <button
                        onClick={() => handleSaveEdit(item)}
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
                        onClick={() => handleStartEdit(item)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteItemId(item.id)}
                        disabled={isUpdating}
                        className="p-1.5 text-gray-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-[13px] text-gray-500">No clarifications needed.</p>
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
