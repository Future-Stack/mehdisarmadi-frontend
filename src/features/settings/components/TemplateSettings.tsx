"use client";

import React from "react";
import { FileText, Save, Hash, CreditCard, ShieldCheck, ListTodo, Ban, StickyNote, Clock } from "lucide-react";
import { Input, Button } from "@/components/ui";

export function TemplateSettings() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg text-emerald-600 dark:text-emerald-400">
          <FileText size={20} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Quote Template Settings</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Set default content to avoid repetitive typing in every quote</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <Input
            label="Footer Text"
            placeholder="Thank you for your business!"
            prefix={<StickyNote className="w-4 h-4 opacity-50" />}
          />
          <Input
            label="Quote Validity (Days)"
            placeholder="30"
            prefix={<Clock className="w-4 h-4 opacity-50" />}
          />
        </div>

        <Input
          label="HST Number"
          placeholder="Enter HST registration number"
          prefix={<Hash className="w-4 h-4 opacity-50" />}
        />

        <div className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <CreditCard size={14} className="text-gray-400" />
              Payment Terms
            </label>
            <textarea
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm transition-all focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              rows={3}
              placeholder="e.g. 50% upfront, 50% upon completion"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <ShieldCheck size={14} className="text-gray-400" />
              Holdback Terms
            </label>
            <textarea
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm transition-all focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              rows={3}
              placeholder="Enter standard holdback percentage or terms"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <ListTodo size={14} className="text-gray-400" />
              Default Assumptions
            </label>
            <textarea
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm transition-all focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              rows={4}
              placeholder="List standard assumptions for your projects"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Ban size={14} className="text-gray-400" />
              Default Exclusions
            </label>
            <textarea
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm transition-all focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              rows={4}
              placeholder="List standard exclusions from your quotes"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <StickyNote size={14} className="text-gray-400" />
              Default Notes
            </label>
            <textarea
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm transition-all focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              rows={4}
              placeholder="Additional default notes for your quotes"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-6">
        <Button
          className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 font-bold px-8 shadow-lg shadow-emerald-200 dark:shadow-none"
        >
          <Save size={16} />
          Save Changes
        </Button>
      </div>
    </div>
  );
}
