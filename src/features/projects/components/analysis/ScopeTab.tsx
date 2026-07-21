// import React, { useState, useMemo } from "react";
// import { cn } from "@/lib/utils";
// import { CheckSquare, Edit3, Copy, Trash2, FileText, Loader2, Check, X, Square } from "lucide-react";
// import { Button } from "@/components/ui/Button";
// import { toast } from "sonner";
// import { useGetProjectScopeQuery, useUpdateProjectAnalysisSectionMutation } from "@/store/api/projectApi";
// import { SectionSkeleton, SectionError, getHighlightStyle, ReanalyzeBlock, DeleteConfirmationModal } from "./shared";

// interface Props {
//   projectId: string;
// }

// export default function ScopeTab({ projectId }: Props) {
//   const { data, isLoading, isError, refetch } = useGetProjectScopeQuery(projectId);
//   const [updateSection, { isLoading: isUpdating }] = useUpdateProjectAnalysisSectionMutation();
//   const scope = data?.data?.payload || data?.data;

//   const [searchQuery, setSearchQuery] = useState("");
//   const [activeFilterCode, setActiveFilterCode] = useState("all");

//   const filteredItems = useMemo(() => {
//     if (!scope?.items) return [];
//     return scope.items.filter((item: any) => {
//       // Apply search
//       const query = searchQuery.toLowerCase();
//       const matchesSearch = !query || 
//         item.scopeItem?.toLowerCase().includes(query) || 
//         item.notes?.toLowerCase().includes(query) ||
//         item.division?.toLowerCase().includes(query);

//       // Apply filter
//       const matchesFilter = activeFilterCode === "all" || item.division === activeFilterCode;

//       return matchesSearch && matchesFilter;
//     });
//   }, [scope?.items, searchQuery, activeFilterCode]);

//   const [editingId, setEditingId] = useState<string | null>(null);
//   const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
//   const [editingScopeItem, setEditingScopeItem] = useState("");
//   const [editingNotes, setEditingNotes] = useState("");

//   const handleStartEdit = (row: any) => {
//     setEditingId(row.id);
//     setEditingScopeItem(row.scopeItem);
//     setEditingNotes(row.notes || "");
//   };

//   const handleSaveEdit = async (rowId: string) => {
//     if (!scope?.items) return;
//     const newItems = scope.items.map((item: any) =>
//       item.id === rowId ? { ...item, scopeItem: editingScopeItem, notes: editingNotes } : item
//     );
//     try {
//       await updateSection({ projectId, section: "scope", data: { payload: { items: newItems }, note: "Manual edits from estimator" } }).unwrap();
//       toast.success("Scope item updated.");
//       setEditingId(null);
//     } catch {
//       toast.error("Failed to update scope item.");
//     }
//   };

//   const handleToggleInclude = async (itemToToggle: any) => {
//     if (!scope?.items) return;
//     const newItems = scope.items.filter((item: any) => item.id !== itemToToggle.id);
//     try {
//       await updateSection({
//         projectId,
//         section: "scope",
//         data: { payload: { items: newItems }, note: "Manual edits from estimator" }
//       }).unwrap();
//       toast.success(`Scope item removed.`);
//     } catch (err: any) {
//       toast.error("Failed to remove scope item.");
//     }
//   };

//   const handleDeleteConfirm = async () => {
//     if (!scope?.items || !deleteItemId) return;
//     const newItems = scope.items.filter((item: any) => item.id !== deleteItemId);
//     try {
//       await updateSection({
//         projectId,
//         section: "scope",
//         data: { payload: { items: newItems }, note: "Manual edits from estimator" }
//       }).unwrap();
//       toast.success("Scope item deleted successfully.");
//       setDeleteItemId(null);
//     } catch (err: any) {
//       toast.error("Failed to delete scope item.");
//     }
//   };

//   if (isLoading) return <SectionSkeleton />;
//   if (isError)
//     return <SectionError message="Failed to load scope items. Please try again." onRetry={refetch} />;

//   return (
//     <div className="space-y-6">
//       <div className="bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 rounded-3xl p-6 md:p-8 shadow-sm">

//         {/* Filters + Add Row */}
//         <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-6">
//           <div className="flex flex-col md:flex-row md:items-center gap-4">
//             {/* Search */}
//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <svg className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
//                   <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
//                 </svg>
//               </div>
//               <input
//                 type="text"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 placeholder="Search scope items..."
//                 className="w-full md:w-64 h-10 pl-10 pr-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900 text-[13px] focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
//               />
//             </div>
//             {/* Filters */}
//             <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg overflow-x-auto hide-scrollbar">
//               {scope?.filters?.map((f: any) => {
//                 const isActive = activeFilterCode === f.code || (f.active && activeFilterCode === "all" && f.code === "all"); // Simplify matching, or just strictly use activeFilterCode
//                 const isCurrentlyActive = activeFilterCode === f.code;
//                 return (
//                   <button
//                     key={f.code}
//                     onClick={() => setActiveFilterCode(f.code)}
//                     className={cn(
//                       "px-4 py-1.5 text-[12px] font-bold rounded-md transition-colors whitespace-nowrap",
//                       isCurrentlyActive
//                         ? "bg-emerald-600 text-white shadow-sm"
//                         : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
//                     )}
//                   >
//                     {f.label}
//                   </button>
//                 );
//               })}
//             </div>
//           </div>
//           <Button
//             variant="secondary"
//             className="h-10 px-5 rounded-xl font-bold bg-white border border-gray-200 dark:border-gray-700 shadow-sm text-gray-700 dark:text-gray-200 text-[13px] hover:bg-gray-50 dark:hover:bg-gray-800 flex-shrink-0"
//           >
//             + Add Row
//           </Button>
//         </div>

//         {/* Table */}
//         <div className="overflow-x-auto border border-gray-200 dark:border-gray-800 rounded-xl mb-4">
//           <table className="w-full text-left text-[12px]">
//             <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
//               <tr>
//                 <th className="px-4 py-3 font-bold text-gray-500 w-16">Div</th>
//                 <th className="px-4 py-3 font-bold text-gray-500 min-w-[200px]">Scope Item</th>
//                 <th className="px-4 py-3 font-bold text-gray-500">Quantity</th>
//                 <th className="px-4 py-3 font-bold text-gray-500 text-center">Include</th>
//                 <th className="px-4 py-3 font-bold text-gray-500">Notes</th>
//                 <th className="px-4 py-3 font-bold text-gray-500">Source</th>
//                 <th className="px-4 py-3 font-bold text-gray-500 text-center">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-gray-900">
//               {filteredItems.length > 0 ? (
//                 filteredItems.map((row: any, idx: number) => (
//                   <tr key={row.id || idx} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
//                     <td className="px-4 py-3">
//                       <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
//                         {row.division}
//                       </span>
//                     </td>
//                     <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{row.scopeItem}</td>
//                     <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
//                       {row.quantity?.value ?? 0} {row.quantity?.unit}
//                     </td>
//                     <td className="px-4 py-3 text-center">
//                       <button
//                         onClick={() => handleToggleInclude(row)}
//                         disabled={isUpdating}
//                         className={cn(
//                           "p-1 rounded transition-colors disabled:opacity-50",
//                           row.include !== false
//                             ? "text-emerald-500 hover:text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30"
//                             : "text-gray-400 bg-gray-100 dark:bg-gray-800"
//                         )}
//                       >
//                         <CheckSquare className="w-4 h-4" />
//                       </button>
//                     </td>
//                     <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
//                       {editingId === row.id ? (
//                         <input value={editingNotes} onChange={e => setEditingNotes(e.target.value)} className="w-full h-8 px-2 rounded border border-gray-200 dark:border-gray-700 bg-transparent text-[12px] focus:outline-none focus:border-emerald-500" />
//                       ) : row.notes}
//                     </td>
//                     <td className="px-4 py-3">
//                       <div className="flex items-center gap-1.5 text-gray-500">
//                         <FileText className="w-3.5 h-3.5" />
//                         <span>{row.source?.document}</span>
//                         {row.source?.page && <span className="text-gray-400">p.{row.source.page}</span>}
//                       </div>
//                     </td>
//                     <td className="px-4 py-3 text-center">
//                       <div className="flex items-center justify-center gap-2">
//                         {editingId === row.id ? (
//                           <>
//                             <button onClick={() => handleSaveEdit(row.id)} disabled={isUpdating} className="text-emerald-600 hover:text-emerald-700 transition-colors p-1 rounded hover:bg-emerald-50">
//                               {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
//                             </button>
//                             <button onClick={() => setEditingId(null)} className="text-gray-400 hover:text-gray-700 transition-colors p-1 rounded hover:bg-gray-100">
//                               <X className="w-4 h-4" />
//                             </button>
//                           </>
//                         ) : (
//                           <>
//                             <button onClick={() => handleStartEdit(row)} className="text-gray-400 hover:text-blue-600 transition-colors">
//                               <Edit3 className="w-4 h-4" />
//                             </button>
//                             {row.actions?.canDelete !== false && (
//                               <button
//                                 className="text-gray-400 hover:text-red-600 transition-colors disabled:opacity-40"
//                                 disabled={isUpdating}
//                                 onClick={() => setDeleteItemId(row.id)}
//                               >
//                                 {isUpdating ? (
//                                   <Loader2 className="w-4 h-4 animate-spin" />
//                                 ) : (
//                                   <Trash2 className="w-4 h-4" />
//                                 )}
//                               </button>
//                             )}
//                           </>
//                         )}
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan={7} className="px-4 py-8 text-center text-[13px] text-gray-500">
//                     No scope items found.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         <div className="text-[12px] font-medium text-gray-500">
//           Showing {filteredItems.length} of {scope?.items?.length || 0} items
//         </div>
//       </div>

//       <ReanalyzeBlock projectId={projectId} section="scope" data={data?.data} />
//       <DeleteConfirmationModal
//         isOpen={!!deleteItemId}
//         onClose={() => setDeleteItemId(null)}
//         onConfirm={handleDeleteConfirm}
//         isDeleting={isUpdating}
//         title="Delete Scope Item"
//         description="Are you sure you want to delete this scope item? This action cannot be undone."
//       />
//     </div>
//   );
// }




import React, { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { CheckSquare, Edit3, Copy, Trash2, FileText, Loader2, Check, X, Square, Sparkles, ThumbsUp, ThumbsDown, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import { useGetProjectScopeQuery, useUpdateProjectAnalysisSectionMutation } from "@/store/api/projectApi";
import { SectionSkeleton, SectionError, getHighlightStyle, ReanalyzeBlock, DeleteConfirmationModal, ProposedChangesReview } from "./shared";

interface Props {
  projectId: string;
}

function normalizeScopeRows(section: any): { items: any[]; filters: any[] } {
  const payload = section?.payload;
  const proposedPayload = section?.proposedPayload;
  const proposedChanges = proposedPayload?.proposed_changes;

  // Real shape (future-proof): backend already sends items/filters directly.
  if (Array.isArray(payload?.items)) {
    return { items: payload.items, filters: payload.filters || [] };
  }

  // Current actual shape: derive table rows from proposed_changes.changes.
  const changes: string[] = proposedChanges?.changes || [];
  const affectedTab: string = proposedChanges?.affected_tabs?.[0] || "-";

  const derivedItems = changes.map((changeText: string, i: number) => ({
    id: `${section?.id || "scope"}-change-${i}`,
    division: affectedTab,
    scopeItem: changeText,
    quantity: null,
    include: payload?.action !== "reject",
    notes: proposedPayload?.ai_instructions || "",
    source: { document: undefined, page: undefined },
    actions: { canDelete: false }, // derived rows aren't independently deletable
  }));

  return { items: derivedItems, filters: [{ code: "all", label: "All", active: true }] };
}

export default function ScopeTab({ projectId }: Props) {
  const { data, isLoading, isError, refetch } = useGetProjectScopeQuery(projectId);
  const [updateSection, { isLoading: isUpdating }] = useUpdateProjectAnalysisSectionMutation();

  const { items, filters } = useMemo(() => normalizeScopeRows(data?.data), [data]);
  const proposedChanges = data?.data?.proposedPayload?.proposed_changes;
  const aiInstructionUsed = data?.data?.proposedPayload?.ai_instructions;
  const currentAction = data?.data?.payload?.action as string | undefined;
  const includedCount = items.filter((item: any) => item.include !== false).length;

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilterCode, setActiveFilterCode] = useState("all");

  const filteredItems = useMemo(() => {
    return items.filter((item: any) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch = !query ||
        item.scopeItem?.toLowerCase().includes(query) ||
        item.notes?.toLowerCase().includes(query) ||
        item.division?.toLowerCase().includes(query);
      const matchesFilter = activeFilterCode === "all" || item.division === activeFilterCode;
      return matchesSearch && matchesFilter;
    });
  }, [items, searchQuery, activeFilterCode]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const [editingScopeItem, setEditingScopeItem] = useState("");
  const [editingNotes, setEditingNotes] = useState("");

  const handleStartEdit = (row: any) => {
    setEditingId(row.id);
    setEditingScopeItem(row.scopeItem);
    setEditingNotes(row.notes || "");
  };

  const handleSaveEdit = async (rowId: string) => {
    const newItems = items.map((item: any) =>
      item.id === rowId ? { ...item, scopeItem: editingScopeItem, notes: editingNotes } : item
    );
    try {
      await updateSection({ projectId, section: "scope", data: { payload: { items: newItems }, note: "Manual edits from estimator" } }).unwrap();
      toast.success("Scope item updated.");
      setEditingId(null);
    } catch {
      toast.error("Failed to update scope item.");
    }
  };

  const handleToggleInclude = async (itemToToggle: any) => {
    const newItems = items.filter((item: any) => item.id !== itemToToggle.id);
    try {
      await updateSection({ projectId, section: "scope", data: { payload: { items: newItems }, note: "Manual edits from estimator" } }).unwrap();
      toast.success("Scope item removed.");
    } catch {
      toast.error("Failed to remove scope item.");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteItemId) return;
    const newItems = items.filter((item: any) => item.id !== deleteItemId);
    try {
      await updateSection({ projectId, section: "scope", data: { payload: { items: newItems }, note: "Manual edits from estimator" } }).unwrap();
      toast.success("Scope item deleted successfully.");
      setDeleteItemId(null);
    } catch {
      toast.error("Failed to delete scope item.");
    }
  };

  // Accept / reject the AI-proposed changes shown in the "Proposed Changes" card below.
  const handleDecision = async (decision: "accept" | "reject") => {
    const currentPayload = data?.data?.payload || {};
    try {
      await updateSection({
        projectId,
        section: "scope",
        data: { payload: { ...currentPayload, action: decision }, note: `Estimator ${decision}ed proposed scope changes` },
      }).unwrap();
      toast.success(decision === "accept" ? "Proposed changes accepted." : "Proposed changes rejected.");
    } catch {
      toast.error(`Failed to ${decision} proposed changes.`);
    }
  };

  if (isLoading) return <SectionSkeleton />;
  if (isError)
    return <SectionError message="Failed to load scope items. Please try again." onRetry={refetch} />;

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 rounded-3xl p-6 md:p-8 shadow-sm">

        {/* Filters + Add Row */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search scope items..."
                className="w-full md:w-64 h-10 pl-10 pr-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900 text-[13px] focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            {/* Filters */}
            <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg overflow-x-auto hide-scrollbar">
              {filters?.map((f: any) => {
                const isCurrentlyActive = activeFilterCode === f.code;
                return (
                  <button
                    key={f.code}
                    onClick={() => setActiveFilterCode(f.code)}
                    className={cn(
                      "px-4 py-1.5 text-[12px] font-bold rounded-md transition-colors whitespace-nowrap",
                      isCurrentlyActive
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
                    )}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>
          </div>
          <Button
            variant="secondary"
            className="h-10 px-5 rounded-xl font-bold bg-white border border-gray-200 dark:border-gray-700 shadow-sm text-gray-700 dark:text-gray-200 text-[13px] hover:bg-gray-50 dark:hover:bg-gray-800 flex-shrink-0"
          >
            + Add Row
          </Button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border border-gray-200 dark:border-gray-800 rounded-xl mb-4">
          <table className="w-full text-left text-[12px]">
            <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="px-4 py-3 font-bold text-gray-500 w-16">Div</th>
                <th className="px-4 py-3 font-bold text-gray-500 min-w-[200px]">Scope Item</th>
                <th className="px-4 py-3 font-bold text-gray-500">Quantity</th>
                <th className="px-4 py-3 font-bold text-gray-500 text-center">Include</th>
                <th className="px-4 py-3 font-bold text-gray-500">Notes</th>
                <th className="px-4 py-3 font-bold text-gray-500">Source</th>
                <th className="px-4 py-3 font-bold text-gray-500 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-gray-900">
              {filteredItems.length > 0 ? (
                filteredItems.map((row: any, idx: number) => (
                  <tr key={row.id || idx} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-4 py-3">
                      <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                        {row.division}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{row.scopeItem}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                      {row.quantity?.value ?? 0} {row.quantity?.unit}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleToggleInclude(row)}
                        disabled={isUpdating}
                        className={cn(
                          "p-1 rounded transition-colors disabled:opacity-50",
                          row.include !== false
                            ? "text-emerald-500 hover:text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30"
                            : "text-gray-400 bg-gray-100 dark:bg-gray-800"
                        )}
                      >
                        <CheckSquare className="w-4 h-4" />
                      </button>
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                      {editingId === row.id ? (
                        <input value={editingNotes} onChange={e => setEditingNotes(e.target.value)} className="w-full h-8 px-2 rounded border border-gray-200 dark:border-gray-700 bg-transparent text-[12px] focus:outline-none focus:border-emerald-500" />
                      ) : row.notes}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-gray-500">
                        <FileText className="w-3.5 h-3.5" />
                        <span>{row.source?.document}</span>
                        {row.source?.page && <span className="text-gray-400">p.{row.source.page}</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {editingId === row.id ? (
                          <>
                            <button onClick={() => handleSaveEdit(row.id)} disabled={isUpdating} className="text-emerald-600 hover:text-emerald-700 transition-colors p-1 rounded hover:bg-emerald-50">
                              {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                            </button>
                            <button onClick={() => setEditingId(null)} className="text-gray-400 hover:text-gray-700 transition-colors p-1 rounded hover:bg-gray-100">
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => handleStartEdit(row)} className="text-gray-400 hover:text-blue-600 transition-colors">
                              <Edit3 className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => {
                                navigator.clipboard?.writeText(row.scopeItem || "");
                                toast.success("Copied to clipboard.");
                              }}
                              className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                            {/* {row.actions?.canDelete !== false && ( */}
                            <button
                              className="text-gray-400 hover:text-red-600 transition-colors disabled:opacity-40"
                              disabled={isUpdating}
                              onClick={() => setDeleteItemId(row.id)}
                            >
                              {isUpdating ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </button>
                            {/* )} */}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-[13px] text-gray-500">
                    No scope items found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="text-[12px] font-medium text-gray-500">
          Showing {filteredItems.length} of {items.length || 0} items • {includedCount} included in scope
        </div>
      </div>

      <ReanalyzeBlock projectId={projectId} section="scope" data={data?.data} />

      {/* <ProposedChangesReview projectId={projectId} section="scope" data={data?.data} /> */}

      <DeleteConfirmationModal
        isOpen={!!deleteItemId}
        onClose={() => setDeleteItemId(null)}
        onConfirm={handleDeleteConfirm}
        isDeleting={isUpdating}
        title="Delete Scope Item"
        description="Are you sure you want to delete this scope item? This action cannot be undone."
      />
    </div>
  );
}