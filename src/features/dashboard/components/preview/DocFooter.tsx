import { resolveQuoteData } from "./resolveQuoteData";

/* ─── Premium Document Footer ─── */
export const DocFooter = ({ quoteData }: { quoteData?: any }) => {
    const resolved = resolveQuoteData(quoteData);

    return (
    <div className="mt-auto">
        {/* Green top accent */}
        <div className="h-0.5 bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400 mx-12 mb-5" />
        <div className="px-12 pb-8 flex justify-between items-end">
            <div>
                {resolved.companyName && (
                    <>
                        <div className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.12em] mb-1.5">Submitted by</div>
                        <div className="text-[12px] font-bold text-gray-900">{resolved.companyName}</div>
                    </>
                )}
                <div className="text-[10px] text-gray-500 leading-relaxed mt-0.5">
                    {[
                        resolved.companyAddress,
                        [resolved.companyPhone, resolved.companyEmail].filter(Boolean).join(" · ")
                    ].filter(Boolean).join("\n").split("\n").map((line, i) => (
                        <div key={i}>{line}</div>
                    ))}
                </div>
            </div>
            <div className="text-right text-[10px] text-gray-400">
                <div className="italic mb-1">We look forward to working with you on this project.</div>
                {resolved.companyName && <div className="font-bold text-gray-600">{resolved.companyName}</div>}
            </div>
        </div>
    </div>
    );
};