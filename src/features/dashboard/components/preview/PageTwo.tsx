import { DocFooter } from "./DocFooter";
import { DocumentHeader } from "./DocumentHeader";

export const PageTwo = () => (
    <div className="bg-white text-gray-900 shadow-xl border border-gray-200 mx-auto w-full max-w-[850px] min-h-[1100px] p-12 flex flex-col font-sans">
        <DocumentHeader showFull={false} />

        {/* Exclusions */}
        <div className="mb-8">
            <h3 className="text-[12px] font-bold text-gray-700 mb-3 uppercase tracking-widest">Exclusions</h3>
            <ul className="list-disc list-outside ml-4 text-[11px] leading-relaxed text-gray-600 space-y-1.5">
                <li>Electrical rough-in and fixture installation</li>
                <li>Plumbing rough-in and fixture installation</li>
                <li>HVAC ductwork and equipment installation</li>
                <li>Fire protection systems and equipment</li>
                <li>Building permits and inspection fees</li>
                <li>Engineered drawings and structural calculations</li>
                <li>Site security, hoarding, and temporary fencing</li>
                <li>Mobilization costs for changes to schedule beyond our control</li>
                <li>Price escalation beyond 30 days from quote date</li>
                <li>Work on statutory holidays unless specifically agreed</li>
            </ul>
        </div>

        {/* Separate Prices */}
        <div className="mb-8">
            <h3 className="text-[12px] font-bold text-gray-700 mb-3 uppercase tracking-widest">SEPARATE PRICES</h3>
            <div className="border border-gray-200 rounded-xl p-5 mb-4 bg-gray-50/40">
                <div className="flex justify-between items-start mb-3 pb-2.5 border-b border-gray-200">
                    <div className="flex gap-2 items-center">
                        <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded uppercase">SP-01</span>
                        <span className="text-[12px] font-bold text-gray-900">Kitchen Appliances Package</span>
                    </div>
                    <div className="text-[13px] font-black text-gray-900">$21,000</div>
                </div>
                <div className="text-[11px] text-gray-600 space-y-3">
                    <div>
                        <div className="font-bold text-gray-800 mb-1.5">Description</div>
                        <p>Provide supply and installation of standard model appliances including refrigerator, dishwasher, microwave, standard oven and stove, washer/dryer, standard ventilation hood fan, and electric cooktop.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <div className="font-bold text-gray-800 mb-1.5">Scope of Work</div>
                            <ul className="list-disc list-outside ml-4 space-y-0.5">
                                <li>Refrigerator (36&quot; French Door)</li>
                                <li>Dishwasher (24&quot; Built-in)</li>
                                <li>Microwave (Over-the-range)</li>
                                <li>Standard installation and haul-away</li>
                            </ul>
                        </div>
                        <div>
                            <div className="font-bold text-gray-800 mb-1.5">Assumptions</div>
                            <ul className="list-disc list-outside ml-4 space-y-0.5">
                                <li>Existing electrical points available</li>
                                <li>Standard appliance dimensions apply</li>
                                <li>No cabinet modification is required</li>
                            </ul>
                        </div>
                    </div>
                    <div>
                        <div className="font-bold text-gray-800 mb-1.5">Exclusions</div>
                        <ul className="list-disc list-outside ml-4 space-y-0.5 grid grid-cols-2">
                            <li>Select appliances</li>
                            <li>Custom cabinetry alterations</li>
                            <li>Plumbing modifications</li>
                            <li>Running upgrades</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        {/* Alternative Prices */}
        <div className="flex-1">
            <h3 className="text-[12px] font-bold text-gray-700 mb-3 uppercase tracking-widest">ALTERNATIVE PRICES</h3>
            <div className="border border-gray-200 rounded-xl p-5 bg-gray-50/40">
                <div className="flex justify-between items-start mb-3 pb-2.5 border-b border-gray-200">
                    <div className="flex gap-2 items-center">
                        <span className="text-[9px] font-bold text-blue-700 bg-blue-100 border border-blue-200 px-2 py-0.5 rounded uppercase">ALT-01</span>
                        <span className="text-[12px] font-bold text-gray-900">Premium Appliances Package</span>
                    </div>
                    <div className="text-[13px] font-black text-gray-900">$8,000</div>
                </div>
                <div className="text-[11px] text-gray-600 space-y-3">
                    <div>
                        <div className="font-bold text-gray-800 mb-1.5">Description</div>
                        <p>Provide supply and installation of high-end premium appliances including stainless steel refrigerator with smart display, silent dishwasher, convection microwave and all hardware required for a fully operational installation in high-end residential application.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <div className="font-bold text-gray-800 mb-1.5">Scope of Work</div>
                            <ul className="list-disc list-outside ml-4 space-y-0.5">
                                <li>Refrigerator (36&quot; French Door - Smart)</li>
                                <li>Dishwasher (24&quot; Built-in - Quiet)</li>
                                <li>Microwave (Over-the-range - Convection)</li>
                                <li>Standard installation and haul-away</li>
                            </ul>
                        </div>
                        <div>
                            <div className="font-bold text-gray-800 mb-1.5">Assumptions</div>
                            <ul className="list-disc list-outside ml-4 space-y-0.5">
                                <li>Existing electrical points available</li>
                                <li>Standard appliance dimensions apply</li>
                                <li>No cabinet modification required</li>
                            </ul>
                        </div>
                    </div>
                    <div>
                        <div className="font-bold text-gray-800 mb-1.5">Exclusions</div>
                        <ul className="list-disc list-outside ml-4 space-y-0.5 grid grid-cols-2">
                            <li>Premium appliances</li>
                            <li>Custom cabinetry alterations</li>
                            <li>Plumbing modifications</li>
                            <li>Running upgrades</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <DocFooter />
    </div>
);