"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff, ChevronDown, Save, Loader } from "lucide-react";
import StaticPage from "@/components/layout/StaticDemoPage";
import { UpdateSystemSettingsPayload, useUpdateSystemSettingsMutation } from "@/store/api/admin/SystemSettings/updateSettings";
import { useGetSystemSettingsQuery } from "@/store/api/admin/SystemSettings/getSettings";
import { toast } from "sonner";

export default function SystemSettings() {
  const [showKey, setShowKey] = useState(false);

  const { data, isLoading } = useGetSystemSettingsQuery();

  const [
    updateSystemSettings,
    { isLoading: saving },
  ] = useUpdateSystemSettingsMutation();

  const [form, setForm] =
    useState<UpdateSystemSettingsPayload>({
      api_key: "",
      model_name: "",
      upload_size: 0,
    });
  useEffect(() => {
    if (!data?.data) return;

    setForm({
      api_key: data.data.api_key,
      model_name: data.data.model_name,
      upload_size: data.data.upload_size,
    });
  }, [data]);
  const handleSave = async () => {
    const toastId = toast.loading("Saving system settings...");

    try {
      const res = await updateSystemSettings(form).unwrap();

      toast.success(res.message, {
        id: toastId,
      });
    } catch (error: any) {
      toast.error("Failed to save settings", {
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
        title="System Settings"
        description="Manage application settings and system configurations"
      />

      <div className="space-y-6 pt-2">
        {/* ── API Configuration ── */}
        <div className="card-premium p-6 bg-white dark:bg-gray-900">
          <h3 className="text-[17px] font-bold text-gray-900 dark:text-white mb-6">API Configuration</h3>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">OpenAI API Key</label>
            <div className="relative">
              <input
                type={showKey ? "text" : "password"}
                value={form.api_key}
                onChange={(e) =>
                  setForm({
                    ...form,
                    api_key: e.target.value,
                  })
                }
                className="w-full rounded-lg border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-800 px-4 py-2.5 pr-10 text-[15px] text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all font-mono"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors focus:outline-none"
              >
                {showKey ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
        </div>

        {/* ── AI Configuration ── */}
        <div className="card-premium p-6 bg-white dark:bg-gray-900">
          <h3 className="text-[17px] font-bold text-gray-900 dark:text-white mb-6">AI Configuration</h3>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Model Version</label>
              <div className="relative">
                <select
                  value={form.model_name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      model_name: e.target.value,
                    })
                  }
                  className="w-full appearance-none rounded-lg border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-800 px-4 py-2.5 pr-10 text-[15px] text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all cursor-pointer"
                >
                  <option value="">Select Model</option>
                  <option value="gpt-4.1-mini">GPT-4.1 Mini</option>
                  <option value="gpt-4.1">GPT-4.1</option>
                  <option value="gpt-4o">GPT-4o</option>
                  <option value="gpt-4o-mini">GPT-4o Mini</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Processing Mode</label>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-5 h-5 rounded-[4px] border-gray-300 dark:border-gray-700 text-secondary focus:ring-secondary/50 accent-secondary transition-colors cursor-pointer"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">Fast</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded-[4px] border-gray-300 dark:border-gray-700 text-secondary focus:ring-secondary/50 accent-secondary transition-colors cursor-pointer"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">Accurate</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* ── File Settings ── */}
        <div className="card-premium p-6 bg-white dark:bg-gray-900">
          <h3 className="text-[17px] font-bold text-gray-900 dark:text-white mb-6">File Settings</h3>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Max Upload Size</label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={form.upload_size}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      upload_size: Number(e.target.value),
                    })
                  }
                  className="w-32 rounded-lg border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-800 px-4 py-2.5 text-[15px] text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all"
                />
                <span className="text-[15px] font-medium text-gray-500 dark:text-gray-400">MB</span>
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Supported Formats</label>
              <div className="flex flex-wrap gap-2">
                {["PDF", "DOCX", "TXT"].map((format) => (
                  <span
                    key={format}
                    className="inline-flex items-center px-4 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-[13px] font-bold text-gray-600 dark:text-gray-400 transition-colors"
                  >
                    {format}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Footer Actions ── */}
        <div className="flex justify-end pt-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-secondary px-6 py-3 text-[15px] font-bold text-white shadow-lg shadow-secondary/20 transition-all hover:bg-secondary/90 hover:scale-[1.02] active:scale-95 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving ? (
              <Loader size={18} className="animate-spin" />
            ) : (
              <Save size={18} strokeWidth={2.5} />
            )}

            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
