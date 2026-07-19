"use client";

import React, { useState, useRef } from "react";
import { ArrowLeft, Upload, FileText, X, Check, Building2, User, Calendar as CalendarIcon, ArrowRight, CheckCircle2, SparklesIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useGetDivisionsQuery, useCreateProjectMutation } from "@/store/api/projectApi";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const STEPS = [
  { id: 1, title: "Basic Info", subtitle: "Tender details" },
  { id: 2, title: "Upload Files", subtitle: "Tender documents" },
  { id: 3, title: "AI Options", subtitle: "Analysis settings" },
  { id: 4, title: "Review", subtitle: "Confirm & create" }
];

export default function NewProjectWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [formData, setFormData] = useState({
    projectName: "",
    clientName: "",
    clientContact: "",
    closingDate: "",
    questionDate: "",
    projectAddress: "",
    projectDescription: "",
    instruction: "",
  });

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const [aiOptions, setAiOptions] = useState({
    generateScope: true,
    detectRisks: true,
    suggestPricing: true,
    analyzeAddenda: false,
    extractQuantities: true,
  });

  const [selectedDivisions, setSelectedDivisions] = useState<string[]>([]);
  const { data: divisionsData, isLoading: isDivLoading } = useGetDivisionsQuery();
  const [createProject, { isLoading: isCreating }] = useCreateProjectMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedFiles(prev => [...prev, ...Array.from(e.target.files as FileList)]);
    }
  };

  const handleCreate = async () => {
    if (!formData.projectName || !formData.projectAddress) {
      toast.error("Tender Name and Address are required.");
      return;
    }

    try {
      const data = new FormData();
      data.append("name", formData.projectName);
      data.append("address", formData.projectAddress);
      data.append("clientName", formData.clientName);
      data.append("clientContact", formData.clientContact);
      if (formData.closingDate) data.append("closingDate", new Date(formData.closingDate).toISOString());
      if (formData.questionDate) data.append("questionDate", new Date(formData.questionDate).toISOString());
      data.append("description", formData.projectDescription);
      data.append("instruction", formData.instruction);

      selectedDivisions.forEach(id => data.append("divisionIds", id));

      const aiOptsArray = Object.keys(aiOptions).filter(k => (aiOptions as any)[k]);
      aiOptsArray.forEach(opt => data.append("aiOptions", opt));

      uploadedFiles.forEach(file => {
        data.append("files", file);
      });

      const response = await createProject(data).unwrap();
      toast.success("Tender created successfully!");
      router.push(`/sub-user/projects/${response.data.project.id}`);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to create tender");
    }
  };

  // Calculate progress for the Tender Summary
  let progress = 0;
  if (currentStep >= 1 && formData.projectName) progress += 25;
  if (currentStep >= 2 && uploadedFiles.length > 0) progress += 25;
  if (currentStep >= 3) progress += 25;
  if (currentStep === 4) progress += 25;

  return (
    <div className="flex flex-col lg:flex-row  gap-6 max-w-7xl mx-auto pb-12">
      <input type="file" multiple ref={fileInputRef} className="hidden" onChange={handleFileUpload} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col gap-6">

        {/* Step Indicator */}
        <div className="bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 rounded-2xl p-4 sm:p-6 shadow-sm flex items-center justify-between relative">
          <div className="absolute top-1/2 left-[10%] right-[10%] h-1 bg-gray-100 dark:bg-gray-800 -translate-y-1/2 z-0"></div>
          <div
            className="absolute top-1/2 left-[10%] h-1 bg-emerald-500 transition-all duration-500 -translate-y-1/2 z-0"
            style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 80}%` }}
          ></div>

          {STEPS.map((step) => {
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            return (
              <div key={step.id} className="relative z-10 flex flex-col items-center gap-1 sm:gap-2 bg-white dark:bg-[#111827] px-1 sm:px-4">
                <div className={cn(
                  "w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition-colors",
                  isActive ? "bg-[#009966] text-white shadow-md shadow-emerald-200 dark:shadow-none" :
                    isCompleted ? "bg-[#009966] text-white" : "bg-[#D9DBDD] dark:bg-gray-800 text-[#6B6969]"
                )}>
                  {isCompleted ? <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : String(step.id).padStart(2, '0')}
                </div>
                <div className="text-center ">
                  <div className={cn("text-[10px] sm:text-[12px] font-bold", isActive || isCompleted ? "text-[#101828] dark:text-white" : "text-[#6B6969]")}>{step.title}</div>
                  <div className={cn("text-[9px] sm:text-[11px] font-medium ", isActive || isCompleted ? "text-[#101828] dark:text-white" : "text-[#6A7282]")}>{step.subtitle}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Wizard Form Area */}
        <div className="bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 rounded-[24px] sm:rounded-[32px] p-5 sm:p-8 lg:px-16 lg:py-11 shadow-sm min-h-[500px] flex flex-col">

          <div className="flex items-center gap-2 mb-6 lg:mb-10">
            <Link href="/sub-user" className="text-sm font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white flex items-center gap-1 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </Link>
          </div>

          {/* Dynamic Content based on step */}
          <div className="flex-1">

            {/* STEP 1: Basic Info */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-[22px] font-bold text-gray-900 dark:text-white">Basic Info</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Tender details</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[13px] font-medium text-gray-700 dark:text-gray-300 mb-1.5">Tender Name *</label>
                    <input
                      type="text"
                      placeholder="e.g., Green Valley Residential Complex"
                      value={formData.projectName}
                      onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                      className="w-full h-11 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-gray-700 dark:text-gray-300 mb-1.5">Client Name *</label>
                    <input
                      type="text"
                      placeholder="e.g., ABC Developers Inc."
                      value={formData.clientName}
                      onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                      className="w-full h-11 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[13px] font-medium text-gray-700 dark:text-gray-300 mb-1.5">Client Contact *</label>
                      <input
                        type="email"
                        placeholder="email@example.com"
                        value={formData.clientContact}
                        onChange={(e) => setFormData({ ...formData, clientContact: e.target.value })}
                        className="w-full h-11 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[13px] font-medium text-gray-700 dark:text-gray-300 mb-1.5">CLOSING DATE</label>
                      <div className="relative">
                        <input
                          type="date"
                          value={formData.closingDate}
                          onChange={(e) => {
                            const value = e.target.value;
                            setFormData((prev) => ({
                              ...prev,
                              closingDate: value,
                              // reset questionDate if it's now invalid relative to the new closing date
                              questionDate: prev.questionDate && value && prev.questionDate > value ? "" : prev.questionDate,
                            }));
                          }}
                          className="w-full h-11 pl-10 pr-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                        />
                        <CalendarIcon className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[13px] font-medium text-gray-700 dark:text-gray-300 mb-1.5">QUESTION DUE DATE</label>
                      <div className="relative">
                        <input
                          type="date"
                          value={formData.questionDate}
                          max={formData.closingDate || undefined}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (formData.closingDate && value > formData.closingDate) {
                              toast.error("Question due date cannot be after the closing date.");
                              return;
                            }
                            setFormData({ ...formData, questionDate: value });
                          }}
                          className="w-full h-11 pl-10 pr-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                        />
                        <CalendarIcon className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[13px] font-medium text-gray-700 dark:text-gray-300 mb-1.5">Tender Address *</label>
                    <input
                      type="text"
                      placeholder="e.g., 123 Main St..."
                      value={formData.projectAddress}
                      onChange={(e) => setFormData({ ...formData, projectAddress: e.target.value })}
                      className="w-full h-11 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-gray-700 dark:text-gray-300 mb-1.5">Tender Description</label>
                    <textarea
                      placeholder="Brief description of the tender scope...."
                      value={formData.projectDescription}
                      onChange={(e) => setFormData({ ...formData, projectDescription: e.target.value })}
                      className="w-full h-24 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-gray-700 dark:text-gray-300 mb-1.5">Instructions</label>
                    <textarea
                      placeholder="Instructions..."
                      value={formData.instruction}
                      onChange={(e) => setFormData({ ...formData, instruction: e.target.value })}
                      className="w-full h-24 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 resize-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Upload Files */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-[22px] font-bold text-gray-900 dark:text-white">Upload Files & Select Divisions</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Tender documents</p>
                </div>

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-emerald-300 dark:border-emerald-700/50 rounded-[24px] bg-emerald-50/50 dark:bg-emerald-900/10 p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-emerald-50/80 transition-colors"
                >
                  <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 shadow-sm">
                    <Upload className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h3 className="text-[17px] font-medium text-gray-800 dark:text-white mb-2">Drag & Drop Files Here</h3>
                  <p className="text-sm text-gray-500 mb-6">or click to browse and select files</p>

                  <Button variant="secondary" className="h-10 px-6 rounded-xl font-bold bg-white dark:bg-[#111827] border-gray-200 shadow-sm text-gray-700 pointer-events-none">
                    <Upload className="w-4 h-4 mr-2" /> Browse Files
                  </Button>
                  <p className="text-[11px] text-gray-400 font-medium mt-4">
                    Supported formats: PDF, DOC, DOCX, XLS, XLSX (Max 100MB per file)
                  </p>
                </div>

                {uploadedFiles.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">Uploaded Files</h4>
                    {uploadedFiles.map((file, idx) => (
                      <div key={idx} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
                        <FileText className="w-6 h-6 text-emerald-500" />
                        <div className="flex-1">
                          <div className="flex justify-between mb-1">
                            <span className="text-[13px] font-medium text-gray-900 dark:text-white">{file.name}</span>
                            <span className="text-[11px] font-medium text-gray-400">100%</span>
                          </div>
                          <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500" style={{ width: `100%` }}></div>
                          </div>
                          <div className="text-[11px] text-gray-400 mt-1">{(file.size / 1024).toFixed(2)} KB</div>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); setUploadedFiles(prev => prev.filter((_, i) => i !== idx)); }}
                          className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mt-8 mb-4">Divisions (Optional)</h4>
                  {isDivLoading ? (
                    <p className="text-xs text-gray-500">Loading divisions...</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-5">
                      {divisionsData?.data?.map(div => {
                        const isSelected = selectedDivisions.includes(div.id);
                        return (
                          <div
                            key={div.id}
                            onClick={() => setSelectedDivisions(prev => prev.includes(div.id) ? prev.filter(id => id !== div.id) : [...prev, div.id])}
                            className={cn(
                              "p-3 rounded-xl border-2 cursor-pointer flex justify-between h-auto transition-all",
                              isSelected
                                ? "border-emerald-500 bg-emerald-50/30 dark:bg-emerald-900/20"
                                : "border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-gray-200 dark:hover:border-gray-700"
                            )}
                          >
                            <span className={cn("text-[13px] font-semibold line-clamp-1 mt-1", isSelected ? "text-gray-900 dark:text-white" : "text-gray-600 dark:text-gray-300")}>
                              {div.name}
                            </span>
                            {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* STEP 3: AI Options */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-[22px] font-bold text-gray-900 dark:text-white">AI Options</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Analysis settings</p>
                </div>

                <div className="bg-[#EFF6FF] dark:bg-blue-900/10 border border-l-[#2B7FFF] dark:border-blue-900 p-4 rounded-xl flex gap-3 border-l-4 border-t-1 border-t-[#2B7FFF]/30 border-r-1 border-b-1 border-r-[#2B7FFF]/30 border-b-[#2B7FFF]/30">
                  <div className="mt-0.5"><SparklesIcon className="text-[#155DFC] w-4 h-4" /></div>
                  <div>
                    <h4 className="text-[13px] font-bold text-[#1C398E] dark:text-blue-400 mb-1">AI Analysis Options</h4>
                    <p className="text-[13px] text-[#193CB8] dark:text-blue-300">Select which AI features you want to use for this tender. You can change these settings later.</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    { id: 'generateScope', title: 'Generate Scope of Work', desc: 'AI will extract and organize scope items by CSI division', checked: aiOptions.generateScope },
                    { id: 'detectRisks', title: 'Detect Risks & Issues', desc: 'Flag potential risks, conflicts, and coordination items', checked: aiOptions.detectRisks },
                    { id: 'suggestPricing', title: 'Suggest Pricing Estimates', desc: 'Generate draft pricing based on quantities and market rates', checked: aiOptions.suggestPricing },
                    { id: 'analyzeAddenda', title: 'Analyze Addenda Changes', desc: 'Track changes from addenda and their impact on scope/pricing', checked: aiOptions.analyzeAddenda },
                    { id: 'extractQuantities', title: 'Extract Quantities', desc: 'Automatically identify and extract quantities from documents', checked: aiOptions.extractQuantities }
                  ].map((option) => (
                    <div
                      key={option.id}
                      onClick={() => setAiOptions(prev => ({ ...prev, [option.id]: !prev[option.id as keyof typeof prev] }))}
                      className={cn(
                        "flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors",
                        option.checked
                          ? "shadow-md shadow-[##5EE9B5] border-[#5EE9B5]/40 bg-[#ECFDF5] dark:bg-emerald-900/10"
                          : "border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-gray-200 dark:hover:border-gray-700"
                      )}
                    >
                      <div className={cn(
                        "w-5 h-5 rounded-md border flex items-center justify-center mt-0.5",
                        option.checked ? "bg-emerald-500 border-emerald-500 text-white" : "border-gray-300 dark:border-gray-600"
                      )}>
                        {option.checked && <Check className="w-3.5 h-3.5" />}
                      </div>
                      <div>
                        <h4 className="text-[14px] font-bold text-[#101828] dark:text-white mb-0.5">{option.title}</h4>
                        <p className="text-[12px] text-[#4A5565] dark:text-gray-400">{option.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 4: Review */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-[22px] font-bold text-gray-900 dark:text-white">Review</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Confirm & create</p>
                </div>

                <div className="bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900 p-4 rounded-xl flex gap-3">
                  <div className="mt-0.5 text-emerald-600"><CheckCircle2 className="w-5 h-5" /></div>
                  <div>
                    <h4 className="text-[14px] font-bold text-emerald-800 dark:text-emerald-400 mb-0.5">Ready to Create Tender</h4>
                    <p className="text-[13px] text-emerald-600/80 dark:text-emerald-300">Review your tender details below before creating</p>
                  </div>
                </div>

                <div className="space-y-8">
                  <div>
                    <h3 className="text-[15px] font-bold text-gray-900 dark:text-white mb-4">Tender Information</h3>
                    <div className="bg-gray-50/50 dark:bg-gray-800/30 rounded-xl p-5 border border-gray-100 dark:border-gray-800">
                      <div className="grid grid-cols-[120px_1fr] gap-y-3 text-sm">
                        <div className="text-gray-500 font-medium">Tender Name:</div>
                        <div className="text-gray-900 dark:text-white font-semibold text-right">{formData.projectName || "N/A"}</div>

                        <div className="text-gray-500 font-medium">Client:</div>
                        <div className="text-gray-900 dark:text-white font-semibold text-right">{formData.clientName || "N/A"}</div>

                        <div className="text-gray-500 font-medium">Contact:</div>
                        <div className="text-gray-900 dark:text-white font-semibold text-right">{formData.clientContact || "N/A"}</div>

                        <div className="text-gray-500 font-medium">Due Date:</div>
                        <div className="text-gray-900 dark:text-white font-semibold text-right">{formData.closingDate || "N/A"}</div>

                        <div className="text-gray-500 font-medium">Address:</div>
                        <div className="text-gray-900 dark:text-white font-semibold text-right capitalize">{formData.projectAddress || "N/A"}</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-[15px] font-bold text-gray-900 dark:text-white mb-4">Uploaded Files</h3>
                    <div className="space-y-2">
                      {uploadedFiles.length === 0 && (
                        <div className="flex justify-between items-center p-3 px-4 bg-gray-50/50 dark:bg-gray-800/30 rounded-xl border border-gray-100 dark:border-gray-800">
                          <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
                            <FileText className="w-4 h-4 text-emerald-500" /> No files uploaded
                          </div>
                        </div>
                      )}
                      {uploadedFiles.map((f, i) => (
                        <div key={i} className="flex justify-between items-center p-3 px-4 bg-gray-50/50 dark:bg-gray-800/30 rounded-xl border border-gray-100 dark:border-gray-800">
                          <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
                            <FileText className="w-4 h-4 text-emerald-500" /> {f.name}
                          </div>
                          <span className="text-xs font-bold text-gray-500 bg-white dark:bg-gray-700 px-2 py-1 rounded-md shadow-sm border border-gray-100 dark:border-gray-600">{(f.size / 1024).toFixed(2)} KB</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-[15px] font-bold text-gray-900 dark:text-white mb-4">AI Analysis Features</h3>
                    <div className="bg-gray-50/50 dark:bg-gray-800/30 rounded-xl p-5 border border-gray-100 dark:border-gray-800 space-y-3">
                      {[
                        { key: 'generateScope', label: 'Generate Scope' },
                        { key: 'detectRisks', label: 'Detect Risks' },
                        { key: 'suggestPricing', label: 'Suggest Pricing' },
                        { key: 'extractQuantities', label: 'Extract Quantities' }
                      ].map(feature => (
                        aiOptions[feature.key as keyof typeof aiOptions] && (
                          <div key={feature.key} className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> {feature.label}
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Footer Actions */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3 items-center justify-between pt-6 border-t border-gray-100 dark:border-gray-800">
            <Button
              variant="secondary"
              className={cn("h-11 px-6 rounded-xl font-bold bg-white dark:bg-gray-800 border-gray-200 shadow-sm", currentStep === 1 && "invisible")}
              onClick={handleBack}
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>

            {currentStep < 4 ? (
              <Button
                variant="primary"
                className="h-11 px-8 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-200 dark:shadow-none"
                onClick={handleNext}
              >
                Next <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={handleCreate}
                disabled={isCreating}
                isLoading={isCreating}
                className="h-11 px-8 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-200 dark:shadow-none"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" /> Create Tender
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Right Sidebar - Tender Summary */}
      <div className="w-full lg:w-[320px] flex-shrink-0">
        <div className="bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm lg:sticky lg:top-28">
          <h3 className="text-base font-bold text-gray-900 dark:text-white mb-5">Tender Summary</h3>

          <div className="space-y-3">
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 flex gap-3">
              <Building2 className="w-4 h-4 text-emerald-500 mt-0.5" />
              <div>
                <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">Tender Name</div>
                <div className="text-[13px] font-semibold text-gray-900 dark:text-white line-clamp-2">
                  {formData.projectName || "..."}
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 flex gap-3">
              <User className="w-4 h-4 text-blue-500 mt-0.5" />
              <div>
                <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">Client</div>
                <div className="text-[13px] font-semibold text-gray-900 dark:text-white">
                  {formData.clientName || "..."}
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 flex gap-3">
              <CalendarIcon className="w-4 h-4 text-orange-500 mt-0.5" />
              <div>
                <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">Due Date</div>
                <div className="text-[13px] font-semibold text-gray-900 dark:text-white">
                  {formData.closingDate || "..."}
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 flex gap-3">
              <FileText className="w-4 h-4 text-purple-500 mt-0.5" />
              <div>
                <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">Uploaded Files</div>
                <div className="text-[13px] font-semibold text-gray-900 dark:text-white">
                  {uploadedFiles.length > 0 ? `${uploadedFiles.length} files` : "0 files"}
                </div>
              </div>
            </div>
          </div>

          {(currentStep >= 3) && (
            <div className="mt-5 pt-5 border-t border-gray-100 dark:border-gray-800">
              <div className="text-[11px] font-bold text-gray-900 dark:text-white mb-2.5">AI Features Enabled:</div>
              <div className="flex flex-wrap gap-2">
                {aiOptions.generateScope && <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-400 px-2 py-1 rounded-full border border-emerald-100 dark:border-emerald-800">Generate Scope</span>}
                {aiOptions.detectRisks && <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-400 px-2 py-1 rounded-full border border-emerald-100 dark:border-emerald-800">Detect Risks</span>}
                {aiOptions.suggestPricing && <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-400 px-2 py-1 rounded-full border border-emerald-100 dark:border-emerald-800">Suggest Pricing</span>}
                {aiOptions.extractQuantities && <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-400 px-2 py-1 rounded-full border border-emerald-100 dark:border-emerald-800">Extract Quantities</span>}
              </div>
            </div>
          )}

          <div className="mt-6 pt-5 border-t border-gray-100 dark:border-gray-800">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-gray-500">Progress</span>
              <span className="text-xs font-bold text-gray-500">{progress}%</span>
            </div>
            <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
