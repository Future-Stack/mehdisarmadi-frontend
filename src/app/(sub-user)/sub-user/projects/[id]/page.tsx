"use client";

import React, { useState } from "react";
import { ArrowLeft, Upload, CheckCircle2, ChevronRight, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useGetProjectByIdQuery } from "@/store/api/projectApi";

export default function ProjectDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  
  const { data: projectData, isLoading, error } = useGetProjectByIdQuery(id);
  const project = projectData?.data;

  // We are assuming divisions are already selected during creation or can be updated here
  // For UI sake we just display what was returned
  const selectedDivisions = project?.divisions?.map(d => d.id) || [];
  
  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading project details...</div>;
  if (error || !project) return <div className="p-8 text-center text-red-500">Failed to load project details.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      
      {/* Header */}
      <div>
        <Link href="/sub-user" className="inline-flex items-center gap-1 text-sm font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{project.name}</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{project.address}</p>
      </div>

      {/* Upload Original Tender Documents */}
      <div className="bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm">
        <h3 className="text-[15px] font-bold text-gray-900 dark:text-white mb-4">Original Tender Documents ({project.tenderFileCount})</h3>
        <div className="space-y-2">
          {project.files?.filter(f => f.kind === 'tender').map(f => (
             <div key={f.id} className="flex justify-between items-center p-3 px-4 bg-gray-50/50 dark:bg-gray-800/30 rounded-xl border border-gray-100 dark:border-gray-800">
               <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{f.originalName}</span>
               <span className="text-xs font-bold text-gray-500">{f.status}</span>
             </div>
          ))}
          {project.tenderFileCount === 0 && (
             <p className="text-sm text-gray-500">No tender files uploaded.</p>
          )}
        </div>
      </div>

      {/* Upload Addenda */}
      <div className="bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 rounded-3xl p-6">
        <h3 className="text-[15px] font-bold text-gray-900 dark:text-white mb-4">Addenda Documents ({project.addendumFileCount})</h3>
        <div className="space-y-2">
          {project.files?.filter(f => f.kind === 'addendum').map(f => (
             <div key={f.id} className="flex justify-between items-center p-3 px-4 bg-white dark:bg-gray-800/30 rounded-xl border border-gray-100 dark:border-gray-800">
               <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{f.originalName}</span>
               <span className="text-xs font-bold text-gray-500">{f.status}</span>
             </div>
          ))}
          {project.addendumFileCount === 0 && (
             <p className="text-sm text-gray-500">No addenda files uploaded.</p>
          )}
        </div>
      </div>

      {/* Select Applicable Divisions */}
      <div className="bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm">
        <h3 className="text-[15px] font-bold text-gray-900 dark:text-white mb-4">Applicable Divisions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
          {project.divisions?.map(div => (
            <div 
              key={div.id}
              className="p-3 rounded-xl border-2 border-emerald-500 bg-emerald-50/30 dark:bg-emerald-900/20 flex flex-col justify-between h-20"
            >
              <div className="flex justify-between items-start">
                <span className="text-[12px] font-bold text-emerald-700 dark:text-emerald-400">
                  Div {div.code}
                </span>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-[13px] font-semibold line-clamp-1 mt-1 text-gray-900 dark:text-white">
                {div.name}
              </div>
            </div>
          ))}
          {project.divisions?.length === 0 && (
             <p className="text-sm text-gray-500">No divisions selected.</p>
          )}
        </div>
      </div>

      {/* Estimator Instructions */}
      <div className="bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm">
        <h3 className="text-[15px] font-bold text-gray-900 dark:text-white mb-1">Estimator Instructions / Focus Area</h3>
        <p className="text-[13px] text-gray-500 dark:text-gray-400 mb-4">{project.instruction || "No instructions provided."}</p>
      </div>

      {/* Document Processing / Analyze Button */}
      <div className="bg-white dark:bg-[#111827] border border-emerald-100 dark:border-emerald-900/50 rounded-3xl p-6 shadow-sm shadow-emerald-100 dark:shadow-none flex flex-col items-center">
        <div className="w-full flex items-center justify-between mb-2">
          <span className="text-[13px] font-bold text-gray-700 dark:text-gray-300">Document Processing: {project.fileCount}/{project.fileCount} files completed</span>
          <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-md">Ready</span>
        </div>
        
        <div className="w-full h-2 bg-emerald-100 dark:bg-gray-800 rounded-full overflow-hidden mb-6">
          <div className="h-full bg-emerald-500" style={{ width: '100%' }}></div>
        </div>

        <Link href={`/sub-user/projects/${id}/analyzing`}>
          <Button variant="primary" className="h-11 px-8 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-200 dark:shadow-none">
            ✨ Analyze Tender
          </Button>
        </Link>
      </div>

    </div>
  );
}
