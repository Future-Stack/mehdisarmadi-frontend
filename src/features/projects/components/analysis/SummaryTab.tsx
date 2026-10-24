"use client";

import React from "react";
import AiChatAnalysisTab from "./AiChatAnalysisTab";

interface Props {
  projectId: string;
}

export default function SummaryTab({ projectId }: Props) {
  return <AiChatAnalysisTab projectId={projectId} section="summary" title="Project Summary" showPromptBar={false} />;
}
