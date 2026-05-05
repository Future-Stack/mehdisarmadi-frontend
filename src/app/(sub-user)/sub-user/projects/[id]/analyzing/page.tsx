"use client";

import React from "react";
import AnalysisLoading from "@/features/projects/components/AnalysisLoading";

export default function Page() {
  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 bg-[#F8FAFC]">
      <AnalysisLoading dashboardPath="/sub-user" />
    </div>
  );
}
