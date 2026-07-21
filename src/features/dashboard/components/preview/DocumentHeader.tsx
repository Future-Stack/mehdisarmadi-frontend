import Logo from "@/components/Reuseable/Logo";

/* ─── Shared Document Header ─── */
export const DocumentHeader = ({ showFull = false, quoteData }: { showFull?: boolean; quoteData?: any }) => {
    const q = quoteData?.savedQuote || {};
    const c = quoteData?.companyDetails || {};
    return (
    <div className="relative overflow-hidden mb-6">
        {/* Green gradient accent strip */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400" />

        <div className="flex justify-between items-start px-12 pt-10 pb-8">
            {/* Left: Company Brand */}
            <div>
                <div className="mb-4 flex items-center gap-3">
                    <Logo />
                </div>
                {showFull && (
                    <>
                        <div className="text-[9px] font-black text-emerald-600 uppercase tracking-[0.12em] mb-2">Submitted By</div>
                        {(c.name || q.companyName) && (
                            <div className="text-[13px] font-bold text-gray-900 mb-1">{c.name || q.companyName}</div>
                        )}
                        <div className="text-[11px] text-gray-500 leading-relaxed space-y-0.5">
                            {(c.address || q.companyAddress) && <div>{c.address || q.companyAddress}</div>}
                            {(c.phone || q.companyPhone) && <div>Phone: {c.phone || q.companyPhone}</div>}
                            {(c.email || q.companyEmail) && <div>Email: {c.email || q.companyEmail}</div>}
                            {(c.hstNumber || q.companyHst) && <div>HST #: {c.hstNumber || q.companyHst}</div>}
                        </div>
                    </>
                )}
                {!showFull && (q.quoteNumber || q.clientName) && (
                    <div className="text-[10px] text-gray-400 font-semibold mt-1">
                        {[q.quoteNumber, q.clientName].filter(Boolean).join(" | ")}
                    </div>
                )}
            </div>

            {/* Right: Quote Badge */}
            <div className="text-right mt-2">
                <div className="text-[22px] font-black text-gray-900 tracking-tight mb-3">QUOTATION</div>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-4 w-64 text-[11px] shadow-sm">
                    {[
                        { label: "Quote No.", value: q.quoteNumber },
                        { label: "Revision", value: q.revisionNumber },
                        { label: "Issue Date", value: q.startDate },
                        { label: "Valid Until", value: q.validityPeriod },
                    ].filter(r => r.value).map((row, i, arr) => (
                        <div key={i} className={`flex justify-between items-center py-1.5 ${i < arr.length - 1 ? "border-b border-gray-200" : ""}`}>
                            <span className="font-semibold text-gray-400 uppercase tracking-wider text-[9px]">{row.label}</span>
                            <span className={`font-bold ${i === 0 ? "text-emerald-600 text-[12px] font-black" : "text-gray-900"}`}>{row.value}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Bottom separator with gradient */}
        <div className="mx-12 h-px bg-gradient-to-r from-emerald-500/30 via-gray-200 to-transparent" />
    </div>
    );
}