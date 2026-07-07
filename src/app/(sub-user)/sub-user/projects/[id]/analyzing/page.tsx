"use client";

import React, { useEffect } from "react";
import { CheckCircle2, Loader2, Sparkles, Circle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AnalyzingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const router = useRouter();

  useEffect(() => {
    // Mock the analyzing process, then redirect to results
    const timer = setTimeout(() => {
      router.push(`/sub-user/projects/${id}/results`);
    }, 4000); // 4 seconds mock wait time
    
    return () => clearTimeout(timer);
  }, [id, router]);

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-140px)] px-4">
      
      <div className="bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 rounded-3xl p-10 shadow-sm max-w-[480px] w-full flex flex-col items-center">
        
        <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-6 shadow-sm shadow-blue-100/50 dark:shadow-none">
          <Sparkles className="w-6 h-6 text-blue-500" />
        </div>

        <h2 className="text-[22px] font-bold text-gray-900 dark:text-white mb-2">Analyzing Your Tender Document</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 font-medium">Please wait while AI processes your document</p>
        
        <div className="w-full space-y-4 mb-8">
          <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <span className="text-[13px] font-semibold">Extracting text from document</span>
          </div>
          
          <div className="flex items-center gap-3 text-blue-600 dark:text-blue-400">
            <Loader2 className="w-5 h-5 flex-shrink-0 animate-spin" />
            <span className="text-[13px] font-semibold">Identifying trade divisions</span>
          </div>

          <div className="flex items-center gap-3 text-gray-400 dark:text-gray-600">
            <Circle className="w-5 h-5 flex-shrink-0" />
            <span className="text-[13px] font-medium">Detecting scope items</span>
          </div>

          <div className="flex items-center gap-3 text-gray-400 dark:text-gray-600">
            <Circle className="w-5 h-5 flex-shrink-0" />
            <span className="text-[13px] font-medium">Finding pricing-impact data</span>
          </div>

          <div className="flex items-center gap-3 text-gray-400 dark:text-gray-600">
            <Circle className="w-5 h-5 flex-shrink-0" />
            <span className="text-[13px] font-medium">Structuring output</span>
          </div>
        </div>

        <div className="w-full bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded-xl p-4 flex gap-2">
          <span className="text-[12px] font-bold">Tip:</span>
          <span className="text-[12px] font-medium">This may take a few moments depending on document size</span>
        </div>

      </div>

    </div>
  );
}
