import React from "react";
import { AlertCircle, Loader2, Sparkles, CheckCircle2, Check, X, AlertTriangle, Edit3, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import {
  useReanalyzeProjectSectionMutation,
  useUpdateProjectAnalysisSectionMutation,
} from "@/store/api/projectApi";

// ─── Loading Skeleton ─────────────────────────────────────────────────────────
export function SectionSkeleton() {
  return (
    <div className="bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 rounded-3xl p-6 md:p-8 shadow-sm animate-pulse">
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4" />
      <div className="space-y-3">
        <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-full" />
        <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-5/6" />
        <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-4/6" />
      </div>
    </div>
  );
}

// ─── Error Block ──────────────────────────────────────────────────────────────
export function SectionError({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="bg-red-50/50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/50 rounded-3xl p-6 md:p-8 flex flex-col items-center gap-4">
      <AlertCircle className="w-8 h-8 text-red-400" />
      <p className="text-[14px] font-semibold text-red-700 dark:text-red-400 text-center">{message}</p>
      {onRetry && (
        <Button variant="secondary" className="h-9 px-5 rounded-xl font-bold text-[13px]" onClick={onRetry}>
          Retry
        </Button>
      )}
    </div>
  );
}

// ─── AI Instruction Section ───────────────────────────────────────────────────
// Used standalone OR controlled externally (via defaultInstruction + onReanalyzed)
interface AIInstructionSectionProps {
  projectId: string;
  section: string;
  /** Pre-fill instruction (e.g. when user clicks Edit on proposed changes) */
  defaultInstruction?: string;
  /** Called after successful reanalyze so parent can clear the prefill */
  onReanalyzed?: () => void;
}

export function AIInstructionSection({
  projectId,
  section,
  defaultInstruction,
  onReanalyzed,
}: AIInstructionSectionProps) {
  const [instruction, setInstruction] = React.useState(defaultInstruction ?? "");
  const [reanalyze, { isLoading }] = useReanalyzeProjectSectionMutation();

  // Sync if parent pushes a new defaultInstruction
  React.useEffect(() => {
    if (defaultInstruction !== undefined) setInstruction(defaultInstruction);
  }, [defaultInstruction]);

  const handleReanalyze = async () => {
    if (!instruction.trim()) {
      toast.error("Please enter an instruction before re-analyzing.");
      return;
    }
    try {
      await reanalyze({ projectId, section, data: { instruction } }).unwrap();
      toast.success(`${section} section re-analyzed! Review the proposed changes below.`);
      setInstruction("");
      onReanalyzed?.();
    } catch (err: any) {
      toast.error(err?.data?.message || `Failed to re-analyze ${section} section.`);
    }
  };

  return (
    <div className="bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-4 h-4 text-blue-500" />
        <h3 className="text-[14px] font-bold text-gray-900 dark:text-white">AI Instruction for This Section</h3>
      </div>
      <div className="space-y-4">
        <input
          type="text"
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleReanalyze()}
          placeholder="Add instruction for this section…"
          className="w-full h-11 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-[13px] focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
        />
        <Button
          variant="primary"
          className="h-9 px-4 rounded-xl text-[12px] font-bold bg-emerald-600 hover:bg-emerald-700 shadow-sm text-white flex items-center gap-2"
          onClick={handleReanalyze}
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
          Re-analyze Section
        </Button>
      </div>
    </div>
  );
}

// ─── Proposed Changes Review ──────────────────────────────────────────────────
interface ProposedChangesReviewProps {
  projectId: string;
  section: string;
  data: any;
  /** Called when user clicks Edit — receives the original AI instruction */
  onEdit?: (instruction: string) => void;
}

export function ProposedChangesReview({ projectId, section, data, onEdit }: ProposedChangesReviewProps) {
  const [updateSection, { isLoading: isUpdating }] = useUpdateProjectAnalysisSectionMutation();

  const proposedPayload = data?.proposedPayload;
  if (!proposedPayload) return null;

  const proposedChanges = proposedPayload?.proposed_changes;
  const changes: string[] = proposedChanges?.changes ?? [];
  const pricingImpact: string | null = proposedChanges?.pricing_impact ?? null;
  const affectedTabs: string[] = proposedChanges?.affected_tabs ?? [];
  const aiInstruction: string | null = data?.proposedInstruction ?? null;

  const handleAccept = async () => {
    try {
      await updateSection({ projectId, section, data: { payload: { action: "accept" } } }).unwrap();
      toast.success("Proposed changes accepted!");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to accept proposed changes.");
    }
  };

  const handleReject = async () => {
    try {
      await updateSection({ projectId, section, data: { payload: { action: "delete" } } }).unwrap();
      toast.success("Proposed changes rejected.");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to reject proposed changes.");
    }
  };

  /**
   * Edit = reject current proposal (clean slate) then open the
   * AI Instruction input pre-filled with the old instruction.
   */
  const handleEdit = async () => {
    try {
      await updateSection({ projectId, section, data: { payload: { action: "delete" } } }).unwrap();
      // Notify parent so it can pre-fill the instruction input
      onEdit?.(aiInstruction ?? "");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to clear proposed changes.");
    }
  };

  return (
    <div className="bg-[#f0fbf5] dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/30 rounded-2xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-top-2">
      {/* Header */}
      <div className="flex items-center gap-2 px-6 py-5 border-b border-emerald-100 dark:border-emerald-800/30">
        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
        <h3 className="text-[15px] font-bold text-gray-900 dark:text-white">Proposed Changes</h3>
      </div>

      <div className="px-6 py-6 space-y-5">
        {/* AI Instruction badge */}
        {aiInstruction && (
          <div className="flex items-start gap-2 bg-blue-50/80 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30 rounded-xl px-4 py-3">
            <Sparkles className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
            <p className="text-[12px] font-medium text-blue-700 dark:text-blue-300 leading-snug">
              <span className="font-bold">AI Instruction: </span>{aiInstruction}
            </p>
          </div>
        )}

        {/* Change list */}
        {changes.length > 0 && (
          <div>
            <p className="text-[13px] font-bold text-gray-700 dark:text-gray-300 mb-3">
              {section.charAt(0).toUpperCase() + section.slice(1)} Changes:
            </p>
            <ul className="space-y-2">
              {changes.map((change: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-[13px] font-medium text-gray-700 dark:text-gray-300">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                  {change}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Pricing Impact */}
        {pricingImpact && (
          <div className="bg-orange-50/70 dark:bg-orange-900/10 rounded-xl px-5 py-4 relative overflow-hidden">
            <div className="absolute inset-y-0 left-0 w-1 bg-orange-500" />
            <p className="text-[13px] font-bold text-orange-700 dark:text-orange-400 mb-1">Pricing Impact:</p>
            <p className="text-[13px] font-medium text-orange-600 dark:text-orange-300">{pricingImpact}</p>
          </div>
        )}

        {/* Affected tabs */}
        {affectedTabs.length > 0 && (
          <div className="bg-[#fffdf0] dark:bg-yellow-900/10 rounded-xl px-5 py-4 relative overflow-hidden">
            <div className="absolute inset-y-0 left-0 w-1 bg-yellow-400" />
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-500 flex-shrink-0" />
              <p className="text-[13px] font-bold text-yellow-800 dark:text-yellow-300">This change may affect:</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {affectedTabs.map((s: string) => (
                <span key={s} className="text-[11px] font-bold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md px-2.5 py-1 shadow-sm">
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 px-6 pb-6 pt-2">
        <Button
          variant="primary"
          className="h-9 px-4 rounded-xl text-[12px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 shadow-sm"
          onClick={handleAccept}
          disabled={isUpdating}
        >
          {isUpdating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
          Accept Changes
        </Button>
        <Button
          variant="secondary"
          className="h-9 px-4 rounded-xl text-[12px] font-bold bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 flex items-center gap-1.5 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700"
          onClick={handleEdit}
          disabled={isUpdating}
        >
          {isUpdating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Edit3 className="w-3.5 h-3.5" />}
          Edit
        </Button>
        <Button
          variant="secondary"
          className="h-9 px-4 rounded-xl text-[12px] font-bold bg-white dark:bg-gray-800 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-900/30 flex items-center gap-1.5 shadow-sm"
          onClick={handleReject}
          disabled={isUpdating}
        >
          {isUpdating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <X className="w-3.5 h-3.5" />}
          Reject
        </Button>
      </div>
    </div>
  );
}

// ─── Unified Reanalyze Block ──────────────────────────────────────────────────
interface ReanalyzeBlockProps {
  projectId: string;
  section: string;
  data: any;
}

export function ReanalyzeBlock({ projectId, section, data }: ReanalyzeBlockProps) {
  const [editInstruction, setEditInstruction] = React.useState<string | undefined>();

  return (
    <>
      <AIInstructionSection
        projectId={projectId}
        section={section}
        defaultInstruction={editInstruction}
        onReanalyzed={() => setEditInstruction(undefined)}
      />
      {data && (
        <div className="mt-6">
          <ProposedChangesReview
            projectId={projectId}
            section={section}
            data={data}
            onEdit={(instruction) => setEditInstruction(instruction)}
          />
        </div>
      )}
    </>
  );
}

// ─── Highlight type → styles ───────────────────────────────────────────────────
export function getHighlightStyle(type: string) {
  switch (type) {
    case "scope":
      return {
        card: "bg-emerald-50/80 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-800/50",
        title: "text-emerald-800 dark:text-emerald-400",
        desc: "text-emerald-700/80 dark:text-emerald-500/80",
        extraborder: "bg-emerald-500",
      };
    case "pricing":
      return {
        card: "bg-orange-50/80 dark:bg-orange-900/10 border-orange-100 dark:border-orange-800/50",
        title: "text-orange-800 dark:text-orange-400",
        desc: "text-orange-700/80 dark:text-orange-500/80",
        extraborder: "bg-orange-500",
      };
    case "risk":
      return {
        card: "bg-red-50/80 dark:bg-red-900/10 border-red-100 dark:border-red-800/50",
        title: "text-red-800 dark:text-red-400",
        desc: "text-red-700/80 dark:text-red-500/80",
        extraborder: "bg-red-500",
      };
    case "addenda":
      return {
        card: "bg-blue-50/80 dark:bg-blue-900/10 border-blue-100 dark:border-blue-800/50",
        title: "text-blue-800 dark:text-blue-400",
        desc: "text-blue-700/80 dark:text-blue-500/80",
        extraborder: "bg-blue-500",
      };
    default:
      return {
        card: "bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-800",
        title: "text-gray-800 dark:text-gray-200",
        desc: "text-gray-600 dark:text-gray-400",
        extraborder: "bg-gray-500",
      };
  }
}

// ─── Risk category → badge color ──────────────────────────────────────────────
export function getRiskBadgeColor(category: string) {
  switch (category?.toLowerCase()) {
    case "pricing impact":
      return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
    case "contractual requirement":
      return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400";
    case "scope gap":
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
  }
}

// ─── Delete Confirmation Modal ────────────────────────────────────────────────
import { Modal } from "@/components/ui/Modal";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting?: boolean;
  title?: string;
  description?: string;
}

export function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
  title = "Delete Item",
  description = "Are you sure you want to delete this item? This action cannot be undone.",
}: DeleteConfirmationModalProps) {
  return (
    <Modal open={isOpen} onClose={onClose} title={title} size="sm">
      <div className="pt-2">
        <p className="text-[13px] text-gray-600 dark:text-gray-300 mb-6 font-medium leading-relaxed">{description}</p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose} disabled={isDeleting} className="h-9 px-4 text-[12px] rounded-xl font-bold">
            Cancel
          </Button>
          <Button 
            className="h-9 px-4 text-[12px] rounded-xl font-bold bg-red-600 hover:bg-red-700 text-white flex items-center gap-2" 
            onClick={onConfirm} 
            disabled={isDeleting}
          >
            {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
}
