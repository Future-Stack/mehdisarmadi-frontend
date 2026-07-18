import React from "react";
import { ChevronLeft, FileUp, Cpu, ShieldCheck, FileSpreadsheet, Users, ChevronRight, Brain, Shield, DollarSign, Download, FileText } from "lucide-react";
import Logo from "../../../public/Images/Renofield.png";
// import Logo from "../Reuseable/Logo";
import Image from "next/image";

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
    icon: FileText,
    bgIcon: "bg-[#00996638]",
    color: "text-emerald-500",
    bg: "bg-gradient-to-b from-[#ECFDF5] to-[#FFFFFF]",
    border: "border-[#A4F4CF]",
  },
  {
    title: "AI Analysis",
    desc: "Automated extraction and insights",
        bgIcon: "bg-[#155DFC4F]",
        icon: Brain,
    color: "text-blue-500",
     bg: "bg-gradient-to-b from-[#EFF6FF] to-[#FFFFFF]",
    border: "border-[#BEDBFF]",
  },
  {
    title: "Risk Assessment",
    desc: "Identify and mitigate project risks",
    icon: Shield,
    bgIcon: "bg-[#9810FA]",
    color: "text-white",
     bg: "bg-gradient-to-b from-[#FAF5FF] to-[#FFFFFF]",
    border: "border-[#E9D4FF]",
  },
  {
    title: "Quote Builder",
    desc: "Professional quote generation",
     icon: DollarSign,
     bgIcon: "bg-[#F54900]",
    color: "text-white",
    bg: "bg-gradient-to-b from-[#FFF7ED] to-[#FFFFFF]",
    border: "border-[#FFD6A8]",
  },
];

export default function Step3({ onBack, onLogin, onRegister, onSkip }: Step3Props) {
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
                          className="w-[120px] md:w-[240px] h-auto object-contain"
                          // style={{ width: "auto", height: "auto" }}
                        />

          <div className="space-y-11">
            <h1 className="text-4xl md:text-5xl font-bold text-[#0A0A0A] -mt-5">
              Ready to Get Started?
            </h1>
            <p className="text-xl lg:text-2xl font-semibold text-[#364153]">
              Join Thousands of Construction Professionals
            </p>
          </div>

          <p className="text-base text-[#4A5565] max-w-[841px] leading-relaxed -mt-2">
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
                className={`flex items-center gap-4 p-4 border ${item.border} shadow-md shadow-[#0000001A] rounded-2xl ${item.bg} text-left`}
              >
                <div className={`${item.bgIcon} ${item.color} p-2 rounded-xl shadow-sm`}>
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
        <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-12 pt-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 border border-gray-200 px-8 py-2.5 rounded-lg text-[#0A0A0A] font-medium hover:text-gray-800 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" /> Previous
          </button>

          <button
            onClick={onLogin}
            className="px-24 py-2.5 bg-[#009966] text-white rounded-xl font-semibold hover:bg-[#005a38] transition-all shadow-md hover:shadow-xl"
          >
            Login
          </button>

          <button
            onClick={onRegister}
            className="px-24 py-2.5 border border-[#0A0A0A] text-[#0A0A0A] rounded-xl font-semibold hover:bg-gray-50 transition-all shadow-sm"
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