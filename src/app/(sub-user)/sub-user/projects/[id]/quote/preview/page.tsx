"use client";

import React, { useState } from "react";
import { ArrowLeft, Edit3, FileText, Download, Loader2, AlertCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { PageOne } from "@/features/dashboard/components/preview/PageOne";
import { PageTwo } from "@/features/dashboard/components/preview/PageTwo";
import { PageThree } from "@/features/dashboard/components/preview/PageThree";
import { resolveQuoteData } from "@/features/dashboard/components/preview/resolveQuoteData";
import { exportElementToPDF, exportQuoteToDocx } from "@/lib/exportUtils";
import { useGetProjectQuoteQuery } from "@/store/api/projectApi";
import { useGetCompanyProfileQuery } from "@/store/api/sub-user/company-profile/getCompanyProfile";

export default function QuotePreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const { data: quoteResponse, isLoading: isLoadingQuote } = useGetProjectQuoteQuery(id);
  const { data: companyProfileResponse } = useGetCompanyProfileQuery();
  const rawQuoteData = quoteResponse?.data || quoteResponse || {};
  const companyProfile = companyProfileResponse?.data;

  // Resolved dynamic quote data
  const resolved = resolveQuoteData(rawQuoteData, companyProfile);

  const [isExportingPDF, setIsExportingPDF] = useState(false);

  const handleExportPDF = async () => {
    setIsExportingPDF(true);
    try {
      await exportElementToPDF("quote-preview-doc-all", `quote-${resolved.quoteNumber || "preview"}.pdf`);
      toast.success("PDF exported successfully!");
    } catch (err: any) {
      console.error("PDF Export error:", err);
      toast.error(`Failed to export PDF: ${err?.message || "Unknown error"}`);
    } finally {
      setIsExportingPDF(false);
    }
  };

  const [isExportingDocx, setIsExportingDocx] = useState(false);
  const handleExportDocx = async () => {
    setIsExportingDocx(true);
    try {
      await exportQuoteToDocx({
        companyName: resolved.companyName,
        companyAddress: resolved.companyAddress,
        projectName: resolved.projectName,
        clientName: resolved.clientName,
        quoteNumber: resolved.quoteNumber,
        baseBidPrice: String(resolved.numericBase),
        hstPercentage: String(resolved.numericHstPct),
        currency: resolved.currency,
        scopeOfWork: resolved.scopeOfWork.join("\n"),
        assumptions: resolved.assumptions.join("\n"),
        exclusions: resolved.exclusions.join("\n"),
        clarifications: resolved.clarifications.join("\n"),
        paymentTerms: resolved.paymentTerms,
        holdbackNote: resolved.holdbackNote,
        validityPeriod: resolved.validityPeriod,
        footerNotes: resolved.footerNotes,
      }, `quote-${resolved.quoteNumber || "preview"}.docx`);
      toast.success("DOCX exported successfully!");
    } catch (err) {
      console.error("DOCX Export error:", err);
      toast.error("Failed to export DOCX.");
    } finally {
      setIsExportingDocx(false);
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 3;

  return (
    <div className="max-w-[1000px] mx-auto pb-32">

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <Link href={`/sub-user/projects/${id}/quote`} className="inline-flex items-center gap-1 text-sm font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Quote Builder
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-[28px] font-bold text-gray-900 dark:text-white leading-tight">Quote Preview</h1>
            {resolved.confidence && (
              <span className={cn(
                "text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border",
                resolved.confidence === "high"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400"
                  : resolved.confidence === "medium"
                  ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400"
                  : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400"
              )}>
                {resolved.confidence} confidence
              </span>
            )}
            {resolved.completeness && (
              <span className="text-[10px] font-bold text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full border border-gray-200 dark:border-gray-700 capitalize">
                {resolved.completeness}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-1">
            {resolved.projectName ? `${resolved.projectName} • ` : ""}Final review before export
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href={`/sub-user/projects/${id}/quote`}>
            <Button variant="secondary" className="h-10 px-5 rounded-lg font-bold bg-white dark:bg-[#111827] border-gray-200 dark:border-gray-700 shadow-sm text-gray-700 dark:text-gray-200 text-xs">
              <Edit3 className="w-4 h-4 mr-2" /> Edit Quote
            </Button>
          </Link>
          <Button onClick={handleExportDocx} disabled={isExportingDocx} variant="secondary" className="h-10 px-5 rounded-lg font-bold bg-white dark:bg-[#111827] border-gray-200 dark:border-gray-700 shadow-sm text-gray-700 dark:text-gray-200 text-xs">
            {isExportingDocx ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <FileText className="w-4 h-4 mr-2" />} Export Word
          </Button>
          <Button onClick={handleExportPDF} disabled={isExportingPDF} variant="primary" className="h-10 px-5 rounded-lg font-bold bg-emerald-600 hover:bg-emerald-700 shadow-sm text-white text-xs">
            {isExportingPDF ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />} Export PDF
          </Button>
        </div>
      </div>

      {/* Estimator Advisory banner for missing items if any */}
      {(resolved.missingInformation && resolved.missingInformation.length > 0) && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-800/50 text-[12px] text-amber-800 dark:text-amber-300">
          <div className="font-bold flex items-center gap-2 mb-1.5 text-[13px]">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>AI Estimation Notice</span>
          </div>
          <ul className="list-disc pl-5 space-y-1 text-amber-700/90 dark:text-amber-300/80">
            {resolved.missingInformation.map((info, idx) => (
              <li key={idx}>{info}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Visual Document canvas (single page) */}
      <div className="mb-12 rounded-3xl p-6 md:p-10 ">
        {isLoadingQuote ? (
          <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-emerald-600" /></div>
        ) : (
          <>
            {currentPage === 1 && <PageOne quoteData={rawQuoteData} />}
            {currentPage === 2 && <PageTwo quoteData={rawQuoteData} />}
            {currentPage === 3 && <PageThree quoteData={rawQuoteData} />}
          </>
        )}
      </div>

      {/* Hidden Document canvas for export (all pages) */}
      <div className="fixed top-full left-0 opacity-0 pointer-events-none -z-50">
        <div id="quote-preview-doc-all" className="flex flex-col gap-0 w-[850px] bg-white">
          <PageOne exportMode={true} quoteData={rawQuoteData} />
          <PageTwo exportMode={true} quoteData={rawQuoteData} />
          <PageThree exportMode={true} quoteData={rawQuoteData} />
        </div>
      </div>

      {/* Sticky bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-[#111827]/90 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 p-4 z-50">
        <div className="max-w-[1000px] mx-auto flex items-center justify-between md:ml-64">
          <div className="flex items-center gap-2">
            <Link href={`/sub-user/projects/${id}/quote`}>
              <Button variant="secondary" className="h-9 px-4 rounded-lg font-bold bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm text-gray-700 dark:text-gray-200 text-xs">
                <Edit3 className="w-3.5 h-3.5 mr-2" /> Edit Quote
              </Button>
            </Link>
            <Button onClick={handleExportDocx} disabled={isExportingDocx} variant="secondary" className="h-9 px-4 rounded-lg font-bold bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm text-gray-700 dark:text-gray-200 text-xs">
              {isExportingDocx ? <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" /> : <FileText className="w-3.5 h-3.5 mr-2" />} Export Word
            </Button>
            <Button onClick={handleExportPDF} disabled={isExportingPDF} variant="primary" className="h-9 px-4 rounded-lg font-bold bg-emerald-600 hover:bg-emerald-700 shadow-sm text-white text-xs">
              <Download className="w-3.5 h-3.5 mr-2" /> Export PDF
            </Button>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-30 transition-colors"
            >
              Previous
            </button>
            <div className="flex gap-1 mx-2">
              {[1, 2, 3].map((num) => (
                <button
                  key={num}
                  onClick={() => setCurrentPage(num)}
                  className={cn(
                    "w-8 h-8 rounded border flex items-center justify-center text-xs font-bold transition-colors",
                    currentPage === num
                      ? "bg-emerald-600 border-emerald-600 text-white"
                      : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  )}
                >
                  {num}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-30 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
