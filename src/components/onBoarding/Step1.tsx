import React from "react";
import { BsUpload } from "react-icons/bs";
import Logo from "../Reuseable/Logo";

type Step1Props = {
  onNext: () => void;
};


const features = [
  {
    title: "Upload Documents",
    desc: "Drag & drop tender files",
    icon: BsUpload,
  },
  {
    title: "AI Analysis",
    desc: "Auto risk detection",
    icon: BsUpload,
  },
  {
    title: "Smart Quotes",
    desc: "Generate proposals instantly",
    icon: BsUpload,
  },
  {
    title: "Collaboration",
    desc: "Team workflow support",
    icon: BsUpload,
  },
];

const Step1 = ({ onNext }: Step1Props) => {
  return (
       <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="w-full max-w-4xl space-y-10 text-center">

        {/* Logo + Heading */}
        <div className="flex flex-col items-center space-y-4">
          <Logo />

          <h1 className="text-4xl font-bold text-red-500">
            Welcome to TenderPro AI
          </h1>

          <p className="text-lg text-gray-600">
            Smart Tender Management Made Simple
          </p>

          <p className="text-sm text-gray-500 max-w-2xl">
            Transform the way you manage construction tenders with AI-powered automation.
            Analyze documents, identify risks, and generate professional quotes in minutes.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {features.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className="flex flex-col items-center gap-2 p-5 border rounded-lg bg-white hover:shadow-md transition"
              >
                <Icon size={24} />
                <span className="font-medium">{item.title}</span>
                <span className="text-sm text-gray-500">{item.desc}</span>
              </div>
            );
          })}
        </div>

        {/* Button */}
        <div>
          <button
            onClick={onNext}
            className="px-6 py-2 bg-black text-white rounded-md hover:opacity-80 transition"
          >
            Next
          </button>
        </div>

      </div>
    </div>
  );
};

export default Step1;
