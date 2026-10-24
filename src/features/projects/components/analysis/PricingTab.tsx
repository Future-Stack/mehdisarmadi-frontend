"use client";

import React from "react";
import AiChatAnalysisTab from "./AiChatAnalysisTab";

interface Props {
  projectId: string;
}

export default function PricingTab({ projectId }: Props) {
  return <AiChatAnalysisTab projectId={projectId} section="pricing" title="Pricing & Estimates" />;
}
