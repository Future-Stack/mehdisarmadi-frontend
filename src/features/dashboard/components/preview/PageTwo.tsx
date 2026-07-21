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

const Badge = ({ text, color = "emerald" }: { text: string; color?: "emerald" | "blue" }) => (
    <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${color === "emerald"
            ? "text-emerald-700 bg-emerald-100 border-emerald-200"
            : "text-blue-700 bg-blue-100 border-blue-200"
        }`}>{text}</span>
);

export const PageTwo = ({ exportMode, quoteData }: { exportMode?: boolean; quoteData?: any }) => {
    const q = quoteData?.savedQuote || {};
    return (
        <div className={exportMode
            ? "bg-white text-gray-900 font-sans"
            : "bg-white text-gray-900 shadow-2xl border border-gray-200 mx-auto w-full max-w-[850px] min-h-[1100px] flex flex-col font-sans rounded-xl overflow-hidden"
        }>
            {!exportMode && <DocumentHeader showFull quoteData={quoteData} />}

            {/* Exclusions */}
            {/* <div className={`mb-8 px-12 ${exportMode ? 'export-section pt-10' : ''}`}> */}
            <div
                className={cn(
                    exportMode ? "export-section px-0 mb-0" : "export-section px-12 mb-6"
                )}
            >

                <SectionHeading label="Exclusions" />
                <div className="bg-red-50/50 border border-red-100 rounded-xl p-5">
                    <ul className="space-y-2 text-[11px] leading-relaxed text-gray-600">
                        {q.exclusions && Array.isArray(q.exclusions) ? (
                            q.exclusions.map((item: string, i: number) => (
                                <li key={i} className="flex gap-2.5">
                                    <span className="text-red-400 mt-0.5 flex-shrink-0 font-bold">✕</span>
                                    <span>{item}</span>
                                </li>
                            ))
                        ) : (
                            <span>No exclusions listed</span>
                        )}
                    </ul>
                </div>
            </div>

            {/* Separate Prices */}
            {/* <div className={`mb-8 px-12 ${exportMode ? 'export-section' : ''}`}> */}
            <div
                className={cn(
                    exportMode ? "export-section px-0 mb-0" : "export-section px-12 mb-6"
                )}
            >

                <SectionHeading label="Separate Prices" />
                {q.separatePrices && Array.isArray(q.separatePrices) && q.separatePrices.length > 0 ? (
                    q.separatePrices.map((sp: any, i: number) => (
                        <div key={i} className="border border-gray-200 rounded-xl mb-4 overflow-hidden">
                            <div className="flex justify-between items-center px-5 py-3 bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-gray-200">
                                <div className="flex gap-2.5 items-center">
                                    <Badge text={sp.id || `SP-0${i + 1}`} color="emerald" />
                                    <span className="text-[12px] font-bold text-gray-900">{sp.title}</span>
                                </div>
                                <div className="text-[15px] font-black text-emerald-700">{sp.price}</div>
                            </div>
                            <div className="p-5 text-[11px] text-gray-600 space-y-3">
                                {sp.description && (
                                    <div>
                                        <div className="font-bold text-gray-800 mb-1">Description</div>
                                        <p>{sp.description}</p>
                                    </div>
                                )}
                                <div className="grid grid-cols-2 gap-4">
                                    {sp.scopeOfWork && (
                                        <div>
                                            <div className="font-bold text-gray-800 mb-1">Scope of Work</div>
                                            <p className="text-gray-600">{sp.scopeOfWork}</p>
                                        </div>
                                    )}
                                    {sp.assumptions && (
                                        <div>
                                            <div className="font-bold text-gray-800 mb-1">Assumptions</div>
                                            <p className="text-gray-600">{sp.assumptions}</p>
                                        </div>
                                    )}
                                </div>
                                {sp.exclusions && (
                                    <div>
                                        <div className="font-bold text-gray-800 mb-1">Exclusions</div>
                                        <p className="text-gray-600">{sp.exclusions}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <span>No separate prices listed</span>
                )}
            </div>

            {/* Alternative Prices */}
            {/* <div className={`flex-1 px-12 ${exportMode ? 'export-section' : ''}`}> */}
            <div
                className={cn(
                    exportMode ? "export-section px-0 mb-0" : "export-section px-12 mb-6"
                )}
            >
                <SectionHeading label="Alternative Prices" />
                {q.altPrices && Array.isArray(q.altPrices) && q.altPrices.length > 0 ? (
                    q.altPrices.map((ap: any, i: number) => (
                        <div key={i} className="border border-gray-200 rounded-xl mb-4 overflow-hidden">
                            <div className="flex justify-between items-center px-5 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                                <div className="flex gap-2.5 items-center">
                                    <Badge text={ap.id || `ALT-0${i + 1}`} color="blue" />
                                    <span className="text-[12px] font-bold text-gray-900">{ap.title}</span>
                                </div>
                                <div className="text-[15px] font-black text-blue-700">{ap.price}</div>
                            </div>
                            {ap.description && (
                                <div className="p-5 text-[11px] text-gray-600">
                                    <p>{ap.description}</p>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <span>No alternative prices listed</span>
                )}
            </div>

            {!exportMode && (
                <div className="mt-6">
                    <DocFooter quoteData={quoteData} />
                </div>
            )}
        </div>
    );
}