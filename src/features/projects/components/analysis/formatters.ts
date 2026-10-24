/* eslint-disable @typescript-eslint/no-explicit-any */

function formatCurrency(num: number | null | undefined): string {
  if (num === null || num === undefined || isNaN(Number(num))) return "$0.00";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(num));
}

function formatSource(source: any): string {
  if (!source) return "";
  const parts: string[] = [];
  const file = source.file || source.document;
  if (file) parts.push(file);
  if (source.sheet) parts.push(`Sheet: ${source.sheet}`);
  if (source.page) parts.push(`p.${source.page}`);
  if (source.section) parts.push(`Sec: ${source.section}`);
  return parts.length ? `[Source: ${parts.join(", ")}]` : "";
}

export function formatAnalysisPayloadToMarkdown(
  section: string,
  payload: any,
  meta?: any
): string {
  if (!payload) {
    return `### No analysis data available for ${section}.\n\nUse the prompt input below to ask the AI to generate an analysis.`;
  }

  // 1. If payload is a plain string
  if (typeof payload === "string") {
    return payload.trim();
  }

  // 2. If payload has raw text/markdown properties
  if (typeof payload.markdown === "string" && payload.markdown.trim()) {
    return payload.markdown.trim();
  }
  if (typeof payload.raw_text === "string" && payload.raw_text.trim()) {
    return payload.raw_text.trim();
  }
  if (typeof payload.text === "string" && payload.text.trim()) {
    return payload.text.trim();
  }
  if (typeof payload.content === "string" && payload.content.trim()) {
    return payload.content.trim();
  }
  if (typeof payload.response === "string" && payload.response.trim()) {
    return payload.response.trim();
  }

  const s = section.toLowerCase();

  // ─── SUMMARY ──────────────────────────────────────────────────────────────
  if (s === "summary") {
    const lines: string[] = [];
    lines.push("# 📊 Project Executive Summary");
    lines.push("");

    const stats: string[] = [];
    if (payload.estimated_value !== undefined && payload.estimated_value !== null) {
      stats.push(`**Estimated Value:** ${formatCurrency(payload.estimated_value)}`);
    }
    if (payload.duration_weeks) {
      stats.push(`**Estimated Duration:** ${payload.duration_weeks} Weeks`);
    }
    if (payload.labor_hours) {
      stats.push(`**Labor Required:** ${payload.labor_hours.toLocaleString()} Hours`);
    }
    if (payload.total_items) {
      stats.push(`**Total Scope Items:** ${payload.total_items}`);
    }
    if (stats.length) {
      lines.push(stats.join("  |  "));
      lines.push("");
    }

    if (Array.isArray(payload.selected_divisions) && payload.selected_divisions.length) {
      lines.push("### 🏷️ Applicable CSI Divisions");
      payload.selected_divisions.forEach((d: any) => {
        lines.push(`- **Div ${d.code}** — ${d.name}`);
      });
      lines.push("");
    }

    if (Array.isArray(payload.key_highlights) && payload.key_highlights.length) {
      lines.push("---");
      lines.push("## 💡 Key Highlights & Critical Focus Areas");
      lines.push("");
      payload.key_highlights.forEach((h: any, idx: number) => {
        const typeTag = h.type ? `[${h.type.toUpperCase()}] ` : "";
        lines.push(`### ${idx + 1}. ${typeTag}${h.title || "Highlight"}`);
        if (h.description) {
          lines.push(`${h.description}`);
        }
        lines.push("");
      });
    }

    return lines.join("\n").trim();
  }

  // ─── SCOPE ────────────────────────────────────────────────────────────────
  if (s === "scope") {
    const lines: string[] = [];
    lines.push("# 📋 Scope of Work Breakdown");
    lines.push("");

    const items = Array.isArray(payload.items) ? payload.items : [];
    if (payload.confidence) lines.push(`**Confidence:** ${payload.confidence}  |  **Total Items:** ${items.length}`);
    if (payload.warnings && Array.isArray(payload.warnings) && payload.warnings.length) {
      lines.push(`**Warnings:** ${payload.warnings.join("; ")}`);
    }
    lines.push("");

    // Group items by division
    const grouped: Record<string, any[]> = {};
    items.forEach((item: any) => {
      const div = item.division ? `Division ${String(item.division).padStart(2, "0")}` : "General Scope";
      if (!grouped[div]) grouped[div] = [];
      grouped[div].push(item);
    });

    Object.entries(grouped).forEach(([divName, divItems]) => {
      lines.push(`## ${divName}`);
      lines.push("");
      divItems.forEach((item: any) => {
        const title = item.scopeItem || item.description || item.title || "Scope Item";
        const includeStatus = item.include === false ? " ⚠️ *(Excluded from Base)*" : "";
        lines.push(`- **${title}**${includeStatus}`);
        
        if (item.location) lines.push(`  • **Location:** ${item.location}`);
        if (item.quantity && item.quantity.value) {
          lines.push(`  • **Quantity:** ${item.quantity.value} ${item.quantity.unit || ""}`);
        }
        if (item.work_type) lines.push(`  • **Work Type:** ${item.work_type}`);
        if (item.notes) lines.push(`  • **Notes:** ${item.notes}`);
        if (item.inclusions && item.inclusions.length) {
          lines.push(`  • **Inclusions:** ${item.inclusions.join(", ")}`);
        }
        const src = formatSource(item.source);
        if (src) lines.push(`  • ${src}`);
        lines.push("");
      });
    });

    return lines.join("\n").trim();
  }

  // ─── PRICING ──────────────────────────────────────────────────────────────
  if (s === "pricing") {
    const lines: string[] = [];
    lines.push("# 💰 Pricing & Estimate Breakdown");
    lines.push("");

    const total = payload.priced_scope_total || payload.stated_total;
    if (total) lines.push(`**Total Estimated Value:** ${formatCurrency(total)}`);
    if (payload.confidence) lines.push(`**Confidence Level:** ${payload.confidence}`);
    if (payload.breakdown_note) lines.push(`**Notes:** ${payload.breakdown_note}`);
    lines.push("");

    const breakdown = Array.isArray(payload.aiDraftEstimateBreakdown)
      ? payload.aiDraftEstimateBreakdown
      : Array.isArray(payload.items)
      ? payload.items
      : [];

    if (breakdown.length) {
      lines.push("## Itemized Cost Estimates");
      lines.push("");
      lines.push("| Division | Description | Qty | Unit | Unit Rate | Total Amount |");
      lines.push("|---|---|---|---|---|---|");
      breakdown.forEach((item: any) => {
        const div = item.division ? `Div ${item.division}` : "-";
        const desc = item.name || item.description || "Item";
        const qty = item.quantity !== undefined && item.quantity !== null ? item.quantity : "-";
        const unit = item.unit || "-";
        const rate = item.unit_rate ? formatCurrency(item.unit_rate) : "-";
        const amt = item.amount || item.total_price ? formatCurrency(item.amount || item.total_price) : "-";
        lines.push(`| ${div} | ${desc} | ${qty} | ${unit} | ${rate} | ${amt} |`);
      });
      lines.push("");
    }

    if (Array.isArray(payload.additionalCostItems) && payload.additionalCostItems.length) {
      lines.push("### Additional Cost Allowances & Indirects");
      payload.additionalCostItems.forEach((item: any) => {
        lines.push(`- **${item.name}:** ${item.amount ? formatCurrency(item.amount) : "TBD"} — ${item.description || ""}`);
      });
      lines.push("");
    }

    if (Array.isArray(payload.pricingBasisAndReasoning) && payload.pricingBasisAndReasoning.length) {
      lines.push("### Pricing Basis & Methodology");
      payload.pricingBasisAndReasoning.forEach((item: any) => {
        lines.push(`- **${item.title}:** ${item.description}`);
      });
      lines.push("");
    }

    return lines.join("\n").trim();
  }

  // ─── RISKS ────────────────────────────────────────────────────────────────
  if (s === "risks") {
    const lines: string[] = [];
    lines.push("# ⚠️ Risk Assessment & Mitigation Matrix");
    lines.push("");

    const items = Array.isArray(payload.items) ? payload.items : [];
    lines.push(`**Total Identified Risks:** ${items.length}`);
    lines.push("");

    items.forEach((risk: any, idx: number) => {
      const sev = (risk.severity || "MEDIUM").toUpperCase();
      const emoji = sev === "HIGH" || sev === "CRITICAL" ? "🔴" : sev === "LOW" ? "🟢" : "🟡";
      lines.push(`### ${emoji} ${idx + 1}. [${sev}] ${risk.title || "Risk Item"}`);
      if (risk.category) lines.push(`- **Category:** ${risk.category}`);
      if (risk.description) lines.push(`- **Description:** ${risk.description}`);
      if (risk.trigger) lines.push(`- **Trigger Event:** ${risk.trigger}`);
      if (risk.probability) lines.push(`- **Probability:** ${risk.probability}`);
      if (risk.cost_impact) lines.push(`- **Cost Impact:** ${risk.cost_impact}`);
      if (risk.schedule_impact) lines.push(`- **Schedule Impact:** ${risk.schedule_impact}`);
      if (risk.mitigation) lines.push(`- **Mitigation Strategy:** ${risk.mitigation}`);
      const src = formatSource(risk.reference);
      if (src) lines.push(`- ${src}`);
      lines.push("");
    });

    return lines.join("\n").trim();
  }

  // ─── CLARIFICATIONS ───────────────────────────────────────────────────────
  if (s === "clarifications") {
    const lines: string[] = [];
    lines.push("# ❓ Tender Clarifications & RFI Questions");
    lines.push("");

    const items = Array.isArray(payload.items) ? payload.items : [];
    lines.push(`**Items Flagged for Clarification:** ${items.length}`);
    lines.push("");

    items.forEach((item: any, idx: number) => {
      const priority = item.priority ? `[Priority: ${item.priority.toUpperCase()}] ` : "";
      lines.push(`### ${idx + 1}. ${priority}${item.question || "Clarification Item"}`);
      if (item.reason) lines.push(`- **Reason / Ambiguity:** ${item.reason}`);
      if (item.impact_if_unresolved) lines.push(`- **Impact if Unresolved:** ${item.impact_if_unresolved}`);
      if (item.requested_from) lines.push(`- **Directed To:** ${item.requested_from}`);
      if (item.risk_category) lines.push(`- **Risk Category:** ${item.risk_category}`);
      const src = formatSource(item.reference);
      if (src) lines.push(`- ${src}`);
      lines.push("");
    });

    return lines.join("\n").trim();
  }

  // ─── ASSUMPTIONS ──────────────────────────────────────────────────────────
  if (s === "assumptions") {
    const lines: string[] = [];
    lines.push("# 📝 Estimator Assumptions & Bidding Basis");
    lines.push("");

    const items = Array.isArray(payload.items) ? payload.items : [];
    lines.push(`**Documented Assumptions:** ${items.length}`);
    lines.push("");

    items.forEach((item: any, idx: number) => {
      const title = item.text || item.title || `Assumption #${idx + 1}`;
      lines.push(`### ${idx + 1}. ${title}`);
      if (item.basis) lines.push(`- **Bidding Basis:** ${item.basis}`);
      if (item.assumption_type) lines.push(`- **Category / Type:** ${item.assumption_type}`);
      if (item.impact_if_false) lines.push(`- **Impact if Invalid:** ${item.impact_if_false}`);
      if (item.status) lines.push(`- **Status:** ${item.status}`);
      const src = formatSource(item.reference);
      if (src) lines.push(`- ${src}`);
      lines.push("");
    });

    return lines.join("\n").trim();
  }

  // ─── EXCLUSIONS ───────────────────────────────────────────────────────────
  if (s === "exclusions") {
    const lines: string[] = [];
    lines.push("# 🚫 Scope Exclusions & Trade Boundaries");
    lines.push("");

    const items = Array.isArray(payload.items) ? payload.items : [];
    lines.push(`**Total Stated Exclusions:** ${items.length}`);
    lines.push("");

    items.forEach((item: any, idx: number) => {
      const title = item.text || item.title || `Exclusion #${idx + 1}`;
      const div = item.division ? ` *(Div ${item.division})*` : "";
      lines.push(`### ${idx + 1}. ${title}${div}`);
      if (item.reason) lines.push(`- **Reason:** ${item.reason}`);
      if (item.category) lines.push(`- **Category:** ${item.category}`);
      if (item.assigned_to) lines.push(`- **Assigned To / Covered By:** ${item.assigned_to}`);
      if (item.exclusion_type) lines.push(`- **Exclusion Type:** ${item.exclusion_type}`);
      const src = formatSource(item.reference);
      if (src) lines.push(`- ${src}`);
      lines.push("");
    });

    return lines.join("\n").trim();
  }

  // ─── ADDENDA ──────────────────────────────────────────────────────────────
  if (s === "addenda") {
    const lines: string[] = [];
    lines.push("# 📑 Addenda Review & Modification Log");
    lines.push("");

    const items = Array.isArray(payload.items) ? payload.items : [];
    lines.push(`**Addenda Documents Analyzed:** ${items.length}`);
    lines.push("");

    items.forEach((item: any, idx: number) => {
      const title = item.title || `Addendum Item #${idx + 1}`;
      lines.push(`### ${title}`);
      if (item.description || item.text) lines.push(`${item.description || item.text}`);
      const src = formatSource(item.reference);
      if (src) lines.push(`\n*${src}*`);
      lines.push("");
    });

    return lines.join("\n").trim();
  }

  // ─── FALLBACK GENERIC PARSER ──────────────────────────────────────────────
  try {
    return JSON.stringify(payload, null, 2);
  } catch {
    return String(payload);
  }
}
