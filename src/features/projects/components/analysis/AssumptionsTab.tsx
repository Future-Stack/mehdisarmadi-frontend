"use client";

import React from "react";
import AiChatAnalysisTab from "./AiChatAnalysisTab";

interface Props {
  projectId: string;
}

export default function AssumptionsTab({ projectId }: Props) {
  return <AiChatAnalysisTab projectId={projectId} section="assumptions" title="Estimator Assumptions" />;
}
