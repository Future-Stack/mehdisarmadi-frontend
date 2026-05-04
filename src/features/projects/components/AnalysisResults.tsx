"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  FileText,
  Paperclip,
  CheckCircle2,
  X,
  Plus,
  Edit2,
  ExternalLink,
  CheckCircle,
  XCircle,
  Edit,
  ArrowRight,
  Sparkles,
  LayoutDashboard,
  ShieldAlert,
  MessageSquare,
  Lightbulb,
  AlertTriangle,
  DraftingCompass,
  Search,
} from "lucide-react";

const TABS = [
  { id: "summary", label: "Summary" },
  { id: "scope", label: "Scope" },
  { id: "pricing", label: "Pricing" },
  { id: "risks", label: "Risks" },
  { id: "clarifications", label: "Clarifications" },
  { id: "assumptions", label: "Assumptions" },
  { id: "exclusions", label: "Exclusions" },
  { id: "addenda", label: "Addenda" },
  { id: "quote", label: "Quote Draft" },
  { id: "sources", label: "Sources" },
];

const SCOPE_ITEMS = [
  {
    title: "Supply and install solid core wooden doors",
    div: "Div 08",
    qty: "40 units",
    specs: '1-3/4" thick, pre-hung with frames, paint-grade finish',
    source: "A601 Door Schedule • Page 23 • Division 08 - Doors",
  },
  {
    title: "Install aluminum window frames with double glazing",
    div: "Div 08",
    qty: "85 sq.m",
    specs: "Low-E glass, thermally broken frames, white finish",
    source: "Spec Section 08 44 16 • Page 34 • Window Systems",
  },
  {
    title: "Architectural Woodwork & Paneling",
    div: "Div 06",
    qty: "1,200 sq.ft",
    specs: "Oak veneer with satin finish, includes all trim",
    source: "Spec Section 06 40 00 • Page 42",
  },
  {
    title: "Interior Wall Painting",
    div: "Div 09",
    qty: "12,000 sq.ft",
    specs: "Low VOC, eggshell finish, 2 coats over primer",
    source: "A901 Finish Schedule • Page 12",
  },
  {
    title: "Project Management Fees",
    div: "Div 01",
    qty: "Lump Sum",
    specs: "Comprehensive site supervision and safety",
    source: "General Conditions • Page 5",
  },
];

export default function AnalysisResults() {
  const [activeTab, setActiveTab] = useState("summary");
  const [activeFilter, setActiveFilter] = useState("All Scope");

  const filteredScopeItems =
    activeFilter === "All Scope"
      ? SCOPE_ITEMS
      : SCOPE_ITEMS.filter((item) => item.div === activeFilter);

  const filterButtons = ["All Scope", "Div 01", "Div 06", "Div 08", "Div 09"];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#ECFDF5] to-white">
      <div className="max-w-7xl mx-auto py-8 px-4 space-y-8 animate-in fade-in duration-500 pb-20">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-4">
            <Link
              href="/admin"
              className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-[#059669] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Project
            </Link>
            <div className="space-y-1">
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                AI Analysis Results
              </h1>
              <p className="text-gray-400 font-bold text-sm uppercase tracking-widest flex items-center gap-2">
                Residential Complex <span className="text-gray-200">•</span>{" "}
                united states
              </p>
            </div>
          </div>
          <button className="bg-[#059669] h-12 px-8 rounded-xl font-black text-white text-sm shadow-lg shadow-emerald-100 hover:bg-[#047857] transition-all active:scale-95">
            Build Quote
          </button>
        </div>

        {/* Navigation Tabs (Single Line Grid) */}
        <div className="grid grid-cols-10 gap-1 p-1 bg-gray-50 border border-gray-100 rounded-2xl shadow-sm min-w-[1000px] overflow-hidden">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-1 py-3 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all text-center whitespace-nowrap ${
                  isActive
                    ? "bg-[#059669] text-white shadow-md scale-[1.02]"
                    : "bg-transparent text-gray-400 hover:text-gray-600 hover:bg-white"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* CONDITIONAL HEADER FOR SCOPE TAB (OUTSIDE WHITE BOX) */}
        {activeTab === "scope" && (
          <div className="flex items-end justify-between px-2">
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                Scope of Work
              </h2>
              <p className="text-gray-400 text-xs font-bold">
                Showing {filteredScopeItems.length} of {SCOPE_ITEMS.length} scope
                items
              </p>
            </div>
            <div className="flex gap-2">
              {filterButtons.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setActiveFilter(tag)}
                  className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider border transition-all ${
                    activeFilter === tag
                      ? "bg-[#059669] text-white shadow-md"
                      : "bg-white text-gray-400 border-gray-100 hover:border-emerald-200"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tab Content Container */}
        <div className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm min-h-[600px]">
          {activeTab === "summary" && <SummaryTab />}
          {activeTab === "scope" && (
            <ScopeTab
              items={filteredScopeItems}
              activeFilter={activeFilter}
            />
          )}
          {activeTab === "pricing" && <PricingTab />}
          {activeTab === "risks" && <RisksTab />}
          {activeTab === "clarifications" && <ClarificationsTab />}
          {activeTab === "assumptions" && <AssumptionsTab />}
          {activeTab === "exclusions" && <ExclusionsTab />}
          {activeTab === "addenda" && <AddendaTab />}
          {activeTab === "quote" && <QuoteDraftTab />}
          {activeTab === "sources" && <SourcesTab />}
        </div>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function SummaryTab() {
  const highlights = [
    {
      title: "Scope Summary",
      content:
        "Comprehensive interior finishing work across 4 CSI divisions. Total 7 scope items identified with quantities and specifications.",
      border: "border-l-[#059669]",
      bg: "bg-emerald-50/40",
    },
    {
      title: "Pricing Impacts",
      content:
        "5 cost factors identified. Major impacts include night work premium ($32,400) and performance bond ($24,250).",
      border: "border-l-[#F97316]",
      bg: "bg-orange-50/40",
    },
    {
      title: "Risks & Coordination",
      content:
        "4 items flagged for review including contractual requirements, schedule impacts, and coordination needs.",
      border: "border-l-[#EF4444]",
      bg: "bg-red-50/40",
    },
    {
      title: "Addenda Changes",
      content:
        "2 addenda issued. Window specification changed (cost impact +$12,500) and closing date extended to May 1, 2026.",
      border: "border-l-[#3B82F6]",
      bg: "bg-blue-50/30",
    },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="space-y-6">
        <h2 className="text-2xl font-black text-gray-900 tracking-tight">
          Key Highlights
        </h2>
        <div className="space-y-4">
          {highlights.map((h, i) => (
            <div
              key={i}
              className={`${h.bg} border-l-4 ${h.border} rounded-2xl p-6 transition-all hover:scale-[1.01]`}
            >
              <h3 className="font-black text-gray-900 text-lg mb-1">
                {h.title}
              </h3>
              <p className="text-gray-600 font-medium text-sm leading-relaxed">
                {h.content}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-black text-gray-900 tracking-tight">
            Selected Divisions
          </h2>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">
            Division breakdown and allocation
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {[
            "01 General Requirements (15%)",
            "06 Wood, Plastics & Composites (25%)",
            "08 Openings (30%)",
            "09 Finishes (30%)",
          ].map((div, i) => (
            <div
              key={i}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-50/50 border border-emerald-100 rounded-xl"
            >
              <div className="w-1.5 h-1.5 bg-[#059669] rounded-full" />
              <span className="text-xs font-bold text-gray-700">{div}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ScopeTab({ items, activeFilter }: any) {
  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      {items.map((item: any, i: number) => (
        <div
          key={i}
          className="bg-white rounded-[16px] border border-gray-100 p-6 shadow-sm space-y-5 hover:border-emerald-100 transition-all"
        >
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
            <span className="px-2.5 py-1 bg-[#059669] text-white rounded-[6px] text-[9px] font-black uppercase tracking-wider">
              Division {item.div.split(" ")[1]}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-x-20">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Quantity
              </p>
              <p className="text-sm font-medium text-gray-700">{item.qty}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Specifications
              </p>
              <p className="text-sm font-medium text-gray-700 leading-relaxed">
                {item.specs}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1 text-[10px] font-bold text-gray-300 uppercase tracking-widest">
            <FileText className="w-3.5 h-3.5" />
            <span>{item.source}</span>
          </div>
        </div>
      ))}
      {items.length === 0 && (
        <div className="py-20 text-center space-y-3 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
          <p className="font-bold text-gray-400">
            No items found for {activeFilter}
          </p>
        </div>
      )}
    </div>
  );
}

function PricingTab() {
  const items = [
    {
      title: "Night Work Required",
      desc: "Work between 10 PM - 6 AM for noise-sensitive areas. Impact: Cost increase (15-20%)",
      val: "$32,400",
      source: "General Conditions.pdf • Page 8 • 4.2 Working Hours",
    },
    {
      title: "Performance Bond",
      desc: "Performance bond must be submitted within 7 days of award. Impact: 5% of contract value",
      val: "$24,250",
      source: "Instructions to Bidders.pdf • Page 5 • 4.3",
    },
    {
      title: "Material Price Escalation",
      desc: "Price escalation clause for material costs beyond 60 days. Impact: Potential 5-8% increase",
      val: "$24,250-$38,800",
      source: "General Conditions.pdf • Page 22 • 9.3 Price Adjustments",
    },
    {
      title: "Site Access Limitations",
      desc: "Material delivery restricted to 2 hours daily (9-11 AM). Impact: Extended timeline costs",
      val: "$15,000",
      source: "Site Instructions.pdf • Page 3 • 2.1 Site Access",
    },
    {
      title: "Coordination Delays",
      desc: "Potential delays due to trade coordination requirements. Impact: Standby time charges",
      val: "$8,000-$12,000",
      source: "General Conditions.pdf • Page 19 • 8.2 Coordination",
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="space-y-1">
        <h2 className="text-2xl font-black text-gray-900 tracking-tight">
          Pricing Impacts
        </h2>
        <p className="text-gray-400 text-sm font-medium">
          Cost factors identified from tender documents
        </p>
      </div>
      <div className="space-y-4">
        {items.map((item, i) => (
          <div
            key={i}
            className="bg-orange-50/20 border-l-4 border-orange-400 rounded-2xl p-6 space-y-4"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <h3 className="font-black text-gray-900 text-lg">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-sm font-medium">{item.desc}</p>
              </div>
              <p className="text-xl font-black text-gray-900 tracking-tight">
                {item.val}
              </p>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-black text-gray-300 uppercase tracking-widest pt-2 border-t border-gray-100/50">
              <Paperclip className="w-3 h-3" /> {item.source}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RisksTab() {
  const risks = [
    {
      title: "Night Work Required",
      desc: "Tender specifies work between 10 PM - 6 AM for noise-sensitive areas. This will significantly increase labor costs.",
      badge: "Pricing Impact",
      bColor: "bg-emerald-500",
      source: "General Conditions.pdf • Page 8 • 4.2 Working Hours",
    },
    {
      title: "Liquidated Damages Clause",
      desc: "Daily penalty of $2,000 for delays beyond completion date. No grace period mentioned.",
      badge: "Contractual Requirement",
      bColor: "bg-[#059669]",
      source: "Contract Agreement.pdf • Page 27 • 11.4 Liquidated Damages",
    },
    {
      title: "Limited Site Access",
      desc: "Material delivery restricted to 2 hours daily (9-11 AM). This creates scheduling challenges.",
      badge: "Schedule Impact",
      bColor: "bg-emerald-500",
      source: "Site Instructions.pdf • Page 3 • 2.1 Site Access",
    },
    {
      title: "Material Approval Lead Time",
      desc: "All materials require architect approval with 14-day review period. Potential for rejection and resubmission.",
      badge: "Coordination Item",
      bColor: "bg-[#059669]",
      source: "Specifications.pdf • Page 6 • 1.5 Submittal Procedures",
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="space-y-1">
        <h2 className="text-2xl font-black text-gray-900 tracking-tight">
          Risks & Coordination Items
        </h2>
        <p className="text-gray-400 text-sm font-medium">
          Issues flagged from tender analysis
        </p>
      </div>
      <div className="space-y-4">
        {risks.map((risk, i) => (
          <div
            key={i}
            className="bg-red-50/20 border-l-4 border-red-500 rounded-2xl p-6 space-y-4"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <h3 className="font-black text-gray-900 text-lg">
                  {risk.title}
                </h3>
                <p className="text-gray-600 text-sm font-medium leading-relaxed">
                  {risk.desc}
                </p>
              </div>
              <span
                className={`px-3 py-1 ${risk.bColor} text-white rounded-lg text-[9px] font-black uppercase tracking-wider`}
              >
                {risk.badge}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-black text-gray-300 uppercase tracking-widest pt-2 border-t border-gray-100/50">
              <Paperclip className="w-3 h-3" /> {risk.source}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ClarificationsTab() {
  const items = [
    "Confirm exact working hours permitted for night work and any noise level restrictions",
    "Verify if temporary lighting and power are included or contractor-supplied",
    "Clarify responsibility for material storage - on-site or off-site required",
    "Confirm measurement method - is site verification allowed before final pricing?",
    "Verify coordination protocol with other trades (electrical, plumbing)",
  ];
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">
            Clarifications Needed
          </h2>
          <p className="text-gray-400 text-sm font-medium">
            Items requiring clarification from owner/architect
          </p>
        </div>
        <button className="bg-[#059669] h-10 px-6 rounded-xl font-bold text-white text-sm flex items-center gap-2 shadow-sm hover:bg-[#047857] transition-all">
          <Edit className="w-4 h-4" /> Edit
        </button>
      </div>
      <div className="space-y-4">
        {items.map((item, i) => (
          <div
            key={i}
            className="bg-emerald-50/20 border border-gray-100 rounded-2xl p-6 space-y-4"
          >
            <div className="flex gap-4">
              <span className="font-black text-[#059669] text-lg">
                {i + 1}.
              </span>
              <p className="font-bold text-gray-700 leading-relaxed">{item}</p>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-black text-gray-300 uppercase tracking-widest pl-8">
              <FileText className="w-3 h-3" /> General Conditions.pdf • Page 8 •
              4.2 Working Hours
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AssumptionsTab() {
  const items = [
    "Site access will be provided as per tender specifications (9-11 AM for deliveries)",
    "Temporary facilities (site office, storage, washrooms) provided by general contractor",
    "All substrates will be properly prepared and ready to receive finishes",
    "Utilities (power, water) will be available at no cost to contractor",
    "Building is weathertight and secure before finish work begins",
  ];
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">
            Assumptions
          </h2>
          <p className="text-gray-400 text-sm font-medium">
            Assumptions made based on tender documents
          </p>
        </div>
        <button className="bg-[#059669] h-10 px-6 rounded-xl font-bold text-white text-sm flex items-center gap-2 shadow-sm hover:bg-[#047857] transition-all">
          <Edit className="w-4 h-4" /> Edit
        </button>
      </div>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div
            key={i}
            className="bg-blue-50/20 border border-gray-50 rounded-2xl p-5 space-y-3"
          >
            <div className="flex items-center gap-4">
              <CheckCircle className="w-5 h-5 text-blue-500" />
              <p className="font-bold text-gray-700 text-sm">{item}</p>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-black text-gray-300 uppercase tracking-widest pl-9">
              <FileText className="w-3 h-3" /> General Conditions.pdf • Page 11
              • 5.1 Site Access
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ExclusionsTab() {
  const items = [
    "Electrical rough-in and fixture installation",
    "Plumbing rough-in and fixture installation",
    "HVAC ductwork and equipment installation",
    "Building permits and inspection fees (owner responsibility)",
    "Site security, hoarding, and temporary fencing",
  ];
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">
            Exclusions
          </h2>
          <p className="text-gray-400 text-sm font-medium">
            Items explicitly excluded from scope
          </p>
        </div>
        <button className="bg-[#059669] h-10 px-6 rounded-xl font-bold text-white text-sm flex items-center gap-2 shadow-sm hover:bg-[#047857] transition-all">
          <Edit className="w-4 h-4" /> Edit
        </button>
      </div>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div
            key={i}
            className="bg-red-50/20 border border-gray-50 rounded-2xl p-5 space-y-3"
          >
            <div className="flex items-center gap-4">
              <XCircle className="w-5 h-5 text-red-500" />
              <p className="font-bold text-gray-700 text-sm">{item}</p>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-black text-gray-300 uppercase tracking-widest pl-9">
              <FileText className="w-3 h-3" /> Scope of Work.pdf • Page 4 •
              Division 26 (Not Included)
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AddendaTab() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="space-y-1">
        <h2 className="text-2xl font-black text-gray-900 tracking-tight">
          Addenda Changes
        </h2>
        <p className="text-gray-400 text-sm font-medium">
          Changes issued through addenda
        </p>
      </div>
      {[
        {
          id: "01",
          date: "April 10, 2026",
          title: "Window Specification Changed",
          desc: "Changed from single-pane to double-glazed low-E glass",
          type: "Cost/Specs",
          div: "08",
          impact: "+$12,500",
        },
        {
          id: "02",
          date: "April 15, 2026",
          title: "Closing Date Extended",
          desc: "Bid closing date extended from April 28 to May 1, 2026",
          type: "Schedule",
          div: "All",
          impact: "None",
        },
      ].map((item, i) => (
        <div
          key={i}
          className="bg-emerald-50/20 border border-gray-100 rounded-[24px] p-8 space-y-8"
        >
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-[#059669] text-white rounded-lg text-[9px] font-black uppercase tracking-wider">
              Addendum {item.id}
            </span>
            <span className="text-gray-400 text-xs font-bold">{item.date}</span>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-black text-gray-900">{item.title}</h3>
            <p className="text-gray-500 font-medium">{item.desc}</p>
          </div>
          <div className="grid grid-cols-2 gap-12 border-t border-gray-100 pt-8">
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Impact Type
                </p>
                <span className="px-2 py-0.5 bg-white border border-gray-100 rounded text-[9px] font-bold">
                  {item.type}
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Affected Divisions
                </p>
                <span className="px-2 py-0.5 bg-[#059669] text-white rounded text-[9px] font-bold">
                  {item.div}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Scope Change
                </p>
                <p className="text-sm font-bold text-gray-800">Add</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Pricing Impact
                </p>
                <p className="text-sm font-black text-gray-900">
                  {item.impact}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-black text-gray-300 uppercase tracking-widest pt-2">
            <FileText className="w-3.5 h-3.5" /> Addendum_01.pdf • Page 2 • item
            3
          </div>
        </div>
      ))}
    </div>
  );
}

function QuoteDraftTab() {
  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="space-y-1">
        <h2 className="text-2xl font-black text-gray-900 tracking-tight">
          Suggested Quote Information
        </h2>
        <p className="text-gray-400 text-sm font-medium">
          Preliminary quote data for review
        </p>
      </div>

      <div className="bg-emerald-50/40 rounded-[24px] p-8 space-y-4">
        <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest">
          Recommended Lump Sum
        </h3>
        <div className="space-y-2">
          <p className="text-4xl font-black text-[#059669]">$485,000 + HST</p>
          <p className="text-xs text-gray-400 font-bold">
            Based on scope analysis and pricing factors
          </p>
        </div>
      </div>

      <div className="bg-gray-50/50 rounded-[24px] p-8 space-y-6">
        <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest">
          Division Breakdown
        </h3>
        <div className="space-y-4">
          {[
            { label: "Division 01 - General Requirements", val: "$72,750" },
            { label: "Division 06 - Wood & Plastics", val: "$121,250" },
            { label: "Division 08 - Openings", val: "$145,500" },
            { label: "Division 09 - Finishes", val: "$145,500" },
          ].map((row, i) => (
            <div
              key={i}
              className="flex justify-between items-center border-b border-gray-100 pb-4 last:border-0 last:pb-0"
            >
              <span className="text-sm font-bold text-gray-600">
                {row.label}
              </span>
              <span className="text-sm font-black text-gray-900">
                {row.val}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-blue-50/30 rounded-[24px] p-8 space-y-6">
        <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest">
          Additional Costs
        </h3>
        <div className="space-y-4">
          {[
            { label: "Night Work Premium (15%)", val: "$32,400" },
            { label: "Performance Bond (5%)", val: "$24,250" },
          ].map((row, i) => (
            <div key={i} className="flex justify-between items-center">
              <span className="text-sm font-bold text-gray-600">
                {row.label}
              </span>
              <span className="text-sm font-black text-gray-900">
                {row.val}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button className="bg-[#059669] h-12 px-8 rounded-xl font-black text-white text-sm flex items-center gap-2 shadow-lg shadow-emerald-100 hover:bg-[#047857] transition-all">
          Open Build Quote <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function SourcesTab() {
  const sources = [
    { name: "General Conditions.pdf", pages: 42, date: "Apr 20, 2026" },
    { name: "Technical Specifications.pdf", pages: 156, date: "Apr 20, 2026" },
    { name: "Contract Agreement.pdf", pages: 28, date: "Apr 20, 2026" },
    { name: "Instructions to Bidders.pdf", pages: 12, date: "Apr 20, 2026" },
    { name: "Addendum_01.pdf", pages: 3, date: "Apr 22, 2026" },
    { name: "Addendum_02.pdf", pages: 2, date: "Apr 24, 2026" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="space-y-1">
        <h2 className="text-2xl font-black text-gray-900 tracking-tight">
          Source Documents
        </h2>
        <p className="text-gray-400 text-sm font-medium">
          All documents analyzed by AI
        </p>
      </div>
      <div className="space-y-3">
        {sources.map((source, i) => (
          <div
            key={i}
            className="bg-emerald-50/20 border-l-4 border-[#059669] rounded-2xl p-6 flex justify-between items-center group hover:bg-emerald-50/40 transition-all"
          >
            <div className="space-y-1">
              <h3 className="font-black text-gray-900 text-base">
                {source.name}
              </h3>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
                {source.pages} pages • Uploaded {source.date}
              </p>
            </div>
            <div className="p-2 text-gray-300 group-hover:text-[#059669] transition-colors cursor-pointer">
              <ExternalLink className="w-5 h-5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
