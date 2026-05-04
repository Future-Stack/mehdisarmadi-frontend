"use client";

import { Building2, Save } from "lucide-react";
import StaticPage from "@/components/layout/StaticDemoPage";

export default function GlobalSettings() {
  return (
    <div className="space-y-6 w-full">
      {/* ── Header ── */}
      <StaticPage 
        title="Global Settings" 
        description="Company-level defaults for all projects" 
      />

      <div className="space-y-6 pt-2">
        {/* ── Company Information ── */}
        <div className="card-premium p-6 bg-white dark:bg-gray-900">
          <div className="flex items-center gap-2 mb-6">
            <Building2 className="w-5 h-5 text-secondary" />
            <h3 className="text-[17px] font-bold text-gray-900 dark:text-white">Company Information</h3>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Company Name</label>
            <input 
              type="text" 
              defaultValue="RENOFIELD Construction"
              className="w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 px-4 py-2.5 text-[15px] text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all"
            />
          </div>
        </div>

        {/* ── Pricing Defaults ── */}
        <div className="card-premium p-6 bg-white dark:bg-gray-900">
          <h3 className="text-[17px] font-bold text-gray-900 dark:text-white mb-6">Pricing Defaults</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Labour Rate ($/hour)</label>
              <input 
                type="number" 
                defaultValue="85"
                className="w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 px-4 py-2.5 text-[15px] text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Profit Margin (%)</label>
              <input 
                type="number" 
                defaultValue="15"
                className="w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 px-4 py-2.5 text-[15px] text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Bond (%)</label>
              <input 
                type="number" 
                defaultValue="2.5"
                step="0.1"
                className="w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 px-4 py-2.5 text-[15px] text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all"
              />
            </div>
          </div>
        </div>

        {/* ── Standard Exclusions ── */}
        <div className="card-premium p-6 bg-white dark:bg-gray-900">
          <div className="mb-6">
            <h3 className="text-[17px] font-bold text-gray-900 dark:text-white">Standard Exclusions</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Default exclusions applied to all quotes</p>
          </div>
          <div className="relative">
            <textarea 
              rows={6}
              defaultValue={`- Permits and approvals
- Site security and hoarding
- Utility connections
- Testing and commissioning`}
              className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 p-6 text-[15px] text-gray-600 dark:text-gray-400 font-medium leading-relaxed focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all resize-none"
            />
          </div>
        </div>

        {/* ── Standard Assumptions ── */}
        <div className="card-premium p-6 bg-white dark:bg-gray-900">
          <div className="mb-6">
            <h3 className="text-[17px] font-bold text-gray-900 dark:text-white">Standard Assumptions</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Default assumptions applied to all quotes</p>
          </div>
          <div className="relative">
            <textarea 
              rows={6}
              defaultValue={`- Site access 7:00 AM - 5:00 PM weekdays
- Material delivery within 2 weeks
- No overtime or weekend work
- Existing conditions as shown in drawings`}
              className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 p-6 text-[15px] text-gray-600 dark:text-gray-400 font-medium leading-relaxed focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all resize-none"
            />
          </div>
        </div>

        {/* ── Footer Actions ── */}
        <div className="flex justify-end pt-4">
          <button className="inline-flex items-center gap-2 rounded-lg bg-secondary px-6 py-3 text-[15px] font-bold text-white shadow-lg shadow-secondary/20 transition-all hover:bg-secondary/90 hover:scale-[1.02] active:scale-95 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2">
            <Save size={18} strokeWidth={2.5} />
            Save Global Settings
          </button>
        </div>
      </div>
    </div>
  );
}
