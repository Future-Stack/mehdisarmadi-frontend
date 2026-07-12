import React from "react";
import { CheckCircle2, Zap, Clock, ShieldCheck, ChevronLeft, ChevronRight, Sparkles, CheckCircle, Shield, TrendingUp } from "lucide-react";
import Logo from "../../../public/Images/Renofield.png";
// import Logo from "../Reuseable/Logo";
import Image from "next/image";

type Step2Props = {
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
};

const stats = [
  {
    label: "Time Saved",
    value: "85%",
    icon: TrendingUp,
    color: "text-[#155DFC]",
    bg: "bg-blue-50",
    border: "border-[#155DFC]/30",
  },
  {
    label: "Avg Analysis",
    value: "10 min",
    icon: Clock,
    color: "text-[#009966]",
    bg: "bg-emerald-50",
    border: "border-[#009966]/30",
  },
  {
    label: "Accuracy",
    value: "99%",
    icon: Shield,
    color: "text-[#9810FA]",
    bg: "bg-purple-50",
    border: "border-[#9810FA]/30",
  },
];

const checkItems = [
  "Scope of work extraction with quantities",
  "Risk identification with severity ratings",
  "Addenda tracking and change detection",
];

export default function Step2({ onNext, onBack, onSkip }: Step2Props) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-4xl space-y-12 text-center">
        {/* Logo + Heading */}
        <div className="flex flex-col items-center space-y-6">
           <Image
                          src={Logo}
                          alt="logo"
                          // height={195}
                          className="w-[120px] md:w-[240px] h-auto object-contain"
                          style={{ width: "auto", height: "auto" }}
                        />

          <div className="space-y-11">
            <h1 className="text-4xl md:text-5xl font-bold text-[#0A0A0A] -mt-5">
              AI-Powered Analysis
            </h1>
            <p className="text-xl lg:text-2xl font-semibold text-[#364153]">
              Let AI Do the Heavy Lifting
            </p>
          </div>

          <p className="text-base text-[#4A5565] max-w-[841px] leading-relaxed -mt-2">
            Our advanced AI engine automatically extracts scope of work, identifies risks, processes addenda, and provides strategic insights to help you submit winning bids.
          </p>
        </div>

        {/* Main Feature Box */}
        <div className="bg-white border border-[#009966]/30 rounded-xl p-8 shadow-sm shadow-[#0000001A] text-left max-w-2xl mx-auto space-y-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-[#D0FAE5] rounded-lg">
              <Sparkles className="w-8 h-8 text-[#009966]" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-[#1E2939]">Intelligent Document Processing</h3>
              <p className="text-sm text-[#4A5565]">Extract quantities, specs, and requirements automatically</p>
            </div>
          </div>

          <div className="space-y-3 pt-4">
            {checkItems.map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-[#ECFDF5] rounded-xl border border-emerald-50">
                <CheckCircle className="w-5 h-5 text-[#009966] flex-shrink-0" />
                <span className="text-sm font-medium text-[#0A0A0A]">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {stats.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className={`flex flex-col items-center p-6 border ${item.border} rounded-2xl bg-white hover:shadow-md transition-shadow`}
              >
                <Icon className={`w-6 h-6 ${item.color} mb-3`} />
                <span className="text-2xl font-bold text-gray-900">{item.value}</span>
                <span className="text-sm text-gray-500">{item.label}</span>
              </div>
            );
          })}
        </div>

        {/* Progress Dots */}
        <div className="flex justify-center gap-2">
          <div className="w-2 h-2 rounded-full bg-gray-200" />
          <div className="w-8 h-2 rounded-full bg-[#006D44]" />
          <div className="w-2 h-2 rounded-full bg-gray-200" />
        </div>

        {/* Buttons */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-12 pt-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 border border-gray-200 px-8 py-2.5 rounded-lg text-[#0A0A0A] font-medium hover:text-gray-800 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" /> Previous
          </button>

          <button
            onClick={onNext}
            className="flex items-center gap-2 px-8 py-2.5 bg-[#0D5B0F] text-white rounded-xl font-semibold hover:bg-[#005a38] transition-all shadow-md hover:shadow-xl"
          >
            Next <ChevronRight className="w-5 h-5" />
          </button>
          
          <button
            onClick={onSkip}
            className="text-[#0A0A0A] font-medium hover:text-gray-800 transition-colors"
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  );
}