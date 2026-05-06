"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useRouter } from "next/navigation";

export default function CreateProjectForm({ dashboardPath = "/admin" }: { dashboardPath?: string }) {
  const router = useRouter();

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Project Created! Moving to Setup...");
    router.push(`${dashboardPath}/projects/1`); 
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
            <Input
              label="Project Name"
              placeholder="e.g., Residential Complex"
              className="h-14 rounded-2xl border-gray-100 focus:border-emerald-200 focus:ring-emerald-500/5 transition-all font-medium"
              required
            />
            
            <Input
              label="Project Address"
              placeholder="united states"
              className="h-14 rounded-2xl border-gray-100 focus:border-emerald-200 focus:ring-emerald-500/5 transition-all font-medium"
              required
            />
          </div>

          <Button 
            type="submit"
            variant="primary" 
            className="w-full h-14 rounded-2xl font-black text-base shadow-lg shadow-emerald-100 dark:shadow-none active:scale-[0.98] transition-all mt-4"
          >
            Create Project
          </Button>
        </form>
      </div>
    </div>
  );
}
