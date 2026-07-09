import { cn } from "@/lib/utils";
import { useGetProjectSummaryQuery } from "@/store/api/projectApi";
import { SectionSkeleton, SectionError, getHighlightStyle, AIInstructionSection, ProposedChangesReview } from "./shared";

interface Props {
  projectId: string;
}

export default function SummaryTab({ projectId }: Props) {
  const { data, isLoading, isError, refetch } = useGetProjectSummaryQuery(projectId);
  const summary = data?.data;

  if (isLoading) return <SectionSkeleton />;
  if (isError)
    return <SectionError message="Failed to load summary. Please try again." onRetry={refetch} />;

  return (
    <div className="space-y-8">


      {/* Key Highlights */}
      <div className="space-y-4">
        <h2 className="text-[20px] font-bold text-gray-900 dark:text-white mb-2">Key Highlights</h2>
        <div className="bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm">
          <div className="space-y-3">
            {summary?.key_highlights?.length ? (
              summary.key_highlights.map((highlight: any) => {
                const styles = getHighlightStyle(highlight.type);

                return (
                  <div
                    key={highlight.id || highlight.type}
                    className={cn(
                      "relative overflow-hidden rounded-2xl border p-5",
                      styles.card
                    )}
                  >
                    {/* Left Highlight Border */}
                    <div
                      className={cn(
                        "absolute inset-y-0 left-0 w-1",
                        styles.extraborder
                      )}
                    />

                    <h4 className={cn("mb-1 text-[15px] font-bold", styles.title)}>
                      {highlight.title}
                    </h4>

                    <p className={cn("text-[13px]", styles.desc)}>
                      {highlight.description}
                    </p>
                  </div>
                );
              })
            ) : (
              <p className="text-[13px] text-gray-500">
                No highlights found.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Estimated Value", value: summary?.estimated_value != null ? `$${summary.estimated_value.toLocaleString()}` : "N/A" },
          { label: "Total Items", value: summary?.total_items ?? "N/A" },
          { label: "Duration", value: summary?.duration_weeks ? `${summary.duration_weeks} wks` : "N/A" },
          { label: "Labor Hours", value: summary?.labor_hours || "N/A" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 rounded-2xl p-4 shadow-sm text-center"
          >
            <div className="text-[12px] font-bold text-gray-400 uppercase tracking-wider mb-1">{stat.label}</div>
            <div className="text-[20px] font-black text-gray-900 dark:text-white">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Selected Divisions */}
      <div className="bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm">
        <h3 className="text-[15px] font-bold text-gray-900 dark:text-white mb-1">Selected Divisions</h3>
        <p className="text-[13px] text-gray-500 dark:text-gray-400 mb-5">Division breakdown and allocation</p>
        <div className="flex flex-wrap gap-3">
          {summary?.selected_divisions?.length ? (
            summary.selected_divisions.map((div: any) => (
              <div
                key={div.id || div.code}
                className="flex items-center border border-emerald-200 dark:border-emerald-800 rounded-full px-3 py-1.5 bg-emerald-50/30 dark:bg-emerald-900/10"
              >
                <span className="text-[11px] font-bold text-white bg-emerald-500 rounded px-1.5 py-0.5 mr-2">
                  Div {div.code}
                </span>
                <span className="text-[13px] font-bold text-gray-700 dark:text-gray-300">{div.name}</span>
              </div>
            ))
          ) : (
            <p className="text-[13px] text-gray-500">No divisions selected.</p>
          )}
        </div>
      </div>

      <AIInstructionSection projectId={projectId} section="summary" />

      <ProposedChangesReview
        projectId={projectId}
        section="summary"
        data={{
          ...data?.data,
          // Inject mock payload if not present so UI design can be reviewed
          proposedPayload: data?.data?.proposedPayload || {
            changes: [
              "Remove painting scope items (2 items affected)",
              "Exclude lift work from Division 01",
              "Focus analysis on door installation only",
              "Update quantity calculations for door hardware"
            ],
            pricingImpact: "Estimated reduction: $145,500 (Division 09 painting)",
            affectedSections: ["Pricing", "Exclusions", "Quote Builder"]
          }
        }}
      />
    </div>
  );
}
