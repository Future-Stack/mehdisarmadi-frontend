"use client";

import { useState } from "react";
import { Loader, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { useCreateDivisionMutation } from "@/store/api/admin/Division/postDivision";

interface Props {
  onClose: () => void;
}

export default function DivisionCreateModal({ onClose }: Props) {
  const [form, setForm] = useState({
    code: "",
    name: "",
    description: "",
  });

  const [createDivision, { isLoading }] = useCreateDivisionMutation();

  const handleChange = (
    field: "code" | "name" | "description",
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!form.code.trim() || !form.name.trim()) {
      toast.error("Code and Name are required.");
      return;
    }

    const toastId = toast.loading("Creating division...");

    try {
      await createDivision({
        code: form.code.trim(),
        name: form.name.trim(),
        description: form.description.trim(),
      }).unwrap();

      toast.success("Division created successfully.", {
        id: toastId,
      });

      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to create division.", {
        id: toastId,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 ">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />

      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white border border-[#E5E7EB] dark:border-[#4A5565] dark:bg-[#101828] shadow-2xl ring-1 ring-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E5E7EB] dark:border-[#4A5565] px-6 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500">
              Division
            </p>
            <h2 className="mt-0.5 text-lg font-bold text-slate-800 dark:text-white">
              Create Division
            </h2>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-4 px-6 py-5">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">
              Code
            </label>
            <input
              value={form.code}
              onChange={(e) => handleChange("code", e.target.value)}
              className="w-full rounded-lg border border-[#E5E7EB] dark:border-[#4A5565] bg-slate-50 dark:bg-gray-800 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="DIV-001"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">
              Name
            </label>
            <input
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="w-full rounded-lg border border-[#E5E7EB] dark:border-[#4A5565] bg-slate-50 dark:bg-gray-800 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Commercial"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">
              Description
            </label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="w-full resize-none rounded-lg border border-[#E5E7EB] dark:border-[#4A5565] bg-slate-50 dark:bg-gray-800 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Enter description..."
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 border-t border-slate-100 dark:border-gray-800 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
          >
            Cancel
          </button>

          <button
            disabled={isLoading}
            onClick={handleSubmit}
            className="inline-flex items-center gap-2 rounded-lg bg-[#008236] px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
          >
            {isLoading ? (
              <Loader className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}

            Create Division
          </button>
        </div>
      </div>
    </div>
  );
}