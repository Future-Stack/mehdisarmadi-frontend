"use client";

import { Search, ChevronDown, FileText, ChevronLeft, ChevronRight, Download, ExternalLink, Loader2 } from "lucide-react";
import StaticPage from "@/components/layout/StaticDemoPage";
import { useEffect, useState } from "react";
import {
  useGetSourceTrackingQuery,
  SourceTrackingItem,
  SourceTrackingMappedSections,
} from "@/store/api/admin/SourceTracking/getSourceTracking";
import { Modal } from "@/components/ui/Modal";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isMappedSections(
  ms: SourceTrackingItem["mappedSections"]
): ms is SourceTrackingMappedSections {
  return !!ms && "items" in ms && Array.isArray((ms as SourceTrackingMappedSections).items);
}

function typeBadgeClass(type: string): string {
  switch (type.toLowerCase()) {
    case "addendum":
      return "bg-[#DCFCE7] text-[#166534]";
    case "spec":
      return "bg-[#F3E8FF] text-[#6B21A8]";
    case "tender":
    default:
      return "bg-[#DBEAFE] text-[#1E40AF]";
  }
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}



// ─── Skeleton Card ────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="card-premium border border-gray-100 dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-900 p-6">
      <div className="flex items-start gap-4">
        <div className="w-6 h-6 rounded bg-gray-100 dark:bg-gray-800 animate-pulse mt-1 shrink-0" />
        <div className="flex-1 space-y-3">
          <div className="h-4 rounded-full bg-gray-100 dark:bg-gray-800 animate-pulse w-3/4" />
          <div className="flex gap-2">
            <div className="h-3 rounded-full bg-gray-100 dark:bg-gray-800 animate-pulse w-16" />
            <div className="h-3 rounded-full bg-gray-100 dark:bg-gray-800 animate-pulse w-32" />
            <div className="h-3 rounded-full bg-gray-100 dark:bg-gray-800 animate-pulse w-20" />
          </div>
          <div className="flex gap-2 mt-6">
            <div className="h-8 rounded-md bg-gray-100 dark:bg-gray-800 animate-pulse w-28" />
            <div className="h-8 rounded-md bg-gray-100 dark:bg-gray-800 animate-pulse w-28" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── View Document Modal ──────────────────────────────────────────────────────

function ViewDocumentModal({
  doc,
  onClose,
}: {
  doc: SourceTrackingItem | null;
  onClose: () => void;
}) {
  if (!doc) return null;
  const sections = isMappedSections(doc.mappedSections) ? doc.mappedSections : null;
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async (fileUrl: string, fileName: string) => {
    setIsDownloading(true);
    try {
      const res = await fetch(fileUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      // Fallback: open in new tab if fetch fails (e.g. CORS)
      window.open(fileUrl, "_blank", "noopener,noreferrer");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Modal open={!!doc} onClose={onClose} title="Document Details" size="lg">
      <div className="mt-2 space-y-5 text-sm text-gray-700 dark:text-gray-300">
        <hr className="border-gray-200 dark:border-gray-800" />

        {/* Meta */}
        <div className="grid grid-cols-2 gap-y-4 gap-x-6">
          <div className="col-span-2">
            <span className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
              File Name
            </span>
            <span className="font-semibold text-gray-900 dark:text-white break-all">
              {doc.fileName}
            </span>
          </div>
          <div>
            <span className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
              Project
            </span>
            <span className="font-medium text-gray-900 dark:text-white">
              {doc.projectName}
            </span>
          </div>
          <div>
            <span className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
              Type
            </span>
            <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${typeBadgeClass(doc.type)}`}>
              {doc.typeLabel}
            </span>
          </div>
          <div>
            <span className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
              File Size
            </span>
            <span className="font-medium text-gray-900 dark:text-white">
              {formatFileSize(doc.size)}
            </span>
          </div>
          <div>
            <span className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
              Status
            </span>
            <span className="font-medium text-gray-900 dark:text-white capitalize">
              {doc.status}
            </span>
          </div>
          <div>
            <span className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
              Mapped Sections
            </span>
            <span className="font-medium text-gray-900 dark:text-white">
              {doc.mappedSectionCount}
            </span>
          </div>
          <div>
            <span className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
              Created
            </span>
            <span className="font-medium text-gray-900 dark:text-white">
              {formatDate(doc.createdAt)}
            </span>
          </div>
        </div>

        {/* Mapped scope items */}
        {sections && sections.items.length > 0 && (
          <>
            <hr className="border-gray-200 dark:border-gray-800" />
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-[13px] text-gray-500 dark:text-gray-400 font-medium">
                  Mapped Sections:
                </p>
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {sections.showing}
                </span>
              </div>
              <div className="space-y-1.5">
                {sections.items.map((section) => (
                  <div
                    key={section.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-lg bg-[#F9FAFB] dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex-1">
                      <span className="font-medium text-gray-700 dark:text-gray-200 text-sm transition-colors block">
                        {section.scopeItem}
                      </span>
                      {section.notes && (
                        <span className="text-[12px] text-gray-400 dark:text-gray-500 mt-0.5 block">
                          {section.notes}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#DBEAFE] text-[#1E40AF] dark:bg-blue-900/30 dark:text-blue-400">
                        Div {section.division}
                      </span>
                      <span className="text-[13px] font-medium text-gray-500 dark:text-gray-400 transition-colors">
                        {section.source.page ? `Page: ${section.source.page}` : section.source.document}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        <hr className="border-gray-200 dark:border-gray-800" />

        {/* Actions */}
        <div className="flex items-center gap-3 pt-1">
          <button
            onClick={() => handleDownload(doc.fileUrl, doc.fileName)}
            disabled={isDownloading}
            className="inline-flex items-center gap-2 flex-1 justify-center px-4 py-2.5 rounded-md bg-secondary text-sm font-semibold text-white hover:bg-secondary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isDownloading ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Download size={15} />
            )}
            {isDownloading ? "Downloading..." : "Download"}
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-md border border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

const TYPE_OPTIONS = [
  { value: "", label: "All Types" },
  { value: "tender", label: "Tender" },
  { value: "spec", label: "Spec" },
  { value: "addendum", label: "Addendum" },
];

export default function SourceTracking() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [selectedDoc, setSelectedDoc] = useState<SourceTrackingItem | null>(null);
  const [loadingDownload, setLoadingDownload] = useState<Record<string, boolean>>({});
  const limit = 10;

  const handleDownload = async (fileUrl: string, fileName: string, docId: string) => {
    setLoadingDownload((prev) => ({ ...prev, [docId]: true }));
    try {
      const res = await fetch(fileUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      // Fallback: open in new tab if fetch fails (e.g. CORS)
      window.open(fileUrl, "_blank", "noopener,noreferrer");
    } finally {
      setLoadingDownload((prev) => ({ ...prev, [docId]: false }));
    }
  };

  // Debounce search
  useEffect(() => {
    const timeout = setTimeout(() => {
      setPage(1);
      setSearch(searchInput.trim());
    }, 400);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  };

  const { data, isLoading, isFetching } = useGetSourceTrackingQuery({
    page,
    limit,
    search,
    type: typeFilter || undefined,
  });

  const items = data?.data?.items ?? [];
  const totalPages = data?.data?.totalPages ?? 1;

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <StaticPage
          title="Source Tracking System"
          description="Track and verify AI output against source documents"
        />
        {/* Upload button specifically omitted per user request */}
      </div>

      {/* ── Search & Filter Bar ── */}
      <div className="flex flex-col sm:flex-row gap-4 pt-2">
        <form onSubmit={handleSearch} className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors" />
          <input
            type="text"
            placeholder="Search by file name or project..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all text-sm text-gray-900 dark:text-white placeholder:text-gray-400"
          />
        </form>
        <div className="relative sm:w-[180px]">
          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setPage(1);
            }}
            className="w-full appearance-none px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary text-sm text-gray-600 dark:text-gray-200 transition-colors cursor-pointer"
          >
            {TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
        </div>
      </div>

      {/* ── Document List ── */}
      <div className={`space-y-4 transition-opacity ${isFetching && !isLoading ? "opacity-60" : "opacity-100"}`}>
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
        ) : items.length === 0 ? (
          <div className="card-premium border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-12 text-center text-gray-400 dark:text-gray-500 text-sm">
            {search ? `No documents match "${search}".` : "No source tracking documents found."}
          </div>
        ) : (
          items.map((doc) => {
            const sections = isMappedSections(doc.mappedSections) ? doc.mappedSections : null;

            return (
              <div
                key={doc.id}
                className="card-premium border border-[#E5E7EB] overflow-hidden bg-white dark:bg-gray-900 p-6 transition-colors border-gray-100 dark:border-gray-800"
              >
                <div className="flex items-start gap-4">
                  <FileText className="w-6 h-6 text-[#008236] mt-1 shrink-0" />
                  <div className="flex-1">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight transition-colors">
                      {doc.fileName}
                    </h2>
                    <div className="flex flex-wrap items-center gap-2 mt-2 text-[13px] text-gray-500 dark:text-gray-400 transition-colors">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-bold transition-colors ${typeBadgeClass(doc.type)}`}
                      >
                        {doc.typeLabel}
                      </span>
                      <span>{doc.projectName}</span>
                      <span className="text-gray-300 dark:text-gray-700">•</span>
                      <span>{formatDate(doc.createdAt)}</span>
                    </div>

                    {sections && sections.items.length > 0 && (
                      <div className="mt-8">
                        <p className="text-[13px] text-gray-500 dark:text-gray-400 font-medium mb-3 transition-colors">
                          Mapped Sections:
                        </p>
                        <div className="space-y-1.5">
                          {sections.items.map((section) => (
                            <div
                              key={section.id}
                              className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-lg bg-[#F9FAFB] dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                              <span className="font-medium text-gray-700 dark:text-gray-200 text-sm transition-colors">
                                {section.scopeItem}
                              </span>
                              <span className="text-[13px] font-medium text-gray-500 dark:text-gray-400 transition-colors">
                                {section.source.page ? `Page: ${section.source.page}` : section.source.document}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-6 flex flex-wrap items-center gap-3">
                      {/* View Document → opens modal */}
                      <button
                        onClick={() => setSelectedDoc(doc)}
                        className="px-4 py-2 rounded-md border border-gray-200 dark:border-gray-800 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200"
                      >
                        View Document
                      </button>
                      {/* Download → triggers file download */}
                      <button
                        onClick={() => handleDownload(doc.fileUrl, doc.fileName, doc.id)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md border border-secondary text-sm font-semibold text-secondary hover:bg-secondary/5 transition-colors focus:outline-none focus:ring-2 focus:ring-secondary/50"
                      >
                        {/*  Downloading text if downloading*/}
                        {loadingDownload[doc.id] ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <Download size={14} />
                        )}
                        {loadingDownload[doc.id] ? "Downloading..." : "Download"}

                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2 py-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg text-slate-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 hover:shadow-sm border border-transparent hover:border-slate-200 dark:hover:border-gray-700 disabled:opacity-40 disabled:pointer-events-none transition"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
              .reduce<(number | "…")[]>((acc, p, i, arr) => {
                if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("…");
                acc.push(p);
                return acc;
              }, [])
              .map((p, i) =>
                p === "…" ? (
                  <span key={`e${i}`} className="px-1 text-xs text-slate-400">…</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(p as number)}
                    className={`w-7 h-7 rounded-lg text-xs font-medium transition ${
                      page === p
                        ? "bg-secondary text-white shadow-sm"
                        : "text-slate-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 hover:shadow-sm border border-transparent hover:border-slate-200 dark:hover:border-gray-700"
                    }`}
                  >
                    {p}
                  </button>
                )
              )}
          </div>

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg text-slate-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 hover:shadow-sm border border-transparent hover:border-slate-200 dark:hover:border-gray-700 disabled:opacity-40 disabled:pointer-events-none transition"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── View Document Modal ── */}
      <ViewDocumentModal doc={selectedDoc} onClose={() => setSelectedDoc(null)} />
    </div>
  );
}
