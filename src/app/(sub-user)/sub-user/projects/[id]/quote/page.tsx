"use client";

import React, { useRef, useState } from "react";
import {
  ArrowLeft, Save, AlertCircle, Edit3, Plus, Trash2, Clock,
  ChevronDown, X, FileText, Download, Check, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useSaveProjectQuoteMutation } from "@/store/api/projectApi";
import { exportElementToPDF, exportQuoteToDocx } from "@/lib/exportUtils";

// ─── Types ────────────────────────────────────────────────────────────────────
interface SeparatePrice { id: string; title: string; price: string; description: string; scopeOfWork: string; assumptions: string; exclusions: string; }
interface UnitPrice { id: string; description: string; unit: string; unitPrice: string; estQty: string; notes: string; }

// ─── Editable Section ─────────────────────────────────────────────────────────
function EditableSection({
  title, subtitle, children, onEdit, isEditing, onSave, onCancel
}: {
  title: string; subtitle?: string; children: React.ReactNode;
  onEdit: () => void; isEditing: boolean; onSave: () => void; onCancel: () => void;
}) {
  return (
    <section className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-[16px] font-bold text-gray-900 dark:text-white">{title}</h2>
          {subtitle && <p className="text-[13px] text-gray-500">{subtitle}</p>}
        </div>
        {isEditing ? (
          <div className="flex items-center gap-2">
            <Button variant="primary" onClick={onSave} className="h-8 px-3 rounded-lg font-bold bg-emerald-600 hover:bg-emerald-700 text-white text-[12px] flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" /> Save
            </Button>
            <Button variant="secondary" onClick={onCancel} className="h-8 px-3 rounded-lg font-bold text-[12px] flex items-center gap-1.5">
              <X className="w-3.5 h-3.5" /> Cancel
            </Button>
          </div>
        ) : (
          <Button variant="primary" onClick={onEdit} className="h-8 px-4 rounded-lg font-bold bg-emerald-600 hover:bg-emerald-700 text-white text-[12px] flex items-center gap-2">
            <Edit3 className="w-3.5 h-3.5" /> Edit
          </Button>
        )}
      </div>
      {children}
    </section>
  );
}

// ─── Bullet List Display / Edit ───────────────────────────────────────────────
function BulletListSection({
  title, subtitle, items, setItems
}: {
  title: string; subtitle: string; items: string[]; setItems: (v: string[]) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(items.join("\n"));

  const handleSave = () => {
    setItems(draft.split("\n").map(s => s.trim()).filter(Boolean));
    setIsEditing(false);
  };

  return (
    <EditableSection title={title} subtitle={subtitle} isEditing={isEditing}
      onEdit={() => { setDraft(items.join("\n")); setIsEditing(true); }}
      onSave={handleSave}
      onCancel={() => setIsEditing(false)}
    >
      {isEditing ? (
        <textarea
          value={draft}
          onChange={e => setDraft(e.target.value)}
          rows={Math.max(5, items.length + 1)}
          className="w-full p-4 rounded-xl border border-emerald-300 dark:border-emerald-700 bg-transparent text-[13px] resize-y focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          placeholder="Enter each item on a new line..."
        />
      ) : (
        <div className="bg-gray-50/70 dark:bg-gray-800/50 rounded-xl p-5 border border-gray-100 dark:border-gray-800">
          <ul className="list-disc pl-4 space-y-1.5 text-[13px] text-gray-600 dark:text-gray-300">
            {items.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </div>
      )}
    </EditableSection>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function QuoteBuilderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const printRef = useRef<HTMLDivElement>(null);

  // ─── API ────────────────────────────────────────────────────────────────────
  const [saveQuote, { isLoading: isSaving }] = useSaveProjectQuoteMutation();
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [isExportingDocx, setIsExportingDocx] = useState(false);

  // ─── Form State ─────────────────────────────────────────────────────────────
  const [quoteNumber, setQuoteNumber] = useState("Q-2026-042");
  const [projectLocation, setProjectLocation] = useState("United States");
  const [projectName, setProjectName] = useState("Residential Complex");
  const [startDate, setStartDate] = useState("May 15, 2026");
  const [clientName, setClientName] = useState("Green Valley Developers Inc.");
  const [revisionNumber, setRevisionNumber] = useState("00");
  const [attention, setAttention] = useState("John Smith, Project Manager");
  const [bidClosingDate, setBidClosingDate] = useState("May 15, 2026");
  const [subject, setSubject] = useState("Interior Finishing - Divisions 06, 08, 09");
  const [gcName, setGcName] = useState("Prime Construction Ltd.");
  const [addendaIncluded, setAddendaIncluded] = useState("Addendum 01 (Window Spec Change), Addendum 02 (Closing Date Extension)");

  const [baseBidPrice, setBaseBidPrice] = useState("$485,000");
  const [hstPercentage, setHstPercentage] = useState("13%");
  const [currency, setCurrency] = useState("CAD");

  // Editable sections state
  const [scopeItems, setScopeItems] = useState([
    "Division 06 - Wood, Plastics & Composites: Supply and install solid core wooden doors (40 units), 1-3/4\" thick, pre-hung, with frames, paint-grade finish, Supply and install door hardware (40 sets)",
    "Division 08 - Openings: Install aluminum window frames with double glazing (85 sq.m), Low-E glass, thermally broken frames, white finish",
    "Division 09 - Finishes: Apply premium acrylic paint on interior walls (1,200 sq.m), Two coats, after proper surface preparation, Install porcelain floor tiles with grouting (850 sq.m)"
  ]);

  const [assumptionItems, setAssumptionItems] = useState([
    "Site access provided as per tender specifications (9-11 AM for deliveries)",
    "Temporary facilities (site office, storage, washrooms) provided by general contractor",
    "Work area will be cleaned and protected by other trades before installation",
    "All substrates properly prepared and ready to receive finishes",
    "Utilities (power, water) available at no cost to contractor",
    "Building is weathertight and secure before finish work begins",
    "Material storage area (minimum 200 sq.ft) provided on-site or nearby",
    "No hazardous materials or contamination in work areas",
    "Standard construction tolerances apply as per industry standards",
    "Shop drawings approval process will not exceed 14 business days",
  ]);

  const [exclusionItems, setExclusionItems] = useState([
    "Electrical rough-in and fixture installation",
    "Plumbing rough-in and fixture installation",
    "HVAC ductwork and equipment installation",
    "Fire protection systems and equipment",
    "Building permits and inspection fees (owner responsibility)",
    "Engineered drawings and structural calculations if required",
    "Site security, hoarding, and temporary fencing",
    "General site cleanup and waste disposal (except our trade waste)",
    "Mobilization costs for changes in schedule beyond our control",
    "Price escalation beyond 60 days from quote date",
    "Work on statutory holidays unless specifically agreed",
    "Repairs to existing damaged substrates or conditions",
  ]);

  const [clarificationItems, setClarificationItems] = useState([
    "Confirm exact working hours permitted for night work and noise restrictions",
    "Verify if temporary lighting and power are included or contractor-supplied",
    "Clarify responsibility for material storage - on-site or off-site required",
    "Confirm measurement method - is site verification allowed before final pricing?",
    "Verify coordination protocol with other trades (electrical, plumbing)",
    "Confirm inspection schedule and notice requirements",
    "Clarify warranty period and maintenance responsibilities post-completion",
  ]);

  // Separate Prices
  const [separatePrices, setSeparatePrices] = useState<SeparatePrice[]>([
    { id: "SP-01", title: "", price: "$15,000", description: "", scopeOfWork: "", assumptions: "", exclusions: "" }
  ]);

  // Alternative Prices
  const [altPrices, setAltPrices] = useState<{ id: string; title: string; price: string; description: string }[]>([
    { id: "ALT-01", title: "", price: "$8,000", description: "" }
  ]);

  // Unit Prices
  const [unitPrices, setUnitPrices] = useState<UnitPrice[]>([
    { id: "UP-01", description: "Additional wooden doors...", unit: "per unit", unitPrice: "$10,000", estQty: "5", notes: "Same specs as base bid..." }
  ]);

  // Commercial Terms
  const [paymentTerms, setPaymentTerms] = useState("Progress payments monthly based on work completed. Net 30 days from invoice date......");
  const [holdbackNote, setHoldbackNote] = useState("10% holdback will be retained as per Construction Act requirements until final completion and lien period expiry....");
  const [validityPeriod, setValidityPeriod] = useState("30 days");
  const [termsCurrency, setTermsCurrency] = useState("CAD");
  const [isEditingTerms, setIsEditingTerms] = useState(false);

  const [footerNotes, setFooterNotes] = useState("Thank you for considering our proposal. We look forward to working with you on this project......");

  // ─── Handlers ────────────────────────────────────────────────────────────────
  const [lastSaved, setLastSaved] = useState("14:30:52");
  const router = useRouter();

  const handleSaveDraft = async () => {
    try {
      const numericPrice = Number(baseBidPrice.replace(/[^0-9.-]+/g, ""));
      const payload = {
        quote: {
          projectName, 
          quoteNumber, 
          clientName, 
          baseBidPrice, 
          totalPrice: isNaN(numericPrice) ? 0 : numericPrice,
          hstPercentage, 
          currency,
          scopeOfWork: scopeItems,
          paymentTerms, 
          validityPeriod, 
          footerNotes,
        },
        status: "completed"
      };
      await saveQuote({ projectId: id, data: payload }).unwrap();
      const now = new Date();
      setLastSaved(`${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`);
      toast.success("Quote saved successfully!");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to save quote.");
    }
  };

  const handleSaveAndClose = async () => {
    await handleSaveDraft();
    router.push(`/sub-user/projects/${id}/results`);
  };

  const handleExportPDF = async () => {
    setIsExportingPDF(true);
    try {
      await exportElementToPDF("quote-printable", `quote-${quoteNumber}.pdf`);
      toast.success("PDF exported successfully!");
    } catch (err) {
      toast.error("Failed to export PDF. Please try again.");
    } finally {
      setIsExportingPDF(false);
    }
  };

  const handleExportDocx = async () => {
    setIsExportingDocx(true);
    try {
      await exportQuoteToDocx({
        companyName: "ABC Construction Ltd.",
        companyAddress: "123 Main Street, Toronto, ON M5V 3A8",
        projectName, clientName, quoteNumber,
        baseBidPrice, hstPercentage: hstPercentage.replace("%", ""), currency,
        scopeOfWork: scopeItems.join("\n"),
        assumptions: assumptionItems.join("\n"),
        exclusions: exclusionItems.join("\n"),
        clarifications: clarificationItems.join("\n"),
        paymentTerms, holdbackNote,
        validityPeriod, footerNotes,
      }, `quote-${quoteNumber}.docx`);
      toast.success("DOCX exported successfully!");
    } catch (err) {
      toast.error("Failed to export DOCX. Please try again.");
    } finally {
      setIsExportingDocx(false);
    }
  };

  // Separate prices helpers
  const addSeparatePrice = () => {
    setSeparatePrices(prev => [...prev, {
      id: `SP-${String(prev.length + 1).padStart(2, "0")}`, title: "", price: "$0",
      description: "", scopeOfWork: "", assumptions: "", exclusions: ""
    }]);
  };
  const removeSeparatePrice = (idx: number) => setSeparatePrices(prev => prev.filter((_, i) => i !== idx));
  const updateSeparatePrice = (idx: number, field: keyof SeparatePrice, value: string) => {
    setSeparatePrices(prev => prev.map((p, i) => i === idx ? { ...p, [field]: value } : p));
  };

  // Alt prices helpers
  const addAltPrice = () => {
    setAltPrices(prev => [...prev, { id: `ALT-${String(prev.length + 1).padStart(2, "0")}`, title: "", price: "$0", description: "" }]);
  };
  const removeAltPrice = (idx: number) => setAltPrices(prev => prev.filter((_, i) => i !== idx));

  // Unit prices helpers
  const addUnitPrice = () => {
    setUnitPrices(prev => [...prev, {
      id: `UP-${String(prev.length + 1).padStart(2, "0")}`, description: "", unit: "", unitPrice: "$0", estQty: "1", notes: ""
    }]);
  };
  const removeUnitPrice = (idx: number) => setUnitPrices(prev => prev.filter((_, i) => i !== idx));
  const updateUnitPrice = (idx: number, field: keyof UnitPrice, value: string) => {
    setUnitPrices(prev => prev.map((p, i) => i === idx ? { ...p, [field]: value } : p));
  };

  const inputCls = "w-full h-11 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-[13px] focus:outline-none focus:border-emerald-500";

  return (
    <div className="max-w-5xl mx-auto pb-24 space-y-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div>
          <Link href={`/sub-user/projects/${id}/results`} className="inline-flex items-center gap-1 text-[13px] font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white mb-2 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Analysis
          </Link>
          <h1 className="text-[24px] font-bold text-gray-900 dark:text-white leading-tight">Quote Builder</h1>
          <p className="text-[13px] text-gray-500 dark:text-gray-400 font-medium mt-1">{projectName} • {projectLocation}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-[13px] text-gray-500 font-medium">
            <Clock className="w-4 h-4" /> Last saved: {lastSaved}
          </div>
          <Button onClick={handleSaveDraft} disabled={isSaving} variant="primary"
            className="h-9 px-5 rounded-lg font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm">
            {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save
          </Button>
        </div>
      </div>

      {/* Warning Banner */}
      <div className="bg-orange-50/70 dark:bg-orange-900/10 border border-orange-200/60 dark:border-orange-800/50 rounded-xl p-4 flex gap-3">
        <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="text-[14px] font-bold text-orange-800 dark:text-orange-400 mb-1">Quote (AI-Generated) - For Estimator Review</h4>
          <p className="text-[13px] text-orange-700/80 dark:text-orange-300">This quote has been auto-generated by AI based on tender analysis. Please review and verify all information, pricing, and terms before submission.</p>
        </div>
      </div>

      {/* Printable area */}
      <div id="quote-printable" ref={printRef} className="space-y-6">

        {/* Company Information */}
        <section className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
          <div className="mb-4">
            <h2 className="text-[16px] font-bold text-gray-900 dark:text-white">Company Information</h2>
            <p className="text-[13px] text-gray-500">Auto-filled from your settings</p>
          </div>
          <div className="flex flex-col md:flex-row gap-12 text-[13px]">
            <div>
              <div className="font-bold text-gray-900 dark:text-white mb-1">ABC Construction Ltd.</div>
              <div className="text-gray-500">123 Main Street, Toronto, ON M5V 3A8</div>
            </div>
            <div className="space-y-1.5 text-gray-600 dark:text-gray-400 font-medium">
              <div className="flex gap-2"><span className="font-bold text-gray-900 dark:text-gray-200 w-16">Phone</span><span>: +1 (416) 555-0123</span></div>
              <div className="flex gap-2"><span className="font-bold text-gray-900 dark:text-gray-200 w-16">Email</span><span>: info@abcconstruction.com</span></div>
              <div className="flex gap-2"><span className="font-bold text-gray-900 dark:text-gray-200 w-16">Website</span><span>: www.abcconstruction.com</span></div>
              <div className="flex gap-2"><span className="font-bold text-gray-900 dark:text-gray-200 w-16">HST #</span><span>: 123456789 RT0001</span></div>
            </div>
          </div>
        </section>

        {/* Project & Quote Details */}
        <section className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
          <h2 className="text-[16px] font-bold text-gray-900 dark:text-white mb-6">Tender & Quote Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
            <div><label className="block text-[13px] font-bold text-gray-700 dark:text-gray-300 mb-1.5">Quote Number</label><input value={quoteNumber} onChange={e => setQuoteNumber(e.target.value)} className={inputCls} /></div>
            <div><label className="block text-[13px] font-bold text-gray-700 dark:text-gray-300 mb-1.5">Tender Location</label><input value={projectLocation} onChange={e => setProjectLocation(e.target.value)} className={inputCls} /></div>
            <div><label className="block text-[13px] font-bold text-gray-700 dark:text-gray-300 mb-1.5">Tender Name</label><input value={projectName} onChange={e => setProjectName(e.target.value)} className={inputCls} /></div>
            <div><label className="block text-[13px] font-bold text-gray-700 dark:text-gray-300 mb-1.5">Start Date</label><input value={startDate} onChange={e => setStartDate(e.target.value)} className={inputCls} /></div>
            <div><label className="block text-[13px] font-bold text-gray-700 dark:text-gray-300 mb-1.5">Client Name</label><input value={clientName} onChange={e => setClientName(e.target.value)} className={inputCls} /></div>
            <div><label className="block text-[13px] font-bold text-gray-700 dark:text-gray-300 mb-1.5">Revision Number</label><input value={revisionNumber} onChange={e => setRevisionNumber(e.target.value)} className={inputCls} /></div>
            <div><label className="block text-[13px] font-bold text-gray-700 dark:text-gray-300 mb-1.5">Attention</label><input value={attention} onChange={e => setAttention(e.target.value)} className={inputCls} /></div>
            <div><label className="block text-[13px] font-bold text-gray-700 dark:text-gray-300 mb-1.5">Bid Closing Date</label><input value={bidClosingDate} onChange={e => setBidClosingDate(e.target.value)} className={inputCls} /></div>
            <div className="md:col-span-2"><label className="block text-[13px] font-bold text-gray-700 dark:text-gray-300 mb-1.5">Subject</label><input value={subject} onChange={e => setSubject(e.target.value)} className={inputCls} /></div>
            <div className="md:col-span-2"><label className="block text-[13px] font-bold text-gray-700 dark:text-gray-300 mb-1.5">General Contractor Name</label><input value={gcName} onChange={e => setGcName(e.target.value)} className={inputCls} /></div>
            <div className="md:col-span-2"><label className="block text-[13px] font-bold text-gray-700 dark:text-gray-300 mb-1.5">Addenda Included</label><input value={addendaIncluded} onChange={e => setAddendaIncluded(e.target.value)} className={inputCls} /></div>
          </div>
        </section>

        {/* Pricing */}
        <section className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-[16px] font-bold text-gray-900 dark:text-white">Pricing</h2>
              <p className="text-[13px] text-gray-500">Choose pricing structure</p>
            </div>
            <Link href={`/sub-user/projects/${id}/quote/preview`}>
              <Button variant="primary" className="h-8 px-4 rounded-lg font-bold bg-emerald-600 hover:bg-emerald-700 text-white text-[12px]">
                Itemized Breakdown
              </Button>
            </Link>
          </div>
          <div className="space-y-5">
            <div><label className="block text-[13px] font-bold text-gray-700 dark:text-gray-300 mb-1.5">Base Bid Price ( CAD )</label><input value={baseBidPrice} onChange={e => setBaseBidPrice(e.target.value)} className={inputCls} /></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div><label className="block text-[13px] font-bold text-gray-700 dark:text-gray-300 mb-1.5">HST Percentage ( % )</label><input value={hstPercentage} onChange={e => setHstPercentage(e.target.value)} className={inputCls} /></div>
              <div><label className="block text-[13px] font-bold text-gray-700 dark:text-gray-300 mb-1.5">Currency</label><input value={currency} onChange={e => setCurrency(e.target.value)} className={inputCls} /></div>
            </div>
          </div>
        </section>

        {/* Scope of Work - Editable */}
        <BulletListSection
          title="Scope of Work"
          subtitle="Detailed description of work included in quote"
          items={scopeItems}
          setItems={setScopeItems}
        />

        {/* Assumptions - Editable */}
        <BulletListSection
          title="Assumptions"
          subtitle="Assumptions made in preparing this quote"
          items={assumptionItems}
          setItems={setAssumptionItems}
        />

        {/* Exclusions - Editable */}
        <BulletListSection
          title="Exclusions"
          subtitle="Items explicitly excluded from this quote"
          items={exclusionItems}
          setItems={setExclusionItems}
        />

        {/* Clarifications / Notes - Editable */}
        <BulletListSection
          title="Clarifications / Notes"
          subtitle="Additional clarifications and notes"
          items={clarificationItems}
          setItems={setClarificationItems}
        />

        {/* Separate Prices */}
        <section className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h2 className="text-[16px] font-bold text-gray-900 dark:text-white">Separate Prices</h2>
              <p className="text-[13px] text-gray-500">Additional items priced separately</p>
            </div>
            <div className="bg-emerald-50 text-emerald-700 text-[11px] font-bold px-3 py-1 rounded-full border border-emerald-100">Optional Section</div>
          </div>

          {separatePrices.map((sp, idx) => (
            <div key={sp.id} className="border border-gray-200 dark:border-gray-800 rounded-xl p-6">
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-3 w-1/2">
                  <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100 shrink-0">{sp.id}</span>
                  <input value={sp.title} onChange={e => updateSeparatePrice(idx, "title", e.target.value)} placeholder="Enter Title" className="flex-1 bg-transparent border border-gray-200 dark:border-gray-700 rounded-lg px-3 h-8 text-[13px] focus:outline-none focus:border-emerald-500" />
                </div>
                <div className="flex items-center gap-4">
                  <input value={sp.price} onChange={e => updateSeparatePrice(idx, "price", e.target.value)} className="w-24 text-right font-black text-gray-900 dark:text-white text-[16px] bg-transparent border-b border-gray-200 dark:border-gray-700 focus:outline-none focus:border-emerald-500" />
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                  <button onClick={() => removeSeparatePrice(idx)} className="text-red-400 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
              <input value={sp.description} onChange={e => updateSeparatePrice(idx, "description", e.target.value)} placeholder="Brief description..." className="w-full bg-transparent border border-gray-200 dark:border-gray-700 rounded-lg px-4 h-10 text-[13px] focus:outline-none focus:border-emerald-500 mb-4" />
              <div className="space-y-4">
                {(["scopeOfWork", "assumptions", "exclusions"] as const).map(field => (
                  <div key={field}>
                    <label className="block text-[13px] font-bold text-gray-700 dark:text-gray-300 mb-1.5 capitalize">{field === "scopeOfWork" ? "Scope of Work" : field.charAt(0).toUpperCase() + field.slice(1)}</label>
                    <textarea value={sp[field]} onChange={e => updateSeparatePrice(idx, field, e.target.value)} placeholder={`Enter ${field}...`} className="w-full h-16 p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-[13px] resize-none focus:outline-none focus:border-emerald-500" />
                  </div>
                ))}
              </div>
            </div>
          ))}

          <button onClick={addSeparatePrice} className="w-full h-11 bg-emerald-50/50 hover:bg-emerald-50 dark:bg-emerald-900/10 dark:hover:bg-emerald-900/20 text-emerald-700 dark:text-emerald-500 font-bold text-[13px] rounded-xl flex items-center justify-center gap-2 border border-emerald-100 dark:border-emerald-800/50 transition-colors">
            <Plus className="w-4 h-4" /> Add Separate Price
          </button>
        </section>

        {/* Alternative Prices */}
        <section className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h2 className="text-[16px] font-bold text-gray-900 dark:text-white">Alternative Prices</h2>
              <p className="text-[13px] text-gray-500">Alternative options for materials or methods</p>
            </div>
            <div className="bg-emerald-50 text-emerald-700 text-[11px] font-bold px-3 py-1 rounded-full border border-emerald-100">Optional Section</div>
          </div>

          {altPrices.map((ap, idx) => (
            <div key={ap.id} className="border border-gray-200 dark:border-gray-800 rounded-xl p-6">
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-3 w-1/2">
                  <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100 shrink-0">{ap.id}</span>
                  <input value={ap.title} onChange={e => setAltPrices(prev => prev.map((a, i) => i === idx ? { ...a, title: e.target.value } : a))} placeholder="Enter Title" className="flex-1 bg-transparent border border-gray-200 dark:border-gray-700 rounded-lg px-3 h-8 text-[13px] focus:outline-none focus:border-emerald-500" />
                </div>
                <div className="flex items-center gap-4">
                  <input value={ap.price} onChange={e => setAltPrices(prev => prev.map((a, i) => i === idx ? { ...a, price: e.target.value } : a))} className="w-24 text-right font-black text-gray-900 dark:text-white text-[16px] bg-transparent border-b border-gray-200 dark:border-gray-700 focus:outline-none focus:border-emerald-500" />
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                  <button onClick={() => removeAltPrice(idx)} className="text-red-400 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
              <input value={ap.description} onChange={e => setAltPrices(prev => prev.map((a, i) => i === idx ? { ...a, description: e.target.value } : a))} placeholder="Brief description..." className="w-full bg-transparent border border-gray-200 dark:border-gray-700 rounded-lg px-4 h-10 text-[13px] focus:outline-none focus:border-emerald-500" />
            </div>
          ))}

          <button onClick={addAltPrice} className="w-full h-11 bg-emerald-50/50 hover:bg-emerald-50 dark:bg-emerald-900/10 dark:hover:bg-emerald-900/20 text-emerald-700 dark:text-emerald-500 font-bold text-[13px] rounded-xl flex items-center justify-center gap-2 border border-emerald-100 dark:border-emerald-800/50 transition-colors">
            <Plus className="w-4 h-4" /> Add Alternative Price
          </button>
        </section>

        {/* Unit Prices */}
        <section className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h2 className="text-[16px] font-bold text-gray-900 dark:text-white">Unit Prices</h2>
              <p className="text-[13px] text-gray-500">Unit pricing for additional quantities</p>
            </div>
            <div className="bg-emerald-50 text-emerald-700 text-[11px] font-bold px-3 py-1 rounded-full border border-emerald-100">Optional Section</div>
          </div>

          <div className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
            <table className="w-full text-left text-[13px]">
              <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                <tr>
                  <th className="px-4 py-3 font-bold text-gray-900 dark:text-white">Item</th>
                  <th className="px-4 py-3 font-bold text-gray-900 dark:text-white">Description</th>
                  <th className="px-4 py-3 font-bold text-gray-900 dark:text-white">Unit</th>
                  <th className="px-4 py-3 font-bold text-gray-900 dark:text-white">Unit Price</th>
                  <th className="px-4 py-3 font-bold text-gray-900 dark:text-white">Est. Qty</th>
                  <th className="px-4 py-3 font-bold text-gray-900 dark:text-white">Notes</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-[#111827]">
                {unitPrices.map((up, idx) => (
                  <tr key={up.id}>
                    <td className="px-3 py-3"><div className="border border-gray-200 dark:border-gray-700 rounded-md px-3 h-9 flex items-center justify-center text-[12px] font-medium text-gray-600 bg-white dark:bg-gray-800">{up.id}</div></td>
                    <td className="px-3 py-3"><input value={up.description} onChange={e => updateUnitPrice(idx, "description", e.target.value)} className="w-full h-9 px-3 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-[13px] focus:outline-none focus:border-emerald-500" /></td>
                    <td className="px-3 py-3"><input value={up.unit} onChange={e => updateUnitPrice(idx, "unit", e.target.value)} className="w-full h-9 px-3 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-[13px] focus:outline-none focus:border-emerald-500" /></td>
                    <td className="px-3 py-3"><input value={up.unitPrice} onChange={e => updateUnitPrice(idx, "unitPrice", e.target.value)} className="w-full h-9 px-3 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-[13px] focus:outline-none focus:border-emerald-500" /></td>
                    <td className="px-3 py-3"><input value={up.estQty} onChange={e => updateUnitPrice(idx, "estQty", e.target.value)} className="w-full h-9 px-3 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-[13px] focus:outline-none focus:border-emerald-500" /></td>
                    <td className="px-3 py-3"><input value={up.notes} onChange={e => updateUnitPrice(idx, "notes", e.target.value)} className="w-full h-9 px-3 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-[13px] focus:outline-none focus:border-emerald-500" /></td>
                    <td className="px-3 py-3 text-center">
                      <button onClick={() => removeUnitPrice(idx)} className="w-7 h-7 rounded-md border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-400 hover:text-red-500 bg-white dark:bg-gray-800">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="p-3 bg-white dark:bg-[#111827]">
              <button onClick={addUnitPrice} className="w-full h-9 bg-emerald-50/50 hover:bg-emerald-50 dark:bg-emerald-900/10 dark:hover:bg-emerald-900/20 text-emerald-700 dark:text-emerald-500 font-bold text-[12px] rounded-lg flex items-center justify-center gap-1.5 border border-emerald-100 dark:border-emerald-800/50 transition-colors">
                <Plus className="w-3.5 h-3.5" /> Add Unit Price
              </button>
            </div>
          </div>
        </section>

        {/* Commercial Terms */}
        <section className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-[16px] font-bold text-gray-900 dark:text-white">Commercial Terms</h2>
              <p className="text-[13px] text-gray-500">Additional clarifications and notes</p>
            </div>
            {isEditingTerms ? (
              <div className="flex items-center gap-2">
                <Button variant="primary" onClick={() => setIsEditingTerms(false)} className="h-8 px-3 rounded-lg font-bold bg-emerald-600 hover:bg-emerald-700 text-white text-[12px] flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" /> Save
                </Button>
                <Button variant="secondary" onClick={() => setIsEditingTerms(false)} className="h-8 px-3 rounded-lg font-bold text-[12px] flex items-center gap-1.5">
                  <X className="w-3.5 h-3.5" /> Cancel
                </Button>
              </div>
            ) : (
              <Button variant="primary" onClick={() => setIsEditingTerms(true)} className="h-8 px-4 rounded-lg font-bold bg-emerald-600 hover:bg-emerald-700 text-white text-[12px] flex items-center gap-2">
                <Edit3 className="w-3.5 h-3.5" /> Edit
              </Button>
            )}
          </div>
          <div className="space-y-5">
            <div>
              <label className="block text-[13px] font-bold text-gray-700 dark:text-gray-300 mb-1.5">Payment Terms</label>
              {isEditingTerms ? (
                <textarea value={paymentTerms} onChange={e => setPaymentTerms(e.target.value)} rows={2} className="w-full p-3 rounded-xl border border-emerald-300 dark:border-emerald-700 bg-transparent text-[13px] resize-none focus:outline-none focus:border-emerald-500" />
              ) : (
                <div className="w-full min-h-[44px] px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-[13px] text-gray-700 dark:text-gray-300">{paymentTerms}</div>
              )}
            </div>
            <div>
              <label className="block text-[13px] font-bold text-gray-700 dark:text-gray-300 mb-1.5">Holdback Note</label>
              {isEditingTerms ? (
                <textarea value={holdbackNote} onChange={e => setHoldbackNote(e.target.value)} rows={2} className="w-full p-3 rounded-xl border border-emerald-300 dark:border-emerald-700 bg-transparent text-[13px] resize-none focus:outline-none focus:border-emerald-500" />
              ) : (
                <div className="w-full min-h-[44px] px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-[13px] text-gray-700 dark:text-gray-300">{holdbackNote}</div>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[13px] font-bold text-gray-700 dark:text-gray-300 mb-1.5">Validity Period (days)</label>
                <input value={validityPeriod} onChange={e => setValidityPeriod(e.target.value)} readOnly={!isEditingTerms} className={`${inputCls} ${!isEditingTerms ? "cursor-default" : ""}`} />
              </div>
              <div>
                <label className="block text-[13px] font-bold text-gray-700 dark:text-gray-300 mb-1.5">Currency</label>
                <input value={termsCurrency} onChange={e => setTermsCurrency(e.target.value)} readOnly={!isEditingTerms} className={`${inputCls} ${!isEditingTerms ? "cursor-default" : ""}`} />
              </div>
            </div>
          </div>
        </section>

        {/* Footer Notes */}
        <section className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
          <h2 className="text-[16px] font-bold text-gray-900 dark:text-white mb-4">Footer Notes</h2>
          <textarea value={footerNotes} onChange={e => setFooterNotes(e.target.value)} className="w-full h-20 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-[13px] text-gray-600 dark:text-gray-300 resize-none focus:outline-none focus:border-emerald-500" />
        </section>

        {/* Clarifications Required */}
        <div className="pt-4 pb-4">
          <h2 className="text-[16px] font-bold text-gray-900 dark:text-white mb-4">Clarifications Required</h2>
          <ul className="list-disc pl-4 space-y-2 text-[13px] font-medium text-[#787878] dark:text-emerald-400">
            <li>Confirm exact working hours permitted for night work</li>
            <li>Verify if temporary lighting and power are included</li>
            <li>Clarify material storage responsibility</li>
            <li>Confirm measurement method and site verification</li>
            <li>Verify coordination protocol with other trades</li>
            <li>Confirm inspection schedule and notice requirements</li>
          </ul>
        </div>

      </div>{/* end printable area */}

      {/* Preview & Export Quote */}
      <div className="bg-emerald-50/60 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/50 rounded-2xl p-6 shadow-sm mt-8">
        <h2 className="text-[16px] font-bold text-gray-900 dark:text-white mb-1">Preview & Export Quote</h2>
        <p className="text-[13px] text-gray-500 mb-6">Preview your quote before exporting with professional formatting</p>

        <div className="flex flex-wrap items-center gap-4">
          <Button onClick={handleSaveDraft} disabled={isSaving} variant="secondary" className="h-10 px-6 rounded-xl font-bold bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 text-[13px] hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm flex-1 sm:flex-none">
            {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />} Save Draft
          </Button>
          <Link href={`/sub-user/projects/${id}/quote/preview`} className="flex-1 sm:flex-none">
            <Button variant="secondary" className="w-full h-10 px-6 rounded-xl font-bold bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 text-[13px] hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm">
              <FileText className="w-4 h-4 mr-2" /> Preview Quote
            </Button>
          </Link>
          <Button onClick={handleExportPDF} disabled={isExportingPDF} variant="secondary" className="h-10 px-6 rounded-xl font-bold bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 text-[13px] hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm flex-1 sm:flex-none">
            {isExportingPDF ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />} Export PDF
          </Button>
          <Button onClick={handleExportDocx} disabled={isExportingDocx} variant="secondary" className="h-10 px-6 rounded-xl font-bold bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 text-[13px] hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm flex-1 sm:flex-none">
            {isExportingDocx ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <FileText className="w-4 h-4 mr-2" />} Export DOCX
          </Button>
          <Button onClick={handleSaveAndClose} disabled={isSaving} variant="primary" className="h-10 px-8 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white text-[13px] shadow-sm flex-1 sm:flex-none">
            Save & Close
          </Button>
        </div>
      </div>

    </div>
  );
}
