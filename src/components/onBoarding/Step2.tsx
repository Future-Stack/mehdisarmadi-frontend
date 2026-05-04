import React from "react";
import { CheckCircle2, Zap, Clock, ShieldCheck, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import Logo from "../Reuseable/Logo";

type Step2Props = {
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
};

const stats = [
  {
    label: "Time Saved",
    value: "85%",
    icon: Zap,
    color: "text-blue-500",
    bg: "bg-blue-50",
    border: "border-blue-100",
  },
  {
    label: "Avg Analysis",
    value: "10 min",
    icon: Clock,
    color: "text-emerald-500",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
  },
  {
    label: "Accuracy",
    value: "99%",
    icon: ShieldCheck,
    color: "text-purple-500",
    bg: "bg-purple-50",
    border: "border-purple-100",
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
          <Logo />

          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold text-[#006D44]">
              AI-Powered Analysis
            </h1>
            <p className="text-xl font-semibold text-gray-700">
              Let AI Do the Heavy Lifting
            </p>
          </div>

          <p className="text-base text-gray-500 max-w-2xl leading-relaxed">
            Our advanced AI engine automatically extracts scope of work, identifies risks, processes addenda, and provides strategic insights to help you submit winning bids.
          </p>
        </div>

        {/* Main Feature Box */}
        <div className="bg-white border border-emerald-100 rounded-3xl p-8 shadow-sm text-left max-w-2xl mx-auto space-y-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <Sparkles className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900">Intelligent Document Processing</h3>
              <p className="text-sm text-gray-500">Extract quantities, specs, and requirements automatically</p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {checkItems.map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-emerald-50/50 rounded-xl border border-emerald-50">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                <span className="text-sm font-medium text-gray-700">{item}</span>
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
        <div className="flex items-center justify-center gap-12 pt-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-500 font-medium hover:text-gray-800 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" /> Previous
          </button>

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
}