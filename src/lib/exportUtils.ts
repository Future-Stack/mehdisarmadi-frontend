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
export async function exportElementToPDF(
  elementId: string,
  filename: string = "quote.pdf"
) {
  // Lazy-load html2canvas-pro to avoid SSR issues and fix color parsing bugs (e.g. lab/oklch)
  const { default: html2canvas } = await import("html2canvas-pro");
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Element with id "${elementId}" not found`);
  }

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
    logging: false,
  });

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const imgWidth = pageWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  while (heightLeft > 0) {
    position -= pageHeight;
    pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
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
