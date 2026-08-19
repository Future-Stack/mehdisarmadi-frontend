import { Edit3, Copy, Trash2, CheckSquare, Loader2, Square, Edit, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useGetProjectAssumptionsQuery, useUpdateProjectAnalysisSectionMutation } from "@/store/api/projectApi";
import { SectionSkeleton, SectionError, ReanalyzeBlock, DeleteConfirmationModal, PdfReferenceLink } from "./shared";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface Props {
  projectId: string;
}

export default function AssumptionsTab({ projectId }: Props) {
  const { data, isLoading, isError, refetch } = useGetProjectAssumptionsQuery(projectId);
  const [updateSection, { isLoading: isUpdating }] = useUpdateProjectAnalysisSectionMutation();
  const assumptions = data?.data?.payload;

  const [deleteItemId, setDeleteItemId] = useState<string | number | null>(null);
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [editingText, setEditingText] = useState("");

  const handleToggleInclude = async (itemToToggle: any) => {
    if (!assumptions?.items) return;
    const newItems = assumptions.items.filter((item: any) => item.id !== itemToToggle.id);
    try {
      await updateSection({
        projectId,
        section: "assumptions",
        data: { payload: { items: newItems }, note: "Manual edits from estimator" }
      }).unwrap();
      toast.success("Assumption removed.");
    } catch {
      toast.error("Failed to remove assumption.");
    }
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setEditingText(item.text);
  };

  const handleDeleteConfirm = async () => {
    if (!assumptions?.items || !deleteItemId) return;
    const newItems = assumptions.items.filter((item: any) => item.id !== deleteItemId);
    try {
      await updateSection({
        projectId,
        section: "assumptions",
        data: { payload: { items: newItems }, note: "Manual edits from estimator" }
      }).unwrap();
      toast.success("Assumption deleted successfully.");
      setDeleteItemId(null);
    } catch {
      toast.error("Failed to delete assumption.");
    }
  };

  if (isLoading) return <SectionSkeleton />;
  if (isError)
    return <SectionError message="Failed to load assumptions. Please try again." onRetry={refetch} />;

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 rounded-3xl p-6 md:p-8 shadow-sm">

        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8 border-b border-gray-100 dark:border-gray-800 pb-6">
          <div>
            <h2 className="text-[20px] font-bold text-gray-900 dark:text-white mb-1">
              {assumptions?.title || "Assumptions"}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
              {assumptions?.subtitle || "Assumptions made based on tender documents."}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {assumptions?.items?.length ? (
            assumptions.items.map((item: any, index: number) => (
              <div
                key={item.id ?? index}
                className="p-5 rounded-2xl border bg-gray-50/60 dark:bg-gray-800/40 border-gray-200/80 dark:border-gray-700/80 space-y-3"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex gap-3 flex-1">
                    <span className="text-[13px] font-bold text-gray-400 w-5 shrink-0 pt-0.5">{index + 1}.</span>
                    <div className="flex-1">
                      {editingId === item.id ? (
                        <textarea
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          rows={2}
                          className="w-full p-2 rounded-lg border border-blue-300 dark:border-blue-700 bg-transparent text-[13px] font-medium resize-none focus:outline-none focus:border-blue-500"
                        />
                      ) : (
                        <p className="text-[14px] font-bold text-gray-900 dark:text-gray-100 leading-snug">
                          {item.text}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {item.status && (
                      <span className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-[10px] font-bold px-2.5 py-1 rounded-md capitalize">
                        {item.status}
                      </span>
                    )}
                    {item.assumption_type && (
                      <span className="bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 text-[10px] font-bold px-2.5 py-1 rounded-md capitalize">
                        {item.assumption_type}
                      </span>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2 ml-2">
                      <button
                        onClick={() => handleToggleInclude(item)}
                        disabled={isUpdating}
                        className={
                          item.include !== false
                            ? "flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1.5 rounded-lg border text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 transition-colors"
                            : "flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1.5 rounded-lg border text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 transition-colors"
                        }
                      >
                        {item.include !== false ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                        {item.include !== false ? "Included" : "Include"}
                      </button>
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          navigator.clipboard?.writeText(item.text || "");
                          toast.success("Copied to clipboard.");
                        }}
                        className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteItemId(item.id)}
                        disabled={isUpdating}
                        className="p-1.5 text-red-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Additional Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-2 text-[12px] pl-8">
                  {item.basis && (
                    <div className="bg-white/80 dark:bg-gray-900/50 p-2.5 rounded-lg border border-gray-200/60 dark:border-gray-700/60">
                      <span className="font-bold text-gray-800 dark:text-gray-200 block mb-0.5">Basis:</span>
                      <span className="text-gray-600 dark:text-gray-400">{item.basis}</span>
                    </div>
                  )}
                  {item.impact_if_false && (
                    <div className="bg-amber-50/60 dark:bg-amber-950/20 p-2.5 rounded-lg border border-amber-200/50 dark:border-amber-900/30">
                      <span className="font-bold text-amber-800 dark:text-amber-300 block mb-0.5">Impact if False:</span>
                      <span className="text-amber-900/80 dark:text-amber-200/80">{item.impact_if_false}</span>
                    </div>
                  )}
                  {item.validation_required && (
                    <div className="bg-blue-50/60 dark:bg-blue-950/20 p-2.5 rounded-lg border border-blue-100 dark:border-blue-900/30 md:col-span-2">
                      <span className="font-bold text-blue-800 dark:text-blue-300 block mb-0.5">Validation Required:</span>
                      <span className="text-blue-900/80 dark:text-blue-200/80">{item.validation_required}</span>
                    </div>
                  )}
                </div>

                {/* PDF Reference Link */}
                {item.reference?.file && (
                  <div className="pl-8 pt-1">
                    <PdfReferenceLink projectId={projectId} reference={item.reference} />
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-[13px] text-gray-500">No assumptions found.</p>
          )}
        </div>
      </div>

      <ReanalyzeBlock projectId={projectId} section="assumptions" data={data?.data} />
      <DeleteConfirmationModal
        isOpen={!!deleteItemId}
        onClose={() => setDeleteItemId(null)}
        onConfirm={handleDeleteConfirm}
        isDeleting={isUpdating}
        title="Delete Assumption"
        description="Are you sure you want to delete this assumption? This action cannot be undone."
      />
    </div>
  );
}
