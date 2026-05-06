"use client";

import React from "react";
import { Search, FileText, Share2, Clock, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

const PROJECTS = [
  {
    name: "Green Valley Residential Complex",
    files: 5,
    addenda: 2,
    status: {
      processing: "Processing",
      analysis: "Done",
      quote: "Draft",
    },
    updated: "2 hours ago",
  },
  {
    name: "Downtown Office Tower",
    files: 8,
    addenda: 1,
    status: {
      processing: "Processing",
      analysis: "Done",
      quote: "Draft",
    },
    updated: "2 hours ago",
  },
  {
    name: "City Center Shopping Mall",
    files: 12,
    addenda: 0,
    status: {
      processing: "Processing",
      analysis: "Done",
      quote: "Draft",
    },
    updated: "2 hours ago",
  },
  {
    name: "Green Valley Residential Complex",
    files: 5,
    addenda: 2,
    status: {
      processing: "Processing",
      analysis: "Done",
      quote: "Draft",
    },
    updated: "2 hours ago",
  },
];

export default function SubUserDashboardPage() {
  return (
    <div className="space-y-10 py-6">
      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search Projects..........."
          className="w-full h-14 pl-14 pr-6 bg-white dark:bg-gray-900 border border-emerald-100 dark:border-gray-800 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-200 dark:focus:border-emerald-900 transition-all placeholder:text-gray-300 dark:placeholder:text-gray-600 font-medium text-gray-900 dark:text-gray-100"
        />
      </div>

      {/* Hero Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            My Projects
          </h1>
          <Link href="/sub-user/projects/new">
            <Button variant="primary" className="rounded-xl font-bold">
              <Plus className="w-4 h-4 mr-2" /> Create New
            </Button>
          </Link>
        </div>
        <p className="text-gray-500 dark:text-gray-400 max-w-3xl leading-relaxed font-medium">
          Manage your construction tenders and analyze documents with AI.
        </p>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {PROJECTS.map((project, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-[#111827] border border-gray-50 dark:border-gray-800 rounded-[32px] p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col gap-6"
          >
            <h3 className="font-bold text-gray-800 dark:text-gray-100 text-lg leading-tight min-h-[3rem]">
              {project.name}
            </h3>

            <div className="flex items-center justify-between text-sm font-bold">
              <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-lg">
                <FileText className="w-4 h-4" />
                <span>{project.files} Files</span>
              </div>
              <div className="flex items-center gap-2 text-orange-500 bg-orange-50 dark:bg-orange-900/20 px-3 py-1.5 rounded-lg">
                <Share2 className="w-4 h-4" />
                <span>{project.addenda} Addenda</span>
              </div>
            </div>

            <div className="space-y-3.5 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400 dark:text-gray-500 font-bold">
                  Processing:
                </span>
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg text-[11px] font-black uppercase tracking-wider">
                  {project.status.processing}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400 dark:text-gray-500 font-bold">
                  Analysis:
                </span>
                <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg text-[11px] font-black uppercase tracking-wider">
                  {project.status.analysis}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400 dark:text-gray-500 font-bold">Quote:</span>
                <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-lg text-[11px] font-black uppercase tracking-wider">
                  {project.status.quote}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-gray-400 dark:text-gray-500 pt-2 font-bold uppercase tracking-wider">
              <Clock className="w-4 h-4" />
              <span>Last Updated: {project.updated}</span>
            </div>

            <div className="flex gap-3 pt-2">
              <Link href={`/sub-user/projects/${idx + 1}`} className="flex-1">
                <Button
                  variant="secondary"
                  className="w-full h-12 rounded-2xl font-bold shadow-sm"
                >
                  Open
                </Button>
              </Link>
              <Link href={`/sub-user/projects/${idx + 1}/results`} className="flex-[1.5]">
                <Button
                  variant="primary"
                  className="w-full h-12 rounded-2xl font-bold"
                >
                  Continue
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
