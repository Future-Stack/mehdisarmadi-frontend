import React, { useState } from "react";
import { Edit3, Check, X, Loader2, Edit, XCircle } from "lucide-react";
import { toast } from "sonner";
import { useGetProjectExclusionsQuery, useUpdateProjectAnalysisSectionMutation } from "@/store/api/projectApi";
import { SectionSkeleton, SectionError, ReanalyzeBlock, DeleteConfirmationModal, PdfReferenceLink } from "./shared";

interface Props {
  projectId: string;
}

export default function ExclusionsTab({ projectId }: Props) {
  const { data, isLoading, isError, refetch } = useGetProjectExclusionsQuery(projectId);
  const [updateSection, { isLoading: isUpdating }] = useUpdateProjectAnalysisSectionMutation();
  const exclusions = data?.data?.payload;

  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [deleteItemId, setDeleteItemId] = useState<string | number | null>(null);
  const [editingText, setEditingText] = useState("");

  const handleStartEdit = (item: any) => {
    setEditingId(item.id);
    setEditingText(item.text);
  };

  const handleSaveEdit = async (item: any) => {
    if (!exclusions?.items) return;
    const newItems = exclusions.items.map((i: any) =>
      i.id === item.id ? { ...i, text: editingText } : i
    );
    try {
      await updateSection({ projectId, section: "exclusions", data: { payload: { items: newItems }, note: "Manual edits from estimator" } }).unwrap();
      toast.success("Exclusion updated.");
      setEditingId(null);
    } catch {
      toast.error("Failed to update exclusion.");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!exclusions?.items || !deleteItemId) return;
    const newItems = exclusions.items.filter((i: any) => i.id !== deleteItemId);
    try {
      await updateSection({ projectId, section: "exclusions", data: { payload: { items: newItems }, note: "Manual edits from estimator" } }).unwrap();
      toast.success("Exclusion deleted.");
      setDeleteItemId(null);
    } catch {
      toast.error("Failed to delete exclusion.");
    }
  };

  if (isLoading) return <SectionSkeleton />;
  if (isError)
    return <SectionError message="Failed to load exclusions. Please try again." onRetry={refetch} />;

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 rounded-3xl p-6 md:p-8 shadow-sm">

        <div className="flex justify-between items-center mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">
          <div>
            <h2 className="text-[20px] font-bold text-gray-900 dark:text-white mb-1">
              {exclusions?.title || "Exclusions"}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
              {exclusions?.subtitle || "Items explicitly excluded from scope."}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {exclusions?.items?.length ? (
            exclusions.items.map((item: any, idx: number) => (
              <div
                key={item.id ?? idx}
                className="p-5 rounded-2xl border border-red-100 dark:border-red-950/40 bg-red-50/30 dark:bg-red-950/10 space-y-3 group"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex gap-3 flex-1">
                    <XCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                    <div className="flex-1">
                      {editingId === item.id ? (
                        <textarea
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          rows={2}
                          className="w-full p-2 rounded-lg border border-red-300 dark:border-red-700 bg-transparent text-[14px] font-bold text-red-950 dark:text-red-100 resize-none focus:outline-none focus:border-red-500"
                        />
                      ) : (
                        <h4 className="text-[15px] font-bold text-gray-900 dark:text-white leading-snug">
                          {item.text}
                        </h4>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {item.assigned_to && (
                      <span className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 text-[10px] font-bold px-2.5 py-1 rounded-md">
                        Assigned: {item.assigned_to}
                      </span>
                    )}
                    {item.exclusion_type && (
                      <span className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-[10px] font-bold px-2.5 py-1 rounded-md capitalize">
                        {item.exclusion_type}
                      </span>
                    )}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-1">
                      {editingId === item.id ? (
                        <>
                          <button
                            onClick={() => handleSaveEdit(item)}
                            disabled={isUpdating}
                            className="p-1.5 text-emerald-600 hover:text-emerald-700 transition-colors rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/30"
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
                        <button
                          onClick={() => handleStartEdit(item)}
                          className="flex gap-1 items-center px-2.5 py-1 text-red-700 bg-red-100 hover:bg-red-200 dark:bg-red-900/40 dark:text-red-300 transition-colors rounded-md text-[11px] font-bold"
                        >
                          Edit <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Additional Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-2 text-[12px] pl-8">
                  {item.reason && (
                    <div className="bg-white/80 dark:bg-gray-900/50 p-2.5 rounded-lg border border-red-100/60 dark:border-red-900/30">
                      <span className="font-bold text-gray-800 dark:text-gray-200 block mb-0.5">Reason:</span>
                      <span className="text-gray-600 dark:text-gray-400">{item.reason}</span>
                    </div>
                  )}
                  {item.scope_boundary && (
                    <div className="bg-amber-50/60 dark:bg-amber-950/20 p-2.5 rounded-lg border border-amber-200/50 dark:border-amber-900/30">
                      <span className="font-bold text-amber-800 dark:text-amber-300 block mb-0.5">Scope Boundary:</span>
                      <span className="text-amber-900/80 dark:text-amber-200/80">{item.scope_boundary}</span>
                    </div>
                  )}
                  {item.commercial_treatment && (
                    <div className="bg-blue-50/60 dark:bg-blue-950/20 p-2.5 rounded-lg border border-blue-100 dark:border-blue-900/30 md:col-span-2">
                      <span className="font-bold text-blue-800 dark:text-blue-300 block mb-0.5">Commercial Treatment:</span>
                      <span className="text-blue-900/80 dark:text-blue-200/80">{item.commercial_treatment}</span>
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
            <p className="text-[13px] text-gray-500">No exclusions found.</p>
          )}
        </div>
      </div>

      <ReanalyzeBlock projectId={projectId} section="exclusions" data={data?.data} />
    </div>
  );
}
