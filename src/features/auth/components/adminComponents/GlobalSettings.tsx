"use client";

import { Building2, FileText, Loader, Save } from "lucide-react";
import StaticPage from "@/components/layout/StaticDemoPage";
import { UpdateGlobalSettingsPayload, useUpdateGlobalSettingsMutation } from "@/store/api/admin/GlobalSettings/updateSettings";
import { useEffect, useState } from "react";
import { useGetGlobalSettingsQuery } from "@/store/api/admin/GlobalSettings/getSettings";
import { toast } from "sonner";

export default function GlobalSettings() {
  const {
    data,
    isLoading,
  } = useGetGlobalSettingsQuery();

  const [
    updateGlobalSettings,
    { isLoading: saving },
  ] = useUpdateGlobalSettingsMutation();

  const [form, setForm] =
    useState<UpdateGlobalSettingsPayload>({
      companyName: "",
      labourRate: 0,
      profitMargin: 0,
      bondPercentage: 0,
      standardExclusions: [],
      standardAssumptions: [],
    });

  useEffect(() => {
    if (!data?.data) return;

    setForm({
      companyName: data.data.companyName,
      labourRate: data.data.labourRate,
      profitMargin: data.data.profitMargin,
      bondPercentage: data.data.bondPercentage,
      standardExclusions: data.data.standardExclusions,
      standardAssumptions: data.data.standardAssumptions,
    });
  }, [data]);

  const handleSave = async () => {
    const toastId = toast.loading("Saving settings...");

    try {
      const res = await updateGlobalSettings(form).unwrap();

      toast.success(res.message, {
        id: toastId,
      });
    } catch (error: any) {
      toast.error("Failed to update settings", {
        id: toastId,
        description:
          error?.data?.message ??
          "Something went wrong.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader className="h-7 w-7 animate-spin text-secondary" />
      </div>
    );
  }
  return (
    <div className="space-y-6 w-full">
      {/* ── Header ── */}
      <StaticPage
        title="Global Settings"
        description="Company-level defaults for all tenders"
      />

      <div className="space-y-6 pt-2">
        {/* ── Company Information ── */}
        <div className="card-premium border border-[#E5E7EB] dark:border-gray-700 p-6 bg-white dark:bg-gray-900">
          <div className="flex items-center gap-2 mb-6">
            <Building2 className="w-5 h-5 text-secondary" />
            <h3 className="text-[17px] font-bold text-gray-900 dark:text-white">Company Information</h3>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Company Name</label>
            <input
              type="text"
              value={form.companyName}
              onChange={(e) =>
                setForm({
                  ...form,
                  companyName: e.target.value,
                })
              } className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-3 text-[15px] text-gray-800 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary transition-all"
            />
          </div>
        </div>

        {/* ── Pricing Defaults ── */}
        <div className="card-premium border border-[#E5E7EB] dark:border-gray-700 p-6 bg-white dark:bg-gray-900">
          <h3 className="text-[17px] font-bold text-gray-900 dark:text-white mb-6">Pricing Defaults</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Labour Rate ($/hour)</label>
              <input
                type="text"
                value={form.labourRate}
                onChange={(e) =>
                  setForm({
                    ...form,
                    labourRate: Number(e.target.value),
                  })
                } className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-3 text-[15px] text-gray-800 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Profit Margin (%)</label>

              <input
                type="number"
                value={form.profitMargin}
                onChange={(e) =>
                  setForm({
                    ...form,
                    profitMargin: Number(e.target.value),
                  })
                } className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-3 text-[15px] text-gray-800 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Bond (%)</label>

              <input
                type="number"
                value={form.bondPercentage}
                onChange={(e) =>
                  setForm({
                    ...form,
                    bondPercentage: Number(e.target.value),
                  })
                } className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-3 text-[15px] text-gray-800 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary transition-all"
              />
            </div>
          </div>
        </div>

        {/* ── Standard Exclusions ── */}
        <div className="card-premium border border-[#E5E7EB] dark:border-gray-700 p-6 bg-white dark:bg-gray-900">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-secondary" />
              <label className="font-semibold text-gray-800 dark:text-white">
                Standard Exclusions
              </label>
            </div>
            <p className="text-xs text-gray-500 mb-3">
              Enter one exclusion per line.
            </p>

          </div>
          <div className="relative">
            <textarea
              rows={6}
              value={form.standardExclusions.join("\n")}
              onChange={(e) =>
                setForm({
                  ...form,
                  standardExclusions: e.target.value
                    .split("\n")
                    .map((v) => v.replace(/^-/, "").trim())
                    .filter(Boolean),
                })
              } 
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-4 text-[15px] leading-7 text-gray-800 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary transition-all resize-y"
            />
          </div>
        </div>

        {/* ── Standard Assumptions ── */}
        <div className="card-premium border border-[#E5E7EB] dark:border-gray-700 p-6 bg-white dark:bg-gray-900">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-secondary" />
              <label className="font-semibold text-gray-800 dark:text-white">
                Standard Assumptions
              </label>
            </div>
            <p className="text-xs text-gray-500 mb-3">
              Enter one assumption per line.
            </p>
          </div>
          <div className="relative">
            <textarea
              rows={6}
              value={form.standardAssumptions.join("\n")}
              onChange={(e) =>
                setForm({
                  ...form,
                  standardAssumptions: e.target.value
                    .split("\n")
                    .map((v) => v.replace(/^-/, "").trim())
                    .filter(Boolean),
                })
              } className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-4 text-[15px] leading-7 text-gray-800 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary transition-all resize-y"
            />
          </div>
        </div>

        {/* ── Footer Actions ── */}
        <div className="flex justify-end pt-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-secondary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-secondary/20 transition-all hover:scale-[1.02] hover:bg-secondary/90 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving ? (
              <Loader size={18} className="animate-spin" />
            ) : (
              <Save size={18} strokeWidth={2.5} />
            )}

            Save Global Settings
          </button>
        </div>
      </div>
    </div>
  );
}
