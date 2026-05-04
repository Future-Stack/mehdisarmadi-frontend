import React from "react";
import { ChevronLeft, FileUp, Cpu, ShieldCheck, FileSpreadsheet, Users, ChevronRight } from "lucide-react";
import Logo from "../Reuseable/Logo";

type Step3Props = {
  onBack: () => void;
  onLogin: () => void;
  onRegister: () => void;
  onSkip: () => void;
};

const smallFeatures = [
  {
    title: "Upload Documents",
    desc: "Support for PDF, DOCX, and XLSX files",
    icon: FileUp,
    color: "text-emerald-500",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
  },
  {
    title: "AI Analysis",
    desc: "Automated extraction and insights",
    icon: Cpu,
    color: "text-blue-500",
    bg: "bg-blue-50",
    border: "border-blue-100",
  },
  {
    title: "Risk Assessment",
    desc: "Identify and mitigate project risks",
    icon: ShieldCheck,
    color: "text-purple-500",
    bg: "bg-purple-50",
    border: "border-purple-100",
  },
  {
    title: "Quote Builder",
    desc: "Professional quote generation",
    icon: FileSpreadsheet,
    color: "text-orange-500",
    bg: "bg-orange-50",
    border: "border-orange-100",
  },
];

export default function Step3({ onBack, onLogin, onRegister, onSkip }: Step3Props) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-4xl space-y-12 text-center">
        {/* Logo + Heading */}
        <div className="flex flex-col items-center space-y-6">
          <Logo />

          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold text-[#006D44]">
              Ready to Get Started?
            </h1>
            <p className="text-xl font-semibold text-gray-700">
              Join Thousands of Construction Professionals
            </p>
          </div>

          <p className="text-base text-gray-500 max-w-2xl leading-relaxed">
            Start analyzing tenders and building quotes in minutes. No credit card required for your first project.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {smallFeatures.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className={`flex items-center gap-4 p-4 border ${item.border} rounded-2xl ${item.bg} text-left`}
              >
                <div className="p-2 bg-white rounded-xl shadow-sm">
                  <Icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-gray-900">{item.title}</h3>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Large User Card */}
        <div className="bg-gradient-to-r from-[#009966] to-[#3B82F6] rounded-3xl p-8 text-left text-white relative overflow-hidden group">
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold">5,000+</h2>
                <p className="text-sm font-medium text-white/80">Active Users Worldwide</p>
              </div>
            </div>
            <p className="text-sm text-white/90 max-w-md">
              Trusted by construction professionals across 50+ countries for efficient tender management.
            </p>
          </div>
          {/* Decorative circles */}
          <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700" />
          <div className="absolute bottom-[-20%] left-[-10%] w-48 h-48 bg-blue-400/20 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-700" />
        </div>

        {/* Progress Dots */}
        <div className="flex justify-center gap-2">
          <div className="w-2 h-2 rounded-full bg-gray-200" />
          <div className="w-2 h-2 rounded-full bg-gray-200" />
          <div className="w-8 h-2 rounded-full bg-[#006D44]" />
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 pt-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-500 font-medium hover:text-gray-800 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" /> Previous
          </button>

          <button
            onClick={onLogin}
            className="px-8 py-3 bg-[#006D44] text-white rounded-xl font-semibold hover:bg-[#005a38] transition-all shadow-md hover:shadow-xl"
          >
            Login
          </button>

          <button
            onClick={onRegister}
            className="px-8 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all shadow-sm"
          >
            Sign Up Free
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