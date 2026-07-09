import { Edit3, Copy, Trash2, CheckSquare, FileText, Loader2, Square } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import { useGetProjectAssumptionsQuery, useUpdateProjectAnalysisSectionMutation } from "@/store/api/projectApi";
import { SectionSkeleton, SectionError, AIInstructionSection, ProposedChangesReview } from "./shared";

interface Props {
  projectId: string;
}

export default function AssumptionsTab({ projectId }: Props) {
  const { data, isLoading, isError, refetch } = useGetProjectAssumptionsQuery(projectId);
  const [updateSection, { isLoading: isUpdating }] = useUpdateProjectAnalysisSectionMutation();
  const assumptions = data?.data;

  const handleToggleInclude = async (itemToToggle: any) => {
    if (!assumptions?.items) return;
    const newItems = assumptions.items.map((item: any) =>
      item.id === itemToToggle.id ? { ...item, include: item.include === false ? true : false } : item
    );
    try {
      await updateSection({
        projectId,
        section: "assumptions",
        data: { ...assumptions, items: newItems }
      }).unwrap();
      toast.success(`Assumption ${itemToToggle.include === false ? 'included' : 'excluded'}.`);
    } catch (err: any) {
      toast.error("Failed to update assumption.");
    }
  };

  const handleDelete = async (itemId: string) => {
    if (!assumptions?.items) return;
    const newItems = assumptions.items.filter((item: any) => item.id !== itemId);
    try {
      await updateSection({
        projectId,
        section: "assumptions",
        data: { ...assumptions, items: newItems }
      }).unwrap();
      toast.success("Assumption deleted successfully.");
    } catch (err: any) {
      toast.error("Failed to delete assumption.");
    }
  };

  if (isLoading) return <SectionSkeleton />;
  if (isError)
    return <SectionError message="Failed to load assumptions. Please try again." onRetry={refetch} />;

  return (
    <div className="space-y-6">
      <ProposedChangesReview projectId={projectId} section="assumptions" data={data?.data} />
      <div className="bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 rounded-3xl p-6 md:p-8 shadow-sm">

        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8 border-b border-gray-100 dark:border-gray-800 pb-6">
          <div>
            <h2 className="text-[20px] font-bold text-gray-900 dark:text-white mb-1">
              {assumptions?.title || "Assumptions"}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
              {assumptions?.subtitle || "Assumptions made based on tender documents."}
            </p>
          </div>
          {/* <Button
            variant="secondary"
            className="h-9 px-4 rounded-lg font-bold bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 text-xs shadow-sm"
          >
            + Add Manual Assumption
          </Button> */}
        </div>

        <div className="space-y-3">
          {assumptions?.items?.length ? (
            assumptions.items.map((item: any, index: number) => (
              <div
                key={item.id}
                className="flex flex-col md:flex-row md:items-start gap-4 justify-between p-4 rounded-xl border bg-gray-50/80 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 transition-colors"
              >
                <div>
                  {/* Number + text */}
                  <div className="flex-1 flex gap-3">
                    <span className="text-[13px] font-bold text-gray-400 w-5 text-right shrink-0">{index + 1}.</span>
                    <p className="text-[13px] font-medium text-gray-700 dark:text-gray-300 leading-relaxed">
                      {item.text}
                    </p>
                  </div>
                  {/* Source reference */}
                  {item.reference?.file && (
                    <div className="ml-8 flex items-center gap-1.5 text-[11px] font-medium text-gray-400 self-start">
                      <FileText className="w-3.5 h-3.5" />
                      {item.reference.file}
                      {item.reference.page && ` • p.${item.reference.page}`}
                      {item.reference.section && ` • ${item.reference.section}`}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 ml-8 md:ml-0 self-start">
                  <button
                    onClick={() => handleToggleInclude(item)}
                    disabled={isUpdating}
                    className={item.include !== false
                      ? "flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1.5 rounded-lg border text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 transition-colors"
                      : "flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1.5 rounded-lg border text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 transition-colors"
                    }
                  >
                    {item.include !== false ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                    {item.include !== false ? 'Included' : 'Include'}
                  </button>
                  <div className="flex items-center gap-1">
                    <button className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    {/* <button className="p-1.5 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                      <Copy className="w-4 h-4" />
                    </button> */}
                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={isUpdating}
                      className="p-1.5 text-red-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>


              </div>
            ))
          ) : (
            <p className="text-[13px] text-gray-500">No assumptions found.</p>
          )}
        </div>
      </div>

      <AIInstructionSection projectId={projectId} section="assumptions" />
    </div>
  );
}
