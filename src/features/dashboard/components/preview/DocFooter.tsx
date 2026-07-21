/* ─── Premium Document Footer ─── */
export const DocFooter = ({ quoteData }: { quoteData?: any }) => {
    const q = quoteData?.quote || {};
    const c = quoteData?.companyDetails || {};
    const companyName = c.name || q.companyName;
    const companyAddress = c.address || q.companyAddress;
    const companyPhone = c.phone || q.companyPhone;
    const companyEmail = c.email || q.companyEmail;

    return (
    <div className="mt-auto">
        {/* Green top accent */}
        <div className="h-0.5 bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400 mx-12 mb-5" />
        <div className="px-12 pb-8 flex justify-between items-end">
            <div>
                {companyName && (
                    <>
                        <div className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.12em] mb-1.5">Submitted by</div>
                        <div className="text-[12px] font-bold text-gray-900">{companyName}</div>
                    </>
                )}
                <div className="text-[10px] text-gray-500 leading-relaxed mt-0.5">
                    {[
                        companyAddress,
                        [companyPhone, companyEmail].filter(Boolean).join(" · ")
                    ].filter(Boolean).join("\n").split("\n").map((line, i) => (
                        <div key={i}>{line}</div>
                    ))}
                </div>
            </div>
            <div className="text-right text-[10px] text-gray-400">
                <div className="italic mb-1">We look forward to working with you on this project.</div>
                {companyName && <div className="font-bold text-gray-600">{companyName}</div>}
            </div>
        </div>
    </div>
    );
};