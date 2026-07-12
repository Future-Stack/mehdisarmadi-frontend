"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  Upload, 
  FileText, 
  CheckCircle2, 
  X, 
  Plus, 
  Info
} from "lucide-react";
import { Button } from "@/components/ui/Button";

const DIVISIONS = [
  { id: "01", name: "General Requirements", selected: true },
  { id: "06", name: "Wood, Plastics & Composites", selected: true },
  { id: "08", name: "Openings", selected: true },
  { id: "09", name: "Finishes", selected: true },
  { id: "21", name: "Fire Suppression", selected: true },
  { id: "22", name: "Plumbing", selected: false },
  { id: "23", name: "HVAC", selected: false },
  { id: "26", name: "Electrical", selected: false },
];

export default function ProjectDetailsPage() {
  const originalInputRef = React.useRef<HTMLInputElement>(null);
  const addendaInputRef = React.useRef<HTMLInputElement>(null);

  const [originalFiles, setOriginalFiles] = useState([
    "Architectural_Drawings.pdf", 
    "Structural_Specs.pdf", 
    "Addendum_01.pdf"
  ]);
  
  const [addendaFiles, setAddendaFiles] = useState([
    { name: "Addendum_01.pdf", date: "April 10, 2024" },
    { name: "Addendum_02.pdf", date: "April 15, 2024" }
  ]);
  
  const [selectedDivs, setSelectedDivs] = useState(DIVISIONS.filter(d => d.selected).map(d => d.id));

  const handleOriginalUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files).map(f => f.name);
      setOriginalFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleAddendaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files).map(f => ({
        name: f.name,
        date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
      }));
      setAddendaFiles(prev => [...prev, ...newFiles]);
    }
  };

  const toggleDivision = (id: string) => {
    setSelectedDivs(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const selectAllDivs = () => setSelectedDivs(DIVISIONS.map(d => d.id));
  const clearAllDivs = () => setSelectedDivs([]);

  const removeOriginalFile = (name: string) => {
    setOriginalFiles(prev => prev.filter(f => f !== name));
  };

  const removeAddendaFile = (name: string) => {
    setAddendaFiles(prev => prev.filter(f => f.name !== name));
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Hidden Inputs */}
      <input 
        type="file" 
        multiple 
        ref={originalInputRef} 
        className="hidden" 
        onChange={handleOriginalUpload} 
      />
      <input 
        type="file" 
        multiple 
        ref={addendaInputRef} 
        className="hidden" 
        onChange={handleAddendaUpload} 
      />

      {/* Breadcrumb & Title */}
      <div className="space-y-4">
        <Link 
          href="/dashboard" 
          className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-[#059669] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            Green Valley Residential Complex
          </h1>
          <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">
            Dhaka, Bangladesh
          </p>
        </div>
      </div>

      {/* Upload Section */}
      <section className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm">
        <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
          Upload Original Tender Documents
        </h2>
        <div 
          onClick={() => originalInputRef.current?.click()}
          className="border-2 border-dashed border-emerald-100 rounded-[24px] bg-emerald-50/20 p-12 flex flex-col items-center justify-center text-center gap-4 group hover:bg-emerald-50/40 transition-all cursor-pointer"
        >
          <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-[#059669] group-hover:scale-110 transition-transform">
            <Upload className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <p className="text-gray-700 font-bold">Drag & drop tender documents or click to upload</p>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Supported: PDF, DOCX, XLSX</p>
          </div>
          <Button variant="primary" className="mt-4 rounded-xl px-8 h-12 font-bold shadow-lg shadow-emerald-100">
            Upload Tender Documents
          </Button>
        </div>
      </section>

      {/* Original Documents List */}
      <section className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm space-y-6">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          Original Documents ({originalFiles.length})
        </h2>
        <div className="space-y-3">
          {originalFiles.map((file, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-50 group hover:border-emerald-100 transition-all">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm text-gray-400 group-hover:text-[#059669] transition-colors">
                  <FileText className="w-5 h-5" />
                </div>
                <span className="font-bold text-gray-700 text-sm">{file}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-wider">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                </span>
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    removeOriginalFile(file);
                  }}
                  className="p-1 text-gray-300 hover:text-red-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Addenda Section */}
      <section className="bg-[#EFF6FF]/40 rounded-[32px] border border-[#EFF6FF] p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <span className="px-2 py-0.5 bg-[#059669]/10 text-[#059669] rounded text-[10px] font-black uppercase tracking-wider">Optional</span>
          <h2 className="text-lg font-bold text-gray-800">Upload Addenda</h2>
        </div>
        <p className="text-gray-400 text-sm font-bold">Upload any addenda or amendments to the original tender</p>
        
        <Button variant="secondary" className="bg-white border-2 border-[#059669]/20 text-gray-700 h-10 px-4 rounded-xl font-bold flex items-center gap-2">
          <Plus className="w-4 h-4" /> Upload Addendum
        </Button>

        <div className="space-y-3 pt-2">
          {addendaFiles.map((file, i) => (
            <div key={i} className="flex items-center justify-between p-5 bg-white rounded-2xl border border-gray-100 group hover:border-emerald-100 transition-all shadow-sm">
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-emerald-50 rounded-xl text-[#059669]">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                  <span className="font-bold text-gray-800 text-sm block">{file.name}</span>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{file.date}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-wider">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                </span>
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    removeAddendaFile(file.name);
                  }}
                  className="p-1 text-gray-300 hover:text-red-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CSI Divisions Section */}
      <section className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm space-y-6">
        <h2 className="text-lg font-bold text-gray-800">Select Applicable Divisions</h2>
        <p className="text-gray-400 text-sm font-bold leading-relaxed">Choose the CSI divisions relevant to your scope</p>
        
        <div className="flex gap-2">
          <Button 
            variant="primary" 
            size="sm" 
            className="h-9 px-4 rounded-lg font-bold"
            onClick={selectAllDivs}
          >
            Select All Divisions
          </Button>
          <Button 
            variant="secondary" 
            size="sm" 
            className="h-9 px-4 rounded-lg font-bold"
            onClick={clearAllDivs}
          >
            Clear All
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {DIVISIONS.map((div) => {
            const isSelected = selectedDivs.includes(div.id);
            return (
              <div 
                key={div.id} 
                onClick={() => toggleDivision(div.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col gap-2 relative group ${
                  isSelected 
                    ? "bg-emerald-50/50 border-emerald-200" 
                    : "bg-white border-gray-100 hover:border-emerald-100"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider group-hover:text-[#059669]">Div {div.id}</span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                </div>
                <span className={`text-[13px] font-bold ${isSelected ? "text-gray-800" : "text-gray-600"}`}>
                  {div.name}
                </span>
              </div>
            );
          })}
        </div>

        <div className="bg-emerald-50 rounded-xl p-3">
          <p className="text-[11px] font-black text-[#059669] uppercase tracking-widest text-center">
            {selectedDivs.length} division(s) selected
          </p>
        </div>
      </section>

      {/* Estimator Instructions */}
      <section className="bg-emerald-50/30 rounded-[32px] border border-emerald-100 p-8 shadow-sm space-y-6">
        <h2 className="text-lg font-bold text-gray-800">Estimator Instructions / Focus Area</h2>
        <p className="text-gray-400 text-sm font-bold leading-relaxed">Tell the AI what to focus on, exclude, or verify in the uploaded tender documents</p>
        
        <div className="space-y-3">
          <textarea 
            placeholder="Example: Focus on material costs for windows and doors. Exclude painting work. Verify if HST is included in pricing. Flag any warranty requirements."
            className="w-full h-32 bg-white border border-gray-100 rounded-2xl p-4 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-200 transition-all placeholder:text-gray-300 resize-none"
          />
          <p className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
            <Info className="w-3.5 h-3.5" /> Note: The AI may still flag related scope outside the selected division if it affects pricing or coordination.
          </p>
        </div>
      </section>

      {/* Footer / Analyze Section */}
      <section className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm flex flex-col items-center gap-6">
        <div className="w-full space-y-3">
          <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
            <span className="text-gray-400">Document Processing: 5/5 files completed</span>
            <span className="text-emerald-600">Ready</span>
          </div>
          <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#059669] w-full rounded-full transition-all duration-1000 shadow-sm shadow-emerald-200" />
          </div>
        </div>
        
        <Button  variant="primary" className="h-14 px-12 rounded-2xl font-black text-base shadow-xl shadow-emerald-200 flex items-center gap-3 active:scale-95 transition-all">
          <FileText className="w-5 h-5" /> Analyze Tender
        </Button>
      </section>
    </div>
  );
}
