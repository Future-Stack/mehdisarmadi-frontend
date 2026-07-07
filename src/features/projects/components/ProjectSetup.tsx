"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Upload, 
  FileText, 
  CheckCircle2, 
  X, 
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useGetDivisionsQuery, useCreateProjectMutation } from "@/store/api/projectApi";
import { toast } from "sonner";

export default function ProjectSetup({ dashboardPath = "/admin" }: { dashboardPath?: string }) {
  const router = useRouter();
  const { data: divisionsData, isLoading: isDivisionsLoading } = useGetDivisionsQuery();
  const [createProject, { isLoading: isCreating }] = useCreateProjectMutation();
  const divisions = divisionsData?.data || [];

  const originalInputRef = useRef<HTMLInputElement>(null);
  const addendaInputRef = useRef<HTMLInputElement>(null);

  const [originalFiles, setOriginalFiles] = useState<File[]>([]);
  const [addendaFiles, setAddendaFiles] = useState<File[]>([]);
  
  const [selectedDivs, setSelectedDivs] = useState<string[]>([]);
  
  // Basic info from previous step
  const [draftProject, setDraftProject] = useState<any>(null);

  useEffect(() => {
    const draft = sessionStorage.getItem("draftProject");
    if (draft) {
      setDraftProject(JSON.parse(draft));
    } else {
      toast.error("Project details missing, returning to start.");
      router.push(`${dashboardPath}/projects/new`);
    }
  }, [router, dashboardPath]);

  const handleOriginalUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      setOriginalFiles(prev => [...prev, ...newFiles]);
    }
    // reset input so same file can be uploaded again if removed
    if (originalInputRef.current) originalInputRef.current.value = "";
  };

  const handleAddendaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      setAddendaFiles(prev => [...prev, ...newFiles]);
    }
    if (addendaInputRef.current) addendaInputRef.current.value = "";
  };

  const toggleDivision = (id: string) => {
    setSelectedDivs(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const selectAllDivs = () => setSelectedDivs(divisions.map(d => d.id));
  const clearAllDivs = () => setSelectedDivs([]);

  const removeOriginalFile = (name: string) => setOriginalFiles(prev => prev.filter(f => f.name !== name));
  const removeAddendaFile = (name: string) => setAddendaFiles(prev => prev.filter(f => f.name !== name));

  const handleAnalyze = async () => {
    if (!draftProject) {
      toast.error("Missing project info.");
      return;
    }
    if (selectedDivs.length === 0) {
      toast.error("Please select at least one division.");
      return;
    }

    try {
      const formData = new FormData();
      
      // Append text fields
      Object.keys(draftProject).forEach(key => {
        if (draftProject[key]) {
          formData.append(key, draftProject[key]);
        }
      });
      
      // Append selected divisions
      selectedDivs.forEach(divId => {
        formData.append("divisionIds", divId);
      });
      
      // Append files
      originalFiles.forEach(file => {
        formData.append("files", file);
      });
      
      // Append addendum files
      addendaFiles.forEach(file => {
        formData.append("addendum", file);
      });

      // Provide AI Options empty for now, or you can add to UI later
      // formData.append("aiOptions", "Generate Scope of Work");

      const response = await createProject(formData).unwrap();
      toast.success("Project created successfully!");
      sessionStorage.removeItem("draftProject");
      router.push(`/sub-user/projects/${response.data.project.id}`);
    } catch (error: any) {
      console.error(error);
      toast.error(error?.data?.message || "Failed to create project");
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-8 animate-in fade-in duration-500">
      {/* Hidden File Inputs */}
      <input type="file" multiple ref={originalInputRef} className="hidden" onChange={handleOriginalUpload} />
      <input type="file" multiple ref={addendaInputRef} className="hidden" onChange={handleAddendaUpload} />

      {/* Header Info */}
      <div className="space-y-4">
        <Link href={dashboardPath} className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-[#059669] transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">{draftProject?.name || "Project Name"}</h1>
          <p className="text-gray-400 dark:text-gray-500 font-bold text-sm uppercase tracking-widest">{draftProject?.address || "Location"}</p>
        </div>
      </div>

      {/* Upload Main Documents */}
      <section className="bg-white dark:bg-[#111827] rounded-[32px] border border-gray-100 dark:border-gray-800 p-8 shadow-sm transition-colors">
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-6">Upload Original Tender Documents</h2>
        <div 
          onClick={() => originalInputRef.current?.click()}
          className="border-2 border-dashed border-emerald-100 dark:border-emerald-900/30 rounded-[24px] bg-emerald-50/20 dark:bg-emerald-900/5 p-12 flex flex-col items-center justify-center text-center gap-4 group hover:bg-emerald-50/40 dark:hover:bg-emerald-900/10 transition-all cursor-pointer"
        >
          <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-2xl shadow-sm flex items-center justify-center text-[#059669] group-hover:scale-110 transition-transform">
            <Upload className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <p className="text-gray-700 dark:text-gray-300 font-bold">Drag & drop tender documents or click to upload</p>
            <p className="text-gray-400 dark:text-gray-500 text-xs font-bold uppercase tracking-wider">Supported: PDF, DOCX, XLSX</p>
          </div>
          <Button variant="primary" className="mt-4 rounded-xl px-8 h-12 font-bold shadow-lg shadow-emerald-100 dark:shadow-none pointer-events-none">
            Upload Tender Documents
          </Button>
        </div>
      </section>

      {/* File List */}
      {originalFiles.length > 0 && (
        <section className="bg-white dark:bg-[#111827] rounded-[32px] border border-gray-100 dark:border-gray-800 p-8 shadow-sm space-y-6 transition-colors">
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">Original Documents ({originalFiles.length})</h2>
          <div className="space-y-3">
            {originalFiles.map((file, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-gray-800/30 rounded-2xl border border-gray-50 dark:border-gray-700 group hover:border-emerald-100 dark:hover:border-emerald-900 transition-all">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm text-gray-400 group-hover:text-[#059669] transition-colors"><FileText className="w-5 h-5" /></div>
                  <span className="font-bold text-gray-700 dark:text-gray-300 text-sm">{file.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg text-[10px] font-black uppercase tracking-wider"><CheckCircle2 className="w-3.5 h-3.5" /> Ready</span>
                  <button onClick={(e) => { e.stopPropagation(); removeOriginalFile(file.name); }} className="p-1 text-gray-300 dark:text-gray-600 hover:text-red-500 transition-colors"><X className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Addenda Section */}
      <section className="bg-[#EFF6FF]/40 dark:bg-blue-900/5 rounded-[32px] border border-[#EFF6FF] dark:border-gray-800 p-8 shadow-sm space-y-6 transition-colors">
        <div className="flex items-center gap-3">
          <span className="px-2 py-0.5 bg-[#059669]/10 text-[#059669] rounded text-[10px] font-black uppercase tracking-wider">Optional</span>
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">Upload Addenda</h2>
        </div>
        <Button variant="secondary" onClick={() => addendaInputRef.current?.click()} className="bg-white dark:bg-gray-800 border-2 border-[#059669]/20 dark:border-[#059669]/10 text-gray-700 dark:text-gray-300 h-10 px-4 rounded-xl font-bold flex items-center gap-2">
          <Plus className="w-4 h-4" /> Upload Addendum
        </Button>
        {addendaFiles.length > 0 && (
          <div className="space-y-3 pt-2">
            {addendaFiles.map((file, i) => (
              <div key={i} className="flex items-center justify-between p-5 bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700 group hover:border-emerald-100 dark:hover:border-emerald-900 transition-all shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl text-[#059669]"><FileText className="w-5 h-5" /></div>
                  <div className="space-y-0.5">
                    <span className="font-bold text-gray-800 dark:text-gray-100 text-sm block">{file.name}</span>
                    <span className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider">Ready</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={(e) => { e.stopPropagation(); removeAddendaFile(file.name); }} className="p-1 text-gray-300 dark:text-gray-600 hover:text-red-500 transition-colors"><X className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Divisions Section */}
      <section className="bg-white dark:bg-[#111827] rounded-[32px] border border-gray-100 dark:border-gray-800 p-8 shadow-sm space-y-6 transition-colors">
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">Select Applicable Divisions</h2>
        {isDivisionsLoading ? (
          <p className="text-gray-500 text-sm">Loading divisions...</p>
        ) : (
          <>
            <div className="flex gap-2">
              <Button variant="primary" size="sm" className="h-9 px-4 rounded-lg font-bold" onClick={selectAllDivs}>Select All Divisions</Button>
              <Button variant="secondary" size="sm" className="h-9 px-4 rounded-lg font-bold" onClick={clearAllDivs}>Clear All</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {divisions.map((div) => {
                const isSelected = selectedDivs.includes(div.id);
                return (
                  <div key={div.id} onClick={() => toggleDivision(div.id)} className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col gap-2 group ${isSelected ? "bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800" : "bg-white dark:bg-gray-800/50 border-gray-100 dark:border-gray-700 hover:border-emerald-100 dark:hover:border-emerald-800"}`}>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider group-hover:text-[#059669]">Div {div.code}</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
                    </div>
                    <span className={`text-[13px] font-bold ${isSelected ? "text-gray-800 dark:text-gray-100" : "text-gray-600 dark:text-gray-400"}`}>{div.name}</span>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </section>

      {/* Bottom Action */}
      <section className="bg-white dark:bg-[#111827] rounded-[32px] border border-gray-100 dark:border-gray-800 p-8 shadow-sm flex flex-col items-center gap-6 text-center transition-colors">
        <div className="w-full space-y-3">
          <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">
            <span>Document Processing: {originalFiles.length + addendaFiles.length} files selected</span>
            <span className="text-emerald-600 dark:text-emerald-400">Ready</span>
          </div>
          <div className="w-full h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-[#059669] w-full rounded-full transition-all duration-1000 shadow-sm" style={{ width: originalFiles.length > 0 ? '100%' : '0%' }} />
          </div>
        </div>
        <div className="w-full max-w-sm">
          <Button 
            variant="primary" 
            onClick={handleAnalyze}
            disabled={isCreating}
            isLoading={isCreating}
            loadingText="Analyzing..."
            className="w-full h-14 rounded-2xl font-black text-base shadow-xl shadow-emerald-200 dark:shadow-none flex items-center justify-center gap-3 active:scale-95 transition-all"
          >
            <FileText className="w-5 h-5" /> Analyze Tender
          </Button>
        </div>
      </section>
    </div>
  );
}
