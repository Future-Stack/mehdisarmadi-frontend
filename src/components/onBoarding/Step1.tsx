import React from "react";
import { UploadCloud, Brain, ShieldAlert, FileText, ChevronRight, Download, Shield, DollarSign } from "lucide-react";
import Logo from "../../../public/Images/Renofield.png";
// import Logo from "../Reuseable/Logo";
import Image from "next/image";

type Step1Props = {
  onNext: () => void;
  onSkip: () => void;
};

const features = [
  {
    title: "Upload Documents",
    desc: "Drag & drop tender files",
    icon: Download,
    color: "text-emerald-500",
    // bg: "bg-emerald-50",
    border: "border-[#A4F4CF]",
  },
  {
    title: "AI Analysis",
    desc: "Extract key insights",
    icon: Brain,
    color: "text-blue-500",
    // bg: "bg-blue-50",
    border: "border-[#BEDBFF]",
  },
  {
    title: "Risk Detection",
    desc: "Identify critical risks",
    icon: Shield,
    color: "text-purple-500",
    // bg: "bg-purple-50",
    border: "border-[#E9D4FF]",
  },
  {
    title: "Build Quotes",
    desc: "Generate professional bids",
    icon: DollarSign,
    color: "text-orange-500",
    // bg: "bg-orange-50",
    border: "border-[#FFD6A8]",
  },
];

const Step1 = ({ onNext, onSkip }: Step1Props) => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-4xl space-y-12 text-center">
        {/* Logo + Heading */}
        <div className="flex flex-col items-center space-y-6">
          {/* <Logo /> */}
          <Image
            src={Logo}
            alt="logo"
            // height={195}
            className="w-[120px] md:w-[240px]  h-auto object-contain"
          // style={{ width: "auto", height: "auto" }}
          />

          <div className="space-y-11">
            <h1 className="text-4xl md:text-5xl font-bold text-[#0A0A0A] -mt-5">
              Welcome to TenderPro AI
            </h1>
            <p className="text-xl lg:text-2xl font-semibold text-[#364153]">
              Smart Tender Management Made Simple
            </p>
          </div>

          <p className="text-base text-[#4A5565] max-w-[841px] leading-relaxed -mt-2">
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
                className={`flex flex-col items-start text-left p-6 border ${item.border} rounded-2xl bg-white shadow-sm shadow-[#0000001A] hover:shadow-lg transition-all duration-300 group `}
              >
                <div className={`mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-12 h-12 ${item.color}`} />
                </div>
                <h3 className="font-semibold text-base text-[#1E2939]">{item.title}</h3>
                <p className="text-sm text-[#4A5565] mt-1">{item.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Progress Dots */}
        <div className="flex justify-center gap-2">
          <div className="w-8 h-2 rounded-full bg-[#0D5B0F]" />
          <div className="w-2 h-2 rounded-full bg-gray-200" />
          <div className="w-2 h-2 rounded-full bg-gray-200" />
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-center gap-12 pt-4">
          <button
            onClick={onNext}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#0D5B0F] text-white rounded-xl font-semibold hover:bg-[#005a38] transition-all shadow-md hover:shadow-xl"
          >
            Next <ChevronRight className="w-5 h-5" />
          </button>

          <button
            onClick={onSkip}
            className="flex justify-end text-[#0A0A0A] font-medium hover:text-gray-800 transition-colors"
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step1;
