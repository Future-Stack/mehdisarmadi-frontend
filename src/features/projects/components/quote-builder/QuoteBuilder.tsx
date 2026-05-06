/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  Save,
  FileDown,
  FileText,
  Copy,
  X,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Edit2,
  Clock,
  ExternalLink,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { toast } from "sonner";
import { useRouter, useParams } from "next/navigation";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";

// --- Mock Data ---
const INITIAL_DATA = {
  quoteNumber: "Q-2026-042",
  projectLocation: "United States",
  projectName: "Residential Complex",
  startDate: "May 15, 2026",
  clientName: "Green Valley Developers Inc.",
  revisionNumber: "00",
  attention: "John Smith, Project Manager",
  bidClosingDate: "May 15, 2026",
  subject: "Interior Finishing - Divisions 06, 08, 09",
  gcName: "Prime Construction Ltd.",
  addendaIncluded:
    "Addendum 01 (Window Spec Change), Addendum 02 (Closing Date Extension)",
  baseBidPrice: "485,000",
  hstPercentage: "13%",
  currency: "CAD",
  scopeOfWork: [
    {
      division: "Division 06 - Wood, Plastics & Composites:",
      items: [
        "Supply and install solid core wooden doors (40 units)",
        '1-3/4" thick, pre-hung with frames, paint-grade finish',
        "Supply and install door hardware (40 sets)",
      ],
    },
    {
      division: "Division 08 - Openings:",
      items: [
        "Install aluminum window frames with double glazing (85 sq.m)",
        "Low-E glass, thermally broken frames, white finish",
      ],
    },
    {
      division: "Division 09 - Finishes:",
      items: [
        "Apply premium acrylic paint on interior walls (1,200 sq.m)",
        "Two coats, after proper surface preparation",
        "Install porcelain floor tiles with grouting (850 sq.m)",
        "600x600mm, non-slip finish, epoxy grout",
      ],
    },
  ],
  assumptions: [
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
  ],
  exclusions: [
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
  ],
  clarifications: [
    "Confirm exact working hours permitted for night work and noise restrictions",
    "Verify if temporary lighting and power are included or contractor-supplied",
    "Clarify responsibility for material storage - on-site or off-site required",
    "Confirm measurement method - is site verification allowed before final pricing?",
    "Verify coordination protocol with other trades (electrical, plumbing)",
    "Confirm inspection schedule and notice requirements",
    "Clarify warranty period and maintenance responsibilities post-completion",
  ],
  separatePrices: [
    {
      item: "SP-01",
      description: "Additional fire-rated .....",
      type: "Add",
      price: "$15,000",
      notes: "Per unit pricing available........",
    },
    {
      item: "SP-02",
      description: "Upgraded window ........",
      type: "Add",
      price: "$15,000",
      notes: "Low-E coating included........",
    },
  ],
  alternativePrices: [
    {
      item: "ALT-01",
      description: "Ceramic tiles instead .....",
      type: "Deduct",
      price: "$10,000",
      notes: "Same size and finish........",
    },
  ],
  unitPrices: [
    {
      item: "UP-01",
      description: "Additional wooden doors..",
      unit: "per unit",
      unitPrice: "$10,000",
      qty: "5",
      notes: "Same specs as base bid.....",
    },
  ],
  modalItems: [
    {
      name: "Wooden Doors",
      description: "Supply & install 40 units...",
      qty: "40",
      unitPrice: "$10,000",
      total: "$48,000",
    },
  ],
  commercialTerms: {
    paymentTerms:
      "Progress payments monthly based on work completed. Net 30 days from invoice date...........",
    holdback:
      "10% holdback will be retained as per Construction Act requirements until final completion and lien period expiry......",
    validity: "30 days",
    currency: "CAD",
  },
  footerNotes:
    "Thank you for considering our proposal. We look forward to working with you on this project...........",
};

export default function QuoteBuilder() {
  const router = useRouter();
  const [formData, setFormData] = useState(INITIAL_DATA);
  const [editingSections, setEditingSections] = useState<
    Record<string, boolean>
  >({});
  const [isAltModalOpen, setIsAltModalOpen] = useState(false);
  const [tempModalItems, setTempModalItems] = useState(INITIAL_DATA.modalItems);

  const toggleEdit = (sectionId: string) => {
    setEditingSections((prev) => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddSeparatePrice = () => {
    setFormData((prev) => ({
      ...prev,
      separatePrices: [
        ...prev.separatePrices,
        {
          item: `SP-0${prev.separatePrices.length + 1}`,
          description: "",
          type: "Add",
          price: "$0",
          notes: "",
        },
      ],
    }));
  };

  const handleAddAlternativePrice = () => {
    setFormData((prev) => ({
      ...prev,
      alternativePrices: [
        ...prev.alternativePrices,
        {
          item: `ALT-0${prev.alternativePrices.length + 1}`,
          description: "",
          type: "Add",
          price: "$0",
          notes: "",
        },
      ],
    }));
  };

  const handleAddUnitPrice = () => {
    setFormData((prev) => ({
      ...prev,
      unitPrices: [
        ...prev.unitPrices,
        {
          item: `UP-0${prev.unitPrices.length + 1}`,
          description: "",
          unit: "unit",
          unitPrice: "$0",
          qty: "0",
          notes: "",
        },
      ],
    }));
  };

  const handleOpenAltModal = () => {
    setTempModalItems([...formData.modalItems]);
    setIsAltModalOpen(true);
  };

  const handleAddModalItem = () => {
    setTempModalItems((prev) => [
      ...prev,
      { name: "", description: "", qty: "0", unitPrice: "$0", total: "$0" },
    ]);
  };

  const handleUpdateModalItem = (idx: number, field: string, value: string) => {
    const updated = [...tempModalItems];
    updated[idx] = { ...updated[idx], [field]: value };

    if (field === "qty" || field === "unitPrice") {
      const q = parseFloat(value.replace(/[^0-9.]/g, "")) || 0;
      const p = parseFloat(updated[idx].unitPrice.replace(/[^0-9.]/g, "")) || 0;
      updated[idx].total = `$${(q * p).toLocaleString()}`;
    }

    setTempModalItems(updated);
  };

  const handleSaveModalItems = () => {
    setFormData((prev) => ({ ...prev, modalItems: tempModalItems }));
    setIsAltModalOpen(false);
    toast.success("Items saved successfully");
  };

  const handleExportPDF = () => {
    const doc = new jsPDF() as any;
    doc.setFontSize(20);
    doc.text("QUOTE BUILDER", 105, 20, { align: "center" });
    doc.save("Quote.pdf");
    toast.success("PDF Exported!");
  };

  const handleExportDocx = async () => {
    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              children: [new TextRun({ text: "Quote Builder", bold: true })],
            }),
          ],
        },
      ],
    });
    const blob = await Packer.toBlob(doc);
    saveAs(blob, "Quote.docx");
    toast.success("DOCX Exported!");
  };

  const handleCopyQuote = () => {
    navigator.clipboard.writeText(JSON.stringify(formData, null, 2));
    toast.success("Quote copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#ECFDF5] to-white dark:from-emerald-950/20 dark:to-[#0B0F1A] transition-colors duration-300">
      {/* Header Bar */}
      <div className=" ">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between">
          <div className="space-y-4">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-xs font-black text-gray-900 dark:text-gray-100 hover:text-[#059669] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Analysis
            </button>
            <div className="space-y-1">
              <h1 className="text-3xl font-black text-[#1F2937] dark:text-white tracking-tight">
                Quote Builder
              </h1>
              <p className="text-gray-400 dark:text-gray-500 text-xs font-bold uppercase tracking-widest">
                Residential Complex <span className="text-gray-200 dark:text-gray-800">•</span>{" "}
                united states
              </p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-gray-400 text-xs font-bold">
              <Clock className="w-4 h-4" /> Last saved: 14:30:52
            </div>
            <button className="bg-[#059669] text-white h-11 px-6 rounded-xl font-black text-xs flex items-center gap-2 shadow-lg shadow-emerald-100 hover:bg-[#047857] transition-all">
              <Save className="w-4 h-4" /> Save Draft
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-8 py-8 space-y-8">
        {/* AI Banner */}
        <div className="bg-[#FFF7ED] dark:bg-orange-950/10 border border-[#FFEDD5] dark:border-orange-900/30 rounded-2xl p-6 flex items-start gap-4 transition-colors">
          <div className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-sm">
            <AlertCircle className="w-5 h-5 text-[#F97316]" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-black text-[#9A3412] dark:text-orange-400">
              Draft Quote (AI-Generated) - For Estimator Review
            </h3>
            <p className="text-[#9A3412] dark:text-orange-300/80 text-sm font-medium opacity-80">
              This quote has been auto-generated by AI based on tender analysis.
              Please review and verify all information, pricing, and terms
              before submission.
            </p>
          </div>
        </div>

        {/* Company Information */}
        <section className="bg-white dark:bg-[#111827] rounded-[32px] border border-gray-100 dark:border-gray-800 p-8 shadow-sm space-y-8 transition-colors duration-300">
          <div className="space-y-1 border-b border-gray-50 dark:border-gray-800 pb-6">
            <h2 className="text-lg font-black text-[#1F2937] dark:text-gray-100">
              Company Information
            </h2>
            <p className="text-gray-400 dark:text-gray-500 text-xs font-bold">
              Auto-filled from your settings
            </p>
          </div>
          <div className="grid grid-cols-2 gap-x-20 gap-y-8">
            <div className="space-y-6">
              <div className="space-y-1">
                <p className="text-sm font-black text-[#1F2937]">
                  ABC Construction Ltd.
                </p>
                <p className="text-sm text-gray-500 font-medium leading-relaxed">
                  123 Main Street, Toronto, ON M5V 3A8
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <InfoRow label="Phone" value="+1 (416) 555-0123" />
              <InfoRow label="Email" value="info@abcconstruction.com" />
              <InfoRow label="Website" value="www.abcconstruction.com" />
              <InfoRow label="HST #" value="123456789 RT0001" />
            </div>
          </div>
        </section>

        {/* Project & Quote Details */}
        <section className="bg-white dark:bg-[#111827] rounded-[32px] border border-gray-100 dark:border-gray-800 p-8 shadow-sm space-y-8 transition-colors duration-300">
          <h2 className="text-lg font-black text-[#1F2937] dark:text-gray-100">
            Project & Quote Details
          </h2>
          <div className="grid grid-cols-2 gap-x-8 gap-y-6">
            <FigmaInput label="Quote Number" value={formData.quoteNumber} />
            <FigmaInput
              label="Project Location"
              value={formData.projectLocation}
            />
            <FigmaInput label="Project Name" value={formData.projectName} />
            <FigmaInput label="Stat Date" value={formData.startDate} />
            <FigmaInput label="Client Name" value={formData.clientName} />
            <FigmaInput
              label="Revision Number"
              value={formData.revisionNumber}
            />
            <FigmaInput label="Attention" value={formData.attention} />
            <FigmaInput
              label="Bid Closing Date"
              value={formData.bidClosingDate}
            />
            <div className="col-span-2">
              <FigmaInput label="Subject" value={formData.subject} />
            </div>
            <div className="col-span-2">
              <FigmaInput
                label="General Contractor Name"
                value={formData.gcName}
              />
            </div>
            <div className="col-span-2">
              <FigmaInput
                label="Addenda Included"
                value={formData.addendaIncluded}
              />
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="bg-white dark:bg-[#111827] rounded-[32px] border border-gray-100 dark:border-gray-800 p-8 shadow-sm space-y-8 transition-colors duration-300">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h2 className="text-lg font-black text-[#1F2937] dark:text-gray-100">Pricing</h2>
              <p className="text-gray-400 dark:text-gray-500 text-xs font-bold">
                Choose pricing structure
              </p>
            </div>
            <button className="bg-[#059669] text-white h-9 px-4 rounded-lg font-black text-[10px] uppercase tracking-wider">
              Itemized Breakdown
            </button>
          </div>
          <div className="space-y-6">
            <FigmaInput
              label="Base Bid Price ( CED )"
              value={`$${formData.baseBidPrice}`}
            />
            <div className="grid grid-cols-2 gap-8">
              <FigmaInput
                label="HST Percentage ( % )"
                value={formData.hstPercentage}
              />
              <FigmaInput label="Currency" value={formData.currency} />
            </div>
          </div>
        </section>

        {/* Scope of Work */}
        <ListCard
          title="Scope of Work"
          subtext="Detailed description of work included in quote"
          isEditing={editingSections["scope"]}
          onToggleEdit={() => toggleEdit("scope")}
        >
          {editingSections["scope"] ? (
            <textarea
              className="w-full h-64 bg-white border border-gray-200 rounded-2xl p-6 text-sm font-medium focus:ring-2 focus:ring-[#059669]"
              defaultValue={JSON.stringify(formData.scopeOfWork, null, 2)}
            />
          ) : (
            <div className="space-y-8">
              {formData.scopeOfWork.map((section, idx) => (
                <div key={idx} className="space-y-3">
                  <h4 className="text-sm font-black text-[#1F2937]">
                    {section.division}
                  </h4>
                  <ul className="space-y-2 pl-4">
                    {section.items.map((item, i) => (
                      <li
                        key={i}
                        className="text-sm text-gray-500 dark:text-gray-400 font-medium list-disc ml-2"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </ListCard>

        {/* Assumptions */}
        <ListCard
          title="Assumptions"
          subtext="Assumptions made in preparing this quote"
          isEditing={editingSections["assumptions"]}
          onToggleEdit={() => toggleEdit("assumptions")}
        >
          {editingSections["assumptions"] ? (
            <textarea
              className="w-full h-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 text-sm font-medium dark:text-gray-200 focus:ring-2 focus:ring-[#059669]"
              defaultValue={formData.assumptions.join("\n")}
            />
          ) : (
            <ul className="space-y-2 pl-4">
              {formData.assumptions.map((item, i) => (
                <li
                  key={i}
                  className="text-sm text-gray-500 font-medium list-disc ml-2"
                >
                  {item}
                </li>
              ))}
            </ul>
          )}
        </ListCard>

        {/* Exclusions */}
        <ListCard
          title="Exclusions"
          subtext="Items explicitly excluded from this quote"
          isEditing={editingSections["exclusions"]}
          onToggleEdit={() => toggleEdit("exclusions")}
        >
          {editingSections["exclusions"] ? (
            <textarea
              className="w-full h-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 text-sm font-medium dark:text-gray-200 focus:ring-2 focus:ring-[#059669]"
              defaultValue={formData.exclusions.join("\n")}
            />
          ) : (
            <ul className="space-y-2 pl-4">
              {formData.exclusions.map((item, i) => (
                <li
                  key={i}
                  className="text-sm text-gray-500 font-medium list-disc ml-2"
                >
                  {item}
                </li>
              ))}
            </ul>
          )}
        </ListCard>

        {/* Clarifications / Notes */}
        <ListCard
          title="Clarifications / Notes"
          subtext="Additional clarifications and notes"
          isEditing={editingSections["clarifications"]}
          onToggleEdit={() => toggleEdit("clarifications")}
        >
          {editingSections["clarifications"] ? (
            <textarea
              className="w-full h-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 text-sm font-medium dark:text-gray-200 focus:ring-2 focus:ring-[#059669]"
              defaultValue={formData.clarifications.join("\n")}
            />
          ) : (
            <ul className="space-y-2 pl-4">
              {formData.clarifications.map((item, i) => (
                <li
                  key={i}
                  className="text-sm text-gray-500 font-medium list-disc ml-2"
                >
                  {item}
                </li>
              ))}
            </ul>
          )}
        </ListCard>

        {/* Separate Prices Table */}
        <TableCard
          title="Separate Prices"
          subtext="Additional items priced separately"
          badge="Optional Section"
        >
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">
                <th className="pb-4 px-6 w-32">Item</th>
                <th className="pb-4 px-6">Description</th>
                <th className="pb-4 px-6 w-32">Type</th>
                <th className="pb-4 px-6 w-40">Price</th>
                <th className="pb-4 px-6">Notes</th>
                <th className="pb-4 px-6 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {formData.separatePrices?.map((row, idx) => (
                <tr key={idx}>
                  <td className="py-4 px-6">
                    <Input
                      value={row.item}
                      className="h-10 text-xs rounded-xl"
                      onChange={() => {}}
                    />
                  </td>
                  <td className="py-4 px-6">
                    <Input
                      value={row.description}
                      className="h-10 text-xs rounded-xl"
                      onChange={() => {}}
                    />
                  </td>
                  <td className="py-4 px-6">
                    <div className="relative">
                      <Input
                        value={row.type}
                        className="h-10 text-xs rounded-xl pr-8"
                        onChange={() => {}}
                      />
                      <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <Input
                      value={row.price}
                      className="h-10 text-xs rounded-xl font-bold"
                      onChange={() => {}}
                    />
                  </td>
                  <td className="py-4 px-6">
                    <Input
                      value={row.notes}
                      className="h-10 text-xs rounded-xl"
                      onChange={() => {}}
                    />
                  </td>
                  <td className="py-4 px-6">
                    <X className="w-4 h-4 text-gray-200 hover:text-red-500 cursor-pointer" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            onClick={handleAddSeparatePrice}
            className="w-full py-3 bg-[#F0FDF4] dark:bg-emerald-900/10 border border-dashed border-[#059669]/20 dark:border-emerald-900/30 rounded-xl text-[#059669] dark:text-emerald-400 font-black text-[10px] uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#DCFCE7] dark:hover:bg-emerald-900/20 transition-all"
          >
            <Plus className="w-3.5 h-3.5" /> Add Separate Price
          </button>
        </TableCard>

        {/* Alternative Prices (Lump Sum style) */}
        <TableCard
          title="Alternative Prices"
          subtext="Alternative options for materials or methods"
          badge="Optional Section"
        >
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest border-b border-gray-50 dark:border-gray-800">
                <th className="pb-4 px-6 w-32">Item</th>
                <th className="pb-4 px-6">Description</th>
                <th className="pb-4 px-6 w-32">Type</th>
                <th className="pb-4 px-6 w-40">Price</th>
                <th className="pb-4 px-6">Notes</th>
                <th className="pb-4 px-6 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {formData.alternativePrices?.map((row, idx) => (
                <tr key={idx}>
                  <td className="py-4 px-6">
                    <Input
                      value={row.item}
                      className="h-10 text-xs rounded-xl"
                      onChange={() => {}}
                    />
                  </td>
                  <td className="py-4 px-6">
                    <Input
                      value={row.description}
                      className="h-10 text-xs rounded-xl"
                      onChange={() => {}}
                    />
                  </td>
                  <td className="py-4 px-6">
                    <div className="relative">
                      <Input
                        value={row.type}
                        className="h-10 text-xs rounded-xl pr-8"
                        onChange={() => {}}
                      />
                      <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <Input
                      value={row.price}
                      className="h-10 text-xs rounded-xl font-bold"
                      onChange={() => {}}
                    />
                  </td>
                  <td className="py-4 px-6">
                    <Input
                      value={row.notes}
                      className="h-10 text-xs rounded-xl"
                      onChange={() => {}}
                    />
                  </td>
                  <td className="py-4 px-6">
                    <X className="w-4 h-4 text-gray-200 hover:text-red-500 cursor-pointer" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            onClick={handleAddAlternativePrice}
            className="w-full py-3 bg-[#F0FDF4] dark:bg-emerald-900/10 border border-dashed border-[#059669]/20 dark:border-emerald-900/30 rounded-xl text-[#059669] dark:text-emerald-400 font-black text-[10px] uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#DCFCE7] dark:hover:bg-emerald-900/20 transition-all"
          >
            <Plus className="w-3.5 h-3.5" /> Add Alternative Price
          </button>
        </TableCard>

        {/* Alternative Prices (Unit Price style) */}
        <TableCard
          title="Alternative Prices"
          subtext="Alternative options for materials or methods"
          badge="Optional Section"
        >
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest border-b border-gray-50 dark:border-gray-800">
                <th className="pb-4 px-6 w-32">Item</th>
                <th className="pb-4 px-6">Description</th>
                <th className="pb-4 px-6 w-32 text-center">Unit</th>
                <th className="pb-4 px-6 w-32">Unit Price</th>
                <th className="pb-4 px-6 w-24 text-center">Est. Qty</th>
                <th className="pb-4 px-6">Notes</th>
                <th className="pb-4 px-6 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {formData.unitPrices?.map((row, idx) => (
                <tr key={idx}>
                  <td className="py-4 px-6">
                    <Input
                      value={row.item}
                      className="h-10 text-xs rounded-xl"
                      onChange={() => {}}
                    />
                  </td>
                  <td className="py-4 px-6">
                    <Input
                      value={row.description}
                      className="h-10 text-xs rounded-xl"
                      onChange={() => {}}
                    />
                  </td>
                  <td className="py-4 px-6">
                    <Input
                      value={row.unit}
                      className="h-10 text-xs rounded-xl text-center"
                      onChange={() => {}}
                    />
                  </td>
                  <td className="py-4 px-6">
                    <Input
                      value={row.unitPrice}
                      className="h-10 text-xs rounded-xl font-bold"
                      onChange={() => {}}
                    />
                  </td>
                  <td className="py-4 px-6">
                    <Input
                      value={row.qty}
                      className="h-10 text-xs rounded-xl text-center"
                      onChange={() => {}}
                    />
                  </td>
                  <td className="py-4 px-6">
                    <Input
                      value={row.notes}
                      className="h-10 text-xs rounded-xl"
                      onChange={() => {}}
                    />
                  </td>
                  <td className="py-4 px-6">
                    <X className="w-4 h-4 text-gray-200 hover:text-red-500 cursor-pointer" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            onClick={handleAddUnitPrice}
            className="w-full py-3 bg-[#F0FDF4] dark:bg-emerald-900/10 border border-dashed border-[#059669]/20 dark:border-emerald-900/30 rounded-xl text-[#059669] dark:text-emerald-400 font-black text-[10px] uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#DCFCE7] dark:hover:bg-emerald-900/20 transition-all"
          >
            <Plus className="w-3.5 h-3.5" /> Add Unit Price
          </button>
        </TableCard>

        {/* Modal Builder Section */}
        <section className="bg-[#F0FDF4] dark:bg-emerald-900/10 rounded-[32px] border border-[#059669]/10 dark:border-emerald-900/20 p-8 shadow-sm flex flex-col gap-6 transition-colors duration-300">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h2 className="text-lg font-black text-[#065F46] dark:text-emerald-400">
                Advanced Alternative Builder
              </h2>
              <p className="text-emerald-600/60 dark:text-emerald-500/60 text-xs font-bold">
                Use this builder for complex itemized alternatives
              </p>
            </div>
            <button
              onClick={handleOpenAltModal}
              className="bg-[#059669] text-white h-11 px-6 rounded-xl font-black text-xs flex items-center gap-2 shadow-lg shadow-emerald-100 dark:shadow-none hover:bg-[#047857] transition-all"
            >
              <ExternalLink className="w-4 h-4" /> Open Modal Builder
            </button>
          </div>
        </section>

        {/* Alternative Price Modal */}
        <Modal
          open={isAltModalOpen}
          onClose={() => setIsAltModalOpen(false)}
          size="full"
        >
          <div className="space-y-8 py-4">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <h2 className="text-2xl font-black text-[#1F2937] dark:text-white">
                  Alternative Prices
                </h2>
                <p className="text-gray-400 dark:text-gray-500 text-xs font-bold">
                  Alternative options for materials or methods
                </p>
              </div>
              <button className="bg-[#059669] text-white h-9 px-4 rounded-lg font-black text-[10px] uppercase tracking-wider transition-all hover:bg-[#047857]">
                Itemized Breakdown
              </button>
            </div>

            <div className="border border-gray-100 dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm transition-colors">
              <table className="w-full text-left">
                <thead className="bg-gray-50/50 dark:bg-gray-900/50">
                  <tr className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                    <th className="py-4 px-6">Item Name</th>
                    <th className="py-4 px-6">Description</th>
                    <th className="py-4 px-6 w-24 text-center">Qty</th>
                    <th className="py-4 px-6 w-32">Unit Price</th>
                    <th className="py-4 px-6 w-32 text-right">Total</th>
                    <th className="py-4 px-6 w-12"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                  {tempModalItems.map((row, idx) => (
                    <tr key={idx}>
                      <td className="py-4 px-6">
                        <Input
                          value={row.name}
                          className="h-10 text-xs rounded-xl border-gray-100 focus:border-[#059669]"
                          onChange={(e) =>
                            handleUpdateModalItem(idx, "name", e.target.value)
                          }
                        />
                      </td>
                      <td className="py-4 px-6">
                        <Input
                          value={row.description}
                          className="h-10 text-xs rounded-xl border-gray-100 focus:border-[#059669]"
                          placeholder="Supply & install 40 units..."
                          onChange={(e) =>
                            handleUpdateModalItem(
                              idx,
                              "description",
                              e.target.value,
                            )
                          }
                        />
                      </td>
                      <td className="py-4 px-6">
                        <Input
                          value={row.qty}
                          className="h-10 text-xs rounded-xl text-center border-gray-100 focus:border-[#059669]"
                          onChange={(e) =>
                            handleUpdateModalItem(idx, "qty", e.target.value)
                          }
                        />
                      </td>
                      <td className="py-4 px-6">
                        <Input
                          value={row.unitPrice}
                          className="h-10 text-xs rounded-xl border-gray-100 focus:border-[#059669]"
                          onChange={(e) =>
                            handleUpdateModalItem(
                              idx,
                              "unitPrice",
                              e.target.value,
                            )
                          }
                        />
                      </td>
                      <td className="py-4 px-6 text-right">
                        <Input
                          value={row.total}
                          readOnly
                          className="h-10 text-xs rounded-xl border-gray-50 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-right font-black text-[#059669] dark:text-emerald-400"
                          onChange={() => {}}
                        />
                      </td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() =>
                            setTempModalItems((prev) =>
                              prev.filter((_, i) => i !== idx),
                            )
                          }
                          className="p-2 text-gray-200 hover:text-red-500 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button
                onClick={handleAddModalItem}
                className="w-full py-3 bg-[#F0FDF4]/50 dark:bg-emerald-900/10 text-[#059669] dark:text-emerald-400 font-black text-[10px] uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#F0FDF4] dark:hover:bg-emerald-900/20 transition-all"
              >
                <Plus className="w-3.5 h-3.5" /> Add Item
              </button>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest block">
                  HST Percentage ( % )
                </label>
                <Input
                  value={formData.hstPercentage}
                  className="h-12 border-gray-100 dark:border-gray-800 rounded-xl"
                  onChange={() => {}}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest block">
                  Currency
                </label>
                <Input
                  value={formData.currency}
                  className="h-12 border-gray-100 dark:border-gray-800 rounded-xl"
                  onChange={() => {}}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
              <button
                onClick={() => setIsAltModalOpen(false)}
                className="h-12 px-8 rounded-xl font-black text-xs text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveModalItems}
                className="bg-[#059669] text-white h-12 px-8 rounded-xl font-black text-xs shadow-lg shadow-emerald-100 dark:shadow-none hover:bg-[#047857] transition-all"
              >
                Save Changes
              </button>
            </div>
          </div>
        </Modal>

        {/* Commercial Terms */}
        <section className="bg-white dark:bg-[#111827] rounded-[32px] border border-gray-100 dark:border-gray-800 p-8 shadow-sm space-y-8 transition-colors duration-300">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h2 className="text-lg font-black text-[#1F2937] dark:text-gray-100">
                Commercial Terms
              </h2>
              <p className="text-gray-400 dark:text-gray-500 text-xs font-bold">
                Additional clarifications and notes
              </p>
            </div>
            <button
              onClick={() => toggleEdit("commercial")}
              className="bg-[#059669] text-white h-9 px-4 rounded-lg font-black text-[10px] uppercase tracking-wider flex items-center gap-2 transition-all hover:bg-[#047857]"
            >
              <Edit2 className="w-3 h-3" />{" "}
              {editingSections["commercial"] ? "Save" : "Edit"}
            </button>
          </div>
          <div className="space-y-6">
            {editingSections["commercial"] ? (
              <>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest block transition-colors">
                    Payment Terms
                  </label>
                  <textarea
                    className="w-full h-24 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-800 rounded-xl p-4 text-sm font-medium dark:text-gray-200"
                    defaultValue={formData.commercialTerms.paymentTerms}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest block transition-colors">
                    Holdback Note
                  </label>
                  <textarea
                    className="w-full h-24 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-800 rounded-xl p-4 text-sm font-medium dark:text-gray-200"
                    defaultValue={formData.commercialTerms.holdback}
                  />
                </div>
              </>
            ) : (
              <>
                <FigmaInput
                  label="Payment Terms"
                  value={formData.commercialTerms.paymentTerms}
                />
                <FigmaInput
                  label="Holdback Note"
                  value={formData.commercialTerms.holdback}
                />
              </>
            )}
            <div className="grid grid-cols-2 gap-8">
              <FigmaInput
                label="Validity Period (days)"
                value={formData.commercialTerms.validity}
              />
              <FigmaInput
                label="Currency"
                value={formData.commercialTerms.currency}
              />
            </div>
          </div>
        </section>

        {/* Footer Notes */}
        <section className="bg-white dark:bg-[#111827] rounded-[32px] border border-gray-100 dark:border-gray-800 p-8 shadow-sm space-y-4 transition-colors duration-300">
          <h2 className="text-lg font-black text-[#1F2937] dark:text-gray-100">Footer Notes</h2>
          <textarea
            value={formData.footerNotes}
            onChange={(e) => handleInputChange("footerNotes", e.target.value)}
            className="w-full h-32 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 text-sm font-medium text-gray-500 dark:text-gray-400 focus:outline-none focus:ring-4 focus:ring-[#059669]/5 focus:border-[#059669] transition-all resize-none"
          />
        </section>

        {/* Export Quote Bar */}
        <div className="max-w-[1200px] mx-auto grid grid-cols-4 gap-4">
          <ExportButton
            icon={Copy}
            label="Copy Full Quote"
            onClick={handleCopyQuote}
          />
          <ExportButton
            icon={FileDown}
            label="Export PDF"
            onClick={handleExportPDF}
          />
          <ExportButton
            icon={FileText}
            label="Export DOCX"
            onClick={handleExportDocx}
          />
          <button
            onClick={() => {
              toast.success("Quote saved successfully!");
              router.push("/");
            }}
            className="bg-[#059669] text-white h-14 rounded-2xl font-black text-sm flex items-center justify-center gap-3 shadow-xl shadow-emerald-100 dark:shadow-none hover:bg-[#047857] transition-all active:scale-95"
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Sub-components ---

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-4 items-baseline">
      <span className="text-xs font-black text-gray-900 dark:text-gray-100 w-20 transition-colors">{label}</span>
      <span className="text-xs text-gray-400 dark:text-gray-600 font-bold whitespace-nowrap">
        :
      </span>
      <span className="text-sm text-gray-500 dark:text-gray-400 font-medium transition-colors">{value}</span>
    </div>
  );
}

function FigmaInput({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest block transition-colors">
        {label}
      </label>
      <Input
        value={value}
        readOnly
        className="h-12 bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-800 rounded-xl text-sm font-medium text-[#1F2937] dark:text-gray-100 focus:border-[#059669] focus:ring-0 transition-all px-6"
        onChange={() => {}}
      />
    </div>
  );
}

function ListCard({
  title,
  subtext,
  children,
  isEditing,
  onToggleEdit,
}: {
  title: string;
  subtext: string;
  children: React.ReactNode;
  isEditing?: boolean;
  onToggleEdit?: () => void;
}) {
  return (
    <section className="bg-white dark:bg-[#111827] rounded-[32px] border border-gray-100 dark:border-gray-800 p-8 shadow-sm space-y-8 transition-colors duration-300">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h2 className="text-lg font-black text-[#1F2937] dark:text-gray-100">{title}</h2>
          <p className="text-gray-400 dark:text-gray-500 text-xs font-bold">{subtext}</p>
        </div>
        {onToggleEdit && (
          <button
            onClick={onToggleEdit}
            className="bg-[#059669] text-white h-9 px-4 rounded-lg font-black text-[10px] uppercase tracking-wider flex items-center gap-2 transition-all hover:bg-[#047857] shadow-sm dark:shadow-none"
          >
            <Edit2 className="w-3 h-3" /> {isEditing ? "Save" : "Edit"}
          </button>
        )}
      </div>
      <div className="bg-[#F9FAFB] dark:bg-gray-900/50 rounded-[24px] p-8 border border-gray-50 dark:border-gray-800 transition-colors">
        {children}
      </div>
    </section>
  );
}

function TableCard({
  title,
  subtext,
  badge,
  children,
}: {
  title: string;
  subtext: string;
  badge: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-white dark:bg-[#111827] rounded-[32px] border border-gray-100 dark:border-gray-800 p-8 shadow-sm space-y-8 transition-colors duration-300">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h2 className="text-lg font-black text-[#1F2937] dark:text-gray-100">{title}</h2>
          <p className="text-gray-400 dark:text-gray-500 text-xs font-bold">{subtext}</p>
        </div>
        <div className="px-3 py-1 bg-[#F0FDF4] dark:bg-emerald-900/20 text-[#059669] dark:text-emerald-400 rounded-lg text-[9px] font-black uppercase tracking-wider">
          {badge}
        </div>
      </div>
      <div className="bg-white dark:bg-gray-900/50 rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden space-y-4 pb-6 transition-colors">
        {children}
      </div>
    </section>
  );
}

function ExportButton({
  icon: Icon,
  label,
  onClick,
}: {
  icon: any;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="bg-white dark:bg-[#111827] border-2 border-[#059669]/20 dark:border-emerald-900/30 text-[#059669] dark:text-emerald-400 h-14 rounded-2xl font-black text-sm flex items-center justify-center gap-3 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all group active:scale-95 shadow-sm dark:shadow-none"
    >
      <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />{" "}
      {label}
    </button>
  );
}
