import { useState, useEffect } from "react";
import { Sparkles, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useGetAiRulesQuery, useUpdateAiRulesMutation } from "@/store/api/settingsApi";

export function AiRulesSettings() {
  const { data: aiRulesResponse, isLoading: isFetching } = useGetAiRulesQuery();
  const [updateAiRules, { isLoading: isUpdating }] = useUpdateAiRulesMutation();

  const [general, setGeneral] = useState("");
  const [pricing, setPricing] = useState("");
  const [scope, setScope] = useState("");
  const [assumptions, setAssumptions] = useState("");
  const [exclusions, setExclusions] = useState("");

  useEffect(() => {
    if (aiRulesResponse?.data) {
      const rules = aiRulesResponse.data;
      setGeneral(rules.generalInstructions || "");
      setPricing(rules.pricingSpecificInstructions || "");
      setScope(rules.scopeAnalysisInstructions || "");
      setAssumptions(rules.defaultAssumptions || "");
      setExclusions(rules.defaultExclusions || "");
    } else if (aiRulesResponse && !aiRulesResponse.success) {
      // Set defaults if rules not found
      setGeneral("Example:\nUse $40/hour labor cost\nUse $300/day per worker\nConsider mobilization and site access\nApply 5% contingency on all pricing\nFlag any night work or overtime requirements\nStandard 30-day payment terms");
      setPricing("Always include HST separately at 13%.\nDo not show internal pricing breakdown or markup to client.\nUse current material price lists from suppliers.\nConsider 2-week lead time for custom millwork.\nApply night work premium at 15% on labor costs.\nPerformance bond typically 5% of contract value.");
      setScope("Focus on CSI divisions 01, 06, 08, 09.\nFlag any MEP coordination requirements.\nIdentify exclusions clearly.\nVerify all quantities against drawings.\nCheck for addenda that modify scope.\nNote any specialty items requiring supplier quotes.");
      setAssumptions("Standard working hours 7 AM - 5 PM unless specified.\nSite access provided as per tender.\nTemporary facilities by general contractor.\nNo hazardous materials in work areas.\nUtilities available at no cost.");
      setExclusions("Electrical and plumbing work unless explicitly included.\nBuilding permits and inspection fees.\nSite security and hoarding.\nWaste disposal except our trade waste.\nPrice escalation beyond 60 days.");
    }
  }, [aiRulesResponse]);

  const handleSave = async () => {
    try {
      await updateAiRules({
        generalInstructions: general,
        pricingSpecificInstructions: pricing,
        scopeAnalysisInstructions: scope,
        defaultAssumptions: assumptions,
        defaultExclusions: exclusions,
      }).unwrap();
      toast.success("AI Rules saved successfully.");
    } catch (error: any) {
      toast.error(error?.data?.message || error?.message || "Failed to save AI rules.");
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center p-12 bg-white border border-gray-200 rounded-xl shadow-sm">
        <Loader2 className="w-8 h-8 text-[#059669] animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm p-6">
      {/* Card Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white mb-1">
            <Sparkles className="w-5 h-5 text-[#059669]" />
            AI Analysis Instructions
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Set company rules and guidelines that AI will automatically follow during tender analysis
          </p>
        </div>

      </div>

      {/* Info Banner */}
      <div className="bg-[#f0fdf4] dark:bg-[#1a2332] border-l-4 border-[#059669] p-4 rounded-r-md mb-8">
        <div className="flex items-center gap-2 font-bold text-gray-900 dark:text-white mb-1 text-sm">
          <Sparkles className="w-4 h-4 text-[#059669]" />
          How AI Instructions Work
        </div>
        <p className="text-sm text-gray-700 dark:text-gray-400 leading-relaxed">
          When AI analyzes scope, pricing, or any section, it will <span className="font-semibold">automatically apply these instructions</span>. Use this to encode your company's standard practices, pricing rules, labor rates, markup policies, and analysis guidelines. This reduces the need for a complex pricing database initially.
        </p>
      </div>

      {/* Forms */}
      <div className="space-y-8">
        <TextareaField
          label="General Instructions"
          value={general}
          onChange={setGeneral}
          appliedTo="All AI analysis across all sections"
        />
        <TextareaField
          label="Pricing-Specific Instructions"
          value={pricing}
          onChange={setPricing}
          appliedTo="Pricing analysis, cost estimates, and quote generation"
        />
        <TextareaField
          label="Scope Analysis Instructions"
          value={scope}
          onChange={setScope}
          appliedTo="Scope of work analysis and item identification"
        />
        <TextareaField
          label="Default Assumptions"
          value={assumptions}
          onChange={setAssumptions}
          appliedTo="Auto-generated assumptions in quotes"
        />
        <TextareaField
          label="Default Exclusions"
          value={exclusions}
          onChange={setExclusions}
          appliedTo="Auto-generated exclusions in quotes"
        />
      </div>

      {/* Tips Banner */}
      <div className="bg-[#fffbeb] dark:bg-[#3a2f0f] border-l-4 border-[#f59e0b] p-5 rounded-r-md mt-8 mb-6">
        <div className="font-bold text-gray-900 dark:text-white mb-3 text-sm">
          Tips for Writing Effective Instructions
        </div>
        <ul className="text-sm text-gray-700 dark:text-gray-400 space-y-2 list-none">
          <li className="flex items-start before:content-['•'] before:mr-2 before:text-[#f59e0b]">
            Be specific: "Use $45/hour" is better than "Use reasonable rates"
          </li>
          <li className="flex items-start before:content-['•'] before:mr-2 before:text-[#f59e0b]">
            One instruction per line for clarity
          </li>
          <li className="flex items-start before:content-['•'] before:mr-2 before:text-[#f59e0b]">
            Include unit types: metric vs imperial, per hour vs per day
          </li>
          <li className="flex items-start before:content-['•'] before:mr-2 before:text-[#f59e0b]">
            Specify percentages: "5% contingency", "13% HST", "15% night premium"
          </li>
          <li className="flex items-start before:content-['•'] before:mr-2 before:text-[#f59e0b]">
            Mention trade-specific considerations and industry standards
          </li>
          <li className="flex items-start before:content-['•'] before:mr-2 before:text-[#f59e0b]">
            Update instructions as your company policies change
          </li>
        </ul>
      </div>

      {/* Footer / Save Button */}
      <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-800">
        <button
          onClick={handleSave}
          disabled={isUpdating}
          className="flex items-center justify-center gap-2 py-2 px-5 rounded-md bg-[#059669] hover:bg-[#047857] text-white font-medium text-sm transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {isUpdating ? "Saving..." : "Save AI Instructions"}
        </button>
      </div>
    </div>
  );
}

function TextareaField({ label, value, onChange, appliedTo }: { label: string, value: string, onChange: (val: string) => void, appliedTo: string }) {
  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <label className="font-bold text-gray-900 dark:text-white text-sm">{label}</label>
        <span className="text-xs text-gray-400 dark:text-gray-500">{value.length} characters</span>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={6}
        className="w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-[#fafafa] dark:bg-[#1a2332] p-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] resize-y placeholder-gray-400 leading-relaxed shadow-inner"
      />
      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
        <span className="font-medium text-gray-700 dark:text-white">Applied to:</span> {appliedTo}
      </div>
    </div>
  );
}
