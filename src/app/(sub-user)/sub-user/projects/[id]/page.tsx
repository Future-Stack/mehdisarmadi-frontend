"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  ArrowLeft,
  Upload,
  CheckCircle2,
  Loader2,
  FileText,
  X,
  AlertCircle,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  useGetProjectByIdQuery,
  useGetDivisionsQuery,
  useUpdateProjectMutation,
} from "@/store/api/projectApi";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const ACCEPTED_EXTENSIONS = ["pdf", "doc", "docx", "xls", "xlsx", "txt"];
const ACCEPTED_ACCEPT = ".pdf,.doc,.docx,.xls,.xlsx,.txt";

function isValidFile(name: string) {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  return ACCEPTED_EXTENSIONS.includes(ext);
}

type NewFile = { file: File; name: string };

export default function ProjectDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const router = useRouter();

  const { data: projectData, isLoading, error } = useGetProjectByIdQuery(id);
  const { data: divisionsData, isLoading: isDivLoading } = useGetDivisionsQuery();
  const [updateProject, { isLoading: isUpdating }] = useUpdateProjectMutation();

  const project = projectData?.data;

  // Local state
  const [uploadedTenderFiles, setUploadedTenderFiles] = useState<NewFile[]>([]);
  const [uploadedAddendaFiles, setUploadedAddendaFiles] = useState<NewFile[]>([]);
  const [selectedDivisions, setSelectedDivisions] = useState<string[]>([]);
  const [instruction, setInstruction] = useState("");
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);
  const [isDraggingTender, setIsDraggingTender] = useState(false);
  const [isDraggingAddenda, setIsDraggingAddenda] = useState(false);

  const tenderInputRef = useRef<HTMLInputElement>(null);
  const addendaInputRef = useRef<HTMLInputElement>(null);

useEffect(() => {
  if (project) {
    setSelectedDivisions(project.divisions?.map((d) => d.id) || []);
    setInstruction(project.instruction || "");
  }
}, [project]);

// ── File validation helper ────────────────────────────────
// Moved ABOVE the early returns so it always runs
const processFiles = useCallback(
  (files: File[]): { valid: NewFile[]; invalid: string[] } => {
    const valid: NewFile[] = [];
    const invalid: string[] = [];

    files.forEach((f) => {
      if (isValidFile(f.name)) {
        valid.push({ file: f, name: f.name });
      } else {
        invalid.push(f.name);
      }
    });

    return { valid, invalid };
  },
  []
);

if (isLoading)
  return (
    <div className="p-8 text-center text-gray-500">Loading tender details...</div>
  );
if (error || !project)
  return (
    <div className="p-8 text-center text-red-500">Failed to load tender details.</div>
  );

  const addTenderFiles = (files: File[]) => {
    const { valid, invalid } = processFiles(files);
    if (invalid.length > 0) {
      toast.error("Invalid file type", {
        description: `Only PDF, DOC, DOCX, XLS, XLSX, TXT allowed. Rejected: ${invalid.join(", ")}`,
      });
    }
    if (valid.length > 0) setUploadedTenderFiles((prev) => [...prev, ...valid]);
  };

  const addAddendaFiles = (files: File[]) => {
    const { valid, invalid } = processFiles(files);
    if (invalid.length > 0) {
      toast.error("Invalid file type", {
        description: `Only PDF, DOC, DOCX, XLS, XLSX, TXT allowed. Rejected: ${invalid.join(", ")}`,
      });
    }
    if (valid.length > 0) setUploadedAddendaFiles((prev) => [...prev, ...valid]);
  };

  // ── Input change handlers ─────────────────────────────────
  const handleTenderInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addTenderFiles(Array.from(e.target.files));
    e.target.value = "";
  };

  const handleAddendaInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addAddendaFiles(Array.from(e.target.files));
    e.target.value = "";
  };

  // ── Drag & drop handlers ──────────────────────────────────
  const handleTenderDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingTender(false);
    addTenderFiles(Array.from(e.dataTransfer.files));
  };

  const handleAddendaDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingAddenda(false);
    addAddendaFiles(Array.from(e.dataTransfer.files));
  };

  // ── Division helpers ──────────────────────────────────────
  const handleSelectAllDivisions = () => {
    if (divisionsData?.data) setSelectedDivisions(divisionsData.data.map((d) => d.id));
  };
  const handleClearAllDivisions = () => setSelectedDivisions([]);

  // ── Analyze ───────────────────────────────────────────────
  const handleAnalyze = async () => {
    setAnalyzeError(null);
    const toastId = toast.loading("Saving changes before analysis...");
    try {
      const formData = new FormData();

      formData.append("name", project.name || "");
      formData.append("clientName", project.clientName || "");
      formData.append("clientContact", project.clientContact || "");
      formData.append("closingDate", project.closingDate || "");
      formData.append("questionDate", project.questionDate || "");
      formData.append("address", project.address || "");
      formData.append("description", project.description || "");
      formData.append("instruction", instruction);

      selectedDivisions.forEach((divId) => formData.append("divisionIds", divId));
      project.aiOptions?.forEach((opt) => formData.append("aiOptions", opt));

      // Only append actual File objects
      uploadedTenderFiles.forEach((f) => formData.append("files", f.file));
      uploadedAddendaFiles.forEach((f) => formData.append("addendum", f.file));

      await updateProject({ projectId: id, data: formData }).unwrap();

      toast.success("Project updated!", { id: toastId });
      router.push(`/sub-user/projects/${id}/analyzing`);
    } catch (err: any) {
      const msg =
        err?.data?.message ||
        err?.data?.data?.message ||
        err?.message ||
        "Failed to update project settings before analysis.";
      setAnalyzeError(msg);
      toast.error("Analysis failed", { id: toastId, description: msg });
    }
  };

  const existingTenderFiles =
  project?.files?.filter((f: any) => f.kind === "tender") ?? [];

const existingAddendaFiles =
  project?.files?.filter((f: any) => f.kind === "addendum") ?? [];

  const totalFiles =
    existingTenderFiles.length +
    existingAddendaFiles.length +
    uploadedTenderFiles.length +
    uploadedAddendaFiles.length;



  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Hidden inputs */}
      <input
        type="file"
        multiple
        accept={ACCEPTED_ACCEPT}
        ref={tenderInputRef}
        className="hidden"
        onChange={handleTenderInputChange}
      />
      <input
        type="file"
        multiple
        accept={ACCEPTED_ACCEPT}
        ref={addendaInputRef}
        className="hidden"
        onChange={handleAddendaInputChange}
      />

      {/* Header */}
      <div>
        <Link
          href="/sub-user"
          className="inline-flex items-center gap-1 text-sm font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <h1 className="text-[28px] font-bold text-gray-900 dark:text-white">{project.name}</h1>
        <p className="text-[13px] text-gray-500 dark:text-gray-400 font-medium">{project.address}</p>
      </div>

      {/* ── Upload Original Tender Documents ── */}
      <div className="bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm space-y-6">
        <h3 className="text-[14px] font-medium text-gray-900 dark:text-white">
          Upload Original Tender Documents
        </h3>

        {/* Drop Zone */}
        <div
          onClick={() => tenderInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDraggingTender(true); }}
          onDragLeave={() => setIsDraggingTender(false)}
          onDrop={handleTenderDrop}
          className={cn(
            "border-2 border-dashed rounded-[24px] p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all",
            isDraggingTender
              ? "border-[#009966] bg-emerald-50/80 dark:bg-emerald-900/20 scale-[1.01]"
              : "border-emerald-300 dark:border-emerald-700/50 bg-emerald-50/50 dark:bg-emerald-900/10 hover:bg-emerald-50/80"
          )}
        >
          <div className={cn(
            "w-12 h-12 bg-white dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-4 shadow-sm border border-emerald-100 dark:border-emerald-800 transition-transform",
            isDraggingTender && "scale-110"
          )}>
            <Upload className="w-5 h-5 text-emerald-600" />
          </div>
          <h3 className="text-[15px] font-medium text-gray-800 dark:text-white mb-2">
            {isDraggingTender ? "Drop files here!" : "Drag & drop tender documents or click to upload"}
          </h3>
          <p className="text-[13px] text-gray-500 mb-6">Supported: PDF, DOC, DOCX, XLS, XLSX, TXT</p>
          <Button
            variant="primary"
            className="h-10 px-6 rounded-xl font-bold bg-[#009966] hover:bg-emerald-700 shadow-sm text-white"
            onClick={(e) => { e.stopPropagation(); tenderInputRef.current?.click(); }}
          >
            Browse Files
          </Button>
        </div>

        {/* Existing & New Tender Files */}
        {(existingTenderFiles.length > 0 || uploadedTenderFiles.length > 0) && (
          <div className="space-y-2">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">
              Tender Documents ({existingTenderFiles.length + uploadedTenderFiles.length})
            </p>

            {existingTenderFiles.map((f: any) => (
              <div
                key={f.id}
                className="flex items-center gap-3 p-3 bg-gray-50/50 dark:bg-gray-800/30 rounded-xl border border-gray-100 dark:border-gray-800"
              >
                <FileText className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                <span className="text-[13px] font-medium text-gray-700 dark:text-gray-200 truncate flex-1">
                  {f.originalName}
                </span>
                <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded whitespace-nowrap">
                  Uploaded
                </span>
              </div>
            ))}

            {uploadedTenderFiles.map((f, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 bg-blue-50/50 dark:bg-blue-900/30 rounded-xl border border-blue-100 dark:border-blue-800"
              >
                <FileText className="w-5 h-5 text-blue-500 flex-shrink-0" />
                <span className="text-[13px] font-medium text-gray-700 dark:text-gray-200 truncate flex-1">
                  {f.name}
                </span>
                <span className="text-[11px] font-medium text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded whitespace-nowrap">
                  Ready
                </span>
                <button
                  type="button"
                  title="Remove file"
                  onClick={() => setUploadedTenderFiles((prev) => prev.filter((_, idx) => idx !== i))}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors flex-shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Upload Addenda ── */}
      <div
        className={cn(
          "border rounded-3xl p-6 space-y-4 transition-all",
          isDraggingAddenda
            ? "border-[#009966] bg-blue-50/60 dark:bg-emerald-900/10"
            : "border-[#E2E8F0] dark:border-blue-800 bg-[#EFF6FF] dark:bg-blue-900/10"
        )}
        onDragOver={(e) => { e.preventDefault(); setIsDraggingAddenda(true); }}
        onDragLeave={() => setIsDraggingAddenda(false)}
        onDrop={handleAddendaDrop}
      >
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 bg-[#D1FAE5] text-[#059669] text-[10px] font-bold uppercase rounded">
            Optional
          </span>
          <h3 className="text-[14px] font-medium text-gray-900 dark:text-white">Upload Addenda</h3>
        </div>
        <p className="text-[13px] text-[#4A5565] dark:text-blue-300">
          {isDraggingAddenda
            ? "Drop addenda files here!"
            : "Upload any addenda or amendments, or drag & drop here"}
        </p>

        <Button
          variant="secondary"
          onClick={() => addendaInputRef.current?.click()}
          className="h-10 px-4 rounded-xl font-semibold bg-white border border-gray-200 shadow-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Browse Addenda Files
        </Button>

        {/* Existing & New Addenda Files */}
        {(existingAddendaFiles.length > 0 || uploadedAddendaFiles.length > 0) && (
          <div className="space-y-2">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">
              Addenda ({existingAddendaFiles.length + uploadedAddendaFiles.length})
            </p>

            {existingAddendaFiles.map((f: any) => (
              <div
                key={f.id}
                className="flex items-center gap-3 p-3 bg-white/60 dark:bg-gray-800/30 rounded-xl border border-gray-200 dark:border-gray-800"
              >
                <FileText className="w-5 h-5 text-blue-500 flex-shrink-0" />
                <span className="text-[13px] font-medium text-gray-700 dark:text-gray-200 truncate flex-1">
                  {f.originalName}
                </span>
                <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded whitespace-nowrap">
                  Uploaded
                </span>
              </div>
            ))}

            {uploadedAddendaFiles.map((f, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 bg-white/90 dark:bg-blue-900/30 rounded-xl border border-blue-200 dark:border-blue-800"
              >
                <FileText className="w-5 h-5 text-blue-500 flex-shrink-0" />
                <span className="text-[13px] font-medium text-gray-700 dark:text-gray-200 truncate flex-1">
                  {f.name}
                </span>
                <span className="text-[11px] font-medium text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded whitespace-nowrap">
                  Ready
                </span>
                <button
                  type="button"
                  title="Remove file"
                  onClick={() => setUploadedAddendaFiles((prev) => prev.filter((_, idx) => idx !== i))}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors flex-shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Select Applicable Divisions ── */}
      <div className="bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm">
        <h3 className="text-[14px] font-medium text-[#101828] dark:text-white mb-1">
          Select Applicable Divisions
        </h3>
        <p className="text-[13px] text-[#4A5565] dark:text-gray-400 mb-4">
          Choose the CSI divisions relevant to your scope
        </p>

        <div className="flex gap-2 mb-6">
          <Button
            onClick={handleSelectAllDivisions}
            variant="primary"
            className="h-9 px-4 rounded-lg font-semibold bg-[#009966] hover:bg-emerald-700 text-white text-[12px]"
          >
            Select All Divisions
          </Button>
          <Button
            onClick={handleClearAllDivisions}
            variant="secondary"
            className="h-9 px-4 rounded-lg font-semibold bg-white border border-gray-200 text-[#344054] text-[12px] hover:bg-gray-50"
          >
            Clear All
          </Button>
        </div>

        {isDivLoading ? (
          <p className="text-xs text-gray-500">Loading divisions...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            {divisionsData?.data?.map((div) => {
              const isSelected = selectedDivisions.includes(div.id);
              return (
                <div
                  key={div.id}
                  onClick={() =>
                    setSelectedDivisions((prev) =>
                      prev.includes(div.id)
                        ? prev.filter((id) => id !== div.id)
                        : [...prev, div.id]
                    )
                  }
                  className={cn(
                    "p-3 rounded-xl border-2 cursor-pointer transition-colors flex flex-col justify-between h-20 select-none",
                    isSelected
                      ? "border-[#5EE9B5] bg-[#ECFDF5] dark:bg-emerald-900/20"
                      : "border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-gray-200 dark:hover:border-gray-700"
                  )}
                >
                  <div className="flex justify-between items-start">
                    <span
                      className={cn(
                        "text-[12px] font-bold",
                        isSelected ? "text-[#101828] dark:text-emerald-400" : "text-gray-500 dark:text-gray-400"
                      )}
                    >
                      Div {div.code}
                    </span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-[#10B981]" />}
                  </div>
                  <div
                    className={cn(
                      "text-[13px] font-semibold line-clamp-1 mt-1",
                      isSelected ? "text-[#101828] dark:text-white" : "text-[#4A5565] dark:text-gray-300"
                    )}
                  >
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

      {/* ── Estimator Instructions ── */}
      <div className="bg-[#ECFDF5] dark:bg-emerald-900/10 border border-[#ECFDF5] dark:border-emerald-800 rounded-3xl p-6 shadow-sm">
        <h3 className="text-[14px] font-bold text-[#101828] dark:text-white mb-1">
          Estimator Instructions / Focus Area
        </h3>
        <p className="text-[13px] text-[#4A5565] dark:text-gray-400 mb-4">
          Tell the AI what to focus on, exclude, or verify in the uploaded tender documents
        </p>
        <textarea
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
          placeholder="Example: Focus on material costs for windows and doors. Exclude painting work. Verify if HST is included in pricing. Flag any warranty requirements."
          className="w-full h-24 p-4 text-[13px] text-gray-700 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 mb-2 resize-none shadow-sm"
        />
        <p className="text-[10px] font-medium text-gray-500">
          Note: The AI may still flag related scope outside the selected division if it affects pricing or coordination.
        </p>
      </div>

      {/* ── Document Processing / Analyze Button ── */}
      <div className="bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm flex flex-col items-center gap-5">
        <div className="w-full">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[13px] font-medium text-[#4A5565] dark:text-gray-300">
              Document Processing: {totalFiles} file{totalFiles !== 1 ? "s" : ""} ready
            </span>
            <span
              className={cn(
                "text-[11px] font-bold px-2 py-0.5 rounded-md",
                totalFiles > 0
                  ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30"
                  : "text-gray-400 bg-gray-100 dark:bg-gray-800"
              )}
            >
              {totalFiles > 0 ? "Ready" : "No files"}
            </span>
          </div>

          <div className="w-full h-2 bg-emerald-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#10B981] rounded-full transition-all duration-700"
              style={{ width: totalFiles > 0 ? "100%" : "0%" }}
            />
          </div>
        </div>

        {/* Error Banner */}
        {analyzeError && (
          <div className="w-full flex items-start gap-3 p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm">Analysis Failed</p>
              <p className="text-xs mt-0.5 font-medium">{analyzeError}</p>
              <p className="text-[10px] mt-1 text-red-400 font-bold uppercase tracking-wider">
                Accepted formats: PDF, DOC, DOCX, XLS, XLSX, TXT
              </p>
            </div>
          </div>
        )}

        <Button
          onClick={handleAnalyze}
          disabled={isUpdating}
          variant="primary"
          className="h-11 px-8 rounded-xl font-bold bg-[#009966] hover:bg-emerald-700 shadow-md shadow-emerald-200 dark:shadow-none flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isUpdating ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing…</>
          ) : (
            <><FileText className="w-5 h-5" /> Analyze Tender</>
          )}
        </Button>
      </div>
    </div>
  );
}
