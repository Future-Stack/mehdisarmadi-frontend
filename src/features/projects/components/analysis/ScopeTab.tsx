/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import {
  CheckSquare,
  Edit3,
  Copy,
  Trash2,
  Check,
  X,
  Square,
  AlertTriangle,
  AlertCircle,
  Info,
  Search,
  Layers,
  MapPin,
  Wrench,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import {
  useGetProjectScopeQuery,
  useUpdateProjectAnalysisSectionMutation,
  useSaveProjectQuoteMutation,
  useGetProjectQuoteQuery,
  ScopePayload,
} from "@/store/api/projectApi";
import {
  SectionSkeleton,
  SectionError,
  ReanalyzeBlock,
  DeleteConfirmationModal,
  PdfReferenceLink,
  getSectionPayload,
  getProposedPayload,
} from "./shared";

interface Props {
  projectId: string;
}

export default function ScopeTab({ projectId }: Props) {
  const { data, isLoading, isError, refetch } = useGetProjectScopeQuery(projectId);
  const [updateSection, { isLoading: isUpdating }] = useUpdateProjectAnalysisSectionMutation();
  const { data: quoteData } = useGetProjectQuoteQuery(projectId);
  const [saveQuote] = useSaveProjectQuoteMutation();

  const scope = getSectionPayload<ScopePayload>(data);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilterCode, setActiveFilterCode] = useState("all");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const [editingScopeItem, setEditingScopeItem] = useState("");
  const [editingNotes, setEditingNotes] = useState("");

  const items: any[] = useMemo(() => {
    if (!scope?.items) return [];
    return scope.items.map((item: any, i: number) => ({
      ...item,
      id: item.id || `scope-item-${i}`,
      scopeItem: item.scopeItem || item.description || item.title || "",
      division: item.division || "00",
      include: item.include !== false,
    }));
  }, [scope?.items]);

  // Combine filters from API with unique divisions present in items
  const filterOptions = useMemo(() => {
    const list: Array<{ code: string; label: string }> = [];

    if (scope?.filters?.length) {
      scope.filters.forEach((f: any) => {
        list.push({ code: f.code || "all", label: f.label });
      });
    } else {
      list.push({ code: "all", label: "All Scope" });
    }

    if (items.length) {
      items.forEach((item: any) => {
        if (item.division) {
          const divCode = String(item.division).padStart(2, "0");
          if (!list.some((f) => f.code === divCode || f.code === item.division)) {
            list.push({ code: item.division, label: `Div ${divCode}` });
          }
        }
      });
    }

    return list;
  }, [scope?.filters, items]);

  const filteredItems = useMemo(() => {
    return items.filter((item: any) => {
      const query = searchQuery.trim().toLowerCase();
      const itemText = (item.scopeItem || item.description || "").toLowerCase();
      const notesText = (item.notes || "").toLowerCase();
      const divText = String(item.division || "").toLowerCase();
      const specsText = Array.isArray(item.specifications) ? item.specifications.join(" ").toLowerCase() : "";
      const inclusionsText = Array.isArray(item.inclusions) ? item.inclusions.join(" ").toLowerCase() : "";

      const matchesSearch =
        !query ||
        itemText.includes(query) ||
        notesText.includes(query) ||
        divText.includes(query) ||
        specsText.includes(query) ||
        inclusionsText.includes(query);

      const matchesFilter =
        activeFilterCode === "all" ||
        item.division === activeFilterCode ||
        String(item.division).padStart(2, "0") === activeFilterCode;

      return matchesSearch && matchesFilter;
    });
  }, [items, searchQuery, activeFilterCode]);

  const includedCount = useMemo(() => {
    return items.filter((item: any) => item.include !== false).length;
  }, [items]);

  const handleStartEdit = (row: any) => {
    setEditingId(row.id);
    setEditingScopeItem(row.scopeItem || row.description || "");
    setEditingNotes(row.notes || "");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingScopeItem("");
    setEditingNotes("");
  };

  const handleSaveEdit = async (rowId: string) => {
    const newItems = items.map((item: any) =>
      item.id === rowId ? { ...item, scopeItem: editingScopeItem, notes: editingNotes } : item
    );
    try {
      await updateSection({
        projectId,
        section: "scope",
        data: {
          payload: { ...scope, items: newItems },
          note: "Estimator updated scope item",
        },
      }).unwrap();
      toast.success("Scope item updated.");
      handleCancelEdit();
    } catch {
      toast.error("Failed to update scope item.");
    }
  };

  const handleToggleInclude = async (row: any) => {
    const updatedInclude = row.include === false;
    const newItems = items.map((item: any) =>
      item.id === row.id ? { ...item, include: updatedInclude } : item
    );
    try {
      await updateSection({
        projectId,
        section: "scope",
        data: {
          payload: { ...scope, items: newItems },
          note: `Estimator ${updatedInclude ? "included" : "excluded"} scope item`,
        },
      }).unwrap();
      toast.success(updatedInclude ? "Item included in scope." : "Item excluded from scope.");
    } catch {
      toast.error("Failed to update item include status.");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteItemId) return;
    const newItems = items.filter((item: any) => item.id !== deleteItemId);
    try {
      await updateSection({
        projectId,
        section: "scope",
        data: {
          payload: { ...scope, items: newItems, total_items: newItems.length },
          note: "Estimator deleted scope item",
        },
      }).unwrap();
      toast.success("Scope item deleted successfully.");
      setDeleteItemId(null);
    } catch {
      toast.error("Failed to delete scope item.");
    }
  };

  const handleDecision = async (decision: "accept" | "reject") => {
    const proposedPayload = getProposedPayload(data?.data);
    const currentPayload = scope || {};

    const nextPayload =
      decision === "accept" && proposedPayload?.updated
        ? proposedPayload.updated
        : currentPayload;

    try {
      await updateSection({
        projectId,
        section: "scope",
        data: {
          payload: nextPayload,
          note:
            decision === "accept"
              ? `Estimator accepted AI-proposed scope changes: ${proposedPayload?.ai_instructions || ""}`
              : "Estimator rejected AI-proposed scope changes",
        },
      }).unwrap();

      if (quoteData?.data) {
        const existingQuote = quoteData.data.savedQuote?.quote || {};
        const aiDraft = quoteData.data.aiQuoteDraft || {};
        const projectDetails = quoteData.data.projectQuoteDetails || {};

        let scopeOfWork: string[] =
          existingQuote.scopeOfWork ||
          aiDraft.scope_of_work?.map(
            (s: any) => `Division ${s.division_code} - ${s.division_label}: ${s.details?.join(", ") || ""}`
          ) ||
          [];

        if (decision === "accept" && proposedPayload?.updated?.items) {
          scopeOfWork = proposedPayload.updated.items.map((it: any) =>
            it.scopeItem
              ? `[Div ${it.division || "00"}] ${it.scopeItem}${it.notes ? `: ${it.notes}` : ""}`
              : String(it.text || it)
          );
        } else if (decision === "reject" && proposedPayload?.proposed_changes?.changes) {
          const changes: string[] = proposedPayload.proposed_changes.changes;
          scopeOfWork = scopeOfWork.filter((item) => !changes.some((c) => item.includes(c)));
        }

        const quotePayload = {
          quote: {
            ...existingQuote,
            projectName: existingQuote.projectName || projectDetails.projectName || "",
            quoteNumber: existingQuote.quoteNumber || "Q-2026-042",
            clientName: existingQuote.clientName || projectDetails.clientName || "",
            scopeOfWork,
          },
          status: "completed",
        };

        await saveQuote({ projectId, data: quotePayload }).unwrap();
      }

      toast.success(decision === "accept" ? "Proposed changes accepted." : "Proposed changes rejected.");
      refetch();
    } catch {
      toast.error(`Failed to ${decision} proposed changes.`);
    }
  };

  if (isLoading) return <SectionSkeleton />;
  if (isError)
    return <SectionError message="Failed to load scope items. Please try again." onRetry={refetch} />;

  return (
    <div className="space-y-6 pb-8 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 rounded-3xl p-6 md:p-8 shadow-sm">
        {/* Dynamic Header & Intelligence Badges */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-gray-100 dark:border-gray-800 pb-5">
          <div className="space-y-1">
            <h2 className="text-[20px] font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-600" />
              {scope?.title || "Scope of Work"}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
              Comprehensive work packages identified from specifications and drawings
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {scope?.confidence && (
              <span
                className={cn(
                  "text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border",
                  scope.confidence.toLowerCase() === "high"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
                    : scope.confidence.toLowerCase() === "medium"
                    ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800"
                    : "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800"
                )}
              >
                {scope.confidence} confidence
              </span>
            )}

            {scope?.completeness && (
              <span
                className={cn(
                  "text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border",
                  scope.completeness.toLowerCase() === "complete"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
                    : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800"
                )}
              >
                {scope.completeness}
              </span>
            )}

            <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
              {scope?.showing
                ? `Showing ${scope.showing}`
                : `Showing ${filteredItems.length} of ${items.length} items`}
            </span>
          </div>
        </div>

        {/* Dynamic Validation Errors Banner */}
        {Boolean(scope?.validation_errors?.length) && (
          <div className="bg-amber-50/90 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/60 rounded-2xl p-4 mb-6 flex gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
            <div className="space-y-1 flex-1">
              <h4 className="text-[14px] font-bold text-amber-900 dark:text-amber-300">
                Validation Notices
              </h4>
              <div className="space-y-0.5">
                {scope?.validation_errors?.map((err, i) => (
                  <p key={i} className="text-[13px] text-amber-800/90 dark:text-amber-300">
                    • {err}
                  </p>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Warnings Banner */}
        {Boolean(scope?.warnings?.length) && (
          <div className="bg-orange-50/90 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800/60 rounded-2xl p-4 mb-6 flex gap-3">
            <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5 shrink-0" />
            <div className="space-y-1 flex-1">
              <h4 className="text-[14px] font-bold text-orange-900 dark:text-orange-300">
                Warnings
              </h4>
              <div className="space-y-0.5">
                {scope?.warnings?.map((w, i) => (
                  <p key={i} className="text-[13px] text-orange-800/90 dark:text-orange-300">
                    • {w}
                  </p>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Missing Information Banner */}
        {Boolean(scope?.missing_information?.length) && (
          <div className="bg-blue-50/90 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/60 rounded-2xl p-4 mb-6 flex gap-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
            <div className="space-y-1 flex-1">
              <h4 className="text-[14px] font-bold text-blue-900 dark:text-blue-300">
                Missing Information
              </h4>
              <div className="space-y-0.5">
                {scope?.missing_information?.map((m, i) => (
                  <p key={i} className="text-[13px] text-blue-800/90 dark:text-blue-300">
                    • {m}
                  </p>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1">
            {/* Search Input */}
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search scope items..."
                className="w-full h-10 pl-9 pr-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900 text-[13px] focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-gray-900 dark:text-white"
              />
            </div>

            {/* Filter Buttons */}
            {filterOptions.length > 1 && (
              <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl overflow-x-auto hide-scrollbar">
                {filterOptions.map((f) => {
                  const isCurrentlyActive = activeFilterCode === f.code;
                  return (
                    <button
                      key={f.code}
                      onClick={() => setActiveFilterCode(f.code)}
                      className={cn(
                        "px-3.5 py-1.5 text-[12px] font-bold rounded-lg transition-colors whitespace-nowrap",
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
            )}
          </div>

          <div className="text-[12px] font-semibold text-gray-500 dark:text-gray-400 shrink-0">
            {includedCount} of {items.length} included
          </div>
        </div>

        {/* Scope Table */}
        <div className="overflow-x-auto border border-gray-200 dark:border-gray-800 rounded-2xl mb-4 shadow-sm">
          <table className="w-full text-left text-[12px]">
            <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="px-4 py-3 font-bold text-gray-600 dark:text-gray-400 w-16">Div</th>
                <th className="px-4 py-3 font-bold text-gray-600 dark:text-gray-400 min-w-[260px]">
                  Scope Item & Specifications
                </th>
                <th className="px-4 py-3 font-bold text-gray-600 dark:text-gray-400 min-w-[130px]">
                  Quantity
                </th>
                <th className="px-4 py-3 font-bold text-gray-600 dark:text-gray-400 text-center w-20">
                  Include
                </th>
                <th className="px-4 py-3 font-bold text-gray-600 dark:text-gray-400 min-w-[180px]">
                  Notes
                </th>
                <th className="px-4 py-3 font-bold text-gray-600 dark:text-gray-400 min-w-[150px]">
                  Source
                </th>
                <th className="px-4 py-3 font-bold text-gray-600 dark:text-gray-400 text-center w-24">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-gray-900">
              {filteredItems.length > 0 ? (
                filteredItems.map((row: any, idx: number) => {
                  const isEditing = editingId === row.id;

                  return (
                    <tr
                      key={row.id || idx}
                      className={cn(
                        "hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors",
                        row.include === false && "opacity-60 bg-gray-50/40 dark:bg-gray-900/40"
                      )}
                    >
                      {/* Division Badge */}
                      <td className="px-4 py-3.5 align-top">
                        <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md inline-block">
                          Div {String(row.division || "00").padStart(2, "0")}
                        </span>
                      </td>

                      {/* Scope Item with Metadata Chips */}
                      <td className="px-4 py-3.5 align-top space-y-1.5">
                        {isEditing ? (
                          <textarea
                            value={editingScopeItem}
                            onChange={(e) => setEditingScopeItem(e.target.value)}
                            rows={2}
                            className="w-full p-2 rounded-lg border border-emerald-300 dark:border-emerald-700 bg-white dark:bg-gray-800 text-[13px] font-bold text-gray-900 dark:text-white resize-none focus:outline-none focus:border-emerald-500"
                          />
                        ) : (
                          <div className="font-bold text-[13px] text-gray-900 dark:text-white leading-snug">
                            {row.scopeItem}
                          </div>
                        )}

                        {/* Location & Work Type Chips */}
                        <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                          {row.location && (
                            <span className="inline-flex items-center gap-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded font-medium">
                              <MapPin className="w-3 h-3 text-gray-400" />
                              {row.location}
                            </span>
                          )}
                          {row.work_type && (
                            <span className="inline-flex items-center gap-1 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded font-medium capitalize">
                              <Wrench className="w-3 h-3 text-blue-500" />
                              {row.work_type}
                            </span>
                          )}
                          {row.confidence && (
                            <span className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded font-medium capitalize">
                              {row.confidence} conf.
                            </span>
                          )}
                        </div>

                        {/* Specifications & Inclusions */}
                        {Boolean(row.specifications?.length) && (
                          <div className="text-[11px] text-gray-500">
                            <span className="font-semibold text-gray-700 dark:text-gray-300">Specs: </span>
                            {row.specifications.join(", ")}
                          </div>
                        )}
                        {Boolean(row.inclusions?.length) && (
                          <div className="text-[11px] text-gray-500">
                            <span className="font-semibold text-gray-700 dark:text-gray-300">Inclusions: </span>
                            {row.inclusions.join(", ")}
                          </div>
                        )}
                        {Boolean(row.trade_interfaces?.length) && (
                          <div className="text-[11px] text-gray-400 dark:text-gray-500">
                            <span className="font-semibold">Interfaces: </span>
                            {row.trade_interfaces.join(" • ")}
                          </div>
                        )}
                      </td>

                      {/* Quantity */}
                      <td className="px-4 py-3.5 align-top">
                        <div className="font-semibold text-gray-900 dark:text-gray-100">
                          {row.quantity?.value != null && row.quantity.value > 0
                            ? `${row.quantity.value} ${row.quantity?.unit || ""}`
                            : row.quantity?.unit && row.quantity.unit !== "unspecified"
                            ? row.quantity.unit
                            : "0 unspecified"}
                        </div>
                        {row.quantity_basis && (
                          <div className="text-[10px] text-gray-400 capitalize">
                            Basis: {row.quantity_basis}
                          </div>
                        )}
                      </td>

                      {/* Include Toggle */}
                      <td className="px-4 py-3.5 align-top text-center">
                        <button
                          onClick={() => handleToggleInclude(row)}
                          disabled={isUpdating}
                          className={cn(
                            "p-1.5 rounded-lg transition-colors disabled:opacity-50",
                            row.include !== false
                              ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100"
                              : "text-gray-400 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200"
                          )}
                          title={row.include !== false ? "Included in Scope" : "Excluded from Scope"}
                        >
                          {row.include !== false ? (
                            <CheckSquare className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Square className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                      </td>

                      {/* Notes */}
                      <td className="px-4 py-3.5 align-top text-gray-600 dark:text-gray-300">
                        {isEditing ? (
                          <input
                            value={editingNotes}
                            onChange={(e) => setEditingNotes(e.target.value)}
                            className="w-full h-8 px-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-[12px] focus:outline-none focus:border-emerald-500"
                          />
                        ) : (
                          <span className="leading-relaxed">{row.notes || "—"}</span>
                        )}
                      </td>

                      {/* Source */}
                      <td className="px-4 py-3.5 align-top">
                        <PdfReferenceLink projectId={projectId} reference={row.source} />
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 align-top text-center">
                        <div className="flex items-center justify-center gap-1">
                          {isEditing ? (
                            <>
                              <button
                                onClick={() => handleSaveEdit(row.id)}
                                disabled={isUpdating}
                                className="p-1 text-emerald-600 hover:text-emerald-700 transition-colors rounded hover:bg-emerald-50 dark:hover:bg-emerald-900/30"
                                title="Save"
                              >
                                {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="p-1 text-gray-400 hover:text-gray-700 transition-colors rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                                title="Cancel"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleStartEdit(row)}
                                className="p-1 text-gray-400 hover:text-blue-600 transition-colors rounded hover:bg-blue-50 dark:hover:bg-blue-900/30"
                                title="Edit"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  navigator.clipboard?.writeText(row.scopeItem || "");
                                  toast.success("Copied to clipboard.");
                                }}
                                className="p-1 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                                title="Copy"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setDeleteItemId(row.id)}
                                disabled={isUpdating}
                                className="p-1 text-gray-400 hover:text-red-600 transition-colors rounded hover:bg-red-50 dark:hover:bg-red-900/30 disabled:opacity-40"
                                title="Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-[13px] text-gray-500">
                    No scope items found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="text-[12px] font-medium text-gray-500">
          Showing {filteredItems.length} of {items.length} items • {includedCount} included in scope
        </div>
      </div>

      <ReanalyzeBlock
        projectId={projectId}
        section="scope"
        data={data?.data}
        onAccept={() => handleDecision("accept")}
        onReject={() => handleDecision("reject")}
      />

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