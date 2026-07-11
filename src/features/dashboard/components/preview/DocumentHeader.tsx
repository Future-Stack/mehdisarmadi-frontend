import Logo from "@/components/Reuseable/Logo";

/* ─── Shared Document Header ─── */
export const DocumentHeader = ({ showFull = false }: { showFull?: boolean }) => (
    <div className="flex justify-between items-start mb-8">
        <div>
            <div className="mb-4"><Logo /></div>
            {showFull && (
                <>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">SUBMITTED BY</div>
                    <div className="text-[12px] font-bold text-gray-900 mb-0.5">Renofield Inc.</div>
                    <div className="text-[11px] text-gray-500 space-y-0.5">
                        <div>123 Main Street, Toronto, ON M5V 3A8</div>
                        <div>Phone: +1 (416) 555-0123</div>
                        <div>Email: info@renofield.com</div>
                        <div>HST #: 123456789 RT0001</div>
                    </div>
                </>
            )}
            {!showFull && (
                <div className="text-[10px] text-gray-400 font-bold mt-1">Q-2026-042 | ABC Construction Ltd.</div>
            )}
        </div>
        <div className="text-right">
            <h1 className="text-[20px] font-black text-gray-900 mb-4 tracking-tight">QUOTATION</h1>
            <div className="grid grid-cols-[auto_auto] gap-x-5 gap-y-1 text-[11px] text-left">
                <span className="font-bold text-gray-400 text-right">Quote Number:</span>
                <span className="font-semibold text-gray-900">Q-2026-042</span>
                <span className="font-bold text-gray-400 text-right">Revision:</span>
                <span className="font-semibold text-gray-900">02</span>
                <span className="font-bold text-gray-400 text-right">Date:</span>
                <span className="font-semibold text-gray-900">May 20, 2026</span>
                <span className="font-bold text-gray-400 text-right">Valid Until:</span>
                <span className="font-semibold text-gray-900">30 days from date of issue</span>
            </div>
        </div>
    </div>
);