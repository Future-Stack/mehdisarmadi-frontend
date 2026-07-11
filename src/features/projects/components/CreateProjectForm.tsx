"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useRouter } from "next/navigation";

export default function CreateProjectForm({ dashboardPath = "/admin" }: { dashboardPath?: string }) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    clientName: "",
    clientContact: "",
    closingDate: "",
    questionDate: "",
    description: "",
    instruction: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    // Store in session storage to pass to the setup page
    sessionStorage.setItem("draftProject", JSON.stringify(formData));
    router.push(`${dashboardPath}/projects/new`); 
  };

  return (
    <div className="w-full max-w-2xl animate-in fade-in zoom-in duration-500">
      <div className="bg-white dark:bg-[#111827] rounded-[32px] border border-gray-100 dark:border-gray-800 p-10 shadow-[0_20px_50px_rgba(0,0,0,0.04)] dark:shadow-none space-y-8 transition-colors duration-300">
        {/* Header */}
        <div className="space-y-6">
          <Link 
            href={dashboardPath} 
            className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-[#059669] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight transition-colors">
              Create New Project
            </h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium transition-colors">
              Transform the way you manage construction tenders with AI-powered automation.
            </p>
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleCreate} className="space-y-6">
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Project Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Residential Complex"
                className="h-14 rounded-2xl border-gray-100 focus:border-emerald-200 focus:ring-emerald-500/5 transition-all font-medium"
                required
              />
              
              <Input
                label="Project Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="united states"
                className="h-14 rounded-2xl border-gray-100 focus:border-emerald-200 focus:ring-emerald-500/5 transition-all font-medium"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Client Name"
                name="clientName"
                value={formData.clientName}
                onChange={handleChange}
                placeholder="Client Name"
                className="h-14 rounded-2xl border-gray-100 focus:border-emerald-200 focus:ring-emerald-500/5 transition-all font-medium"
              />
              <Input
                label="Client Contact"
                name="clientContact"
                value={formData.clientContact}
                onChange={handleChange}
                placeholder="Contact Details"
                className="h-14 rounded-2xl border-gray-100 focus:border-emerald-200 focus:ring-emerald-500/5 transition-all font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Closing Date"
                type="datetime-local"
                name="closingDate"
                value={formData.closingDate}
                onChange={handleChange}
                className="h-14 rounded-2xl border-gray-100 focus:border-emerald-200 focus:ring-emerald-500/5 transition-all font-medium"
              />
              <Input
                label="Question Date"
                type="datetime-local"
                name="questionDate"
                value={formData.questionDate}
                onChange={handleChange}
                className="h-14 rounded-2xl border-gray-100 focus:border-emerald-200 focus:ring-emerald-500/5 transition-all font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full min-h-[100px] p-4 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#111827] focus:outline-none focus:border-emerald-200 dark:focus:border-emerald-800 focus:ring-4 focus:ring-emerald-500/5 transition-all text-sm font-medium resize-y"
                placeholder="Brief description of the project"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Instruction</label>
              <textarea
                name="instruction"
                value={formData.instruction}
                onChange={handleChange}
                className="w-full min-h-[100px] p-4 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#111827] focus:outline-none focus:border-emerald-200 dark:focus:border-emerald-800 focus:ring-4 focus:ring-emerald-500/5 transition-all text-sm font-medium resize-y"
                placeholder="Any specific instructions"
              />
            </div>
          </div>

          <Button 
            type="submit"
            variant="primary" 
            className="w-full h-14 rounded-2xl font-black text-base shadow-lg shadow-emerald-100 dark:shadow-none active:scale-[0.98] transition-all mt-4"
          >
            Continue to Project Setup
          </Button>
        </form>
      </div>
    </div>
  );
}
