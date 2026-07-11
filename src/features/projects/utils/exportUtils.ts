import jsPDF from "jspdf";
import html2canvas from "html2canvas-pro";

const PAGE_WIDTH_PT = 595.28; // A4
const PAGE_HEIGHT_PT = 841.89; // A4
const MARGIN_PT = 36;
const BOTTOM_PADDING_PT = 40; // safe zone at page bottom so content isn't cut

/**
 * Section-aware PDF export.
 *
 * Structure expected inside #analysis-export-content:
 *   #export-header     – rendered once on page 1 top
 *   .export-section    – each logical block, never split across pages
 *   #export-footer     – rendered once on last page bottom
 */
export async function exportAnalysisPDF(filename = "AI-Analysis-Results") {
  const container = document.getElementById("analysis-export-content");
  if (!container) {
    console.error("Export container not found");
    return;
  }

  const headerEl = container.querySelector<HTMLElement>("#export-header");
  const footerEl = container.querySelector<HTMLElement>("#export-footer");
  const sectionEls = Array.from(
    container.querySelectorAll<HTMLElement>(".export-section")
  );

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "a4",
  });

  const canvasOpts = {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
    logging: false,
  };

  // ── Capture header ────────────────────────────────────────────────────────
  let headerH = 0;
  if (headerEl) {
    const c = await html2canvas(headerEl, canvasOpts);
    headerH = (c.height / c.width) * PAGE_WIDTH_PT;
    pdf.addImage(c.toDataURL("image/png"), "PNG", 0, 0, PAGE_WIDTH_PT, headerH);
  }

  // ── Capture footer (reused on last page) ──────────────────────────────────
  let footerImgData = "";
  let footerH = 0;
  if (footerEl) {
    const c = await html2canvas(footerEl, canvasOpts);
    footerH = (c.height / c.width) * PAGE_WIDTH_PT;
    footerImgData = c.toDataURL("image/png");
  }

  // Available content height (leave room for bottom padding + potential footer)
  const availableH = PAGE_HEIGHT_PT - BOTTOM_PADDING_PT;
  const contentW = PAGE_WIDTH_PT - MARGIN_PT * 2;

  let currentY = headerH + MARGIN_PT;
  let currentPage = 1;

  const addNewPage = () => {
    pdf.addPage();
    currentPage++;
    currentY = MARGIN_PT;
  };

  // ── Place each section ────────────────────────────────────────────────────
  for (let i = 0; i < sectionEls.length; i++) {
    const el = sectionEls[i];
    const c = await html2canvas(el, { ...canvasOpts });
    const imgH = (c.height / c.width) * contentW;
    const imgData = c.toDataURL("image/png");

    // If this section won't fit on the current page, start a new one
    if (currentY + imgH > availableH) {
      addNewPage();
    }

    pdf.addImage(imgData, "PNG", MARGIN_PT, currentY, contentW, imgH);
    currentY += imgH + 16; // gap between sections
  }

  // ── Footer on last page ───────────────────────────────────────────────────
  if (footerImgData) {
    // If there's no room for footer on current page, add one more page
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

  pdf.save(`${filename}.pdf`);
}
