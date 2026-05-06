"use client";

import React from "react";
import CreateProjectForm from "@/features/projects/components/CreateProjectForm";

export default function Page() {
  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 bg-[#F8FAFC] dark:bg-[#0B0F1A] transition-colors duration-300">
      <CreateProjectForm dashboardPath="/sub-user" />
    </div>
  );
}
