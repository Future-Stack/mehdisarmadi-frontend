import { cn } from "@/lib/utils";
import { DocFooter } from "./DocFooter";
import { DocumentHeader } from "./DocumentHeader";

const SectionHeading = ({ label }: { label: string }) => (
    <div className="flex items-center gap-3 mb-4">
        <div className="w-1 h-5 rounded-full bg-emerald-500 flex-shrink-0" />
        <h3 className="text-[11px] font-black text-gray-700 uppercase tracking-[0.1em]">{label}</h3>
        <div className="flex-1 h-px bg-gray-100" />
    </div>
);

// export const UNIT_PRICES = [
//     { id: "UP-01", description: "Epoxy Repair", type: "Per square foot", estimate: "$15" },
//     { id: "UP-02", description: "Decking Replacement", type: "Per square foot", estimate: "$30" },
// ];

export const PageThree = ({ exportMode, quoteData }: { exportMode?: boolean; quoteData?: any }) => {
    const q = quoteData?.savedQuote || {};
    const unitPrices = q.unitPrices && Array.isArray(q.unitPrices) && q.unitPrices.length > 0 ? q.unitPrices : [];

    const numericBase = typeof q.baseBidPrice === 'string' ? Number(q.baseBidPrice.replace(/[^0-9.-]+/g, "")) : (q.baseBidPrice || 485000);
    const numericHstPct = typeof q.hstPercentage === 'string' ? Number(q.hstPercentage.replace(/[^0-9.-]+/g, "")) : (q.hstPercentage || 13);
    const hstAmount = (numericBase * numericHstPct) / 100;
    const totalAmount = numericBase + hstAmount;

    return (
        <div className={exportMode
            ? "bg-white text-gray-900 font-sans"
            : "bg-white text-gray-900 shadow-2xl border border-gray-200 mx-auto w-full max-w-[850px] min-h-[1100px] flex flex-col font-sans rounded-xl overflow-hidden"
        }>
            {!exportMode && <DocumentHeader showFull quoteData={quoteData} />}

            {/* Unit Prices */}
            {/* <div className={`mb-8 px-12 ${exportMode ? 'export-section pt-10' : ''}`}> */}
            <div
                className={cn(
                    exportMode ? "export-section px-0 mb-0" : "export-section px-12 mb-6"
                )}
            >

                <SectionHeading label="Unit Prices" />
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
            </div>

            {/* Pricing Summary */}
            {/* <div className={`mb-8 px-12 ${exportMode ? 'export-section' : ''}`}> */}
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
                                <td className="px-5 py-3 text-right font-semibold text-gray-900">{q.currency || "CAD"} ${numericBase.toLocaleString()}</td>
                            </tr>
                            <tr className="bg-gray-50/60">
                                <td className="px-5 py-3 text-gray-700 font-medium">HST ({numericHstPct}%)</td>
                                <td className="px-5 py-3 text-right font-semibold text-gray-900">{q.currency || "CAD"} ${hstAmount.toLocaleString()}</td>
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
                        {q.currency || "CAD"} ${totalAmount.toLocaleString()}
                    </div>
                </div>
            </div>

            {/* Commercial Terms */}
            {/* <div className={`flex-1 px-12 ${exportMode ? 'export-section' : ''}`}>  */}
            <div
                className={cn(
                    exportMode ? "export-section px-0 mb-0" : "export-section px-12 mb-6"
                )}
            >

                <SectionHeading label="Commercial Terms" />
                <div className="grid grid-cols-2 gap-4">
                    {[
                        { label: "Payment Terms", value: q.paymentTerms || "Progress payments monthly based on work completed. Net 30 days from invoice date." },
                        { label: "Holdback", value: q.holdbackNote || "10% holdback as per Construction Act requirements until final completion." },
                        { label: "Quote Validity", value: q.validityPeriod || "30 days from date of issue" },
                        { label: "Currency", value: q.currency === 'CAD' ? 'Canadian Dollars (CAD)' : (q.currency || 'Canadian Dollars (CAD)') },
                    ].map((item, i) => (
                        <div key={i} className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                            <div className="text-[9px] font-black text-emerald-600 uppercase tracking-[0.12em] mb-1.5">{item.label}</div>
                            <p className="text-[11px] text-gray-700 leading-relaxed">{item.value}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer Notes */}
            {q.footerNotes && (
                // <div className={`px-12 mt-4 ${exportMode ? 'export-section' : ''}`}>
                <div
                    className={cn(
                        exportMode ? "export-section px-0 mb-0" : "export-section px-12 mb-6"
                    )}
                >
                    <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-4">
                        <div className="text-[9px] font-black text-amber-600 uppercase tracking-[0.12em] mb-1.5">Additional Notes</div>
                        <p className="text-[11px] text-gray-600 leading-relaxed italic">{q.footerNotes}</p>
                    </div>
                </div>
            )}

            {exportMode ? (
                <div id="export-footer" className="mt-6">
                    <DocFooter quoteData={quoteData} />
                </div>
            ) : (
                <div className="mt-6">
                    <DocFooter quoteData={quoteData} />
                </div>
            )}
        </div>
    );
}