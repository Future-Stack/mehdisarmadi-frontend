"use client";

import React from "react";
import {
  useGetProjectSummaryQuery,
  useGetProjectScopeQuery,
  useGetProjectAssumptionsQuery,
  useGetProjectExclusionsQuery,
  useGetProjectRisksQuery,
  useGetProjectClarificationsQuery,
  useGetProjectAddendaQuery,
  useGetProjectPricingQuery,
  useGetProjectByIdQuery,
} from "@/store/api/projectApi";
import { cn } from "@/lib/utils";

// ─── Helper: section block ────────────────────────────────────────────────────
function SectionBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="export-section" style={{ marginBottom: 32 }}>
      <h2 style={{
        fontSize: 15, fontWeight: 700, color: "#111827",
        borderBottom: "2px solid #10b981", paddingBottom: 6, marginBottom: 14,
        textTransform: "uppercase", letterSpacing: "0.05em",
      }}>{title}</h2>
      {children}
    </div>
  );
}

function ItemRow({ index, text, reference }: { index: number; text: string; reference?: any }) {
  return (
    <div style={{ marginBottom: 10, paddingLeft: 12, borderLeft: "3px solid #d1fae5" }}>
      <p style={{ fontSize: 12, color: "#374151", margin: 0, lineHeight: 1.6 }}>
        <span style={{ fontWeight: 700, color: "#10b981", marginRight: 6 }}>{index}.</span>
        {text}
      </p>
      {reference?.file && (
        <p style={{ fontSize: 10, color: "#9ca3af", margin: "2px 0 0 18px", fontStyle: "italic" }}>
          📄 {reference.file}{reference.page ? ` • p.${reference.page}` : ""}{reference.section ? ` • ${reference.section}` : ""}
        </p>
      )}
    </div>
  );
}

// ─── Main Export View ─────────────────────────────────────────────────────────
export default function AnalysisExportView({ projectId, onReady }: { projectId: string; onReady?: () => void }) {
  const { data: summaryData, isFetching: isSummaryFetching } = useGetProjectSummaryQuery(projectId);
  const { data: scopeData, isFetching: isScopeFetching } = useGetProjectScopeQuery(projectId);
  const { data: assumptionsData, isFetching: isAssumptionsFetching } = useGetProjectAssumptionsQuery(projectId);
  const { data: exclusionsData, isFetching: isExclusionsFetching } = useGetProjectExclusionsQuery(projectId);
  const { data: risksData, isFetching: isRisksFetching } = useGetProjectRisksQuery(projectId);
  const { data: clarificationsData, isFetching: isClarificationsFetching } = useGetProjectClarificationsQuery(projectId);
  const { data: addendaData, isFetching: isAddendaFetching } = useGetProjectAddendaQuery(projectId);
  const { data: pricingData, isFetching: isPricingFetching } = useGetProjectPricingQuery(projectId);
  const { data: projectData, isFetching: isProjectFetching } = useGetProjectByIdQuery(projectId);

  React.useEffect(() => {
    if (
      !isSummaryFetching &&
      !isScopeFetching &&
      !isAssumptionsFetching &&
      !isExclusionsFetching &&
      !isRisksFetching &&
      !isClarificationsFetching &&
      !isAddendaFetching &&
      !isPricingFetching &&
      !isProjectFetching
    ) {
      // Small delay to ensure React has fully flushed the DOM with the new data
      const t = setTimeout(() => {
        onReady?.();
      }, 300);
      return () => clearTimeout(t);
    }
  }, [
    isSummaryFetching, isScopeFetching, isAssumptionsFetching, isExclusionsFetching,
    isRisksFetching, isClarificationsFetching, isAddendaFetching, isPricingFetching,
    isProjectFetching, onReady
  ]);

  const project = projectData?.data;
  const summary = summaryData?.data;
  const scope = scopeData?.data;
  const assumptions = assumptionsData?.data;
  const exclusions = exclusionsData?.data;
  const risks = risksData?.data;
  const clarifications = clarificationsData?.data;
  const addenda = addendaData?.data;
  const pricing = pricingData?.data;

  const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  return (
    <div
      id="analysis-export-content"
      style={{
        fontFamily: "'Segoe UI', Arial, sans-serif",
        backgroundColor: "#ffffff",
        color: "#111827",
        width: 794, // A4 width in px at 96dpi
        margin: "0 auto",
        padding: 0,
      }}
    >
      {/* ── HEADER (only on first page visually, first element) ── */}
      <div id="export-header" style={{
        backgroundColor: "#0f172a",
        color: "#ffffff",
        padding: "28px 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* Logo area */}
          <div style={{
            width: 40, height: 40, borderRadius: 8,
            backgroundColor: "#10b981",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 900, fontSize: 18, color: "#fff",
          }}>R</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 18, letterSpacing: "-0.01em" }}>Renofield</div>
            <div style={{ fontSize: 10, color: "#94a3b8" }}>AI Analysis Report</div>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontWeight: 700, fontSize: 12, color: "#e2e8f0" }}>
            {project?.name || "Project Analysis"}
          </div>
          <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 2 }}>{today}</div>
        </div>
      </div>

      {/* ── META STRIP ── */}
      <div className="export-section" style={{
        backgroundColor: "#f0fdf4", borderBottom: "1px solid #d1fae5",
        padding: "14px 40px", display: "flex", gap: 32, flexWrap: "wrap",
        marginBottom: 20,
      }}>
        {[
          { label: "Project", value: project?.name },
          { label: "Client", value: project?.clientName },
          { label: "Closing Date", value: project?.closingDate ? new Date(project.closingDate).toLocaleDateString() : undefined },
          { label: "Divisions", value: summary?.selected_divisions?.map((d: any) => d.name).join(", ") },
        ].filter(f => f.value).map((f) => (
          <div key={f.label}>
            <div style={{ fontSize: 9, fontWeight: 700, color: "#10b981", textTransform: "uppercase", letterSpacing: "0.06em" }}>{f.label}</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#111827" }}>{f.value}</div>
          </div>
        ))}
      </div>

      {/* ── BODY ── */}
      <div style={{ padding: "32px 40px" }}>

        {/* Key Highlights */}
        {summary?.key_highlights?.length > 0 && (
          <SectionBlock title="Summary Highlights">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {summary.key_highlights.map((h: any) => (
                <div key={h.id || h.type} style={{
                  border: "1px solid #e5e7eb", borderRadius: 8, padding: "10px 14px",
                  borderLeftWidth: 4, borderLeftColor: "#10b981",
                }}>
                  <div style={{ fontWeight: 700, fontSize: 11, color: "#111827", marginBottom: 2 }}>{h.title}</div>
                  <div style={{ fontSize: 10, color: "#6b7280" }}>{h.description}</div>
                </div>
              ))}
            </div>
          </SectionBlock>
        )}

        {/* Stats */}
        {(summary?.estimated_value || summary?.total_items) && (
          <SectionBlock title="Project Stats">
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              {[
                { label: "Estimated Value", value: summary?.estimated_value != null ? `$${summary.estimated_value.toLocaleString()}` : null },
                { label: "Total Items", value: summary?.total_items },
                { label: "Duration", value: summary?.duration_weeks ? `${summary.duration_weeks} wks` : null },
                { label: "Labor Hours", value: summary?.labor_hours },
              ].filter(s => s.value != null).map(s => (
                <div key={s.label} style={{
                  border: "1px solid #e5e7eb", borderRadius: 8, padding: "10px 20px", textAlign: "center", minWidth: 100,
                }}>
                  <div style={{ fontSize: 9, fontWeight: 700, color: "#6b7280", textTransform: "uppercase" }}>{s.label}</div>
                  <div style={{ fontSize: 16, fontWeight: 900, color: "#111827" }}>{String(s.value)}</div>
                </div>
              ))}
            </div>
          </SectionBlock>
        )}

        {/* Scope */}
        {scope?.items?.length > 0 && (
          <SectionBlock title="Scope of Work">
            {scope.items.map((item: any, i: number) => (
              <ItemRow
                key={item.id}
                index={i + 1}
                text={item.scopeItem || item.text || ""}
                reference={item.reference}
              />
            ))}
          </SectionBlock>
        )}

        {/* Assumptions */}
        {assumptions?.items?.length > 0 && (
          <SectionBlock title="Assumptions">
            {assumptions.items.map((item: any, i: number) => (
              <ItemRow key={item.id} index={i + 1} text={item.text} reference={item.reference} />
            ))}
          </SectionBlock>
        )}

        {/* Exclusions */}
        {exclusions?.items?.length > 0 && (
          <SectionBlock title="Exclusions">
            {exclusions.items.map((item: any, i: number) => (
              <ItemRow key={item.id} index={i + 1} text={item.text} reference={item.reference} />
            ))}
          </SectionBlock>
        )}

        {/* Risks */}
        {risks?.items?.length > 0 && (
          <SectionBlock title="Risks & Coordination Items">
            {risks.items.map((item: any, i: number) => (
              <div key={item.id} style={{ marginBottom: 12, padding: "10px 14px", borderRadius: 8, border: "1px solid #fee2e2", borderLeft: "4px solid #ef4444", backgroundColor: "#fff5f5" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#111827" }}>{item.title}</span>
                  <span style={{ fontSize: 9, fontWeight: 700, color: "#ef4444", backgroundColor: "#fee2e2", padding: "2px 8px", borderRadius: 4 }}>{item.category}</span>
                </div>
                <p style={{ fontSize: 10, color: "#6b7280", margin: 0 }}>{item.description}</p>
                {item.reference?.file && (
                  <p style={{ fontSize: 9, color: "#9ca3af", margin: "4px 0 0", fontStyle: "italic" }}>
                    📄 {item.reference.file}{item.reference.page ? ` • p.${item.reference.page}` : ""}
                  </p>
                )}
              </div>
            ))}
          </SectionBlock>
        )}

        {/* Clarifications */}
        {clarifications?.items?.length > 0 && (
          <SectionBlock title="Clarifications Needed">
            {clarifications.items.map((item: any, i: number) => (
              <ItemRow key={item.id} index={i + 1} text={item.question} reference={item.reference} />
            ))}
          </SectionBlock>
        )}

        {/* Pricing Summary */}
        {pricing?.comparison && (
          <SectionBlock title="Pricing Summary">
            <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
              <div style={{
                flex: 1, border: "1px solid #bfdbfe", borderRadius: 8, padding: "12px 16px", textAlign: "center",
                backgroundColor: "#eff6ff",
              }}>
                <div style={{ fontSize: 10, color: "#3b82f6", fontWeight: 700 }}>AI Draft Estimate</div>
                <div style={{ fontSize: 20, fontWeight: 900, color: "#1d4ed8" }}>
                  {pricing.comparison.aiDraftEstimate != null ? `$${pricing.comparison.aiDraftEstimate.toLocaleString()}` : "—"}
                </div>
              </div>
            </div>
            {pricing.additionalCostItems?.length > 0 && (
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#6b7280", marginBottom: 6, textTransform: "uppercase" }}>Additional Cost Items</div>
                {pricing.additionalCostItems.map((item: any, i: number) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 10px", borderBottom: "1px solid #f3f4f6", fontSize: 11 }}>
                    <div>
                      <span style={{ fontWeight: 600 }}>{item.name}</span>
                      {item.description && <span style={{ color: "#9ca3af", marginLeft: 8, fontSize: 10 }}>{item.description}</span>}
                    </div>
                    {item.amount && <span style={{ fontWeight: 700, color: "#111827" }}>${item.amount}</span>}
                  </div>
                ))}
              </div>
            )}
          </SectionBlock>
        )}

        {/* Addenda */}
        {addenda?.items?.length > 0 && (
          <SectionBlock title="Addenda Changes">
            {addenda.items.map((item: any, i: number) => (
              <div key={item.id} style={{ marginBottom: 12, paddingLeft: 12, borderLeft: "3px solid #10b981" }}>
                <div style={{ fontWeight: 700, fontSize: 11, color: "#111827" }}>{item.title || item.text}</div>
                {item.description && <p style={{ fontSize: 10, color: "#6b7280", margin: "2px 0 0" }}>{item.description}</p>}
                {item.reference?.file && (
                  <p style={{ fontSize: 9, color: "#9ca3af", margin: "2px 0 0", fontStyle: "italic" }}>📄 {item.reference.file}</p>
                )}
              </div>
            ))}
          </SectionBlock>
        )}

      </div>

      {/* ── FOOTER (only on last page visually, last element) ── */}
      <div id="export-footer" style={{
        backgroundColor: "#0f172a",
        color: "#94a3b8",
        padding: "20px 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontSize: 10,
        marginTop: 0,
      }}>
        <div>
          <div style={{ fontWeight: 700, color: "#e2e8f0", marginBottom: 2 }}>Renofield Inc.</div>
          <div>123 Main Street, Toronto, ON M5V 3A8</div>
          <div>Phone: +1 (416) 555-0123 | Email: info@renofield.com</div>
          <div>Website: www.renofield.com</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ color: "#e2e8f0", fontWeight: 700, marginBottom: 2 }}>AI Analysis Report</div>
          <div>Generated: {today}</div>
          <div>Confidential — For Internal Use Only</div>
        </div>
      </div>
    </div>
  );
}
