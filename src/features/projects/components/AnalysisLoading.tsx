"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  CheckCircle2, 
  Circle, 
  Loader2, 
  Sparkles
} from "lucide-react";

const STEPS = [
  { id: 1, label: "Extracting text from document" },
  { id: 2, label: "Identifying trade divisions" },
  { id: 3, label: "Detecting scope items" },
  { id: 4, label: "Finding pricing-impact risks" },
  { id: 5, label: "Structuring output" },
];

export default function AnalysisLoading({ dashboardPath = "/dashboard" }: { dashboardPath?: string }) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    if (currentStep <= STEPS.length) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 1500);
      return () => clearTimeout(timer);
    } else {
      const redirectTimer = setTimeout(() => {
        router.push(`${dashboardPath}/projects/1/results`);
      }, 1000);
      return () => clearTimeout(redirectTimer);
    }
  }, [currentStep, router]);

  return (
    <div className="w-full max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="bg-white rounded-[32px] border border-gray-100 p-12 shadow-[0_20px_50px_rgba(0,0,0,0.04)] flex flex-col items-center text-center space-y-10">
        
        {/* Icon Animation */}
        <div className="relative">
          <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center text-[#059669] animate-pulse">
            <Sparkles className="w-10 h-10" />
          </div>
          <div className="absolute -top-2 -right-2">
            <div className="w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center border border-gray-50">
              <Loader2 className="w-4 h-4 text-[#059669] animate-spin" />
            </div>
          </div>
        </div>

        {/* Text */}
        <div className="space-y-3">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Analyzing Your Tender Document</h1>
          <p className="text-gray-500 font-medium">Please wait while AI processes your document</p>
        </div>

        {/* Steps List */}
        <div className="w-full max-w-sm space-y-5 text-left">
          {STEPS.map((step) => {
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;

            return (
              <div 
                key={step.id} 
                className={`flex items-center gap-4 transition-all duration-500 ${isCompleted || isCurrent ? "opacity-100" : "opacity-30"}`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                ) : isCurrent ? (
                  <Loader2 className="w-6 h-6 text-[#059669] animate-spin" />
                ) : (
                  <Circle className="w-6 h-6 text-gray-300" />
                )}
                <span className={`font-bold text-sm ${isCurrent ? "text-blue-600" : isCompleted ? "text-gray-700" : "text-gray-400"}`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Tip */}
        <div className="w-full bg-[#EFF6FF] border border-blue-100 rounded-2xl p-5 text-center">
          <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">
            Tip: <span className="text-blue-500 normal-case font-medium">This may take a few moments depending on document size</span>
          </p>
        </div>
      </div>
    </div>
  );
}
