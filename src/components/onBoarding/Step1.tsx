import React from "react";
import { UploadCloud, Brain, ShieldAlert, FileText, ChevronRight } from "lucide-react";
import Logo from "../Reuseable/Logo";

type Step1Props = {
  onNext: () => void;
  onSkip: () => void;
};

const features = [
  {
    title: "Upload Documents",
    desc: "Drag & drop tender files",
    icon: UploadCloud,
    color: "text-emerald-500",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
  },
  {
    title: "AI Analysis",
    desc: "Extract key insights",
    icon: Brain,
    color: "text-blue-500",
    bg: "bg-blue-50",
    border: "border-blue-100",
  },
  {
    title: "Risk Detection",
    desc: "Identify critical risks",
    icon: ShieldAlert,
    color: "text-purple-500",
    bg: "bg-purple-50",
    border: "border-purple-100",
  },
  {
    title: "Build Quotes",
    desc: "Generate professional bids",
    icon: FileText,
    color: "text-orange-500",
    bg: "bg-orange-50",
    border: "border-orange-100",
  },
];

const Step1 = ({ onNext, onSkip }: Step1Props) => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-4xl space-y-12 text-center">
        {/* Logo + Heading */}
        <div className="flex flex-col items-center space-y-6">
          <Logo />

          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold text-[#006D44]">
              Welcome to TenderPro AI
            </h1>
            <p className="text-xl font-semibold text-gray-700">
              Smart Tender Management Made Simple
            </p>
          </div>

          <p className="text-base text-gray-500 max-w-2xl leading-relaxed">
            Transform the way you manage construction tenders with AI-powered automation. 
            Analyze documents, identify risks, and generate professional quotes in minutes.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {features.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className={`flex flex-col items-start text-left p-6 border ${item.border} rounded-2xl ${item.bg} hover:shadow-lg transition-all duration-300 group`}
              >
                <div className={`p-3 rounded-xl bg-white shadow-sm mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-6 h-6 ${item.color}`} />
                </div>
                <h3 className="font-bold text-lg text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{item.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Progress Dots */}
        <div className="flex justify-center gap-2">
          <div className="w-8 h-2 rounded-full bg-[#006D44]" />
          <div className="w-2 h-2 rounded-full bg-gray-200" />
          <div className="w-2 h-2 rounded-full bg-gray-200" />
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-center gap-12 pt-4">
          <button
            onClick={onNext}
            className="flex items-center gap-2 px-8 py-3 bg-[#006D44] text-white rounded-xl font-semibold hover:bg-[#005a38] transition-all shadow-md hover:shadow-xl"
          >
            Next <ChevronRight className="w-5 h-5" />
          </button>
          
          <button
            onClick={onSkip}
            className="text-gray-500 font-medium hover:text-gray-800 transition-colors"
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step1;
