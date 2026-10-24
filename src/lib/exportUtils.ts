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
  ShadingType,
  PageNumber,
  Header,
  Footer,
} from "docx";

// ─── PDF Export (via jsPDF) ─────────────────────────────────────────────────
const PAGE_WIDTH_PT = 595.28; // A4
const PAGE_HEIGHT_PT = 841.89; // A4
const MARGIN_PT = 36;
const BOTTOM_PADDING_PT = 40;

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
    scale: 3,
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
import { QuoteDocxData } from "@/features/dashboard/components/preview/resolveQuoteData";

// ── Color Palette ──────────────────────────────────────────────────────────
const COLOR = {
  brand: "009966",
  brandDark: "006644",
  brandLight: "ECFDF5",
  white: "FFFFFF",
  black: "0A0A0A",
  gray900: "111827",
  gray700: "374151",
  gray500: "6B7280",
  gray300: "D1D5DB",
  gray100: "F3F4F6",
  gray50: "F9FAFB",
  accent: "059669",
};

// ── Helper: Empty line ─────────────────────────────────────────────────────
const spacer = (lines = 1) =>
  Array.from({ length: lines }, () =>
    new Paragraph({ children: [], spacing: { after: 0, before: 0 } })
  );

// ── Helper: Decorative divider line ───────────────────────────────────────
const divider = () =>
  new Paragraph({
    border: {
      bottom: { color: COLOR.gray300, style: BorderStyle.SINGLE, size: 6 },
    },
    spacing: { before: 120, after: 120 },
    children: [],
  });

// ── Helper: Section heading with green left bar ──────────────────────────
const sectionHeading = (text: string) =>
  new Paragraph({
    children: [
      new TextRun({
        text: text.toUpperCase(),
        bold: true,
        size: 22,
        color: COLOR.brandDark,
        characterSpacing: 60,
      }),
    ],
    spacing: { before: 360, after: 160 },
    border: {
      left: { color: COLOR.brand, style: BorderStyle.THICK, size: 16 },
    },
    indent: { left: 160 },
  });

// ── Helper: Body paragraph ────────────────────────────────────────────────
const bodyText = (text: string, color = COLOR.gray700) =>
  new Paragraph({
    children: [new TextRun({ text: text || "—", size: 20, color })],
    spacing: { after: 80 },
  });

// ── Helper: Bullet item ───────────────────────────────────────────────────
const bulletItem = (text: string) =>
  new Paragraph({
    children: [new TextRun({ text, size: 20, color: COLOR.gray700 })],
    bullet: { level: 0 },
    spacing: { after: 60 },
  });

// ── Helper: 2-column Table ────────────────────────────────────────────────
const infoTable = (rows: { label: string; value: string }[]) =>
  new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 4, color: COLOR.gray300 },
      bottom: { style: BorderStyle.SINGLE, size: 4, color: COLOR.gray300 },
      left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
      right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 2, color: COLOR.gray100 },
      insideVertical: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    },
    rows: rows.map((row) =>
      new TableRow({
        children: [
          new TableCell({
            width: { size: 30, type: WidthType.PERCENTAGE },
            shading: { type: ShadingType.SOLID, color: COLOR.gray50, fill: COLOR.gray50 },
            borders: {
              top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
              bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
              left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
              right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
            },
            margins: { top: 100, bottom: 100, left: 160, right: 160 },
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: row.label, bold: true, size: 18, color: COLOR.gray500 }),
                ],
              }),
            ],
          }),
          new TableCell({
            width: { size: 70, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
              bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
              left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
              right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
            },
            margins: { top: 100, bottom: 100, left: 160, right: 160 },
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: row.value || "—", size: 18, color: COLOR.gray900 }),
                ],
              }),
            ],
          }),
        ],
      })
    ),
  });

// ── Helper: Unit Prices Table ─────────────────────────────────────────────
const headerCell = (
  text: string,
  widthPct: number,
  align: (typeof AlignmentType)[keyof typeof AlignmentType] = AlignmentType.LEFT
) =>
  new TableCell({
    width: { size: widthPct, type: WidthType.PERCENTAGE },
    shading: { type: ShadingType.SOLID, color: COLOR.gray900, fill: COLOR.gray900 },
    margins: { top: 100, bottom: 100, left: 140, right: 140 },
    children: [
      new Paragraph({
        children: [
          new TextRun({ text, bold: true, size: 18, color: COLOR.white }),
        ],
        alignment: align,
      }),
    ],
  });

const dataCell = (
  text: string,
  widthPct: number,
  bold = false,
  align: (typeof AlignmentType)[keyof typeof AlignmentType] = AlignmentType.LEFT,
  highlight = false
) =>
  new TableCell({
    width: { size: widthPct, type: WidthType.PERCENTAGE },
    shading: highlight ? { type: ShadingType.SOLID, color: COLOR.brandLight, fill: COLOR.brandLight } : undefined,
    margins: { top: 80, bottom: 80, left: 140, right: 140 },
    children: [
      new Paragraph({
        children: [
          new TextRun({ text: text || "—", bold, size: 18, color: highlight ? COLOR.brandDark : COLOR.gray700 }),
        ],
        alignment: align,
      }),
    ],
  });

const unitPricesDocxTable = (items: any[]) =>
  new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 4, color: COLOR.gray300 },
      bottom: { style: BorderStyle.SINGLE, size: 4, color: COLOR.gray300 },
      left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
      right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 2, color: COLOR.gray100 },
      insideVertical: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    },
    rows: [
      new TableRow({
        children: [
          headerCell("Item", 15),
          headerCell("Description", 45),
          headerCell("Unit", 15),
          headerCell("Unit Price", 25, AlignmentType.RIGHT),
        ],
      }),
      ...items.map((up: any, i: number) =>
        new TableRow({
          children: [
            dataCell(up.id || `UP-0${i + 1}`, 15, true, AlignmentType.LEFT, true),
            dataCell(up.description || "—", 45),
            dataCell(up.unit || up.type || "—", 15),
            dataCell(up.unitPrice || up.price || "—", 25, true, AlignmentType.RIGHT),
          ],
        })
      ),
    ],
  });

// ── Helper: Separate Prices blocks ─────────────────────────────────────────
const separatePricesDocxElements = (items: any[]) => {
  const elements: (Paragraph | Table)[] = [];
  items.forEach((sp: any, i: number) => {
    const detailRows: { label: string; value: string }[] = [];
    if (sp.description) detailRows.push({ label: "Description", value: sp.description });
    if (sp.scopeOfWork) detailRows.push({ label: "Scope of Work", value: sp.scopeOfWork });
    if (sp.assumptions) detailRows.push({ label: "Assumptions", value: sp.assumptions });
    if (sp.exclusions) detailRows.push({ label: "Exclusions", value: sp.exclusions });

    elements.push(
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: {
          top: { style: BorderStyle.SINGLE, size: 4, color: COLOR.brand },
          bottom: { style: BorderStyle.SINGLE, size: 4, color: COLOR.gray300 },
          left: { style: BorderStyle.SINGLE, size: 4, color: COLOR.gray300 },
          right: { style: BorderStyle.SINGLE, size: 4, color: COLOR.gray300 },
          insideHorizontal: { style: BorderStyle.SINGLE, size: 2, color: COLOR.gray100 },
          insideVertical: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
        },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                width: { size: 70, type: WidthType.PERCENTAGE },
                shading: { type: ShadingType.SOLID, color: COLOR.brandLight, fill: COLOR.brandLight },
                margins: { top: 100, bottom: 100, left: 140, right: 140 },
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({ text: `[${sp.id || `SP-0${i + 1}`}] `, bold: true, size: 18, color: COLOR.brandDark }),
                      new TextRun({ text: sp.title || "Separate Price Item", bold: true, size: 18, color: COLOR.gray900 }),
                    ],
                  }),
                ],
              }),
              new TableCell({
                width: { size: 30, type: WidthType.PERCENTAGE },
                shading: { type: ShadingType.SOLID, color: COLOR.brandLight, fill: COLOR.brandLight },
                margins: { top: 100, bottom: 100, left: 140, right: 140 },
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({ text: sp.price || "$0", bold: true, size: 20, color: COLOR.brandDark }),
                    ],
                    alignment: AlignmentType.RIGHT,
                  }),
                ],
              }),
            ],
          }),
          ...detailRows.map((dr) =>
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 25, type: WidthType.PERCENTAGE },
                  margins: { top: 80, bottom: 80, left: 140, right: 140 },
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({ text: dr.label, bold: true, size: 17, color: COLOR.gray700 }),
                      ],
                    }),
                  ],
                }),
                new TableCell({
                  width: { size: 75, type: WidthType.PERCENTAGE },
                  margins: { top: 80, bottom: 80, left: 140, right: 140 },
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({ text: dr.value, size: 17, color: COLOR.gray700 }),
                      ],
                    }),
                  ],
                }),
              ],
            })
          ),
        ],
      })
    );
    elements.push(new Paragraph({ spacing: { after: 100 }, children: [] }));
  });
  return elements;
};

// ── Helper: Alternative Prices blocks ──────────────────────────────────────
const altPricesDocxElements = (items: any[]) => {
  const elements: (Paragraph | Table)[] = [];
  items.forEach((ap: any, i: number) => {
    elements.push(
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: {
          top: { style: BorderStyle.SINGLE, size: 4, color: "2563EB" },
          bottom: { style: BorderStyle.SINGLE, size: 4, color: COLOR.gray300 },
          left: { style: BorderStyle.SINGLE, size: 4, color: COLOR.gray300 },
          right: { style: BorderStyle.SINGLE, size: 4, color: COLOR.gray300 },
          insideHorizontal: { style: BorderStyle.SINGLE, size: 2, color: COLOR.gray100 },
          insideVertical: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
        },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                width: { size: 70, type: WidthType.PERCENTAGE },
                shading: { type: ShadingType.SOLID, color: "EFF6FF", fill: "EFF6FF" },
                margins: { top: 100, bottom: 100, left: 140, right: 140 },
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({ text: `[${ap.id || `ALT-0${i + 1}`}] `, bold: true, size: 18, color: "1D4ED8" }),
                      new TextRun({ text: ap.title || "Alternative Price Item", bold: true, size: 18, color: COLOR.gray900 }),
                    ],
                  }),
                ],
              }),
              new TableCell({
                width: { size: 30, type: WidthType.PERCENTAGE },
                shading: { type: ShadingType.SOLID, color: "EFF6FF", fill: "EFF6FF" },
                margins: { top: 100, bottom: 100, left: 140, right: 140 },
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({ text: ap.price || "$0", bold: true, size: 20, color: "1D4ED8" }),
                    ],
                    alignment: AlignmentType.RIGHT,
                  }),
                ],
              }),
            ],
          }),
          ...(ap.description ? [
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 100, type: WidthType.PERCENTAGE },
                  columnSpan: 2,
                  margins: { top: 80, bottom: 80, left: 140, right: 140 },
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({ text: ap.description, size: 17, color: COLOR.gray700 }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
          ] : []),
        ],
      })
    );
    elements.push(new Paragraph({ spacing: { after: 100 }, children: [] }));
  });
  return elements;
};

// ── Helper: Pricing total table ───────────────────────────────────────────
const pricingTable = (base: string, hstPct: string, currency: string) => {
  const numBase = Number(base.replace(/[^0-9.-]+/g, "")) || 0;
  const numHst = Number(hstPct.replace(/[^0-9.-]+/g, "")) || 13;
  const hstAmt = (numBase * numHst) / 100;
  const total = numBase + hstAmt;
  const fmt = (n: number) => `${currency || "CAD"} $${n.toLocaleString()}`;

  const rowStyle = (label: string, value: string, highlight = false) =>
    new TableRow({
      children: [
        new TableCell({
          shading: highlight
            ? { type: ShadingType.SOLID, color: COLOR.brand, fill: COLOR.brand }
            : { type: ShadingType.SOLID, color: COLOR.gray50, fill: COLOR.gray50 },
          borders: {
            top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
            bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
            left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
            right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
          },
          margins: { top: 140, bottom: 140, left: 200, right: 200 },
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: label,
                  bold: true,
                  size: 20,
                  color: highlight ? COLOR.white : COLOR.gray700,
                }),
              ],
            }),
          ],
        }),
        new TableCell({
          shading: highlight
            ? { type: ShadingType.SOLID, color: COLOR.brand, fill: COLOR.brand }
            : undefined,
          borders: {
            top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
            bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
            left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
            right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
          },
          margins: { top: 140, bottom: 140, left: 200, right: 200 },
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: value,
                  bold: highlight,
                  size: highlight ? 24 : 20,
                  color: highlight ? COLOR.white : COLOR.gray900,
                }),
              ],
              alignment: AlignmentType.RIGHT,
            }),
          ],
        }),
      ],
    });

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 4, color: COLOR.gray300 },
      bottom: { style: BorderStyle.SINGLE, size: 4, color: COLOR.gray300 },
      left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
      right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 2, color: COLOR.gray100 },
      insideVertical: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    },
    rows: [
      rowStyle("Base Bid Price", fmt(numBase)),
      rowStyle(`HST (${numHst}%)`, fmt(hstAmt)),
      rowStyle("TOTAL QUOTED PRICE", fmt(total), true),
    ],
  });
};

export async function exportQuoteToDocx(
  quoteData: QuoteDocxData,
  filename: string = "quote.docx"
) {
  const {
    companyName = "Renofield Ltd.",
    companyAddress = "",
    companyPhone = "",
    companyEmail = "",
    companyWebsite = "",
    companyHst = "",

    projectName = "",
    projectLocation = "",
    clientName = "",
    attention = "",
    gcName = "",
    quoteNumber = "",
    revisionNumber = "00",
    startDate = "",
    bidClosingDate = "",
    subject = "",
    addendaIncluded = "",

    baseBidPrice = "0",
    hstPercentage = "13",
    currency = "CAD",

    scopeOfWork = [],
    assumptions = [],
    exclusions = [],
    clarifications = [],

    separatePrices = [],
    altPrices = [],
    unitPrices = [],

    paymentTerms = "Progress payments monthly based on work completed. Net 30 days from invoice date.",
    holdbackNote = "10% holdback as per Construction Act requirements until final completion.",
    validityPeriod = "30 days from date of issue",
    termsCurrency = "",
    footerNotes = "",
  } = quoteData;

  const toLines = (val: string | string[] | undefined): string[] => {
    if (!val) return [];
    if (Array.isArray(val)) return val.map((s) => String(s).trim()).filter(Boolean);
    return String(val).split("\n").map((s) => s.trim()).filter(Boolean);
  };

  const scopeLines = toLines(scopeOfWork);
  const assumptionLines = toLines(assumptions);
  const exclusionLines = toLines(exclusions);
  const clarificationLines = toLines(clarifications);

  const doc = new Document({
    creator: companyName,
    title: `Quotation - ${projectName}`,
    description: `Quote ${quoteNumber} for ${projectName}`,

    styles: {
      default: {
        document: {
          run: { font: "Calibri", size: 20, color: COLOR.gray700 },
          paragraph: { spacing: { line: 276 } },
        },
      },
    },

    sections: [
      {
        properties: {
          page: {
            margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 },
          },
        },
        headers: {
          default: new Header({
            children: [
              new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                borders: {
                  top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                  bottom: { style: BorderStyle.SINGLE, size: 6, color: COLOR.brand },
                  left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                  right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                  insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                  insideVertical: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                },
                rows: [
                  new TableRow({
                    children: [
                      new TableCell({
                        borders: {
                          top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                          bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                          left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                          right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                        },
                        margins: { bottom: 120 },
                        children: [
                          new Paragraph({
                            children: [
                              new TextRun({ text: companyName, bold: true, size: 22, color: COLOR.brand }),
                            ],
                          }),
                          ...(companyAddress ? [
                            new Paragraph({
                              children: [
                                new TextRun({ text: companyAddress, size: 16, color: COLOR.gray500 }),
                              ],
                            }),
                          ] : []),
                          ...(companyPhone || companyEmail ? [
                            new Paragraph({
                              children: [
                                new TextRun({
                                  text: [companyPhone ? `Tel: ${companyPhone}` : "", companyEmail ? `Email: ${companyEmail}` : ""].filter(Boolean).join(" · "),
                                  size: 15,
                                  color: COLOR.gray500,
                                }),
                              ],
                            }),
                          ] : []),
                        ],
                      }),
                      new TableCell({
                        borders: {
                          top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                          bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                          left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                          right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                        },
                        margins: { bottom: 120 },
                        children: [
                          new Paragraph({
                            children: [
                              new TextRun({ text: "QUOTATION", bold: true, size: 28, color: COLOR.brand }),
                            ],
                            alignment: AlignmentType.RIGHT,
                          }),
                          new Paragraph({
                            children: [
                              new TextRun({ text: `#${quoteNumber || "Q-001"}`, bold: true, size: 18, color: COLOR.gray700 }),
                            ],
                            alignment: AlignmentType.RIGHT,
                          }),
                          ...(revisionNumber ? [
                            new Paragraph({
                              children: [
                                new TextRun({ text: `Rev. ${revisionNumber}`, size: 16, color: COLOR.gray500 }),
                              ],
                              alignment: AlignmentType.RIGHT,
                            }),
                          ] : []),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                borders: {
                  top: { style: BorderStyle.SINGLE, size: 6, color: COLOR.brand },
                  bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                  left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                  right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                  insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                  insideVertical: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                },
                rows: [
                  new TableRow({
                    children: [
                      new TableCell({
                        borders: {
                          top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                          bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                          left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                          right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                        },
                        margins: { top: 120 },
                        children: [
                          new Paragraph({
                            children: [
                              new TextRun({ text: `Confidential — ${companyName}`, size: 16, color: COLOR.gray500 }),
                            ],
                          }),
                        ],
                      }),
                      new TableCell({
                        borders: {
                          top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                          bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                          left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                          right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                        },
                        margins: { top: 120 },
                        children: [
                          new Paragraph({
                            children: [
                              new TextRun({ text: "Page ", size: 16, color: COLOR.gray500 }),
                              new TextRun({
                                children: [PageNumber.CURRENT],
                                size: 16,
                                color: COLOR.gray500,
                              }),
                              new TextRun({ text: " of ", size: 16, color: COLOR.gray500 }),
                              new TextRun({
                                children: [PageNumber.TOTAL_PAGES],
                                size: 16,
                                color: COLOR.gray500,
                              }),
                            ],
                            alignment: AlignmentType.RIGHT,
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        },

        children: [
          // ── Hero Section ──────────────────────────────────────────────
          new Paragraph({
            children: [
              new TextRun({
                text: "QUOTATION / BID SUBMISSION",
                bold: true,
                size: 44,
                color: COLOR.brand,
              }),
            ],
            spacing: { before: 240, after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: projectName || "Project Quotation", bold: true, size: 26, color: COLOR.gray900 }),
              ...(projectLocation ? [new TextRun({ text: ` • ${projectLocation}`, size: 22, color: COLOR.gray500 })] : []),
            ],
            spacing: { after: 120 },
          }),

          // Prepared For Block
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 4, color: COLOR.brand },
              bottom: { style: BorderStyle.SINGLE, size: 4, color: COLOR.brand },
              left: { style: BorderStyle.SINGLE, size: 4, color: COLOR.brand },
              right: { style: BorderStyle.SINGLE, size: 4, color: COLOR.brand },
              insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
              insideVertical: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    shading: { type: ShadingType.SOLID, color: COLOR.brandLight, fill: COLOR.brandLight },
                    margins: { top: 120, bottom: 120, left: 160, right: 160 },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: "PREPARED FOR", bold: true, size: 16, color: COLOR.brandDark, characterSpacing: 40 }),
                        ],
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({ text: clientName || "Client Name", bold: true, size: 22, color: COLOR.gray900 }),
                        ],
                        spacing: { before: 60, after: 40 },
                      }),
                      ...(attention ? [
                        new Paragraph({
                          children: [
                            new TextRun({ text: `Attention: ${attention}`, size: 18, color: COLOR.gray700 }),
                          ],
                        }),
                      ] : []),
                      ...(gcName ? [
                        new Paragraph({
                          children: [
                            new TextRun({ text: `General Contractor: ${gcName}`, size: 18, color: COLOR.gray700 }),
                          ],
                        }),
                      ] : []),
                    ],
                  }),
                ],
              }),
            ],
          }),

          // ── Tender / Project Meta Block ───────────────────────────────────
          sectionHeading("Tender Information"),
          infoTable([
            { label: "Tender Name", value: projectName },
            { label: "Tender Address", value: projectLocation },
            { label: "Client Name", value: clientName },
            { label: "Attention", value: attention },
            { label: "General Contractor", value: gcName },
            { label: "Quote Number", value: quoteNumber },
            { label: "Issue Date", value: startDate },
            { label: "Revision Number", value: revisionNumber },
            { label: "Bid Closing Date", value: bidClosingDate },
            { label: "Addenda Included", value: addendaIncluded },
            { label: "Scope / Subject", value: subject },
            { label: "Quote Validity", value: validityPeriod },
            { label: "Currency", value: currency },
          ].filter((r) => Boolean(r.value))),

          // ── Scope of Work ─────────────────────────────────────────────
          sectionHeading("Scope of Work"),
          ...(scopeLines.length > 0 ? scopeLines.map(bulletItem) : [bodyText("No Scope of Work items listed")]),

          // ── Assumptions ───────────────────────────────────────────────
          sectionHeading("Assumptions"),
          ...(assumptionLines.length > 0 ? assumptionLines.map(bulletItem) : [bodyText("No Assumptions listed")]),

          // ── Exclusions ────────────────────────────────────────────────
          sectionHeading("Exclusions"),
          ...(exclusionLines.length > 0 ? exclusionLines.map(bulletItem) : [bodyText("No Exclusions listed")]),

          // ── Clarifications ────────────────────────────────────────────
          ...(clarificationLines.length > 0
            ? [
              sectionHeading("Clarifications / Notes"),
              ...clarificationLines.map(bulletItem),
            ]
            : []),

          // ── Separate Prices ───────────────────────────────────────────
          ...(separatePrices && separatePrices.length > 0
            ? [
              sectionHeading("Separate Prices"),
              ...separatePricesDocxElements(separatePrices),
            ]
            : []),

          // ── Alternative Prices ────────────────────────────────────────
          ...(altPrices && altPrices.length > 0
            ? [
              sectionHeading("Alternative Prices"),
              ...altPricesDocxElements(altPrices),
            ]
            : []),

          // ── Unit Prices ───────────────────────────────────────────────
          ...(unitPrices && unitPrices.length > 0
            ? [
              sectionHeading("Unit Prices"),
              unitPricesDocxTable(unitPrices),
            ]
            : []),

          // ── Pricing Summary ───────────────────────────────────────────
          sectionHeading("Pricing Summary"),
          pricingTable(baseBidPrice, hstPercentage, currency),

          // ── Commercial Terms ──────────────────────────────────────────
          sectionHeading("Commercial Terms"),
          infoTable([
            { label: "Payment Terms", value: paymentTerms },
            { label: "Holdback", value: holdbackNote },
            { label: "Quote Validity", value: validityPeriod },
            { label: "Currency", value: termsCurrency || currency },
          ]),

          // ── Footer Notes ──────────────────────────────────────────────
          ...(footerNotes
            ? [
              sectionHeading("Additional Notes"),
              bodyText(footerNotes),
            ]
            : []),

          // ── Closing Statement ─────────────────────────────────────────
          ...spacer(1),
          divider(),
          new Paragraph({
            children: [
              new TextRun({
                text: "Thank you for considering our proposal. We look forward to working with you on this project.",
                size: 20,
                color: COLOR.gray500,
                italics: true,
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { before: 160, after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: companyName, bold: true, size: 22, color: COLOR.brand }),
            ],
            alignment: AlignmentType.CENTER,
          }),
          ...(companyAddress ? [
            new Paragraph({
              children: [
                new TextRun({ text: companyAddress, size: 18, color: COLOR.gray500 }),
              ],
              alignment: AlignmentType.CENTER,
            }),
          ] : []),
          ...([companyPhone, companyEmail, companyHst ? `HST: ${companyHst}` : ""].filter(Boolean).length > 0 ? [
            new Paragraph({
              children: [
                new TextRun({
                  text: [companyPhone, companyEmail, companyHst ? `HST: ${companyHst}` : ""].filter(Boolean).join(" · "),
                  size: 16,
                  color: COLOR.gray500,
                }),
              ],
              alignment: AlignmentType.CENTER,
            }),
          ] : []),
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

