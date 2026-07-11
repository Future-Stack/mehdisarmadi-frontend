import { jsPDF } from "jspdf";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  Table,
  TableRow,
  TableCell,
  WidthType,
} from "docx";

// ─── PDF Export (via jsPDF) ─────────────────────────────────────────────────
const PAGE_WIDTH_PT = 595.28; // A4
const PAGE_HEIGHT_PT = 841.89; // A4
const MARGIN_PT = 36;
const BOTTOM_PADDING_PT = 40; // safe zone

export async function exportElementToPDF(
  elementId: string,
  filename: string = "quote.pdf"
) {
  const { default: html2canvas } = await import("html2canvas-pro");
  const container = document.getElementById(elementId);
  if (!container) {
    throw new Error(`Element with id "${elementId}" not found`);
  }

  const headerEl = container.querySelector<HTMLElement>("#export-header");
  const footerEl = container.querySelector<HTMLElement>("#export-footer");
  const sectionEls = Array.from(
    container.querySelectorAll<HTMLElement>(".export-section")
  );

  const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
  const canvasOpts = {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
    logging: false,
  };

  // ── Capture header ──
  let headerH = 0;
  if (headerEl) {
    const c = await html2canvas(headerEl, canvasOpts);
    headerH = (c.height / c.width) * PAGE_WIDTH_PT;
    pdf.addImage(c.toDataURL("image/png"), "PNG", 0, 0, PAGE_WIDTH_PT, headerH);
  }

  // ── Capture footer ──
  let footerImgData = "";
  let footerH = 0;
  if (footerEl) {
    const c = await html2canvas(footerEl, canvasOpts);
    footerH = (c.height / c.width) * PAGE_WIDTH_PT;
    footerImgData = c.toDataURL("image/png");
  }

  const availableH = PAGE_HEIGHT_PT - BOTTOM_PADDING_PT;
  const contentW = PAGE_WIDTH_PT - MARGIN_PT * 2;
  let currentY = headerH + MARGIN_PT;
  
  const addNewPage = () => {
    pdf.addPage();
    currentY = MARGIN_PT;
  };

  // ── Place sections ──
  // If there are no sections defined, just capture the whole container as one image and split it mechanically.
  if (sectionEls.length === 0) {
    const c = await html2canvas(container, canvasOpts);
    const imgData = c.toDataURL("image/png");
    const imgW = PAGE_WIDTH_PT;
    const imgH = (c.height * imgW) / c.width;
    
    let heightLeft = imgH;
    let position = 0;
    
    pdf.addImage(imgData, "PNG", 0, position, imgW, imgH);
    heightLeft -= PAGE_HEIGHT_PT;
    
    while (heightLeft > 0) {
      position -= PAGE_HEIGHT_PT;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgW, imgH);
      heightLeft -= PAGE_HEIGHT_PT;
    }
    
    pdf.save(filename);
    return;
  }

  // Otherwise, use section-aware logic
  for (let i = 0; i < sectionEls.length; i++) {
    const el = sectionEls[i];
    const c = await html2canvas(el, { ...canvasOpts });
    const imgH = (c.height / c.width) * contentW;
    const imgData = c.toDataURL("image/png");

    if (currentY + imgH > availableH) {
      addNewPage();
    }
    pdf.addImage(imgData, "PNG", MARGIN_PT, currentY, contentW, imgH);
    currentY += imgH + 16;
  }

  // ── Footer on last page ──
  if (footerImgData) {
    if (currentY + footerH + 10 > PAGE_HEIGHT_PT) {
      addNewPage();
    }
    pdf.addImage(
      footerImgData,
      "PNG",
      0,
      PAGE_HEIGHT_PT - footerH,
      PAGE_WIDTH_PT,
      footerH
    );
  }

  pdf.save(filename);
}

// ─── DOCX Export ────────────────────────────────────────────────────────────
interface QuoteData {
  companyName?: string;
  companyAddress?: string;
  projectName?: string;
  clientName?: string;
  quoteNumber?: string;
  baseBidPrice?: string;
  hstPercentage?: string;
  currency?: string;
  scopeOfWork?: string;
  assumptions?: string;
  exclusions?: string;
  clarifications?: string;
  paymentTerms?: string;
  holdbackNote?: string;
  validityPeriod?: string;
  footerNotes?: string;
}

export async function exportQuoteToDocx(
  quoteData: QuoteData,
  filename: string = "quote.docx"
) {
  const heading = (text: string) =>
    new Paragraph({
      children: [new TextRun({ text, bold: true, size: 28, color: "1a1a1a" })],
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 100 },
    });

  const body = (text: string) =>
    new Paragraph({
      children: [new TextRun({ text, size: 22, color: "444444" })],
      spacing: { after: 80 },
    });

  const divider = () =>
    new Paragraph({
      border: {
        bottom: { color: "e5e7eb", style: BorderStyle.SINGLE, size: 1 },
      },
      spacing: { before: 200, after: 200 },
      children: [],
    });

  const doc = new Document({
    sections: [
      {
        children: [
          // Title
          new Paragraph({
            children: [
              new TextRun({
                text: "QUOTATION / BID SUBMISSION",
                bold: true,
                size: 36,
                color: "059669",
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
          }),
          // Company info
          new Paragraph({
            children: [
              new TextRun({
                text: quoteData.companyName || "ABC Construction Ltd.",
                bold: true,
                size: 26,
              }),
            ],
            spacing: { after: 60 },
          }),
          body(quoteData.companyAddress || "123 Main Street, Toronto, ON M5V 3A8"),
          divider(),
          // Quote meta
          heading("Project & Quote Details"),
          body(`Project Name: ${quoteData.projectName || ""}`),
          body(`Client Name: ${quoteData.clientName || ""}`),
          body(`Quote Number: ${quoteData.quoteNumber || ""}`),
          divider(),
          // Pricing
          heading("Pricing"),
          body(`Base Bid Price (${quoteData.currency || "CAD"}): ${quoteData.baseBidPrice || ""}`),
          body(`HST: ${quoteData.hstPercentage || ""}%`),
          divider(),
          // Scope
          heading("Scope of Work"),
          body(quoteData.scopeOfWork || ""),
          divider(),
          // Assumptions
          heading("Assumptions"),
          body(quoteData.assumptions || ""),
          divider(),
          // Exclusions
          heading("Exclusions"),
          body(quoteData.exclusions || ""),
          divider(),
          // Clarifications
          heading("Clarifications / Notes"),
          body(quoteData.clarifications || ""),
          divider(),
          // Commercial Terms
          heading("Commercial Terms"),
          body(`Payment Terms: ${quoteData.paymentTerms || ""}`),
          body(`Holdback: ${quoteData.holdbackNote || ""}`),
          body(`Validity: ${quoteData.validityPeriod || ""}`),
          divider(),
          // Footer
          heading("Footer Notes"),
          body(quoteData.footerNotes || ""),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
