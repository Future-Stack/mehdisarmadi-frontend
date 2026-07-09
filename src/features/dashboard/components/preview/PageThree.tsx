import { DocFooter } from "./DocFooter";
import { DocumentHeader } from "./DocumentHeader";

export const UNIT_PRICES = [
    { id: "UP-01", description: "Solid hardwood doors", type: "Per unit", estimate: "$2,500" },
    { id: "UP-02", description: "Entry and painting", type: "Per Sq.m", estimate: "$0" },
];

export const PageThree = () => (
    <div className="bg-white text-gray-900 shadow-xl border border-gray-200 mx-auto w-full max-w-[850px] min-h-[1100px] p-12 flex flex-col font-sans">
        <DocumentHeader showFull />

        {/* Unit Prices */}
        <div className="mb-8">
            <h3 className="text-[12px] font-bold text-gray-700 mb-3 uppercase tracking-widest">UNIT PRICES</h3>
            <div className="border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-[11px]">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="px-4 py-2.5 font-bold text-gray-500 w-16">Item</th>
                            <th className="px-4 py-2.5 font-bold text-gray-500">Description</th>
                            <th className="px-4 py-2.5 font-bold text-gray-500">Type</th>
                            <th className="px-4 py-2.5 font-bold text-gray-500 text-right">Estimate</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {UNIT_PRICES.map(p => (
                            <tr key={p.id}>
                                <td className="px-4 py-2.5 font-bold text-emerald-600">{p.id}</td>
                                <td className="px-4 py-2.5 font-medium text-gray-700">{p.description}</td>
                                <td className="px-4 py-2.5 text-gray-500">{p.type}</td>
                                <td className="px-4 py-2.5 font-bold text-gray-900 text-right">{p.estimate}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        {/* Pricing Summary */}
        <div className="mb-8">
            <h3 className="text-[12px] font-bold text-gray-700 mb-3 uppercase tracking-widest">PRICING SUMMARY</h3>
            <div className="border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-[11px]">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="px-4 py-2.5 font-bold text-gray-500">Description</th>
                            <th className="px-4 py-2.5 font-bold text-gray-500 text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        <tr><td className="px-4 py-2.5 text-gray-700 font-medium">Base Price</td><td className="px-4 py-2.5 text-right font-semibold text-gray-900">CAD $485,000</td></tr>
                        <tr><td className="px-4 py-2.5 text-gray-700 font-medium">HST (13%)</td><td className="px-4 py-2.5 text-right font-semibold text-gray-900">CAD $63,050</td></tr>
                    </tbody>
                </table>
            </div>

            {/* Total bar */}
            <div className="mt-4 bg-emerald-600 text-white rounded-xl px-6 py-4 flex justify-between items-center">
                <div>
                    <div className="text-[10px] font-bold opacity-80 uppercase tracking-widest">TOTAL QUOTED PRICE</div>
                    <div className="text-[11px] opacity-70">All divisions included</div>
                </div>
                <div className="text-[22px] font-black tracking-tight">CAD $548,050</div>
            </div>
        </div>

        {/* Terms & Conditions */}
        <div className="flex-1">
            <h3 className="text-[12px] font-bold text-gray-700 mb-3 uppercase tracking-widest">Terms & Conditions</h3>
            <div className="text-[11px] text-gray-600 space-y-3">
                <div>
                    <div className="font-bold text-gray-800 mb-0.5">Payment Terms</div>
                    <p>30% deposit required to commence work; 40% progress payment; 30% on substantial completion and sign-off. All payments to be made within Net 30 days. Renofield reserves the right to suspend work pending overdue payment.</p>
                </div>
                <div>
                    <div className="font-bold text-gray-800 mb-0.5">Holdback</div>
                    <p>10% holdback as per Construction Act (Ontario) requirements.</p>
                </div>
                <div>
                    <div className="font-bold text-gray-800 mb-0.5">Quote Validity</div>
                    <p>30 days from date of issue.</p>
                </div>
                <div>
                    <div className="font-bold text-gray-800 mb-0.5">Currency</div>
                    <p>All prices in Canadian dollars (CAD).</p>
                </div>
            </div>
        </div>

        <div className="bg-[#00996612] mt-5 pb-5">
            <DocFooter />
        </div>
    </div>
);