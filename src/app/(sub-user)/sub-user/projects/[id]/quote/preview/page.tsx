"use client";

import React, { useState } from "react";
import { ArrowLeft, Edit3, FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import Logo from "@/components/Reuseable/Logo";
import { cn } from "@/lib/utils";
import { PageOne } from "@/features/dashboard/components/preview/PageOne";
import { PageTwo } from "@/features/dashboard/components/preview/PageTwo";
import { PageThree } from "@/features/dashboard/components/preview/PageThree";

export default function QuotePreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
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
          <Button variant="secondary" className="h-10 px-5 rounded-lg font-bold bg-white dark:bg-[#111827] border-gray-200 dark:border-gray-700 shadow-sm text-gray-700 dark:text-gray-200 text-xs">
            <FileText className="w-4 h-4 mr-2" /> Export Word
          </Button>
          <Button variant="primary" className="h-10 px-5 rounded-lg font-bold bg-emerald-600 hover:bg-emerald-700 shadow-sm text-white text-xs">
            <Download className="w-4 h-4 mr-2" /> Export PDF
          </Button>
        </div>
      </div>

      {/* Document canvas — white paper on tinted bg in dark mode */}
      <div className="mb-12 bg-[#f0fdf4] dark:bg-[#0c1a14] rounded-3xl p-6 md:p-10 border border-emerald-100 dark:border-emerald-900/30">
        {currentPage === 1 && <PageOne />}
        {currentPage === 2 && <PageTwo />}
        {currentPage === 3 && <PageThree />}
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
            <Button variant="secondary" className="h-9 px-4 rounded-lg font-bold bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm text-gray-700 dark:text-gray-200 text-xs">
              <FileText className="w-3.5 h-3.5 mr-2" /> Export Word
            </Button>
            <Button variant="primary" className="h-9 px-4 rounded-lg font-bold bg-emerald-600 hover:bg-emerald-700 shadow-sm text-white text-xs">
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
