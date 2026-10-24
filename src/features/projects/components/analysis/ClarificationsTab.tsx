"use client";

import React from "react";
import AiChatAnalysisTab from "./AiChatAnalysisTab";

interface Props {
  projectId: string;
}

export default function ClarificationsTab({ projectId }: Props) {
  return <AiChatAnalysisTab projectId={projectId} section="clarifications" title="Clarifications & RFIs" />;
}
