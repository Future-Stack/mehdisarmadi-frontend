import { FileText, Edit3, Trash2, Check, X, Loader2 } from "lucide-react";
import { useGetProjectAddendaQuery, useUpdateProjectAnalysisSectionMutation } from "@/store/api/projectApi";
import { SectionSkeleton, SectionError, AIInstructionSection, ProposedChangesReview, DeleteConfirmationModal } from "./shared";
import React, { useState } from "react";
import { toast } from "sonner";

interface Props {
  projectId: string;
}

export default function AddendaTab({ projectId }: Props) {
  const { data, isLoading, isError, refetch } = useGetProjectAddendaQuery(projectId);
  const [updateSection, { isLoading: isUpdating }] = useUpdateProjectAnalysisSectionMutation();
  const addenda = data?.data;

  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingDescription, setEditingDescription] = useState("");

  const handleStartEdit = (item: any) => {
    setEditingId(item.id);
    setEditingTitle(item.title || item.text);
    setEditingDescription(item.description || "");
  };

  const handleSaveEdit = async (item: any) => {
    if (!addenda?.items) return;
    const newItems = addenda.items.map((i: any) =>
      i.id === item.id ? { ...i, title: editingTitle, description: editingDescription } : i
    );
    try {
      await updateSection({ projectId, section: "addenda", data: { payload: { items: newItems }, note: "Manual edits from estimator" } }).unwrap();
      toast.success("Addenda item updated.");
      setEditingId(null);
    } catch {
      toast.error("Failed to update addenda item.");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!addenda?.items || !deleteItemId) return;
    const newItems = addenda.items.filter((i: any) => i.id !== deleteItemId);
    try {
      await updateSection({ projectId, section: "addenda", data: { payload: { items: newItems }, note: "Manual edits from estimator" } }).unwrap();
      toast.success("Addenda item deleted.");
      setDeleteItemId(null);
    } catch {
      toast.error("Failed to delete addenda item.");
    }
  };

  if (isLoading) return <SectionSkeleton />;
  if (isError)
    return <SectionError message="Failed to load addenda. Please try again." onRetry={refetch} />;

  return (
    <div className="space-y-6">
      <ProposedChangesReview projectId={projectId} section="addenda" data={data?.data} />
      <div className="bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 rounded-3xl p-6 md:p-8 shadow-sm">

        <div className="mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">
          <h2 className="text-[20px] font-bold text-gray-900 dark:text-white mb-1">
            {addenda?.title || "Addenda Changes"}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            {addenda?.subtitle || "Changes issued through addenda."}
          </p>
        </div>

        {addenda?.items?.length ? (
          <div className="space-y-4">
            {addenda.items.map((item: any) => (
              <div key={item.id} className="relative pl-4 group">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 rounded-full" />
                <div className="bg-emerald-50/30 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/50 rounded-xl p-5 relative">
                  
                  {/* Actions hover */}
                  <div className="absolute top-4 right-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {editingId === item.id ? (
                      <>
                        <button onClick={() => handleSaveEdit(item)} disabled={isUpdating} className="p-1.5 text-emerald-600 hover:text-emerald-700 transition-colors rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/50">
                          {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                        </button>
                        <button onClick={() => setEditingId(null)} className="p-1.5 text-gray-400 hover:text-gray-700 transition-colors rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800">
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => handleStartEdit(item)} className="p-1.5 text-blue-500 hover:bg-blue-100 transition-colors rounded-lg dark:hover:bg-blue-900/50">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button onClick={() => setDeleteItemId(item.id)} className="p-1.5 text-red-500 hover:bg-red-100 transition-colors rounded-lg dark:hover:bg-red-900/50">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                  {/* Badge + date row */}
                  {(item.badge || item.date) && (
                    <div className="flex items-center gap-3 mb-2">
                      {item.badge && (
                        <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                          {item.badge}
                        </span>
                      )}
                      {item.date && (
                        <span className="text-sm font-medium text-gray-500">{item.date}</span>
                      )}
                    </div>
                  )}

                  {editingId === item.id ? (
                    <input
                      value={editingTitle}
                      onChange={e => setEditingTitle(e.target.value)}
                      className="w-full px-3 py-1.5 mb-2 rounded border border-emerald-300 dark:border-emerald-700 bg-transparent text-[16px] font-bold focus:outline-none focus:border-emerald-500"
                    />
                  ) : (
                    <h4 className="text-[16px] font-bold text-gray-900 dark:text-white mb-1">
                      {item.title || item.text}
                    </h4>
                  )}

                  {editingId === item.id ? (
                    <textarea
                      value={editingDescription}
                      onChange={e => setEditingDescription(e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 mb-4 rounded border border-emerald-300 dark:border-emerald-700 bg-transparent text-[13px] resize-none focus:outline-none focus:border-emerald-500"
                    />
                  ) : (
                    item.description && (
                      <p className="text-[13px] text-gray-600 dark:text-gray-400 mb-4">{item.description}</p>
                    )
                  )}

                  {/* Impact grid */}
                  {(item.impact || item.divisions || item.scope || item.price) && (
                    <div className="grid grid-cols-2 gap-y-4 gap-x-8 mb-4">
                      {item.impact && (
                        <div>
                          <div className="text-[12px] font-medium text-gray-500 mb-1">Impact Type</div>
                          <div className="text-[13px] font-bold text-gray-900 dark:text-white">{item.impact}</div>
                        </div>
                      )}
                      {item.divisions && (
                        <div>
                          <div className="text-[12px] font-medium text-gray-500 mb-1">Affected Divisions</div>
                          <div className="flex gap-2 flex-wrap">
                            {item.divisions.map((d: string) => (
                              <span key={d} className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                                {d}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {item.scope && (
                        <div>
                          <div className="text-[12px] font-medium text-gray-500 mb-1">Scope Change</div>
                          <div className="text-[13px] font-bold text-gray-900 dark:text-white">{item.scope}</div>
                        </div>
                      )}
                      {item.price && (
                        <div>
                          <div className="text-[12px] font-medium text-gray-500 mb-1">Pricing Impact</div>
                          <div className="text-[13px] font-bold text-gray-900 dark:text-white">{item.price}</div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Reference */}
                  {item.reference?.file && (
                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-gray-400 pt-3 border-t border-emerald-100 dark:border-emerald-900/50">
                      <FileText className="w-3.5 h-3.5" />
                      {item.reference.file}
                      {item.reference.page && ` • p.${item.reference.page}`}
                      {item.reference.section && ` • ${item.reference.section}`}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-400">
            <FileText className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="text-[14px] font-semibold">No addenda changes found</p>
            <p className="text-[12px] mt-1">No supported addendum changes were identified in this tender.</p>
          </div>
        )}
      </div>

      <AIInstructionSection projectId={projectId} section="addenda" />
      <DeleteConfirmationModal
        isOpen={!!deleteItemId}
        onClose={() => setDeleteItemId(null)}
        onConfirm={handleDeleteConfirm}
        isDeleting={isUpdating}
        title="Delete Addenda Item"
        description="Are you sure you want to delete this addenda item? This action cannot be undone."
      />
    </div>
  );
}
