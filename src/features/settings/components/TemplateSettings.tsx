"use client";

import React, { useEffect, useState } from "react";
import { FileText, Save, Hash, CreditCard, ShieldCheck, ListTodo, Ban, StickyNote, Clock, Loader } from "lucide-react";
import { Input, Button } from "@/components/ui";
import { useGetTemplateQuery } from "@/store/api/sub-user/Template/getTemplate";
import { useUpdateTemplateMutation } from "@/store/api/sub-user/Template/updateTemplate";
import { toast } from "sonner";

export function TemplateSettings() {
  const { data, isLoading } =
    useGetTemplateQuery();

  const [
    updateTemplate,
    { isLoading: saving },
  ] = useUpdateTemplateMutation();

  const [form, setForm] = useState({
    footerText: "",
    quoteValidity: "",
    hstWording: "",
    paymentTerms: "",
    holdbackTerms: "",
    defaultAssumptions: "",
    defaultExclusions: "",
    defaultNotes: "",
  });
  useEffect(() => {
    if (!data?.data) return;

    setForm({
      footerText: data.data.footerText,
      quoteValidity: data.data.quoteValidity,
      hstWording: data.data.hstWording,
      paymentTerms: data.data.paymentTerms,
      holdbackTerms: data.data.holdbackTerms,
      defaultAssumptions:
        data.data.defaultAssumptions,
      defaultExclusions:
        data.data.defaultExclusions,
      defaultNotes: data.data.defaultNotes,
    });
  }, [data]);

  const handleSave = async () => {
    const toastId = toast.loading(
      "Saving template..."
    );

    try {
      const res = await updateTemplate(form).unwrap();

      toast.success(res.message, {
        id: toastId,
      });
    } catch (error: any) {
      toast.error("Failed to save template", {
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
        <Loader className="h-7 w-7 animate-spin text-emerald-600" />
      </div>
    );
  }
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
            value={form.footerText}
            onChange={(e) =>
              setForm({
                ...form,
                footerText: e.target.value,
              })
            }
            prefix={<StickyNote className="w-4 h-4 opacity-50" />}
          />
          <Input
            label="Quote Validity (Days)"
            value={form.quoteValidity}
            onChange={(e) =>
              setForm({
                ...form,
                quoteValidity: e.target.value,
              })
            }
            prefix={<Clock className="w-4 h-4 opacity-50" />}
          />
        </div>

        <Input
          label="HST Number"
          value={form.hstWording}
          onChange={(e) =>
            setForm({
              ...form,
              hstWording: e.target.value,
            })
          }
          prefix={<Hash className="w-4 h-4 opacity-50" />}
        />

        <div className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <CreditCard size={14} className="text-gray-400" />
              Payment Terms
            </label>
            <textarea
              rows={3}
              value={form.paymentTerms}
              onChange={(e) =>
                setForm({
                  ...form,
                  paymentTerms: e.target.value,
                })
              }
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm transition-all focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <ShieldCheck size={14} className="text-gray-400" />
              Holdback Terms
            </label>
            <textarea
              rows={3}
              value={form.holdbackTerms}
              onChange={(e) =>
                setForm({
                  ...form,
                  holdbackTerms: e.target.value,
                })
              }
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm transition-all focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <ListTodo size={14} className="text-gray-400" />
              Default Assumptions
            </label>
            <textarea
              rows={4}
              value={form.defaultAssumptions}
              onChange={(e) =>
                setForm({
                  ...form,
                  defaultAssumptions: e.target.value,
                })
              }
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm transition-all focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Ban size={14} className="text-gray-400" />
              Default Exclusions
            </label>
            <textarea
              rows={4}
              value={form.defaultExclusions}
              onChange={(e) =>
                setForm({
                  ...form,
                  defaultExclusions: e.target.value,
                })
              }
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm transition-all focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <StickyNote size={14} className="text-gray-400" />
              Default Notes
            </label>
            <textarea
              rows={4}
              value={form.defaultNotes}
              onChange={(e) =>
                setForm({
                  ...form,
                  defaultNotes: e.target.value,
                })
              }
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm transition-all focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-6">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 font-bold px-8 shadow-lg shadow-emerald-200 dark:shadow-none"
        >
          {saving ? (
            <Loader className="w-4 h-4 animate-spin" />
          ) : (
            <Save size={16} />
          )}

          Save Changes
        </Button>
      </div>
    </div>
  );
}
