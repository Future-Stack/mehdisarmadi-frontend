"use client";

import React, { useState, useRef, useEffect } from "react";
import { ArrowLeft, Upload, CheckCircle2, Loader2, FileText, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useGetProjectByIdQuery, useGetDivisionsQuery, useUpdateProjectMutation } from "@/store/api/projectApi";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function ProjectDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const router = useRouter();
  
  const { data: projectData, isLoading, error } = useGetProjectByIdQuery(id);
  const { data: divisionsData, isLoading: isDivLoading } = useGetDivisionsQuery();
  const [updateProject, { isLoading: isUpdating }] = useUpdateProjectMutation();
  
  const project = projectData?.data;

  // Local state for editing
  const [uploadedTenderFiles, setUploadedTenderFiles] = useState<File[]>([]);
  const [uploadedAddendaFiles, setUploadedAddendaFiles] = useState<File[]>([]);
  const [selectedDivisions, setSelectedDivisions] = useState<string[]>([]);
  const [instruction, setInstruction] = useState("");
  
  const tenderInputRef = useRef<HTMLInputElement>(null);
  const addendaInputRef = useRef<HTMLInputElement>(null);

  // Initialize state from project data
  useEffect(() => {
    if (project) {
      setSelectedDivisions(project.divisions?.map(d => d.id) || []);
      setInstruction(project.instruction || "");
    }
  }, [project]);
  
  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading project details...</div>;
  if (error || !project) return <div className="p-8 text-center text-red-500">Failed to load project details.</div>;

  const handleTenderUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedTenderFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const handleAddendaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedAddendaFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const handleSelectAllDivisions = () => {
    if (divisionsData?.data) {
      setSelectedDivisions(divisionsData.data.map(d => d.id));
    }
  };

  const handleClearAllDivisions = () => {
    setSelectedDivisions([]);
  };

  const handleAnalyze = async () => {
    try {
      // Check if there are changes to save
      const divisionsChanged = JSON.stringify(selectedDivisions.sort()) !== JSON.stringify(project.divisions?.map(d => d.id).sort());
      const instructionChanged = instruction !== (project.instruction || "");
      const hasNewFiles = uploadedTenderFiles.length > 0 || uploadedAddendaFiles.length > 0;

      if (divisionsChanged || instructionChanged || hasNewFiles) {
        toast.info("Saving changes before analysis...");
        const formData = new FormData();
        
        // We must append basic required fields since it's a PUT
        formData.append("name", project.name || "");
        formData.append("clientName", project.clientName || "");
        formData.append("clientContact", project.clientContact || "");
        formData.append("closingDate", project.closingDate || "");
        formData.append("questionDate", project.questionDate || "");
        formData.append("address", project.address || "");
        formData.append("description", project.description || "");
        
        formData.append("instruction", instruction);
        selectedDivisions.forEach(id => formData.append("divisionIds", id));
        
        project.aiOptions?.forEach(opt => formData.append("aiOptions", opt));
        
        uploadedTenderFiles.forEach(file => formData.append("files", file));
        uploadedAddendaFiles.forEach(file => formData.append("addendum", file));

        await updateProject({ projectId: id, data: formData }).unwrap();
      }
      
      router.push(`/sub-user/projects/${id}/analyzing`);
    } catch (err) {
      toast.error("Failed to update project settings before analysis.");
    }
  };

  // Ensure total files count reflects new uploads visually
  const totalFiles = (project.tenderFileCount || 0) + (project.addendumFileCount || 0) + uploadedTenderFiles.length + uploadedAddendaFiles.length;
  
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <input type="file" multiple ref={tenderInputRef} className="hidden" onChange={handleTenderUpload} />
      <input type="file" multiple ref={addendaInputRef} className="hidden" onChange={handleAddendaUpload} />

      {/* Header */}
      <div>
        <Link href="/sub-user" className="inline-flex items-center gap-1 text-sm font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <h1 className="text-[28px] font-bold text-gray-900 dark:text-white">{project.name}</h1>
        <p className="text-[13px] text-gray-500 dark:text-gray-400 font-medium">{project.address}</p>
      </div>

      {/* Upload Original Tender Documents */}
      <div className="bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm">
        <h3 className="text-[14px] font-medium text-gray-900 dark:text-white mb-6">Upload Original Tender Documents</h3>
        
        <div 
          onClick={() => tenderInputRef.current?.click()}
          className="border-2 border-dashed border-emerald-300 dark:border-emerald-700/50 rounded-[24px] bg-emerald-50/50 dark:bg-emerald-900/10 p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-emerald-50/80 transition-colors"
        >
          <div className="w-12 h-12 bg-white dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-4 shadow-sm border border-emerald-100 dark:border-emerald-800">
            <Upload className="w-5 h-5 text-emerald-600" />
          </div>
          <h3 className="text-[15px] font-medium text-gray-800 dark:text-white mb-2">Drag & drop tender documents or click to upload</h3>
          <p className="text-[13px] text-gray-500 mb-6">Supported: PDF, DOCX, XLSX</p>

          <Button variant="primary" className="h-10 px-6 rounded-xl font-bold bg-[#009966] hover:bg-emerald-700 shadow-sm text-white pointer-events-none">
            Upload Tender Documents
          </Button>
        </div>

        {/* Existing & New Tender Files */}
        {(project.files?.filter(f => f.kind === 'tender').length > 0 || uploadedTenderFiles.length > 0) && (
          <div className="mt-6 space-y-2">
            {project.files?.filter(f => f.kind === 'tender').map(f => (
               <div key={f.id} className="flex items-center gap-3 p-3 bg-gray-50/50 dark:bg-gray-800/30 rounded-xl border border-gray-100 dark:border-gray-800">
                 <FileText className="w-5 h-5 text-emerald-500" />
                 <span className="text-[13px] font-medium text-gray-700 dark:text-gray-200">{f.originalName}</span>
                 <span className="ml-auto text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Uploaded</span>
               </div>
            ))}
            {uploadedTenderFiles.map((f, i) => (
               <div key={i} className="flex items-center gap-3 p-3 bg-blue-50/50 dark:bg-blue-900/30 rounded-xl border border-blue-100 dark:border-blue-800">
                 <FileText className="w-5 h-5 text-blue-500" />
                 <span className="text-[13px] font-medium text-gray-700 dark:text-gray-200">{f.name}</span>
                 <span className="ml-auto text-[11px] font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Pending Save</span>
               </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Addenda */}
      <div className="bg-[#EFF6FF] dark:bg-blue-900/10 border border-[#E2E8F0] dark:border-blue-800 rounded-3xl p-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-0.5 bg-[#D1FAE5] text-[#059669] text-[10px] font-bold uppercase rounded">Optional</span>
          <h3 className="text-[14px] font-medium text-gray-900 dark:text-white">Upload Addenda</h3>
        </div>
        <p className="text-[13px] text-[#4A5565] dark:text-blue-300 mb-4">Upload any addenda or amendments to the original tender</p>
        
        <Button 
          variant="secondary" 
          onClick={() => addendaInputRef.current?.click()}
          className="h-10 px-4 rounded-xl font-semibold bg-white border border-gray-200 shadow-sm text-gray-700 hover:bg-gray-50"
        >
          <Upload className="w-4 h-4 mr-2" /> Upload Addendum
        </Button>

        {/* Existing & New Addenda Files */}
        {(project.files?.filter(f => f.kind === 'addendum').length > 0 || uploadedAddendaFiles.length > 0) && (
          <div className="mt-6 space-y-2">
            {project.files?.filter(f => f.kind === 'addendum').map(f => (
               <div key={f.id} className="flex items-center gap-3 p-3 bg-white/60 dark:bg-gray-800/30 rounded-xl border border-gray-200 dark:border-gray-800">
                 <FileText className="w-5 h-5 text-blue-500" />
                 <span className="text-[13px] font-medium text-gray-700 dark:text-gray-200">{f.originalName}</span>
                 <span className="ml-auto text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Uploaded</span>
               </div>
            ))}
            {uploadedAddendaFiles.map((f, i) => (
               <div key={i} className="flex items-center gap-3 p-3 bg-white/90 dark:bg-blue-900/30 rounded-xl border border-blue-200 dark:border-blue-800">
                 <FileText className="w-5 h-5 text-blue-500" />
                 <span className="text-[13px] font-medium text-gray-700 dark:text-gray-200">{f.name}</span>
                 <span className="ml-auto text-[11px] font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Pending Save</span>
               </div>
            ))}
          </div>
        )}
      </div>

      {/* Select Applicable Divisions */}
      <div className="bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm">
        <h3 className="text-[14px] font-medium text-[#101828] dark:text-white mb-1">Select Applicable Divisions</h3>
        <p className="text-[13px] text-[#4A5565] dark:text-gray-400 mb-4">Choose the CSI divisions relevant to your scope</p>
        
        <div className="flex gap-2 mb-6">
          <Button onClick={handleSelectAllDivisions} variant="primary" className="h-9 px-4 rounded-lg font-semibold bg-[#009966] hover:bg-emerald-700 text-white text-[12px]">
            Select All Divisions
          </Button>
          <Button onClick={handleClearAllDivisions} variant="secondary" className="h-9 px-4 rounded-lg font-semibold bg-white border border-gray-200 text-[#344054] text-[12px] hover:bg-gray-50">
            Clear All
          </Button>
        </div>

        {isDivLoading ? (
          <p className="text-xs text-gray-500">Loading divisions...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            {divisionsData?.data?.map(div => {
              const isSelected = selectedDivisions.includes(div.id);
              return (
                <div 
                  key={div.id}
                  onClick={() => setSelectedDivisions(prev => prev.includes(div.id) ? prev.filter(id => id !== div.id) : [...prev, div.id])}
                  className={cn(
                    "p-3 rounded-xl border-2 cursor-pointer transition-colors flex flex-col justify-between h-20",
                    isSelected 
                      ? "border-[#5EE9B5] bg-[#ECFDF5] dark:bg-emerald-900/20" 
                      : "border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-gray-200 dark:hover:border-gray-700"
                  )}
                >
                  <div className="flex justify-between items-start">
                    <span className={cn("text-[12px] font-bold", isSelected ? "text-[#101828] dark:text-emerald-400" : "text-gray-500 dark:text-gray-400")}>
                      Div {div.code}
                    </span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-[#10B981]" />}
                  </div>
                  <div className={cn("text-[13px] font-semibold line-clamp-1 mt-1", isSelected ? "text-[#101828] dark:text-white" : "text-[#4A5565] dark:text-gray-300")}>
                    {div.name}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        <div className="bg-[#EFF6FF] text-[#1D4ED8] text-[12px] font-bold px-4 py-3 rounded-xl border border-[#EFF6FF]">
          {selectedDivisions.length} division(s) selected
        </div>
      </div>

      {/* Estimator Instructions */}
      <div className="bg-[#ECFDF5] dark:bg-emerald-900/10 border border-[#ECFDF5] dark:border-emerald-800 rounded-3xl p-6 shadow-sm">
        <h3 className="text-[14px] font-bold text-[#101828] dark:text-white mb-1">Estimator Instructions / Focus Area</h3>
        <p className="text-[13px] text-[#4A5565] dark:text-gray-400 mb-4">Tell the AI what to focus on, exclude, or verify in the uploaded tender documents</p>
        
        <textarea
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
          placeholder="Example: Focus on material costs for windows and doors. Exclude painting work. Verify if HST is included in pricing. Flag any warranty requirements."
          className="w-full h-24 p-4 text-[13px] text-gray-700 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 mb-2 resize-none shadow-sm"
        />
        <p className="text-[10px] font-medium text-gray-500">Note: The AI may still flag related scope outside the selected division if it affects pricing or coordination.</p>
      </div>

      {/* Document Processing / Analyze Button */}
      <div className="bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm flex flex-col items-center">
        <div className="w-full flex items-center justify-between mb-2">
          <span className="text-[13px] font-medium text-[#4A5565] dark:text-gray-300">Document Processing: {totalFiles}/{totalFiles} files completed</span>
          <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-md">Ready</span>
        </div>
        
        <div className="w-full h-2 bg-emerald-100 dark:bg-gray-800 rounded-full overflow-hidden mb-6">
          <div className="h-full bg-[#10B981]" style={{ width: '100%' }}></div>
        </div>

        <Button 
          onClick={handleAnalyze} 
          disabled={isUpdating}
          variant="primary" 
          className="h-11 px-8 rounded-xl font-bold bg-[#009966] hover:bg-emerald-700 shadow-md shadow-emerald-200 dark:shadow-none"
        >
          {isUpdating ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <FileText className="w-5 h-5 mr-2" />}
          Analyze Tender
        </Button>
      </div>

    </div>
  );
}
