"use client";

import React from "react";
import AiChatAnalysisTab from "./AiChatAnalysisTab";

interface Props {
  projectId: string;
}

export default function ExclusionsTab({ projectId }: Props) {
  return <AiChatAnalysisTab projectId={projectId} section="exclusions" title="Scope Exclusions" />;
}
