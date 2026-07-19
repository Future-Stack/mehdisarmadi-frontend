import Logo from "@/components/Reuseable/Logo";

/* ─── Shared Document Header ─── */
export const DocumentHeader = ({ showFull = false, quoteData }: { showFull?: boolean; quoteData?: any }) => {
    const q = quoteData?.quote || {};
    return (
    <div className="flex justify-between items-start mb-8 px-12 pt-12 ">
        <div>
            <div className="mb-4"><Logo /></div>
            {showFull && (
                <>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">SUBMITTED BY</div>
                    <div className="text-[12px] font-bold text-gray-900 mb-0.5">{q.companyName || "N/A"}</div>
                    <div className="text-[11px] text-gray-500 space-y-0.5">
                        <div>{q.companyAddress || "N/A"}</div>
                        <div>Phone: {q.companyPhone || "N/A"}</div>
                        <div>Email: {q.companyEmail || "N/A"}</div>
                        <div>HST #: {q.companyHst || "N/A"}</div>
                    </div>
                </>
            )}
            {!showFull && (
                <div className="text-[10px] text-gray-400 font-bold mt-1">{q.quoteNumber || "Q-2026-042"} | {q.clientName || "ABC Construction Ltd."}</div>
            )}
        </div>
        <div className="text-right mt-5">
            <h1 className="text-[20px] font-bold text-gray-900 mb-4 tracking-tight">QUOTATION</h1>
            <div className="bg-[#F9FAFB] border border-[#E5E7EB] p-4 rounded-lg space-y-2 w-64 text-[11px]">
                <div className="flex justify-between">
                    <span className="font-bold text-gray-400">Quote Number:</span>
                    <span className="font-semibold text-gray-900">{q.quoteNumber || "N/A"}</span>
                </div>

                <div className="flex justify-between">
                    <span className="font-bold text-gray-400">Revision:</span>
                    <span className="font-semibold text-gray-900">{q.revisionNumber || "N/A"}</span>
                </div>

                <div className="flex justify-between">
                    <span className="font-bold text-gray-400">Date:</span>
                    <span className="font-semibold text-gray-900">{q.startDate || "N/A"}</span>
                </div>

                <div className="flex justify-between">
                    <span className="font-bold text-gray-400">Valid Until:</span>
                    <span className="font-semibold text-gray-900">{q.validityPeriod || "N/A"}</span>
                </div>
                </div>
        </div>
    </div>
    )
}