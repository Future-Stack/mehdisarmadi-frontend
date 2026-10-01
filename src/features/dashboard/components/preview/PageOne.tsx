import { cn } from "@/lib/utils";
import { DocFooter } from "./DocFooter";
import { DocumentHeader } from "./DocumentHeader";
import { resolveQuoteData } from "./resolveQuoteData";

/* ─── Shared section heading component ─── */
const SectionHeading = ({ label }: { label: string }) => (
    <div className="flex items-center gap-3 mb-4">
        <div className="w-1 h-5 rounded-full bg-emerald-500 flex-shrink-0" />
        <h3 className="text-[11px] font-black text-gray-700 uppercase tracking-[0.1em]">{label}</h3>
        <div className="flex-1 h-px bg-gray-100" />
    </div>
);

/* ─── PAGE 1: Tender Info + Scope + Assumptions ─── */
export const PageOne = ({ exportMode, quoteData }: { exportMode?: boolean; quoteData?: any }) => {
    const resolved = resolveQuoteData(quoteData);

    return (
        <div className={exportMode
            ? "bg-white text-gray-900 font-sans"
            : "bg-white text-gray-900 shadow-2xl border border-gray-200 mx-auto w-full max-w-full min-h-[1100px] flex flex-col font-sans rounded-xl overflow-hidden"
        }>
            {exportMode ? (
                <div id="export-header" className="px-0 pt-0 pb-0">
                    <DocumentHeader showFull quoteData={quoteData} />
                </div>
            ) : (
                <DocumentHeader showFull quoteData={quoteData} />
            )}

            {/* Prepared For */}
            <div
                className={cn(
                    exportMode ? "export-section px-0 mb-0" : "export-section px-12 mb-6"
                )}
            >
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-xl p-5">
                    <div className="text-[9px] font-black text-emerald-600 uppercase tracking-[0.12em] mb-2">Prepared For</div>
                    <div className="text-[14px] font-bold text-gray-900">{resolved.clientName || "Client Name"}</div>
                    {resolved.attention && <div className="text-[11px] text-gray-500 mt-1">Attn: {resolved.attention}</div>}
                    {resolved.gcName && <div className="text-[11px] text-gray-500">General Contractor: {resolved.gcName}</div>}
                </div>
            </div>

            {/* Tender Information Table */}
            <div
                className={cn(
                    exportMode ? "export-section px-0 mb-0" : "export-section px-12 mb-6"
                )}
            >
                <SectionHeading label="Tender Information" />
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                    <table className="w-full text-[11px] border-collapse">
                        <tbody>
                            {[
                                { label: "Tender Name", value: resolved.projectName },
                                { label: "Tender Address", value: resolved.projectLocation },
                                { label: "Client Name", value: resolved.clientName },
                                { label: "Attention", value: resolved.attention },
                                { label: "General Contractor", value: resolved.gcName },
                                { label: "Quote Number", value: resolved.quoteNumber },
                                { label: "Issue Date", value: resolved.startDate },
                                { label: "Revision Number", value: resolved.revisionNumber },
                                { label: "Bid Closing Date", value: resolved.bidClosingDate },
                                { label: "Addenda Included", value: resolved.addendaIncluded },
                                { label: "Scope / Subject", value: resolved.subject },
                            ].filter(r => Boolean(r.value)).map((row, i) => (
                                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/60"}>
                                    <td className="py-2.5 px-4 font-bold text-gray-500 w-44 text-[10px] uppercase tracking-wider">{row.label}</td>
                                    <td className="py-2.5 px-4 font-medium text-gray-900">{row.value}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Scope of Work */}
            <div
                className={cn(
                    exportMode ? "export-section px-0 mb-0" : "export-section px-12 mb-6"
                )}
            >
                <SectionHeading label="Scope of Work" />
                <div className="text-[11px] text-gray-600 leading-relaxed space-y-3">
                    {resolved.scopeOfWork && resolved.scopeOfWork.length > 0 ? (
                        resolved.scopeOfWork.map((item: string, i: number) => (
                            <div key={i} className="flex gap-3">
                                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                                <div>{item}</div>
                            </div>
                        ))
                    ) : (
                        <span className="text-gray-400 italic">No Scope of Work items listed</span>
                    )}
                </div>
            </div>

            {/* Assumptions */}
            <div
                className={cn(
                    exportMode ? "export-section px-0 mb-0" : "export-section px-12 mb-6"
                )}
            >
                <SectionHeading label="Assumptions" />
                <ul className="space-y-1.5 text-[11px] leading-relaxed text-gray-600">
                    {resolved.assumptions && resolved.assumptions.length > 0 ? (
                        resolved.assumptions.map((item: string, i: number) => (
                            <li key={i} className="flex gap-2.5">
                                <span className="text-emerald-500 mt-0.5 flex-shrink-0">✓</span>
                                <span>{item}</span>
                            </li>
                        ))
                    ) : (
                        <span className="text-gray-400 italic">No Assumptions listed</span>
                    )}
                </ul>
            </div>

            {!exportMode && (
                <div className="mt-6">
                    <DocFooter quoteData={quoteData} />
                </div>
            )}
        </div>
    );
};