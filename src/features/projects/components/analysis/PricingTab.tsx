import { AlertTriangle, AlertCircle, Edit3 } from "lucide-react";
import { useGetProjectPricingQuery } from "@/store/api/projectApi";
import { SectionSkeleton, SectionError, AIInstructionSection, ProposedChangesReview } from "./shared";
import { cn } from "@/lib/utils";

interface Props {
  projectId: string;
}

export default function PricingTab({ projectId }: Props) {
  const { data, isLoading, isError, refetch } = useGetProjectPricingQuery(projectId);
  const pricing = data?.data;

  if (isLoading) return <SectionSkeleton />;
  if (isError)
    return <SectionError message="Failed to load pricing data. Please try again." onRetry={refetch} />;

  // Helper for Additional Cost Items border colors
  const getCostItemStyle = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes("night")) return "border-l-orange-400 bg-orange-50/30 dark:bg-orange-900/10";
    if (lowerName.includes("bond")) return "border-l-blue-400 bg-blue-50/30 dark:bg-blue-900/10";
    if (lowerName.includes("coordination") || lowerName.includes("contingency")) return "border-l-purple-400 bg-purple-50/30 dark:bg-purple-900/10";
    return "border-l-gray-400 bg-gray-50 dark:bg-gray-800/50";
  };

  return (
    <div className="space-y-6 pb-8">
      <ProposedChangesReview projectId={projectId} section="pricing" data={data?.data} />

      {/* Warning banner */}
      <div className="bg-orange-50/70 dark:bg-orange-900/10 rounded-xl p-4 flex gap-3">
        <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
        <div>
          <h4 className="text-[14px] font-bold text-orange-800 dark:text-orange-400 mb-0.5">
            Internal Pricing Assistant - For Review Only
          </h4>
          <p className="text-[13px] text-orange-700/80 dark:text-orange-300">
            Pricing must be verified by the estimator before use. All values below are AI generated estimates and require validation.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* AI vs Estimator Comparison */}
        <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
          <h3 className="text-[14px] font-bold text-gray-900 dark:text-white mb-1">AI vs Estimator Comparison</h3>
          <p className="text-[12px] text-gray-500 mb-4">Compare AI draft estimate with estimator final price</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-blue-100 dark:border-blue-800/50 flex flex-col items-center justify-center shadow-sm">
              <div className="text-[12px] font-medium text-gray-500 mb-2">AI Draft Estimate</div>
              <div className="text-2xl font-black text-blue-600 dark:text-blue-400">
                {pricing?.comparison?.aiDraftEstimate != null
                  ? `$${pricing.comparison.aiDraftEstimate.toLocaleString()}`
                  : "$485,000"}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-emerald-100 dark:border-emerald-800/50 flex flex-col items-center justify-center shadow-sm">
              <div className="text-[12px] font-medium text-gray-500 mb-2">Estimator Final Price</div>
              <div className="flex items-center justify-center">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                  <input
                    type="text"
                    placeholder="0"
                    className="w-32 h-10 pl-7 pr-3 border border-emerald-200 dark:border-emerald-800/50 rounded-lg focus:outline-none focus:border-emerald-500 bg-emerald-50/30 dark:bg-emerald-900/10 text-center font-bold text-[15px] text-gray-900 dark:text-white"
                  />
                  <Edit3 className="absolute -right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                </div>
              </div>
            </div>
          </div>
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
              pricing.aiDraftEstimateBreakdown.map((div: any) => (
                <div key={div.division} className="flex items-center p-3 rounded-xl bg-gray-50/50 dark:bg-gray-800/30 border border-transparent hover:border-gray-100 dark:hover:border-gray-700 transition-colors">
                  <span className="text-[10px] font-bold text-white bg-emerald-600 rounded px-2 py-1 mr-4">Div {div.division}</span>
                  <span className="text-[13px] font-medium text-gray-900 dark:text-gray-100">{div.name}</span>
                </div>
              ))
            ) : (
              <p className="text-[13px] text-gray-500">No breakdown data available.</p>
            )}
          </div>
        </div>

        {/* Additional Cost Items */}
        <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
          <h3 className="text-[15px] font-bold text-gray-900 dark:text-white mb-1">Additional Cost Items</h3>
          <p className="text-[13px] text-gray-500 mb-4">Bonds, insurance, out-of-hours, and contingency</p>

          <div className="space-y-3">
            {pricing?.additionalCostItems?.map((item: any, i: number) => (
              <div
                key={i}
                className={cn(
                  "p-4 rounded-xl border-l-4 border-r border-t border-b border-r-gray-100 border-t-gray-100 border-b-gray-100 dark:border-r-gray-800 dark:border-t-gray-800 dark:border-b-gray-800",
                  getCostItemStyle(item.name)
                )}
              >
                <div className="text-[14px] font-bold text-gray-900 dark:text-gray-100 mb-0.5">{item.name}</div>
                <div className="text-[12px] text-gray-600 dark:text-gray-400">{item.description}</div>
              </div>
            ))}
          </div>
        </div>


        {/* Missing Information */}
        {pricing?.missingInformation?.length > 0 && (
          <div className="bg-red-50/50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/50 rounded-2xl p-6">
            <h3 className="text-[14px] font-bold text-red-800 dark:text-red-400 flex items-center gap-2 mb-1">
              <AlertCircle className="w-4 h-4" /> Missing Information
            </h3>
            <p className="text-[12px] text-red-600/80 dark:text-red-300 mb-4">Items requiring evaluation or estimator input</p>
            <div className="space-y-3">
              {pricing.missingInformation.map((err: any, i: number) => (
                <div key={i} className="flex gap-3 bg-white/60 dark:bg-red-900/20 p-3 rounded-lg border border-red-100/60 dark:border-red-800/30">
                  <div className="mt-0.5 text-red-500 text-[10px]">❌</div>
                  <div>
                    <div className="text-[13px] font-bold text-gray-900 dark:text-gray-100 mb-0.5">{err.title}</div>
                    <div className="text-[12px] text-gray-600 dark:text-gray-400">{err.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>


      {/* Pricing Basis & Reasoning */}
      {/* <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
        <h3 className="text-[15px] font-bold text-gray-900 dark:text-white mb-1">Pricing Basis & Reasoning</h3>
        <p className="text-[13px] text-gray-500 mb-4">Assumptions and reasoning behind AI draft estimates</p>
        <div className="space-y-3">
          {pricing?.pricingBasisAndReasoning?.length ? (
            pricing.pricingBasisAndReasoning.map((reason: any, idx: number) => (
              <div key={idx} className="bg-gray-50/70 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-900/30 px-2 py-0.5 rounded">
                    Assumption {idx + 1}
                  </span>
                  <span className="text-[14px] font-bold text-gray-900 dark:text-gray-100">{reason.title || "Basis"}</span>
                </div>
                <p className="text-[13px] text-gray-600 dark:text-gray-400">{reason.description}</p>
              </div>
            ))
          ) : (
            <p className="text-[13px] text-gray-500">No reasoning data available.</p>
          )}
        </div>
      </div> */}

      <AIInstructionSection projectId={projectId} section="pricing" />
    </div>
  );
}
