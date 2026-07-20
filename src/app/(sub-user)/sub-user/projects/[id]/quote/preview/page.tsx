"use client";

import React, { useState } from "react";
import { ArrowLeft, Edit3, FileText, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import Logo from "@/components/Reuseable/Logo";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { PageOne } from "@/features/dashboard/components/preview/PageOne";
import { PageTwo } from "@/features/dashboard/components/preview/PageTwo";
import { PageThree } from "@/features/dashboard/components/preview/PageThree";
import { exportElementToPDF, exportQuoteToDocx } from "@/lib/exportUtils";
import { useGetProjectQuoteQuery } from "@/store/api/projectApi";

export default function QuotePreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const { data: quoteResponse, isLoading: isLoadingQuote } = useGetProjectQuoteQuery(id);
  const quoteData = quoteResponse?.data || {};

  const [isExportingPDF, setIsExportingPDF] = useState(false);

  const handleExportPDF = async () => {
    setIsExportingPDF(true);
    try {
      await exportElementToPDF("quote-preview-doc-all", "quote-preview.pdf");
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
      const q = quoteData?.quote || {};
      const companyDetails = quoteData?.companyDetails || {};
      const projectDetails = quoteData?.projectQuoteDetails || {};
      const aiDraft = quoteData?.aiQuoteDraft || {};

      const scopeText = Array.isArray(q.scopeOfWork)
        ? q.scopeOfWork.join("\n")
        : (aiDraft.scope_of_work ? aiDraft.scope_of_work.map((s: any) => `Division ${s.division_code} - ${s.division_label}: ${s.details?.join(", ")}`).join("\n") : "");

      const assumptionsText = Array.isArray(q.assumptions)
        ? q.assumptions.join("\n")
        : (aiDraft.assumptions?.join("\n") || "");

      const exclusionsText = Array.isArray(q.exclusions)
        ? q.exclusions.join("\n")
        : (aiDraft.exclusions?.join("\n") || "");

      const clarificationsText = Array.isArray(q.clarifications)
        ? q.clarifications.join("\n")
        : "";

      await exportQuoteToDocx({
        companyName: companyDetails.name || "ABC Construction Ltd.",
        companyAddress: companyDetails.address || "123 Main Street, Toronto, ON M5V 3A8",
        projectName: q.projectName || projectDetails.projectName || "",
        clientName: q.clientName || projectDetails.clientName || "",
        quoteNumber: q.quoteNumber || "Q-2026-042",
        baseBidPrice: String(q.baseBidPrice || aiDraft.pricing_summary?.base_bid_price || "0"),
        hstPercentage: String(q.hstPercentage || "13").replace("%", ""),
        currency: q.currency || aiDraft.pricing_summary?.currency || "CAD",
        scopeOfWork: scopeText,
        assumptions: assumptionsText,
        exclusions: exclusionsText,
        clarifications: clarificationsText,
        paymentTerms: q.paymentTerms || aiDraft.terms_and_conditions?.payment_terms || "",
        holdbackNote: q.holdbackNote || aiDraft.terms_and_conditions?.holdback || "",
        validityPeriod: q.validityPeriod || aiDraft.terms_and_conditions?.quote_validity || "30 days",
        footerNotes: q.footerNotes || "Thank you for considering our proposal."
      }, `quote-${q.quoteNumber || "preview"}.docx`);
      toast.success("DOCX exported successfully!");
    } catch (err) {
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
          <h1 className="text-[28px] font-bold text-gray-900 dark:text-white leading-tight">Quote Preview</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Final review before export</p>
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

      {/* Visual Document canvas (single page) */}
      <div className="mb-12 rounded-3xl p-6 md:p-10 ">
        {isLoadingQuote ? (
          <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-emerald-600" /></div>
        ) : (
          <>
            {currentPage === 1 && <PageOne quoteData={quoteData} />}
            {currentPage === 2 && <PageTwo quoteData={quoteData} />}
            {currentPage === 3 && <PageThree quoteData={quoteData} />}
          </>
        )}
      </div>

      {/* Hidden Document canvas for export (all pages) */}
      <div className="fixed top-full left-0 opacity-0 pointer-events-none -z-50">
        <div id="quote-preview-doc-all" className="flex flex-col gap-0 w-[850px] bg-white">
          <PageOne exportMode={true} quoteData={quoteData} />
          <PageTwo exportMode={true} quoteData={quoteData} />
          <PageThree exportMode={true} quoteData={quoteData} />
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
