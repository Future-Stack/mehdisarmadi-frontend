"use client";

import React, { useState } from "react";
import { ArrowLeft, Edit3, Copy, Trash2, CheckSquare, Square, Sparkles, AlertTriangle, AlertCircle, FileText, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { cn } from "@/lib/utils";

const TABS = [
  "Summary", "Scope", "Pricing", "Risks", "Clarifications", "Assumptions", "Exclusions", "Addenda"
];

const ASSUMPTIONS_DATA = [
  { id: 1, text: "Site access will be provided as per tender specifications (6 AM to 6 PM daily)", included: true },
  { id: 2, text: "Temporary facilities (site office, storage, washrooms) provided by general contractor", included: false },
  { id: 3, text: "All substrates will be properly prepared and ready to receive finishes", included: false },
  { id: 4, text: "Utilities (power, water) will be available at no cost to contractor", included: false },
  { id: 5, text: "Building is weathertight and secure before finish work begins", included: false },
  { id: 6, text: "No hazardous materials or conditions exist in work areas", included: false }
];

const RISKS_DATA = [
  { id: 1, title: "Night Work Required", desc: "Tender specifies work between 10 PM - 6 AM in computer server areas. This will significantly increase labor costs.", source: "Contract Specifications.pdf, Page 4 • 2:14 PM, Sep 24", badge: "High Impact", badgeColor: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
  { id: 2, title: "Liquidated Damages Clause", desc: "Daily penalty of $2,000 for delays beyond completion date. High schedule risk factor.", source: "Contract Specifications.pdf, Page 27 • 2:14 PM, Sep 24", badge: "Contracting Issue", badgeColor: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" },
  { id: 3, title: "Limited Site Access", desc: "Material delivery restricted to 2 hours daily (2-4 AM). This creates scheduling challenges.", source: "General Requirements.pdf, Page 8 • 2:14 PM, Sep 24", badge: "Schedule Impact", badgeColor: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" },
  { id: 4, title: "Material Approval Lead Time", desc: "All materials require architect approval with 14-day review period. Potential for schedule delay.", source: "General Requirements.pdf, Page 12 • 2:14 PM, Sep 24", badge: "Cost Impact", badgeColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" }
];

const CLARIFICATIONS_DATA = [
  { id: 1, text: "Confirm exact working hours permitted for night work and any noise level restrictions", source: "Contract Specifications.pdf, Page 4 • 2:14 PM, Sep 24" },
  { id: 2, text: "Verify if temporary lighting and power are supplied by general contractor", source: "General Requirements.pdf, Page 14 • 2:14 PM, Sep 24" },
  { id: 3, text: "Clarify responsibility for material storage on site or off site required", source: "General Requirements.pdf, Page 18 • 2:14 PM, Sep 24" },
  { id: 4, text: "Confirm equipment tie-ins - is GC or Subcontractor responsible for tie-in?", source: "Contract Specifications.pdf, Page 42 • 2:14 PM, Sep 24" },
  { id: 5, text: "Verify coordination process with other trades (electrical, plumbing)", source: "Contract Specifications.pdf, Page 54 • 2:14 PM, Sep 24" }
];

const EXCLUSIONS_DATA = [
  { id: 1, text: "Exterior window washing/maintenance", source: "General Requirements.pdf, Page 4 • 2:14 PM, Sep 24" },
  { id: 2, text: "Plumbing rough-in and fixture installation", source: "Contract Specifications.pdf, Page 14 • 2:14 PM, Sep 24" },
  { id: 3, text: "HVAC ductwork and equipment supply/install", source: "Contract Specifications.pdf, Page 18 • 2:14 PM, Sep 24" },
  { id: 4, text: "Building permits and inspection fees (owner responsibility)", source: "General Requirements.pdf, Page 42 • 2:14 PM, Sep 24" },
  { id: 5, text: "Site security, hoarding, and temporary fencing", source: "General Requirements.pdf, Page 54 • 2:14 PM, Sep 24" }
];

const SCOPE_DATA = Array(7).fill(null).map((_, i) => ({
  id: i + 1,
  div: i < 1 ? "01" : i < 4 ? "06" : i < 6 ? "08" : "09",
  item: "Supply and install solid core wooden doors",
  quantity: "40 units",
  included: true,
  notes: "Pre-hung with frames, paint-grade finish",
  source: "A601 Door Schedule p.12"
}));

const ADDENDA_DATA = [
  { 
    id: 1, badge: "ADDENDUM #1", date: "April 15, 2024", title: "Window Specifications Changed", 
    desc: "Changed from single-pane to double-glazed low-E glass", impact: "Escalation", 
    divisions: ["08"], scope: "Add", price: "+$12,500", source: "Architectural Spec, Page 12 • Apr 4" 
  },
  { 
    id: 2, badge: "ADDENDUM #2", date: "April 18, 2024", title: "Closing Date Extended", 
    desc: "Bid closing date extended from April 24 to May 1, 2024", impact: "Schedule", 
    divisions: ["All"], scope: "None", price: "None", source: "Addendum 2 cover, Page 1 • Apr 4" 
  }
];

export default function AIAnalysisResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [activeTab, setActiveTab] = useState("Summary");
  const [assumptions, setAssumptions] = useState(ASSUMPTIONS_DATA);
  
  const toggleAssumption = (id: number) => {
    setAssumptions(prev => prev.map(a => a.id === id ? { ...a, included: !a.included } : a));
  };

  const AIInstructionSection = () => (
    <div className="bg-white dark:bg-[#111827] border border-blue-100 dark:border-blue-900/50 rounded-3xl p-6 md:p-8 shadow-sm mt-8">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-4 h-4 text-blue-500" />
        <h3 className="text-[15px] font-bold text-gray-900 dark:text-white">AI Instruction For This Section</h3>
      </div>
      <div className="space-y-4">
        <input 
          type="text" 
          placeholder="Add instruction for this section...."
          className="w-full h-12 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
        <Button variant="primary" className="h-10 px-5 rounded-xl text-[13px] font-bold bg-emerald-600 hover:bg-emerald-700 shadow-sm text-white flex items-center gap-2">
          ✨ Re-analyze Section
        </Button>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link href={`/sub-user/projects/${id}`} className="inline-flex items-center gap-1 text-sm font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Project
          </Link>
          <h1 className="text-[28px] font-bold text-gray-900 dark:text-white leading-tight">AI Analysis Results</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Residential Complex • united states</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Link href={`/sub-user/projects/${id}/quote`}>
            <Button variant="secondary" className="h-11 px-5 rounded-xl font-bold bg-white dark:bg-[#111827] border-gray-200 dark:border-gray-700 shadow-sm text-gray-700 dark:text-gray-200">
              Open Quote Builder
            </Button>
          </Link>
          <Button variant="primary" className="h-11 px-6 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-200 dark:shadow-none">
            Build Quote
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 pb-2">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-5 py-2.5 rounded-full text-[13px] font-bold transition-all shadow-sm",
              activeTab === tab 
                ? "bg-emerald-600 text-white shadow-emerald-200 dark:shadow-none" 
                : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
        
        {/* TAB CONTENT: Summary */}
        {activeTab === "Summary" && (
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-[20px] font-bold text-gray-900 dark:text-white mb-2">Key Highlights</h2>
              <div className="space-y-3">
                <div className="bg-emerald-50/80 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/50 rounded-2xl p-5">
                  <h4 className="text-[15px] font-bold text-emerald-800 dark:text-emerald-400 mb-1">Scope Summary</h4>
                  <p className="text-[13px] text-emerald-700/80 dark:text-emerald-500/80">Comprehensive interior finishing work across 4 CSI divisions. Total 7 scope items identified with quantities and specifications.</p>
                </div>
                <div className="bg-orange-50/80 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-800/50 rounded-2xl p-5">
                  <h4 className="text-[15px] font-bold text-orange-800 dark:text-orange-400 mb-1">Pricing Impacts</h4>
                  <p className="text-[13px] text-orange-700/80 dark:text-orange-500/80">3 cost factors identified. Major impacts include night work premium ($12,000) and performance bond ($24,200).</p>
                </div>
                <div className="bg-red-50/80 dark:bg-red-900/10 border border-red-100 dark:border-red-800/50 rounded-2xl p-5">
                  <h4 className="text-[15px] font-bold text-red-800 dark:text-red-400 mb-1">Risks & Coordination</h4>
                  <p className="text-[13px] text-red-700/80 dark:text-red-500/80">4 risks flagged for review including contractual requirements, schedule impacts, and coordination needs.</p>
                </div>
                <div className="bg-blue-50/80 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/50 rounded-2xl p-5">
                  <h4 className="text-[15px] font-bold text-blue-800 dark:text-blue-400 mb-1">Addenda Changes</h4>
                  <p className="text-[13px] text-blue-700/80 dark:text-blue-500/80">1 addenda issued. Window specification changed (cost impact ~$12,500) and closing date extended to May 1, 2026.</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm">
              <h3 className="text-[15px] font-bold text-gray-900 dark:text-white mb-1">Selected Divisions</h3>
              <p className="text-[13px] text-gray-500 dark:text-gray-400 mb-5">Division breakdown and allocation</p>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center border border-emerald-200 dark:border-emerald-800 rounded-full px-3 py-1.5 bg-emerald-50/30 dark:bg-emerald-900/10">
                  <span className="text-[11px] font-bold text-white bg-emerald-500 rounded px-1.5 py-0.5 mr-2">Div 01</span>
                  <span className="text-[13px] font-bold text-gray-700 dark:text-gray-300">General Requirements <span className="text-gray-400 font-medium ml-1">(15%)</span></span>
                </div>
                <div className="flex items-center border border-emerald-200 dark:border-emerald-800 rounded-full px-3 py-1.5 bg-emerald-50/30 dark:bg-emerald-900/10">
                  <span className="text-[11px] font-bold text-white bg-emerald-500 rounded px-1.5 py-0.5 mr-2">Div 06</span>
                  <span className="text-[13px] font-bold text-gray-700 dark:text-gray-300">Wood, Plastics & Composites <span className="text-gray-400 font-medium ml-1">(25%)</span></span>
                </div>
                <div className="flex items-center border border-emerald-200 dark:border-emerald-800 rounded-full px-3 py-1.5 bg-emerald-50/30 dark:bg-emerald-900/10">
                  <span className="text-[11px] font-bold text-white bg-emerald-500 rounded px-1.5 py-0.5 mr-2">Div 08</span>
                  <span className="text-[13px] font-bold text-gray-700 dark:text-gray-300">Openings <span className="text-gray-400 font-medium ml-1">(20%)</span></span>
                </div>
                <div className="flex items-center border border-emerald-200 dark:border-emerald-800 rounded-full px-3 py-1.5 bg-emerald-50/30 dark:bg-emerald-900/10">
                  <span className="text-[11px] font-bold text-white bg-emerald-500 rounded px-1.5 py-0.5 mr-2">Div 09</span>
                  <span className="text-[13px] font-bold text-gray-700 dark:text-gray-300">Finishes <span className="text-gray-400 font-medium ml-1">(40%)</span></span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB CONTENT: Scope */}
        {activeTab === "Scope" && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 rounded-3xl p-6 md:p-8 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                  <div className="relative w-64">
                    <input 
                      type="text" 
                      placeholder="Search scope items..."
                      className="w-full h-10 pl-4 pr-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900 text-[13px] focus:outline-none"
                    />
                  </div>
                  <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                    {['All', '01', '06', '08', '09'].map(div => (
                      <button 
                        key={div}
                        className={cn(
                          "px-3 py-1 text-[12px] font-bold rounded-md transition-colors",
                          div === 'All' ? "bg-emerald-600 text-white" : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
                        )}
                      >
                        {div}
                      </button>
                    ))}
                  </div>
                </div>
                <Button variant="secondary" className="h-10 px-4 rounded-xl font-bold bg-white border-gray-200 shadow-sm text-gray-700 text-[12px]">
                  + Add Row
                </Button>
              </div>

              <div className="overflow-x-auto border border-gray-200 dark:border-gray-800 rounded-xl mb-4">
                <table className="w-full text-left text-[12px]">
                  <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                    <tr>
                      <th className="px-4 py-3 font-bold text-gray-500 w-16">Div</th>
                      <th className="px-4 py-3 font-bold text-gray-500 min-w-[200px]">Scope Item</th>
                      <th className="px-4 py-3 font-bold text-gray-500">Quantity</th>
                      <th className="px-4 py-3 font-bold text-gray-500 text-center">Include</th>
                      <th className="px-4 py-3 font-bold text-gray-500">Notes</th>
                      <th className="px-4 py-3 font-bold text-gray-500">Source</th>
                      <th className="px-4 py-3 font-bold text-gray-500 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-gray-900">
                    {SCOPE_DATA.map((row) => (
                      <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        <td className="px-4 py-3">
                          <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                            {row.div}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{row.item}</td>
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{row.quantity}</td>
                        <td className="px-4 py-3 text-center">
                          <button className="text-emerald-500 hover:text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 p-1 rounded transition-colors">
                            <CheckSquare className="w-4 h-4" />
                          </button>
                        </td>
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{row.notes}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5 text-gray-500">
                            <FileText className="w-3.5 h-3.5" /> {row.source}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button className="text-gray-400 hover:text-blue-600 transition-colors"><Edit3 className="w-4 h-4" /></button>
                            <button className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"><Copy className="w-4 h-4" /></button>
                            <button className="text-gray-400 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="text-[12px] font-medium text-gray-500">
                Showing {SCOPE_DATA.length} of {SCOPE_DATA.length} items • {SCOPE_DATA.length} included in quote
              </div>
            </div>

            <AIInstructionSection />
            
            {/* Proposed Changes Box */}
            <div className="bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800/50 rounded-3xl p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-2 mb-4 text-emerald-600 dark:text-emerald-400">
                <CheckSquare className="w-5 h-5" />
                <h3 className="text-[16px] font-bold">Proposed Changes</h3>
              </div>
              
              <div className="mb-4">
                <div className="text-[13px] font-bold text-gray-700 dark:text-gray-300 mb-1">Scope Changes:</div>
                <ul className="list-disc list-inside text-[13px] text-gray-600 dark:text-gray-400 space-y-1">
                  <li>Remove painting scope items (2 items affected)</li>
                  <li>Exclude lift work from Division 01</li>
                  <li>Focus analysis on door installation only</li>
                  <li>Update quantity calculations for door hardware</li>
                </ul>
              </div>

              <div className="border-2 border-dashed border-blue-400 dark:border-blue-500/50 rounded-xl p-4 bg-white/50 dark:bg-[#111827]/50 mb-4">
                <div className="text-[12px] font-bold text-gray-500 mb-1">Pricing Impact</div>
                <div className="text-[14px] font-bold text-orange-500">Estimated reduction of -$12,500 for painting</div>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800/50 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-2 text-[12px] font-bold text-yellow-800 dark:text-yellow-400 mb-2">
                  <AlertTriangle className="w-4 h-4" /> This change may affect:
                </div>
                <div className="flex gap-2">
                  <span className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-[10px] font-bold px-2 py-1 rounded">Pricing</span>
                  <span className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-[10px] font-bold px-2 py-1 rounded">Exclusions</span>
                  <span className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-[10px] font-bold px-2 py-1 rounded">Quote Builder</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button variant="primary" className="h-10 px-5 rounded-xl text-[13px] font-bold bg-emerald-600 hover:bg-emerald-700 shadow-sm text-white">
                  Accept Changes
                </Button>
                <Button variant="secondary" className="h-10 px-5 rounded-xl font-bold bg-white dark:bg-[#111827] border-gray-200 dark:border-gray-700 shadow-sm text-gray-700 dark:text-gray-200 text-[13px]">
                  <Edit3 className="w-4 h-4 mr-2" /> Edit
                </Button>
                <Button variant="secondary" className="h-10 px-5 rounded-xl font-bold bg-white dark:bg-[#111827] border-red-200 dark:border-red-900/50 shadow-sm text-red-600 dark:text-red-400 text-[13px]">
                  <Trash2 className="w-4 h-4 mr-2" /> Reject
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* TAB CONTENT: Pricing */}
        {activeTab === "Pricing" && (
          <div className="space-y-6">
            <div className="bg-orange-50/50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-800/50 rounded-2xl p-4 flex gap-3">
              <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-[14px] font-bold text-orange-800 dark:text-orange-400 mb-0.5">Internal Pricing Assistant - AI Review Only</h4>
                <p className="text-[13px] text-orange-700/80 dark:text-orange-300">Pricing must be verified by the estimator before use. AI utilizes historical 12-month data and default labor rates.</p>
              </div>
            </div>

            <div className="bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
              
              {/* AI vs Estimator */}
              <div className="border border-blue-100 dark:border-blue-900/50 bg-blue-50/30 dark:bg-blue-900/10 rounded-2xl p-6">
                <h3 className="text-[14px] font-bold text-gray-900 dark:text-white mb-1">AI vs Estimator Comparison</h3>
                <p className="text-[12px] text-gray-500 mb-4">Compare AI draft total against an estimator Final price</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-blue-100 dark:border-blue-800/50 text-center">
                    <div className="text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-2">AI Base Estimate</div>
                    <div className="text-2xl font-black text-blue-600 dark:text-blue-400">$485,000</div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center">
                    <div className="text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-2">Estimator Input</div>
                    <div className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white">
                      $ <input type="text" className="w-24 border-b border-gray-300 focus:outline-none focus:border-emerald-500 bg-transparent text-center" />
                      <Edit3 className="w-4 h-4 text-emerald-500 cursor-pointer" />
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 text-center">
                    <div className="text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-2">AI-Staff Variance</div>
                    <div className="text-xl font-black text-gray-400">--</div>
                    <div className="text-[10px] text-gray-400 mt-1">Enter staff cost to calculate</div>
                  </div>
                </div>
              </div>

              {/* Direct Costs */}
              <div>
                <h3 className="text-[15px] font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-2"><Sparkles className="w-4 h-4 text-emerald-500"/> Direct Costs & Subcontractors</h3>
                <p className="text-[13px] text-gray-500 mb-4">Division breakdown pricing analysis</p>
                <div className="space-y-3">
                  {[
                    { id: '01', name: 'General Requirements', val: '$18,750' },
                    { id: '06', name: 'Wood, Plastics & Composites', val: '$72,250' },
                    { id: '08', name: 'Openings', val: '$148,500' },
                    { id: '09', name: 'Finishes', val: '$245,500' }
                  ].map(div => (
                    <div key={div.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 group">
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] font-bold text-white bg-emerald-500 rounded px-1.5 py-0.5">Div {div.id}</span>
                        <span className="text-[14px] font-semibold text-gray-900 dark:text-gray-100">{div.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[15px] font-bold text-gray-900 dark:text-white">{div.val}</span>
                        <Edit3 className="w-4 h-4 text-gray-400 hover:text-emerald-500 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Costs */}
              <div>
                <h3 className="text-[15px] font-bold text-gray-900 dark:text-white mb-1">Additional Costs/Risks</h3>
                <p className="text-[13px] text-gray-500 mb-4">Bonds, insurance, out-of-hours, and contingency</p>
                <div className="space-y-3">
                  {[
                    { name: 'Night Work Premium', sub: '20% labor cost markup', val: '$12,000', color: 'border-l-orange-500' },
                    { name: 'Performance Bond', sub: '5% of contract value', val: '$24,200', color: 'border-l-blue-500' },
                    { name: 'Coordilation Costs', sub: 'Site meetings, scheduling, BIM', val: '$15,500', color: 'border-l-purple-500' },
                    { name: 'Contingency (5%)', sub: 'Risk buffer', val: '$24,250', color: 'border-l-yellow-500' }
                  ].map((item, i) => (
                    <div key={i} className={cn("flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800/50 border-l-4 group", item.color)}>
                      <div>
                        <div className="text-[14px] font-bold text-gray-900 dark:text-gray-100">{item.name}</div>
                        <div className="text-[11px] text-gray-500">{item.sub}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[15px] font-bold text-gray-900 dark:text-white">{item.val}</span>
                        <Edit3 className="w-4 h-4 text-gray-400 hover:text-emerald-500 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Missing Information */}
              <div className="bg-red-50/30 dark:bg-red-900/10 border border-red-100 dark:border-red-900/50 rounded-2xl p-6">
                <h3 className="text-[14px] font-bold text-red-800 dark:text-red-400 flex items-center gap-2 mb-1"><AlertCircle className="w-4 h-4"/> Missing Information</h3>
                <p className="text-[12px] text-red-600/80 dark:text-red-300 mb-4">Items requiring evaluation or estimator input</p>
                <div className="space-y-3">
                  {[
                    { title: 'Escalation clauses missing', sub: 'Must factor in raw material fluctuation if contract spans >6 months' },
                    { title: 'Labor productivity unknown', sub: 'Night work productivity rate must be confirmed by crew supervisor' },
                    { title: 'Site visits uncompleted', sub: 'Need access to assess staging logistics - allowance may be needed' },
                    { title: 'Material escalation risks omitted', sub: 'No provision mapped out for sudden material shortfalls and surcharges' }
                  ].map((err, i) => (
                    <div key={i} className="flex gap-3 bg-white/50 dark:bg-red-900/20 p-3 rounded-lg border border-red-100/50 dark:border-red-800/30">
                      <div className="mt-0.5 text-red-500 text-[10px]">❌</div>
                      <div>
                        <div className="text-[13px] font-bold text-gray-900 dark:text-gray-100 mb-0.5">{err.title}</div>
                        <div className="text-[12px] text-gray-600 dark:text-gray-400">{err.sub}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <AIInstructionSection />
          </div>
        )}

        {/* TAB CONTENT: Risks */}
        {activeTab === "Risks" && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 rounded-3xl p-6 md:p-8 shadow-sm">
              <div className="mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">
                <h2 className="text-[20px] font-bold text-gray-900 dark:text-white mb-1">Risks & Coordination Items</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Issues flagged from tender documents.</p>
              </div>

              <div className="space-y-4">
                {RISKS_DATA.map((risk) => (
                  <div key={risk.id} className="relative pl-4">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500 rounded-full"></div>
                    <div className="bg-gray-50/50 dark:bg-gray-800/30 rounded-xl p-5 border border-gray-100 dark:border-gray-800">
                      <div className="flex justify-between items-start gap-4 mb-2">
                        <h4 className="text-[15px] font-bold text-gray-900 dark:text-white">{risk.title}</h4>
                        <span className={cn("text-[10px] font-bold px-2.5 py-1 rounded-md tracking-wide", risk.badgeColor)}>{risk.badge}</span>
                      </div>
                      <p className="text-[13px] text-gray-600 dark:text-gray-300 leading-relaxed mb-3">{risk.desc}</p>
                      <div className="flex items-center gap-1.5 text-[11px] font-medium text-gray-400">
                        <FileText className="w-3.5 h-3.5" />
                        {risk.source}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <AIInstructionSection />
          </div>
        )}

        {/* TAB CONTENT: Clarifications */}
        {activeTab === "Clarifications" && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 rounded-3xl p-6 md:p-8 shadow-sm">
              <div className="flex justify-between items-center mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">
                <div>
                  <h2 className="text-[20px] font-bold text-gray-900 dark:text-white mb-1">Clarifications Needed</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Items requiring clarification from owner/architect.</p>
                </div>
                <Button variant="primary" className="h-9 px-5 rounded-lg font-bold bg-emerald-600 hover:bg-emerald-700 shadow-sm text-white text-xs">
                  <Edit3 className="w-3.5 h-3.5 mr-2" /> Edit
                </Button>
              </div>

              <div className="space-y-3">
                {CLARIFICATIONS_DATA.map((clarification) => (
                  <div key={clarification.id} className="flex gap-4 p-4 rounded-xl border border-emerald-100 dark:border-emerald-900/30 bg-emerald-50/30 dark:bg-emerald-900/10">
                    <span className="text-[14px] font-bold text-emerald-600 mt-0.5">{clarification.id}.</span>
                    <div>
                      <h4 className="text-[14px] font-bold text-emerald-900 dark:text-emerald-100 mb-1">{clarification.text}</h4>
                      <div className="flex items-center gap-1.5 text-[11px] font-medium text-gray-400">
                        <FileText className="w-3.5 h-3.5" />
                        {clarification.source}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <AIInstructionSection />
          </div>
        )}

        {/* TAB CONTENT: Assumptions */}
        {activeTab === "Assumptions" && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 rounded-3xl p-6 md:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8 border-b border-gray-100 dark:border-gray-800 pb-6">
                <div>
                  <h2 className="text-[20px] font-bold text-gray-900 dark:text-white mb-1">Assumptions</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Assumptions made based on tender documents.</p>
                </div>
                <Button variant="secondary" className="h-9 px-4 rounded-lg font-bold bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 text-xs shadow-sm">
                  + Add Manual Assumption
                </Button>
              </div>

              <div className="space-y-3">
                {assumptions.map((item, index) => (
                  <div 
                    key={item.id} 
                    className={cn(
                      "flex flex-col md:flex-row md:items-center gap-4 p-4 rounded-xl border transition-colors",
                      item.included 
                        ? "bg-gray-50/80 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700" 
                        : "bg-white dark:bg-[#111827] border-transparent hover:border-gray-100 dark:hover:border-gray-800"
                    )}
                  >
                    <div className="flex-1 flex gap-3">
                      <span className="text-[13px] font-bold text-gray-400 w-5 text-right">{index + 1}.</span>
                      <p className="text-[13px] font-medium text-gray-700 dark:text-gray-300 leading-relaxed">{item.text}</p>
                    </div>
                    <div className="flex items-center gap-3 ml-8 md:ml-0 self-start md:self-auto">
                      <button 
                        onClick={() => toggleAssumption(item.id)}
                        className={cn(
                          "flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1.5 rounded-lg transition-colors border",
                          item.included 
                            ? "text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50 bg-emerald-50 dark:bg-emerald-900/20" 
                            : "text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                        )}
                      >
                        {item.included ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                        Include
                      </button>
                      <div className="flex items-center gap-1">
                        <button className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                          <Copy className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-red-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <AIInstructionSection />
          </div>
        )}

        {/* TAB CONTENT: Exclusions */}
        {activeTab === "Exclusions" && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 rounded-3xl p-6 md:p-8 shadow-sm">
              <div className="flex justify-between items-center mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">
                <div>
                  <h2 className="text-[20px] font-bold text-gray-900 dark:text-white mb-1">Exclusions</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Items explicitly excluded from scope.</p>
                </div>
                <Button variant="primary" className="h-9 px-5 rounded-lg font-bold bg-emerald-600 hover:bg-emerald-700 shadow-sm text-white text-xs">
                  <Edit3 className="w-3.5 h-3.5 mr-2" /> Edit
                </Button>
              </div>

              <div className="space-y-3">
                {EXCLUSIONS_DATA.map((exclusion) => (
                  <div key={exclusion.id} className="flex gap-4 p-4 rounded-xl border border-red-100 dark:border-red-900/30 bg-red-50/30 dark:bg-red-900/10">
                    <span className="text-[10px] text-red-500 mt-1">🔴</span>
                    <div>
                      <h4 className="text-[14px] font-bold text-gray-900 dark:text-white mb-1">{exclusion.text}</h4>
                      <div className="flex items-center gap-1.5 text-[11px] font-medium text-gray-400">
                        <FileText className="w-3.5 h-3.5" />
                        {exclusion.source}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <AIInstructionSection />
          </div>
        )}

        {/* TAB CONTENT: Addenda */}
        {activeTab === "Addenda" && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 rounded-3xl p-6 md:p-8 shadow-sm">
              <div className="mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">
                <h2 className="text-[20px] font-bold text-gray-900 dark:text-white mb-1">Addenda Changes</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Changes found through addenda</p>
              </div>

              <div className="space-y-4">
                {ADDENDA_DATA.map((addenda) => (
                  <div key={addenda.id} className="relative pl-4">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 rounded-full"></div>
                    <div className="bg-emerald-50/30 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/50 rounded-xl p-5">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">{addenda.badge}</span>
                        <span className="text-sm font-medium text-gray-500">{addenda.date}</span>
                      </div>
                      <h4 className="text-[16px] font-bold text-gray-900 dark:text-white mb-1">{addenda.title}</h4>
                      <p className="text-[13px] text-gray-600 dark:text-gray-400 mb-6">{addenda.desc}</p>
                      
                      <div className="grid grid-cols-2 gap-y-4 gap-x-8 mb-6">
                        <div>
                          <div className="text-[12px] font-medium text-gray-500 mb-1">Impact Type</div>
                          <div className="text-[13px] font-bold text-gray-900 dark:text-white">{addenda.impact}</div>
                        </div>
                        <div>
                          <div className="text-[12px] font-medium text-gray-500 mb-1">Affected Divisions</div>
                          <div className="flex gap-2">
                            {addenda.divisions.map(d => (
                              <span key={d} className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">{d}</span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <div className="text-[12px] font-medium text-gray-500 mb-1">Scope Change</div>
                          <div className="text-[13px] font-bold text-gray-900 dark:text-white">{addenda.scope}</div>
                        </div>
                        <div>
                          <div className="text-[12px] font-medium text-gray-500 mb-1">Pricing Impact</div>
                          <div className="text-[13px] font-bold text-gray-900 dark:text-white">{addenda.price}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 text-[11px] font-medium text-gray-400 pt-4 border-t border-emerald-100 dark:border-emerald-900/50">
                        <FileText className="w-3.5 h-3.5" />
                        {addenda.source}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <AIInstructionSection />
          </div>
        )}

        {/* Placeholder for remaining tabs */}
        {activeTab !== "Summary" && activeTab !== "Assumptions" && activeTab !== "Risks" && activeTab !== "Pricing" && activeTab !== "Clarifications" && activeTab !== "Exclusions" && activeTab !== "Addenda" && activeTab !== "Scope" && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{activeTab}</h3>
              <p className="text-sm text-gray-500">This section is currently under development.</p>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
