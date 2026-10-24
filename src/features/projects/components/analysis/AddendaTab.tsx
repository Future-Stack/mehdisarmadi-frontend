"use client";

import React from "react";
import AiChatAnalysisTab from "./AiChatAnalysisTab";

interface Props {
  projectId: string;
}

export default function AddendaTab({ projectId }: Props) {
  return <AiChatAnalysisTab projectId={projectId} section="addenda" title="Addenda Modifications" />;
}
