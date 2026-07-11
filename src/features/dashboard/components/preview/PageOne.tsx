import { DocFooter } from "./DocFooter";
import { DocumentHeader } from "./DocumentHeader";

/* ─── PAGE 1: Tender Info + Scope + Assumptions ─── */
export const PageOne = ({ exportMode }: { exportMode?: boolean }) => (
    <div className={exportMode ? "bg-white text-gray-900 font-sans p-12" : "bg-white text-gray-900 shadow-xl border border-gray-200 mx-auto w-full max-w-[850px] min-h-[1100px] p-12 flex flex-col font-sans"}>
        {exportMode ? (
            <div id="export-header" className="p-12 pb-0">
                <DocumentHeader showFull />
            </div>
        ) : (
            <DocumentHeader showFull />
        )}

        {/* Prepared For */}
        <div className={`mb-6 pb-5 border-b border-gray-100 ${exportMode ? 'export-section' : ''}`}>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">PREPARED FOR</div>
            <div className="text-[13px] font-bold text-gray-900">ABC Construction Ltd.</div>
            <div className="text-[11px] text-gray-500 mt-0.5">Attention: John Smith, Project Manager</div>
            <div className="text-[11px] text-gray-500">General Contractor: Prime Construction Ltd.</div>
        </div>

        {/* Tender Information */}
        <div className={`mb-6 ${exportMode ? 'export-section' : ''}`}>
            <h3 className="text-[12px] font-bold text-gray-700 mb-3 uppercase tracking-widest">TENDER INFORMATION</h3>
            <table className="w-full text-[11px] border-collapse border border-gray-200">
                <tbody className="divide-y divide-gray-100">
                    <tr><td className="py-2 px-4 font-bold text-gray-500 w-44 bg-gray-50">Project Name</td><td className="py-2 px-4 font-medium">Green Valley Residential Complex</td></tr>
                    <tr><td className="py-2 px-4 font-bold text-gray-500 bg-gray-50">Project Address</td><td className="py-2 px-4 font-medium">Dhaka, Bangladesh</td></tr>
                    <tr><td className="py-2 px-4 font-bold text-gray-500 bg-gray-50">Client / GC Name</td><td className="py-2 px-4 font-medium">Green Valley Developers Inc. | Prime Construction Ltd.</td></tr>
                    <tr><td className="py-2 px-4 font-bold text-gray-500 bg-gray-50">Quote Number</td><td className="py-2 px-4 font-medium">Q-2026-042</td></tr>
                    <tr><td className="py-2 px-4 font-bold text-gray-500 bg-gray-50">Quote Date</td><td className="py-2 px-4 font-medium">May 15, 2026</td></tr>
                    <tr><td className="py-2 px-4 font-bold text-gray-500 bg-gray-50">Revision Number</td><td className="py-2 px-4 font-medium">02</td></tr>
                    <tr><td className="py-2 px-4 font-bold text-gray-500 bg-gray-50">Drawing/Revision Date</td><td className="py-2 px-4 font-medium">May 10, 2026</td></tr>
                    <tr><td className="py-2 px-4 font-bold text-gray-500 bg-gray-50">Addenda Included</td><td className="py-2 px-4 font-medium">Addendum #1, Addendum #2</td></tr>
                    <tr><td className="py-2 px-4 font-bold text-gray-500 bg-gray-50">Division(s) Priced</td><td className="py-2 px-4 font-medium">Division 06 – Wood & Plastics, Division 08 – Openings, Division 09 – Finishes</td></tr>
                </tbody>
            </table>
        </div>

        {/* Scope of Work */}
        <div className={`mb-6 ${exportMode ? 'export-section' : ''}`}>
            <h3 className="text-[12px] font-bold text-gray-700 mb-3 uppercase tracking-widest">Scope of Work</h3>
            <div className="text-[11px] text-gray-600 leading-relaxed space-y-3">
                <div>
                    <span className="font-bold text-gray-900">Division 06 – Wood, Plastics & Composites: </span>
                    Supply and install a total of forty (40) solid core wooden doors complete with pre-hung frames, paint-grade factory finish, and all required accessories necessary for a complete and fully operational installation. Doors shall be 1-3/4&quot; thick and installed in accordance with manufacturer specifications and project requirements. Scope also includes the supply and installation of forty (40) complete door hardware sets including hinges, locksets, handles, stops, and related fastening materials.
                </div>
                <div>
                    <span className="font-bold text-gray-900">Division 08 – Openings: </span>
                    Provide and install aluminum window framing systems with double-glazed insulated glass units covering approximately eighty-five (85) square meters in total area. All glazing systems shall include thermally broken aluminum frames, Low-E energy-efficient glass, weather sealing, anchoring hardware, and white factory-applied finish suitable for commercial application standards.
                </div>
                <div>
                    <span className="font-bold text-gray-900">Division 09 – Finishes: </span>
                    Prepare all interior wall surfaces and apply premium grade acrylic paint system over approximately one thousand two hundred (1,200) square meters of surface area. Supply and install porcelain floor tiles over approximately eight hundred fifty (850) square meters including adhesive setting materials, leveling, spacing, cutting, and epoxy grout application.
                </div>
            </div>
        </div>

        {/* Assumptions */}
        <div className={`flex-1 ${exportMode ? 'export-section' : ''}`}>
            <h3 className="text-[12px] font-bold text-gray-700 mb-3 uppercase tracking-widest">Assumptions</h3>
            <ul className="list-disc list-outside ml-4 text-[11px] leading-relaxed text-gray-600 space-y-1.5">
                <li>Site access provided as per tender specifications (6-11 AM for deliveries)</li>
                <li>Temporary facilities (site office, storage, washrooms) provided by general contractor</li>
                <li>Work area cleaned and protected by other trades before installation</li>
                <li>All substrates properly prepared and ready to receive finishes</li>
                <li>Utilities (power, water) available at no cost to contractor</li>
                <li>Building is weathertight and secure before finish work begins</li>
                <li>Material storage area (minimum 200 sq.ft) provided on-site</li>
                <li>No hazardous materials or contamination in work areas</li>
                <li>Standard construction tolerances apply</li>
                <li>Shop drawings approval process will not exceed 14 business days</li>
            </ul>
        </div>
        {!exportMode && (
            <div className="bg-[#00996612] mt-5 pb-5">
                <DocFooter />
            </div>
        )}
    </div>
);