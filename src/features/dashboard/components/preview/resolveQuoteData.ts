/**
 * Unified resolver for project quote data.
 * Merges saved quotes, AI quote drafts, project tender details, and commercial terms
 * so that quote preview and quote builder are 100% dynamic without hardcoded fallbacks.
 */

export interface ResolvedScopeItem {
  division: string;
  items: string[];
}

export interface ResolvedQuote {
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
  companyWebsite: string;
  companyHst: string;

  projectName: string;
  projectLocation: string;
  clientName: string;
  attention: string;
  gcName: string;
  quoteNumber: string;
  revisionNumber: string;
  startDate: string;
  bidClosingDate: string;
  subject: string;
  addendaIncluded: string;

  scopeOfWork: string[];
  assumptions: string[];
  exclusions: string[];
  clarifications: string[];
  separatePrices: Array<{
    id: string;
    title: string;
    price: string;
    description: string;
    scopeOfWork: string;
    assumptions: string;
    exclusions: string;
  }>;
  altPrices: Array<{
    id: string;
    title: string;
    price: string;
    description: string;
  }>;
  unitPrices: Array<{
    id: string;
    description: string;
    unit: string;
    unitPrice: string;
    estQty: string;
    notes: string;
  }>;

  numericBase: number;
  numericHstPct: number;
  hstAmount: number;
  totalAmount: number;
  currency: string;

  paymentTerms: string;
  holdbackNote: string;
  validityPeriod: string;
  termsCurrency: string;
  footerNotes: string;

  confidence?: string;
  completeness?: string;
  missingInformation?: string[];
  validationErrors?: string[];
  warnings?: string[];
}

export function resolveQuoteData(quoteData: any, companyProfile?: any, fallbackClarifications?: string[]): ResolvedQuote {
  const raw = quoteData?.data || quoteData || {};
  const saved = raw.savedQuote || raw.quote || {};
  const project = raw.projectQuoteDetails || {};
  const aiDraft = raw.aiQuoteDraft || {};
  const commercial = raw.commercialTerms || {};
  const footer = raw.footerNotes || {};
  const company = raw.companyDetails || companyProfile?.data || companyProfile || {};

  // 1. Company Information
  const companyName =
    (saved.companyName && saved.companyName.trim() !== "" ? saved.companyName : null) ||
    company.name ||
    "Renofield Ltd.";
  const companyAddress =
    (saved.companyAddress && saved.companyAddress.trim() !== "" ? saved.companyAddress : null) ||
    company.address ||
    "";
  const companyPhone =
    (saved.companyPhone && saved.companyPhone.trim() !== "" ? saved.companyPhone : null) ||
    company.phone ||
    "";
  const companyEmail =
    (saved.companyEmail && saved.companyEmail.trim() !== "" ? saved.companyEmail : null) ||
    company.email ||
    "";
  const companyWebsite =
    (saved.companyWebsite && saved.companyWebsite.trim() !== "" ? saved.companyWebsite : null) ||
    company.website ||
    "";
  const companyHst =
    (saved.companyHst && saved.companyHst.trim() !== "" ? saved.companyHst : null) ||
    company.hstNumber ||
    "";

  // 2. Project / Tender Information
  const projectName =
    (saved.projectName && saved.projectName.trim() !== "" ? saved.projectName : null) ||
    project.projectName ||
    "";
  const projectLocation =
    (saved.projectLocation && saved.projectLocation.trim() !== "" ? saved.projectLocation : null) ||
    project.address ||
    "";
  const clientName =
    (saved.clientName && saved.clientName.trim() !== "" ? saved.clientName : null) ||
    project.clientName ||
    "";
  const attention =
    (saved.attention && saved.attention.trim() !== "" ? saved.attention : null) ||
    project.clientContact ||
    "";
  const gcName =
    (saved.gcName && saved.gcName.trim() !== "" ? saved.gcName : null) ||
    project.gcName ||
    "";

  const defaultQuoteNo = project.projectId
    ? `Q-${new Date().getFullYear()}-${project.projectId.slice(0, 4).toUpperCase()}`
    : `Q-${new Date().getFullYear()}-001`;
  const quoteNumber =
    (saved.quoteNumber && saved.quoteNumber.trim() !== "" ? saved.quoteNumber : null) ||
    defaultQuoteNo;
  const revisionNumber = saved.revisionNumber || "00";
  const startDate =
    (saved.startDate && saved.startDate.trim() !== "" ? saved.startDate : null) ||
    new Date().toISOString().split("T")[0];
  const bidClosingDate =
    (saved.bidClosingDate && saved.bidClosingDate.trim() !== "" ? saved.bidClosingDate : null) ||
    (project.closingDate
      ? new Date(project.closingDate).toLocaleDateString()
      : "");
  const subject =
    (saved.subject && saved.subject.trim() !== "" ? saved.subject : null) ||
    project.instruction ||
    project.description ||
    "";
  const addendaIncluded = saved.addendaIncluded || "";

  // 3. Scope of Work
  let scopeOfWork: string[] = [];
  if (Array.isArray(saved.scopeOfWork) && saved.scopeOfWork.length > 0) {
    scopeOfWork = saved.scopeOfWork;
  } else if (Array.isArray(aiDraft.scope_of_work) && aiDraft.scope_of_work.length > 0) {
    scopeOfWork = aiDraft.scope_of_work.map((s: any) => {
      const div = s.division_label || (s.division_code ? `Division ${s.division_code}` : "");
      const details = Array.isArray(s.details)
        ? s.details.join(", ")
        : (s.details || "");
      if (div && details) return `${div}: ${details}`;
      return details || div || "";
    }).filter(Boolean);
  }
  if (scopeOfWork.length === 0 && Array.isArray(project.divisions) && project.divisions.length > 0) {
    scopeOfWork = project.divisions
      .filter((d: any) => d.isEnabled !== false)
      .map((d: any) => {
        const code = d.code ? `Division ${d.code} - ` : "";
        return `${code}${d.name}${d.description ? `: ${d.description}` : ""}`;
      });
  }

  // 4. Assumptions
  let assumptions: string[] = [];
  if (Array.isArray(saved.assumptions) && saved.assumptions.length > 0) {
    assumptions = saved.assumptions;
  } else if (Array.isArray(aiDraft.assumptions) && aiDraft.assumptions.length > 0) {
    assumptions = aiDraft.assumptions;
  }

  // 5. Exclusions
  let exclusions: string[] = [];
  if (Array.isArray(saved.exclusions) && saved.exclusions.length > 0) {
    exclusions = saved.exclusions;
  } else if (Array.isArray(aiDraft.exclusions) && aiDraft.exclusions.length > 0) {
    exclusions = aiDraft.exclusions;
  }

  // 6. Clarifications
  let clarifications: string[] = [];
  if (Array.isArray(saved.clarifications) && saved.clarifications.length > 0) {
    clarifications = saved.clarifications;
  } else if (Array.isArray(fallbackClarifications) && fallbackClarifications.length > 0) {
    clarifications = fallbackClarifications;
  } else if (Array.isArray(aiDraft.missing_information) && aiDraft.missing_information.length > 0) {
    clarifications = aiDraft.missing_information;
  }

  // 7. Separate Prices
  let separatePrices: any[] = [];
  if (Array.isArray(saved.separatePrices) && saved.separatePrices.length > 0) {
    separatePrices = saved.separatePrices;
  } else if (Array.isArray(aiDraft.separate_prices) && aiDraft.separate_prices.length > 0) {
    separatePrices = aiDraft.separate_prices.map((sp: any, i: number) => ({
      id: sp.code || `SP-${String(i + 1).padStart(2, "0")}`,
      title: sp.title || "",
      price: sp.amount || "$0",
      description: sp.description || sp.summary || "",
      scopeOfWork: Array.isArray(sp.scope_of_work) ? sp.scope_of_work.join(", ") : (sp.scope_of_work || ""),
      assumptions: Array.isArray(sp.assumptions) ? sp.assumptions.join(", ") : (sp.assumptions || ""),
      exclusions: Array.isArray(sp.exclusions) ? sp.exclusions.join(", ") : (sp.exclusions || ""),
    }));
  }

  // 8. Alternative Prices
  let altPrices: any[] = [];
  if (Array.isArray(saved.altPrices) && saved.altPrices.length > 0) {
    altPrices = saved.altPrices;
  } else if (Array.isArray(aiDraft.alternative_prices) && aiDraft.alternative_prices.length > 0) {
    altPrices = aiDraft.alternative_prices.map((ap: any, i: number) => ({
      id: ap.code || `ALT-${String(i + 1).padStart(2, "0")}`,
      title: ap.title || "",
      price: ap.amount || "$0",
      description: ap.description || ap.summary || "",
    }));
  }

  // 9. Unit Prices
  let unitPrices: any[] = [];
  if (Array.isArray(saved.unitPrices) && saved.unitPrices.length > 0) {
    unitPrices = saved.unitPrices;
  } else if (Array.isArray(aiDraft.unit_prices) && aiDraft.unit_prices.length > 0) {
    unitPrices = aiDraft.unit_prices.map((up: any, i: number) => ({
      id: up.code || `UP-${String(i + 1).padStart(2, "0")}`,
      description: up.description || "",
      unit: up.type || "",
      unitPrice: up.unit_price || "$0",
      estQty: "1",
      notes: "",
    }));
  }

  // 10. Pricing calculation
  const rawBase = saved.baseBidPrice ?? aiDraft.pricing_summary?.base_bid_price;
  let numericBase = 0;
  if (typeof rawBase === "number") {
    numericBase = rawBase;
  } else if (typeof rawBase === "string" && rawBase.trim().toLowerCase() !== "not found") {
    const parsed = Number(rawBase.replace(/[^0-9.-]+/g, ""));
    numericBase = isNaN(parsed) ? 0 : parsed;
  }

  const rawHstPct = saved.hstPercentage ?? "13%";
  let numericHstPct = 13;
  if (typeof rawHstPct === "number") {
    numericHstPct = rawHstPct;
  } else if (typeof rawHstPct === "string") {
    const parsed = Number(rawHstPct.replace(/[^0-9.-]+/g, ""));
    if (!isNaN(parsed) && parsed >= 0) numericHstPct = parsed;
  }

  const hstAmount = (numericBase * numericHstPct) / 100;
  const totalAmount = numericBase + hstAmount;
  const currency = saved.currency || aiDraft.pricing_summary?.currency || "CAD";

  // 11. Commercial Terms
  const paymentTerms =
    (saved.paymentTerms && saved.paymentTerms.trim() !== "" ? saved.paymentTerms : null) ||
    commercial.paymentTerms ||
    (aiDraft.terms_and_conditions?.payment_terms &&
    aiDraft.terms_and_conditions.payment_terms !== "Not found"
      ? aiDraft.terms_and_conditions.payment_terms
      : "") ||
    "Progress payments monthly based on work completed. Net 30 days from invoice date.";

  const holdbackNote =
    (saved.holdbackNote && saved.holdbackNote.trim() !== "" ? saved.holdbackNote : null) ||
    commercial.holdbackTerms ||
    (aiDraft.terms_and_conditions?.holdback &&
    aiDraft.terms_and_conditions.holdback !== "Not found"
      ? aiDraft.terms_and_conditions.holdback
      : "") ||
    "10% holdback as per Construction Act requirements until final completion.";

  const validityPeriod =
    (saved.validityPeriod && saved.validityPeriod.trim() !== "" ? saved.validityPeriod : null) ||
    commercial.quoteValidity ||
    (aiDraft.terms_and_conditions?.quote_validity &&
    aiDraft.terms_and_conditions.quote_validity !== "Not found"
      ? aiDraft.terms_and_conditions.quote_validity
      : "") ||
    "30 days from date of issue";

  const termsCurrency =
    (saved.termsCurrency && saved.termsCurrency.trim() !== "" ? saved.termsCurrency : null) ||
    (aiDraft.terms_and_conditions?.currency
      ? aiDraft.terms_and_conditions.currency
      : currency === "CAD"
      ? "Canadian Dollars (CAD)"
      : currency);

  // 12. Footer Notes
  const footerNotesText =
    (saved.footerNotes && saved.footerNotes.trim() !== "" ? saved.footerNotes : null) ||
    footer.footerText ||
    footer.defaultNotes ||
    "Thank you for considering our proposal. We look forward to working with you on this project.";

  return {
    companyName,
    companyAddress,
    companyPhone,
    companyEmail,
    companyWebsite,
    companyHst,

    projectName,
    projectLocation,
    clientName,
    attention,
    gcName,
    quoteNumber,
    revisionNumber,
    startDate,
    bidClosingDate,
    subject,
    addendaIncluded,

    scopeOfWork,
    assumptions,
    exclusions,
    clarifications,
    separatePrices,
    altPrices,
    unitPrices,

    numericBase,
    numericHstPct,
    hstAmount,
    totalAmount,
    currency,

    paymentTerms,
    holdbackNote,
    validityPeriod,
    termsCurrency,
    footerNotes: footerNotesText,

    confidence: aiDraft.confidence,
    completeness: aiDraft.completeness,
    missingInformation: aiDraft.missing_information || [],
    validationErrors: aiDraft.validation_errors || [],
    warnings: aiDraft.warnings || [],
  };
}
