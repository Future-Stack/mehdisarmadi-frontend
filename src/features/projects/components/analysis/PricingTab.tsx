import React, { useState, useEffect } from "react";
import { AlertTriangle, AlertCircle, Edit3, Trash2, Check, X, ShieldAlert, Sparkles, Info, DollarSign } from "lucide-react";
import { useGetProjectPricingQuery, useUpdateProjectAnalysisSectionMutation, PricingPayload } from "@/store/api/projectApi";
import { SectionSkeleton, SectionError, DeleteConfirmationModal, ReanalyzeBlock, PdfReferenceLink, getSectionPayload } from "./shared";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Props {
  projectId: string;
}

export default function PricingTab({ projectId }: Props) {
  const { data, isLoading, isError, refetch } = useGetProjectPricingQuery(projectId);
  const [updateSection, { isLoading: isUpdating }] = useUpdateProjectAnalysisSectionMutation();
  const pricing = getSectionPayload<PricingPayload>(data);

  // Editing state for cost items and basis items
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingType, setEditingType] = useState<"costItem" | "basis" | null>(null);
  const [editingName, setEditingName] = useState("");
  const [editingDescription, setEditingDescription] = useState("");
  const [editingAmount, setEditingAmount] = useState<string>("");

  // Deleting state
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const [deleteType, setDeleteType] = useState<"costItem" | "basis">("costItem");

  // Estimator price input state
  const [estimatorPriceInput, setEstimatorPriceInput] = useState<string>("");

  useEffect(() => {
    if (pricing?.comparison?.estimatorFinalPrice != null) {
      setEstimatorPriceInput(pricing.comparison.estimatorFinalPrice.toString());
    } else {
      setEstimatorPriceInput("");
    }
  }, [pricing?.comparison?.estimatorFinalPrice]);

  const handleStartEditCostItem = (item: any) => {
    setEditingId(item.id);
    setEditingType("costItem");
    setEditingName(item.name || "");
    setEditingDescription(item.description || "");
    setEditingAmount(item.amount != null ? item.amount.toString() : "");
  };

  const handleStartEditBasis = (item: any) => {
    setEditingId(item.id);
    setEditingType("basis");
    setEditingName(item.title || item.name || "");
    setEditingDescription(item.description || "");
    setEditingAmount("");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingType(null);
    setEditingName("");
    setEditingDescription("");
    setEditingAmount("");
  };

  const handleUpdateEstimatorPrice = async () => {
    const newPriceStr = estimatorPriceInput.trim();
    const numericPrice = newPriceStr === "" ? null : Number(newPriceStr.replace(/[^0-9.-]+/g, ""));
    const currentPrice = pricing?.comparison?.estimatorFinalPrice;

    if (Number.isNaN(numericPrice) || numericPrice === currentPrice) return;

    const aiDraftEstimate = pricing?.comparison?.aiDraftEstimate || 0;
    const newVariance = numericPrice != null ? numericPrice - aiDraftEstimate : null;

    try {
      await updateSection({
        projectId,
        section: "pricing",
        data: {
          payload: {
            ...pricing,
            comparison: {
              ...pricing?.comparison,
              estimatorFinalPrice: numericPrice,
              variance: newVariance,
            },
          },
          note: "Updated estimator final price",
        },
      }).unwrap();
      toast.success("Estimator final price updated.");
    } catch {
      toast.error("Failed to update estimator price.");
    }
  };

  const handleKeyDownEstimatorPrice = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleUpdateEstimatorPrice();
    }
  };

  const handleSaveEdit = async () => {
    if (!pricing || !editingId) return;

    if (editingType === "costItem") {
      const numericAmount = editingAmount.trim() === "" ? null : Number(editingAmount.replace(/[^0-9.-]+/g, ""));
      const newItems = (pricing.additionalCostItems || []).map((i: any) =>
        i.id === editingId ? { ...i, name: editingName, description: editingDescription, amount: numericAmount } : i
      );
      try {
        await updateSection({
          projectId,
          section: "pricing",
          data: { payload: { ...pricing, additionalCostItems: newItems }, note: "Updated additional cost item" },
        }).unwrap();
        toast.success("Cost item updated.");
        handleCancelEdit();
      } catch {
        toast.error("Failed to update cost item.");
      }
    } else if (editingType === "basis") {
      const newBasis = (pricing.pricingBasisAndReasoning || []).map((i: any) =>
        i.id === editingId ? { ...i, title: editingName, description: editingDescription } : i
      );
      try {
        await updateSection({
          projectId,
          section: "pricing",
          data: { payload: { ...pricing, pricingBasisAndReasoning: newBasis }, note: "Updated pricing basis" },
        }).unwrap();
        toast.success("Pricing basis updated.");
        handleCancelEdit();
      } catch {
        toast.error("Failed to update pricing basis.");
      }
    }
  };

  const handleDeleteConfirm = async () => {
    if (!pricing || !deleteItemId) return;

    if (deleteType === "costItem") {
      const newItems = (pricing.additionalCostItems || []).filter((i: any) => i.id !== deleteItemId);
      try {
        await updateSection({
          projectId,
          section: "pricing",
          data: { payload: { ...pricing, additionalCostItems: newItems }, note: "Deleted additional cost item" },
        }).unwrap();
        toast.success("Cost item deleted.");
        setDeleteItemId(null);
      } catch {
        toast.error("Failed to delete cost item.");
      }
    } else if (deleteType === "basis") {
      const newBasis = (pricing.pricingBasisAndReasoning || []).filter((i: any) => i.id !== deleteItemId);
      try {
        await updateSection({
          projectId,
          section: "pricing",
          data: { payload: { ...pricing, pricingBasisAndReasoning: newBasis }, note: "Deleted pricing basis" },
        }).unwrap();
        toast.success("Pricing basis deleted.");
        setDeleteItemId(null);
      } catch {
        toast.error("Failed to delete pricing basis.");
      }
    }
  };

  if (isLoading) return <SectionSkeleton />;
  if (isError)
    return <SectionError message="Failed to load pricing data. Please try again." onRetry={refetch} />;

  // Helper for border colors
  const getCostItemStyle = (name?: string) => {
    const lower = (name ?? "").toLowerCase();
    if (lower.includes("night") || lower.includes("after-hours")) {
      return "border-l-orange-400 bg-orange-50/30 dark:bg-orange-950/10";
    }
    if (lower.includes("bond")) {
      return "border-l-blue-400 bg-blue-50/30 dark:bg-blue-950/10";
    }
    if (lower.includes("insurance")) {
      return "border-l-rose-400 bg-rose-50/30 dark:bg-rose-950/10";
    }
    if (lower.includes("coordination") || lower.includes("contingency")) {
      return "border-l-purple-400 bg-purple-50/30 dark:bg-purple-950/10";
    }
    return "border-l-emerald-400 bg-emerald-50/30 dark:bg-emerald-950/10";
  };

  // Missing information items normalize (both objects and string array)
  const missingItems: Array<{ id?: string; title: string; description: string; severity?: string }> = [];
  if (pricing?.missingInformation?.length) {
    pricing.missingInformation.forEach((item) => {
      missingItems.push(item);
    });
  } else if (pricing?.missing_information?.length) {
    pricing.missing_information.forEach((item, idx) => {
      if (typeof item === "string") {
        missingItems.push({
          id: `m-${idx}`,
          title: "Missing Information Item",
          description: item,
          severity: "critical",
        });
      } else {
        missingItems.push(item as any);
      }
    });
  }

  // Deduplicate breakdown_note if it is already in validation_errors
  const hasValidationErrors = Boolean(pricing?.validation_errors?.length);
  const showBreakdownNote =
    pricing?.breakdown_note &&
    (!hasValidationErrors || !pricing.validation_errors.includes(pricing.breakdown_note));

  return (
    <div className="space-y-6 pb-8 animate-in fade-in duration-300">
      {/* Dynamic Header Status & Intelligence Badges */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 p-4 rounded-2xl shadow-sm">
        <div className="space-y-0.5">
          <h2 className="text-[18px] font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-600" />
            Pricing Analysis
          </h2>
          <p className="text-[12px] text-gray-500 dark:text-gray-400 font-medium">
            AI-assisted trade and scope cost estimation
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {pricing?.confidence && (
            <span
              className={cn(
                "text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border",
                pricing.confidence.toLowerCase() === "high"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
                  : pricing.confidence.toLowerCase() === "medium"
                  ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800"
                  : "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800"
              )}
            >
              {pricing.confidence} confidence
            </span>
          )}

          {pricing?.completeness && (
            <span
              className={cn(
                "text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border",
                pricing.completeness.toLowerCase() === "complete"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
                  : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800"
              )}
            >
              {pricing.completeness}
            </span>
          )}

          {pricing?.estimate_scope && (
            <span className="text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider bg-gray-100 text-gray-700 border border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700">
              {pricing.estimate_scope}
            </span>
          )}

          {pricing?.breakdown_complete !== undefined && (
            <span
              className={cn(
                "text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border",
                pricing.breakdown_complete
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
                  : "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800"
              )}
            >
              {pricing.breakdown_complete ? "Breakdown Complete" : "Breakdown Incomplete"}
            </span>
          )}
        </div>
      </div>

      {/* Dynamic Validation Errors Banner */}
      {hasValidationErrors && (
        <div className="bg-amber-50/90 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/60 rounded-2xl p-5 flex gap-3 shadow-sm">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
          <div className="space-y-1.5 flex-1">
            <h4 className="text-[14px] font-bold text-amber-900 dark:text-amber-300">
              Validation Notices
            </h4>
            <div className="space-y-1">
              {pricing?.validation_errors?.map((err, i) => (
                <p key={i} className="text-[13px] text-amber-800/90 dark:text-amber-300 flex items-start gap-1.5 leading-relaxed">
                  <span className="font-bold">•</span>
                  <span>{err}</span>
                </p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Warnings Banner */}
      {Boolean(pricing?.warnings?.length) && (
        <div className="bg-orange-50/90 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800/60 rounded-2xl p-5 flex gap-3 shadow-sm">
          <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5 shrink-0" />
          <div className="space-y-1.5 flex-1">
            <h4 className="text-[14px] font-bold text-orange-900 dark:text-orange-300">
              Pricing Warnings
            </h4>
            <div className="space-y-1">
              {pricing?.warnings?.map((w, i) => (
                <p key={i} className="text-[13px] text-orange-800/90 dark:text-orange-300 flex items-start gap-1.5 leading-relaxed">
                  <span className="font-bold">•</span>
                  <span>{w}</span>
                </p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Breakdown Note if distinct */}
      {showBreakdownNote && (
        <div className="bg-blue-50/80 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/60 rounded-2xl p-4 flex gap-3">
          <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
          <div>
            <h4 className="text-[14px] font-bold text-blue-900 dark:text-blue-300 mb-0.5">
              Breakdown Note
            </h4>
            <p className="text-[13px] text-blue-800/90 dark:text-blue-300 leading-relaxed">
              {pricing.breakdown_note}
            </p>
          </div>
        </div>
      )}

      {/* AI vs Estimator Comparison */}
      <div className="bg-gradient-to-r from-[#EFF6FF] to-[#EDFFF3] dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
        <h3 className="text-[14px] font-bold text-gray-900 dark:text-white mb-1">
          AI vs Estimator Comparison
        </h3>
        <p className="text-[12px] text-gray-500 mb-4">
          Compare AI draft estimate with estimator final price
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* AI Draft Estimate Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-blue-100 dark:border-blue-800/50 flex flex-col items-center justify-center shadow-sm">
            <div className="text-[13px] font-medium text-gray-500 mb-2">AI Draft Estimate</div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {pricing?.comparison?.aiDraftEstimate != null ? (
                `$${pricing.comparison.aiDraftEstimate.toLocaleString()}`
              ) : (
                <span className="text-xl font-bold text-amber-600 dark:text-amber-400">
                  $0
                </span>
              )}
            </div>
            <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 text-center">
              {pricing?.priced_scope_total != null ? (
                <span>Priced Scope: <strong className="text-gray-700 dark:text-gray-300">${pricing.priced_scope_total.toLocaleString()}</strong></span>
              ) : pricing?.stated_total != null ? (
                <span>Stated Total: <strong className="text-gray-700 dark:text-gray-300">${pricing.stated_total.toLocaleString()}</strong></span>
              ) : (
                "AI generated estimate"
              )}
            </div>
          </div>

          {/* Estimator Final Price Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-emerald-100 dark:border-emerald-800/50 flex flex-col items-center justify-center shadow-sm">
            <div className="text-[13px] font-medium text-gray-500 mb-2">Estimator Final Price</div>
            <div className="flex items-center justify-center">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                <input
                  type="text"
                  placeholder="0"
                  value={estimatorPriceInput}
                  onChange={(e) => setEstimatorPriceInput(e.target.value)}
                  onKeyDown={handleKeyDownEstimatorPrice}
                  className="w-36 h-10 pl-7 pr-8 border border-emerald-200 dark:border-emerald-800/50 rounded-lg focus:outline-none focus:border-emerald-500 bg-emerald-50/30 dark:bg-emerald-900/10 text-center font-bold text-[15px] text-gray-900 dark:text-white"
                />
                <button
                  onClick={handleUpdateEstimatorPrice}
                  disabled={isUpdating}
                  title="Save Price"
                  className="absolute right-1 top-1/2 -translate-y-1/2 text-emerald-600 hover:text-emerald-700 p-1.5 rounded-md hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">
              Press Enter or click check to save
            </div>
          </div>

          {/* Variance Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-purple-100 dark:border-purple-800/50 flex flex-col items-center justify-center shadow-sm">
            <div className="text-[13px] font-medium text-gray-500 mb-2">Variance</div>
            <div
              className={cn(
                "text-2xl font-black",
                pricing?.comparison?.variance != null
                  ? "text-purple-600 dark:text-purple-400"
                  : "text-gray-400"
              )}
            >
              {pricing?.comparison?.variance != null
                ? `$${pricing.comparison.variance.toLocaleString()}`
                : "—"}
            </div>
            <div className="text-[11px] font-normal text-gray-500 mt-1">
              {pricing?.comparison?.variance != null
                ? "Difference from AI estimate"
                : "Enter estimator price"}
            </div>
          </div>
        </div>

        {/* Dynamic breakdown difference reconciliation info if present */}
        {pricing?.breakdown_difference != null && pricing.breakdown_difference > 0 && (
          <div className="mt-4 pt-3 border-t border-blue-100 dark:border-gray-800 flex items-center justify-between text-[12px] text-gray-600 dark:text-gray-400">
            <span>
              Breakdown reconciliation difference: <strong className="text-gray-900 dark:text-white">${pricing.breakdown_difference.toLocaleString()}</strong>
            </span>
            {pricing.priced_scope_total != null && (
              <span>
                Priced Scope Total: <strong className="text-emerald-600 dark:text-emerald-400">${pricing.priced_scope_total.toLocaleString()}</strong>
              </span>
            )}
          </div>
        )}
      </div>

      {/* AI Draft Estimate Breakdown */}
      <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-5 h-5 rounded bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
            <span className="text-emerald-600 font-bold text-[12px]">$</span>
          </div>
          <h3 className="text-[15px] font-bold text-gray-900 dark:text-white">
            AI Draft Estimate Breakdown
          </h3>
        </div>
        <p className="text-[13px] text-gray-500 mb-4 pl-7">Division-based pricing analysis</p>

        <div className="space-y-3">
          {pricing?.aiDraftEstimateBreakdown?.length ? (
            pricing.aiDraftEstimateBreakdown.map((div, idx) => (
              <div
                key={div.id ?? `breakdown-${idx}`}
                className="p-4 rounded-xl bg-gray-50/50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-800 space-y-2.5"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center flex-wrap gap-2">
                    {div.division && (
                      <span className="text-[10px] font-bold text-white bg-emerald-600 rounded px-2 py-0.5">
                        Div {div.division}
                      </span>
                    )}
                    <span className="text-[14px] font-bold text-gray-900 dark:text-gray-100">
                      {div.name}
                    </span>
                  </div>
                  {div.amount != null ? (
                    <span className="text-[14px] font-black text-emerald-600 dark:text-emerald-400">
                      ${div.amount.toLocaleString()}
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800">
                      $0
                    </span>
                  )}
                </div>

                {div.calculation && (
                  <p className="text-[12px] text-gray-600 dark:text-gray-400 font-mono bg-white dark:bg-gray-900/50 px-2.5 py-1 rounded border border-gray-100 dark:border-gray-800 inline-block">
                    {div.calculation}
                  </p>
                )}

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] text-gray-500">
                  <div className="flex items-center gap-4 flex-wrap">
                    {div.unit && (
                      <span>
                        Unit: <strong className="text-gray-700 dark:text-gray-300">{div.unit}</strong>
                      </span>
                    )}
                    {div.quantity != null && (
                      <span>
                        Qty: <strong className="text-gray-700 dark:text-gray-300">{div.quantity}</strong>
                      </span>
                    )}
                    {div.unit_rate != null && (
                      <span>
                        Rate: <strong className="text-gray-700 dark:text-gray-300">${div.unit_rate.toLocaleString()}</strong>
                      </span>
                    )}
                  </div>

                  {div.source?.file && (
                    <PdfReferenceLink projectId={projectId} reference={div.source} />
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-[13px] text-gray-500 py-3 text-center">
              No breakdown data available.
            </p>
          )}
        </div>
      </div>

      {/* Additional Cost Items */}
      <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
        <h3 className="text-[15px] font-bold text-gray-900 dark:text-white mb-1">
          Additional Cost Items
        </h3>
        <p className="text-[13px] text-gray-500 mb-4">
          Bonds, insurance, coordination, contingency, and other cost items
        </p>

        <div className="space-y-3">
          {pricing?.additionalCostItems?.length ? (
            pricing.additionalCostItems.map((item, index) => (
              <div
                key={item.id ?? `cost-item-${index}`}
                className={cn(
                  "p-4 rounded-xl border-l-4 border-r border-t border-b border-r-gray-100 border-t-gray-100 border-b-gray-100 dark:border-r-gray-800 dark:border-t-gray-800 dark:border-b-gray-800 group relative transition-colors",
                  getCostItemStyle(item.name)
                )}
              >
                {editingId === item.id && editingType === "costItem" ? (
                  <div className="space-y-2">
                    <input
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      placeholder="Item Name"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-[14px] font-bold focus:outline-none focus:border-emerald-500"
                    />
                    <textarea
                      value={editingDescription}
                      onChange={(e) => setEditingDescription(e.target.value)}
                      rows={2}
                      placeholder="Description"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-[12px] resize-none focus:outline-none focus:border-emerald-500"
                    />
                    <div className="relative w-36">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500 text-[12px] font-medium">
                        $
                      </span>
                      <input
                        value={editingAmount}
                        onChange={(e) => setEditingAmount(e.target.value)}
                        placeholder="Amount"
                        type="text"
                        className="w-full pl-6 pr-2.5 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-[13px] font-medium focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 flex-1 pr-14">
                      <div className="text-[14px] font-bold text-gray-900 dark:text-gray-100">
                        {item.name}
                      </div>
                      <div className="text-[12px] text-gray-600 dark:text-gray-400 leading-relaxed">
                        {item.description}
                      </div>
                    </div>
                    <div className="shrink-0">
                      {item.amount != null ? (
                        <span className="text-[13px] font-bold text-gray-900 dark:text-gray-100">
                          ${item.amount.toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800">
                          $0
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {item.editable && (
                  <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {editingId === item.id && editingType === "costItem" ? (
                      <>
                        <button
                          onClick={handleSaveEdit}
                          disabled={isUpdating}
                          className="p-1 text-emerald-600 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 rounded"
                          title="Save"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="p-1 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                          title="Cancel"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleStartEditCostItem(item)}
                          className="p-1 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setDeleteItemId(item.id);
                            setDeleteType("costItem");
                          }}
                          className="p-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-[13px] text-gray-500 py-3 text-center">
              No additional cost items.
            </p>
          )}
        </div>
      </div>

      {/* Dynamic Missing Information */}
      {missingItems.length > 0 && (
        <div className="bg-red-50/50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/50 rounded-2xl p-6">
          <h3 className="text-[14px] font-bold text-red-800 dark:text-red-400 flex items-center gap-2 mb-1">
            <AlertCircle className="w-4 h-4" /> Missing Information
          </h3>
          <p className="text-[12px] text-red-600/80 dark:text-red-300 mb-4">
            Items requiring supplier confirmation or estimator input
          </p>
          <div className="space-y-3">
            {missingItems.map((err, i) => (
              <div
                key={err.id ?? `missing-${i}`}
                className="flex items-start gap-3 bg-white/80 dark:bg-red-900/20 p-3.5 rounded-xl border border-red-100 dark:border-red-800/30"
              >
                <div className="mt-0.5 text-red-500 text-[12px]">⚠️</div>
                <div className="space-y-0.5 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[13px] font-bold text-gray-900 dark:text-gray-100">
                      {err.title}
                    </span>
                    {err.severity && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300">
                        {err.severity}
                      </span>
                    )}
                  </div>
                  <p className="text-[12px] text-gray-600 dark:text-gray-400 leading-relaxed">
                    {err.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pricing Basis & Reasoning */}
      <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
        <h3 className="text-[15px] font-bold text-gray-900 dark:text-white mb-1">
          Pricing Basis & Reasoning
        </h3>
        <p className="text-[13px] text-gray-500 mb-4">
          How AI arrived at these estimates and context from tender documents
        </p>

        <div className="space-y-3">
          {pricing?.pricingBasisAndReasoning?.length ? (
            pricing.pricingBasisAndReasoning.map((item, index) => (
              <div
                key={item.id ?? `basis-${index}`}
                className={cn(
                  "p-4 rounded-xl border-l-4 border-r border-t border-b border-r-gray-100 border-t-gray-100 border-b-gray-100 dark:border-r-gray-800 dark:border-t-gray-800 dark:border-b-gray-800 group relative transition-colors",
                  getCostItemStyle(item.title)
                )}
              >
                {editingId === item.id && editingType === "basis" ? (
                  <div className="space-y-2">
                    <input
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-[14px] font-bold focus:outline-none focus:border-emerald-500"
                    />
                    <textarea
                      value={editingDescription}
                      onChange={(e) => setEditingDescription(e.target.value)}
                      rows={2}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-[12px] resize-none focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                ) : (
                  <div className="pr-14">
                    <div className="text-[14px] font-bold text-gray-900 dark:text-gray-100 mb-0.5">
                      {item.title}
                    </div>
                    <div className="text-[12px] text-gray-600 dark:text-gray-400 leading-relaxed">
                      {item.description}
                    </div>
                  </div>
                )}

                <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {editingId === item.id && editingType === "basis" ? (
                    <>
                      <button
                        onClick={handleSaveEdit}
                        disabled={isUpdating}
                        className="p-1 text-emerald-600 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 rounded"
                        title="Save"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="p-1 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                        title="Cancel"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleStartEditBasis(item)}
                        className="p-1 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded"
                        title="Edit"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setDeleteItemId(item.id);
                          setDeleteType("basis");
                        }}
                        className="p-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-[13px] text-gray-500 py-3 text-center">
              No pricing basis data available.
            </p>
          )}
        </div>
      </div>

      {/* Dynamic Reanalyze Block */}
      <ReanalyzeBlock projectId={projectId} section="pricing" data={data?.data} />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={!!deleteItemId}
        onClose={() => setDeleteItemId(null)}
        onConfirm={handleDeleteConfirm}
        isDeleting={isUpdating}
        title={deleteType === "costItem" ? "Delete Cost Item" : "Delete Pricing Basis"}
        description="Are you sure you want to delete this item? This action cannot be undone."
      />
    </div>
  );
}
