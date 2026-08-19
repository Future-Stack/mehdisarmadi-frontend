import React, { useState } from "react";
import { Edit3, Check, X, Loader2, Edit, HelpCircle } from "lucide-react";
import { toast } from "sonner";
import { useGetProjectClarificationsQuery, useUpdateProjectAnalysisSectionMutation } from "@/store/api/projectApi";
import { SectionSkeleton, SectionError, ReanalyzeBlock, PdfReferenceLink } from "./shared";
import { cn } from "@/lib/utils";

interface Props {
  projectId: string;
}

function getPriorityBadge(priority?: string) {
  switch (priority?.toLowerCase()) {
    case "high":
    case "critical":
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
  const clarifications = data?.data?.payload;

  const [editingId, setEditingId] = useState<string | number | null>(null);
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

        <div className="space-y-4">
          {clarifications?.items?.length ? (
            clarifications.items.map((item: any, idx: number) => (
              <div
                key={item.id ?? idx}
                className="p-5 rounded-2xl border border-emerald-100 dark:border-emerald-900/30 bg-emerald-50/30 dark:bg-emerald-950/10 space-y-3 group"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex gap-3 flex-1">
                    <HelpCircle className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                    <div className="flex-1">
                      {editingId === item.id ? (
                        <textarea
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          rows={2}
                          className="w-full p-2 rounded-lg border border-emerald-300 dark:border-emerald-700 bg-transparent text-[14px] font-bold text-emerald-950 dark:text-emerald-100 resize-none focus:outline-none focus:border-emerald-500"
                        />
                      ) : (
                        <h4 className="text-[15px] font-bold text-emerald-950 dark:text-emerald-100 leading-snug">
                          {item.question}
                        </h4>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {item.priority && (
                      <span className={cn("text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wide", getPriorityBadge(item.priority))}>
                        {item.priority} Priority
                      </span>
                    )}
                    {item.requested_from && (
                      <span className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 text-[10px] font-bold px-2.5 py-1 rounded-md">
                        {item.requested_from}
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
                          className="flex gap-1 items-center px-2.5 py-1 text-emerald-700 bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300 transition-colors rounded-md text-[11px] font-bold"
                        >
                          Edit <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Additional Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-2 text-[12px]">
                  {item.reason && (
                    <div className="bg-white/80 dark:bg-gray-900/50 p-2.5 rounded-lg border border-emerald-100/60 dark:border-emerald-900/30">
                      <span className="font-bold text-gray-800 dark:text-gray-200 block mb-0.5">Reason:</span>
                      <span className="text-gray-600 dark:text-gray-400">{item.reason}</span>
                    </div>
                  )}
                  {item.impact_if_unresolved && (
                    <div className="bg-amber-50/60 dark:bg-amber-950/20 p-2.5 rounded-lg border border-amber-200/50 dark:border-amber-900/30">
                      <span className="font-bold text-amber-800 dark:text-amber-300 block mb-0.5">Impact if Unresolved:</span>
                      <span className="text-amber-900/80 dark:text-amber-200/80">{item.impact_if_unresolved}</span>
                    </div>
                  )}
                  {item.linked_risk_title && (
                    <div className="bg-blue-50/60 dark:bg-blue-950/20 p-2.5 rounded-lg border border-blue-100 dark:border-blue-900/30">
                      <span className="font-bold text-blue-800 dark:text-blue-300 block mb-0.5">Linked Risk:</span>
                      <span className="text-blue-900/80 dark:text-blue-200/80">{item.linked_risk_title}</span>
                    </div>
                  )}
                  {item.risk_category && (
                    <div className="bg-purple-50/60 dark:bg-purple-950/20 p-2.5 rounded-lg border border-purple-100 dark:border-purple-900/30">
                      <span className="font-bold text-purple-800 dark:text-purple-300 block mb-0.5">Category:</span>
                      <span className="text-purple-900/80 dark:text-purple-200/80">{item.risk_category}</span>
                    </div>
                  )}
                </div>

                {/* PDF Reference Link */}
                {item.reference?.file && item.reference.file !== "null" && (
                  <div className="pt-1">
                    <PdfReferenceLink projectId={projectId} reference={item.reference} />
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-[13px] text-gray-500">No clarifications needed.</p>
          )}
        </div>
      </div>

      <ReanalyzeBlock projectId={projectId} section="clarifications" data={data?.data} />
    </div>
  );
}
