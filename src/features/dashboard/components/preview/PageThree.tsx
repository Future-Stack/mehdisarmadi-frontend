import { cn } from "@/lib/utils";
import { DocFooter } from "./DocFooter";
import { DocumentHeader } from "./DocumentHeader";
import { resolveQuoteData } from "./resolveQuoteData";

const SectionHeading = ({ label }: { label: string }) => (
    <div className="flex items-center gap-3 mb-4">
        <div className="w-1 h-5 rounded-full bg-emerald-500 flex-shrink-0" />
        <h3 className="text-[11px] font-black text-gray-700 uppercase tracking-[0.1em]">{label}</h3>
        <div className="flex-1 h-px bg-gray-100" />
    </div>
);

export const PageThree = ({ exportMode, quoteData }: { exportMode?: boolean; quoteData?: any }) => {
    const resolved = resolveQuoteData(quoteData);
    const unitPrices = resolved.unitPrices;

    return (
        <div className={exportMode
            ? "bg-white text-gray-900 font-sans"
            : "bg-white text-gray-900 shadow-2xl border border-gray-200 mx-auto w-full max-w-[850px] min-h-[1100px] flex flex-col font-sans rounded-xl overflow-hidden"
        }>
            {!exportMode && <DocumentHeader showFull quoteData={quoteData} />}

            {/* Unit Prices */}
            <div
                className={cn(
                    exportMode ? "export-section px-0 mb-0" : "export-section px-12 mb-6"
                )}
            >
                <SectionHeading label="Unit Prices" />
                {unitPrices && unitPrices.length > 0 ? (
                    <div className="border border-gray-200 rounded-xl overflow-hidden">
                        <table className="w-full text-left text-[11px]">
                            <thead>
                                <tr className="bg-gradient-to-r from-gray-800 to-gray-700 text-white">
                                    <th className="px-4 py-3 font-bold text-[10px] uppercase tracking-wider w-20">Item</th>
                                    <th className="px-4 py-3 font-bold text-[10px] uppercase tracking-wider">Description</th>
                                    <th className="px-4 py-3 font-bold text-[10px] uppercase tracking-wider">Unit Type</th>
                                    <th className="px-4 py-3 font-bold text-[10px] uppercase tracking-wider text-right">Unit Price</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {unitPrices.map((p: any, i: number) => (
                                    <tr key={p.id || i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/60"}>
                                        <td className="px-4 py-3 font-bold text-emerald-600 text-[10px]">{p.id}</td>
                                        <td className="px-4 py-3 font-medium text-gray-800">{p.description}</td>
                                        <td className="px-4 py-3 text-gray-500">{p.unit || p.type}</td>
                                        <td className="px-4 py-3 font-bold text-gray-900 text-right">{p.unitPrice || p.estimate}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="bg-gray-50/50 border border-dashed border-gray-200 rounded-xl p-4 text-center text-[11px] text-gray-500">
                        No unit prices requested by tender
                    </div>
                )}
            </div>

            {/* Pricing Summary */}
            <div
                className={cn(
                    exportMode ? "export-section px-0 mb-0" : "export-section px-12 mb-6"
                )}
            >
                <SectionHeading label="Pricing Summary" />
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-[11px]">
                        <thead>
                            <tr className="bg-gradient-to-r from-gray-800 to-gray-700 text-white">
                                <th className="px-5 py-3 font-bold text-[10px] uppercase tracking-wider">Description</th>
                                <th className="px-5 py-3 font-bold text-[10px] uppercase tracking-wider text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            <tr className="bg-white">
                                <td className="px-5 py-3 text-gray-700 font-medium">Base Bid Price</td>
                                <td className="px-5 py-3 text-right font-semibold text-gray-900">
                                    {resolved.currency} ${resolved.numericBase.toLocaleString()}
                                </td>
                            </tr>
                            <tr className="bg-gray-50/60">
                                <td className="px-5 py-3 text-gray-700 font-medium">HST ({resolved.numericHstPct}%)</td>
                                <td className="px-5 py-3 text-right font-semibold text-gray-900">
                                    {resolved.currency} ${resolved.hstAmount.toLocaleString()}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Grand Total */}
                <div className="mt-4 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl px-6 py-5 flex justify-between items-center shadow-lg shadow-emerald-500/20">
                    <div>
                        <div className="text-[10px] font-black text-emerald-100 uppercase tracking-[0.14em] mb-0.5">Total Quoted Price</div>
                        <div className="text-[11px] text-emerald-200/70">All taxes included</div>
                    </div>
                    <div className="text-[26px] font-black tracking-tight text-white">
                        {resolved.currency} ${resolved.totalAmount.toLocaleString()}
                    </div>
                </div>
            </div>

            {/* Commercial Terms */}
            <div
                className={cn(
                    exportMode ? "export-section px-0 mb-0" : "export-section px-12 mb-6"
                )}
            >
                <SectionHeading label="Commercial Terms" />
                <div className="grid grid-cols-2 gap-4">
                    {[
                        { label: "Payment Terms", value: resolved.paymentTerms },
                        { label: "Holdback", value: resolved.holdbackNote },
                        { label: "Quote Validity", value: resolved.validityPeriod },
                        { label: "Currency", value: resolved.termsCurrency },
                    ].map((item, i) => (
                        <div key={i} className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                            <div className="text-[9px] font-black text-emerald-600 uppercase tracking-[0.12em] mb-1.5">{item.label}</div>
                            <p className="text-[11px] text-gray-700 leading-relaxed">{item.value}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer Notes */}
            {resolved.footerNotes && (
                <div
                    className={cn(
                        exportMode ? "export-section px-0 mb-0" : "export-section px-12 mb-6"
                    )}
                >
                    <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-4">
                        <div className="text-[9px] font-black text-amber-600 uppercase tracking-[0.12em] mb-1.5">Additional Notes</div>
                        <p className="text-[11px] text-gray-600 leading-relaxed italic">{resolved.footerNotes}</p>
                    </div>
                </div>
            )}

            {!exportMode && (
                <div className="mt-6">
                    <DocFooter quoteData={quoteData} />
                </div>
            )}
        </div>
    );
};