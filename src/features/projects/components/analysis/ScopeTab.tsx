"use client";

import React from "react";
import AiChatAnalysisTab from "./AiChatAnalysisTab";

interface Props {
  projectId: string;
}

export default function ScopeTab({ projectId }: Props) {
  return <AiChatAnalysisTab projectId={projectId} section="scope" title="Scope of Work" />;
}