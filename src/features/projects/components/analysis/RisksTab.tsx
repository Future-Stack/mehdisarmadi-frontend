"use client";

import React from "react";
import AiChatAnalysisTab from "./AiChatAnalysisTab";

interface Props {
  projectId: string;
}

export default function RisksTab({ projectId }: Props) {
  return <AiChatAnalysisTab projectId={projectId} section="risks" title="Risk Assessment" />;
}
