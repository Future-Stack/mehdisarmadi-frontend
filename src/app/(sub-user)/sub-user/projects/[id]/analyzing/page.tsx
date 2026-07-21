"use client";

import React, { useEffect } from "react";
import { CheckCircle2, Loader2, Sparkles, Circle } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
// import sparkleImage from "public/sparks.png";

export default function AnalyzingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const router = useRouter();

  useEffect(() => {
    // Mock the analyzing process, then redirect to results
    const timer = setTimeout(() => {
      router.push(`/sub-user/projects/${id}/results`);
    }, 4000); // 4 seconds mock wait time

    return () => clearTimeout(timer);
  }, [id, router]);

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-140px)] px-4">

      <div className="bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 rounded-3xl p-10 shadow-sm max-w-[480px] w-full flex flex-col items-center">

        <div className="w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-6 shadow-sm shadow-blue-100/50 dark:shadow-none">
        <div className="bg-blue-300 dark:bg-blue-800 rounded-full p-2 shadow-sm shadow-blue-100/50 dark:shadow-none">
          <Image
            src="/sparks.png"
            alt="Sparkle Icon"
            width={28}
            height={28}
            className="object-contain"
          />    
        </div>
        </div>

        <h2 className="text-[22px] font-bold text-gray-900 dark:text-white mb-2">Analyzing Your Tender Document</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 font-medium">Please wait while AI processes your document</p>

        <div className="w-full space-y-4 mb-8">
          <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <span className="text-[13px] font-semibold">Extracting text from document</span>
          </div>

          <div className="flex items-center gap-3 text-blue-600 dark:text-blue-400">
            <Loader2 className="w-5 h-5 flex-shrink-0 animate-spin" />
            <span className="text-[13px] font-semibold">Identifying trade divisions</span>
          </div>

          <div className="flex items-center gap-3 text-gray-400 dark:text-gray-600">
            <Circle className="w-5 h-5 flex-shrink-0" />
            <span className="text-[13px] font-medium">Detecting scope items</span>
          </div>

          <div className="flex items-center gap-3 text-gray-400 dark:text-gray-600">
            <Circle className="w-5 h-5 flex-shrink-0" />
            <span className="text-[13px] font-medium">Finding pricing-impact data</span>
          </div>

          <div className="flex items-center gap-3 text-gray-400 dark:text-gray-600">
            <Circle className="w-5 h-5 flex-shrink-0" />
            <span className="text-[13px] font-medium">Structuring output</span>
          </div>
        </div>

        <div className="w-full bg-[#EFF6FF] dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 border border-[#BEDBFF] rounded-xl p-4 flex gap-2">
          <span className="text-[12px] font-bold">Tip:</span>
          <span className="text-[12px] font-medium">This may take a few moments depending on document size</span>
        </div>

      </div>

    </div>
  );
}



// "use client";

// import React, { useEffect, useState } from "react";
// import { CheckCircle2, Loader2, Circle, AlertCircle } from "lucide-react";
// import { useRouter } from "next/navigation";
// import Image from "next/image";
// import { useGetProjectByIdQuery } from "@/store/api/projectApi";

// // Ordered list of steps shown to the user. `matchStatus` maps a backend
// // project.status value to "this step is done". Adjust the status strings
// // below to whatever your backend actually emits (e.g. "processing",
// // "extracting", "analyzing", "completed", "failed").
// const STEPS = [
//   { key: "extracting", label: "Extracting text from document" },
//   { key: "divisions", label: "Identifying trade divisions" },
//   { key: "scope", label: "Detecting scope items" },
//   { key: "pricing", label: "Finding pricing-impact data" },
//   { key: "structuring", label: "Structuring output" },
// ] as const;

// // Map backend status -> index of the step currently in progress.
// // Anything not recognized falls back to "still on step 0 (extracting)".
// function getActiveStepIndex(status: string | undefined): number {
//   switch (status) {
//     case "notStarted":
//     case "queued":
//     case "processing":
//     case "extracting":
//       return 0;
//     case "identifyingDivisions":
//     case "divisions":
//       return 1;
//     case "detectingScope":
//     case "scope":
//       return 2;
//     case "pricing":
//       return 3;
//     case "structuring":
//       return 4;
//     default:
//       return 0;
//   }
// }

// export default function AnalyzingPage({ params }: { params: Promise<{ id: string }> }) {
//   const { id } = React.use(params);
//   const router = useRouter();
//   const [pollError, setPollError] = useState<string | null>(null);

//   // Poll the project every 3s until the backend reports completion/failure.
//   const { data, error } = useGetProjectByIdQuery(id, {
//     pollingInterval: 3000,
//   });

//   const project = data?.data;
//   const status = project?.status;

//   useEffect(() => {
//     if (!status) return;

//     if (status === "completed" || status === "analyzed") {
//       router.push(`/sub-user/projects/${id}/results`);
//       return;
//     }

//     if (status === "failed" || status === "error") {
//       setPollError(
//         "Analysis failed while processing your document. Please try again or contact support if the issue persists."
//       );
//     }
//   }, [status, id, router]);

//   useEffect(() => {
//     if (error) {
//       setPollError("Lost connection while checking analysis status. Retrying...");
//     }
//   }, [error]);

//   const activeStepIndex = getActiveStepIndex(status);

//   return (
//     <div className="flex items-center justify-center min-h-[calc(100vh-140px)] px-4">
//       <div className="bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 rounded-3xl p-10 shadow-sm max-w-[480px] w-full flex flex-col items-center">
//         <div className="w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-6 shadow-sm shadow-blue-100/50 dark:shadow-none">
//           <div className="bg-blue-300 dark:bg-blue-800 rounded-full p-2 shadow-sm shadow-blue-100/50 dark:shadow-none">
//             <Image
//               src="/sparks.png"
//               alt="Sparkle Icon"
//               width={28}
//               height={28}
//               className="object-contain"
//             />
//           </div>
//         </div>

//         <h2 className="text-[22px] font-bold text-gray-900 dark:text-white mb-2">
//           Analyzing Your Tender Document
//         </h2>
//         <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 font-medium">
//           {pollError ? "There was a problem" : "Please wait while AI processes your document"}
//         </p>

//         <div className="w-full space-y-4 mb-8">
//           {STEPS.map((step, i) => {
//             const isDone = i < activeStepIndex;
//             const isActive = i === activeStepIndex && !pollError;

//             return (
//               <div
//                 key={step.key}
//                 className={
//                   isDone
//                     ? "flex items-center gap-3 text-emerald-600 dark:text-emerald-400"
//                     : isActive
//                     ? "flex items-center gap-3 text-blue-600 dark:text-blue-400"
//                     : "flex items-center gap-3 text-gray-400 dark:text-gray-600"
//                 }
//               >
//                 {isDone ? (
//                   <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
//                 ) : isActive ? (
//                   <Loader2 className="w-5 h-5 flex-shrink-0 animate-spin" />
//                 ) : (
//                   <Circle className="w-5 h-5 flex-shrink-0" />
//                 )}
//                 <span className={isDone || isActive ? "text-[13px] font-semibold" : "text-[13px] font-medium"}>
//                   {step.label}
//                 </span>
//               </div>
//             );
//           })}
//         </div>

//         {pollError ? (
//           <div className="w-full bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-xl p-4 flex gap-2">
//             <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
//             <span className="text-[12px] font-medium">{pollError}</span>
//           </div>
//         ) : (
//           <div className="w-full bg-[#EFF6FF] dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 border border-[#BEDBFF] rounded-xl p-4 flex gap-2">
//             <span className="text-[12px] font-bold">Tip:</span>
//             <span className="text-[12px] font-medium">This may take a few moments depending on document size</span>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }