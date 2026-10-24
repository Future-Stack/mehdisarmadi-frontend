/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Sparkles,
  ArrowUp,
  Copy,
  Check,
  Download,
  Code2,
  FileText,
  RotateCcw,
  Bot,
  User as UserIcon,
  Loader2,
  HelpCircle,
} from "lucide-react";
import { toast } from "sonner";
import {
  useGetProjectSummaryQuery,
  useGetProjectScopeQuery,
  useGetProjectPricingQuery,
  useGetProjectRisksQuery,
  useGetProjectClarificationsQuery,
  useGetProjectAssumptionsQuery,
  useGetProjectExclusionsQuery,
  useGetProjectAddendaQuery,
  useReanalyzeProjectSectionMutation,
  useUpdateProjectAnalysisSectionMutation,
} from "@/store/api/projectApi";
import { formatAnalysisPayloadToMarkdown } from "./formatters";
import { MarkdownViewer } from "./MarkdownViewer";
import { SectionSkeleton, SectionError, getSectionPayload, getProposedPayload } from "./shared";
import { cn } from "@/lib/utils";

interface Props {
  projectId: string;
  section: "summary" | "scope" | "pricing" | "risks" | "clarifications" | "assumptions" | "exclusions" | "addenda";
  title?: string;
  showPromptBar?: boolean;
}

const SECTION_PROMPT_SUGGESTIONS: Record<string, string[]> = {
  summary: [
    "Summarize into 5 key bullet points",
    "Highlight top cost drivers and major schedule milestones",
    "Write an executive brief suitable for client review",
  ],
  scope: [
    "Group all scope items strictly by trade and CSI division",
    "List excluded scope items with reasons",
    "Identify items missing drawing or sheet references",
  ],
  pricing: [
    "Break down total costs into labor vs materials vs equipment",
    "List the 5 highest cost items and unit rates",
    "Check all provisional sums and allowances",
  ],
  risks: [
    "Filter to High and Critical risks only",
    "Add practical mitigation steps for each schedule risk",
    "Calculate contingency allowance recommendation",
  ],
  clarifications: [
    "Draft formal RFI questions to submit to the consultant",
    "Focus on drawing discrepancies vs specifications",
    "Sort questions by priority (Critical first)",
  ],
  assumptions: [
    "List all assumptions regarding site working hours and access",
    "Identify assumptions regarding owner-supplied utilities and staging",
    "Flag assumptions requiring client sign-off before contract",
  ],
  exclusions: [
    "List standard trade boundary exclusions",
    "Highlight client supply and work by other trades",
    "Format exclusions as contract proposal clauses",
  ],
  addenda: [
    "Summarize all scope changes introduced across addenda",
    "Highlight cost impacts resulting from latest addenda",
    "List affected drawings and revision numbers",
  ],
};

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  prompt?: string;
}

export default function AiChatAnalysisTab({ projectId, section, title, showPromptBar }: Props) {
  const sectionKey = section.toLowerCase();
  const canShowPromptBar = showPromptBar !== undefined ? showPromptBar : sectionKey !== "summary";
  const displayTitle = title || section.charAt(0).toUpperCase() + section.slice(1);

  // Hook mappings
  const summaryQuery = useGetProjectSummaryQuery(projectId, { skip: sectionKey !== "summary" });
  const scopeQuery = useGetProjectScopeQuery(projectId, { skip: sectionKey !== "scope" });
  const pricingQuery = useGetProjectPricingQuery(projectId, { skip: sectionKey !== "pricing" });
  const risksQuery = useGetProjectRisksQuery(projectId, { skip: sectionKey !== "risks" });
  const clarificationsQuery = useGetProjectClarificationsQuery(projectId, { skip: sectionKey !== "clarifications" });
  const assumptionsQuery = useGetProjectAssumptionsQuery(projectId, { skip: sectionKey !== "assumptions" });
  const exclusionsQuery = useGetProjectExclusionsQuery(projectId, { skip: sectionKey !== "exclusions" });
  const addendaQuery = useGetProjectAddendaQuery(projectId, { skip: sectionKey !== "addenda" });

  const activeQuery =
    sectionKey === "summary"
      ? summaryQuery
      : sectionKey === "scope"
      ? scopeQuery
      : sectionKey === "pricing"
      ? pricingQuery
      : sectionKey === "risks"
      ? risksQuery
      : sectionKey === "clarifications"
      ? clarificationsQuery
      : sectionKey === "assumptions"
      ? assumptionsQuery
      : sectionKey === "exclusions"
      ? exclusionsQuery
      : addendaQuery;

  const { data, isLoading, isError, refetch } = activeQuery;
  const [reanalyze, { isLoading: isReanalyzing }] = useReanalyzeProjectSectionMutation();
  const [updateSection] = useUpdateProjectAnalysisSectionMutation();

  // Component UI State
  const [prompt, setPrompt] = useState("");
  const [isRawView, setIsRawView] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activePromptExecuting, setActivePromptExecuting] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Extract base payload from query
  const basePayload = useMemo(() => {
    return getSectionPayload(data);
  }, [data]);

  const proposedPayload = useMemo(() => {
    return getProposedPayload(data);
  }, [data]);

  const lastInstruction = useMemo(() => {
    const d = data as any;
    return (
      d?.lastInstruction ||
      d?.data?.lastInstruction ||
      d?.proposedInstruction ||
      d?.data?.proposedInstruction ||
      null
    );
  }, [data]);

  // Initial populate of AI response
  useEffect(() => {
    if (basePayload || proposedPayload) {
      const activeData = proposedPayload?.updated || proposedPayload?.payload || proposedPayload || basePayload;
      const initialText = formatAnalysisPayloadToMarkdown(sectionKey, activeData);

      const initialMsgs: ChatMessage[] = [];

      // If there was an earlier prompt
      if (lastInstruction) {
        initialMsgs.push({
          id: "prompt-init",
          role: "user",
          content: lastInstruction,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        });
      }

      initialMsgs.push({
        id: "msg-init",
        role: "assistant",
        content: initialText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        prompt: lastInstruction || undefined,
      });

      setMessages(initialMsgs);
    }
  }, [basePayload, proposedPayload, lastInstruction, sectionKey]);

  // Copy raw text handler
  const handleCopy = () => {
    const latestAiMessage = [...messages].reverse().find((m) => m.role === "assistant");
    const textToCopy = latestAiMessage?.content || "";
    if (!textToCopy) return;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    toast.success("AI analysis copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  // Download raw markdown handler
  const handleDownloadMarkdown = () => {
    const latestAiMessage = [...messages].reverse().find((m) => m.role === "assistant");
    const text = latestAiMessage?.content || "";
    if (!text) return;

    const blob = new Blob([text], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${projectId}-${sectionKey}-analysis.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Analysis downloaded as Markdown file.");
  };

  // Send reanalyze prompt handler
  const handleSendPrompt = async (customPrompt?: string) => {
    const promptToSend = (customPrompt || prompt).trim();
    if (!promptToSend) {
      toast.error("Please enter a prompt for the AI.");
      return;
    }

    setPrompt("");
    setActivePromptExecuting(promptToSend);

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: promptToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);

    setTimeout(() => {
      chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);

    try {
      const res = await reanalyze({
        projectId,
        section: sectionKey,
        data: { instruction: promptToSend },
      }).unwrap();

      const resData = res?.data || res;
      const proposed = getProposedPayload(resData);
      const updatedPayload =
        proposed?.updated ||
        proposed?.payload ||
        resData?.payload ||
        resData?.data?.payload ||
        resData;

      // Also persist the updated payload to the section
      if (updatedPayload) {
        updateSection({
          projectId,
          section: sectionKey,
          data: {
            payload: updatedPayload,
            note: `AI refined analysis with prompt: "${promptToSend}"`,
          },
        }).catch(() => {});
      }

      const formattedResult = formatAnalysisPayloadToMarkdown(
        sectionKey,
        updatedPayload,
        proposed?.proposed_changes
      );

      const assistantMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: formattedResult,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        prompt: promptToSend,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      toast.success(`AI updated ${displayTitle} based on your prompt!`);
    } catch (err: any) {
      toast.error(
        err?.data?.message || err?.message || `Failed to re-analyze ${displayTitle}. Please try again.`
      );
    } finally {
      setActivePromptExecuting(null);
      setTimeout(() => {
        chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 150);
    }
  };

  const suggestions = SECTION_PROMPT_SUGGESTIONS[sectionKey] || [
    "Summarize into key bullet points",
    "Focus on critical cost and schedule items",
    "Make this analysis concise and executive-level",
  ];

  if (isLoading) return <SectionSkeleton />;
  if (isError) {
    return (
      <SectionError
        message={`Failed to load ${displayTitle} analysis. Please check tender documents and try again.`}
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="flex flex-col space-y-6">
      {/* ── Top ChatGPT Control Bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-[15px] font-bold text-gray-900 dark:text-white">
                {displayTitle} AI Analyst
              </h2>
              {/* <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/40">
                GPT-4o Engine
              </span> */}
            </div>
            <p className="text-[12px] text-gray-500 dark:text-gray-400">
              Raw text AI analysis from tender specifications & drawings
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Format Toggle (Markdown vs Monospace) */}
          <button
            onClick={() => setIsRawView((v) => !v)}
            title={isRawView ? "Switch to ChatGPT Markdown view" : "Switch to Plain Monospace Raw Text"}
            className={cn(
              "h-8 px-3 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border",
              isRawView
                ? "bg-gray-900 text-white border-gray-800 dark:bg-white dark:text-gray-900 dark:border-white"
                : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
            )}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>{isRawView ? "Raw Text" : "Markdown"}</span>
          </button>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="h-8 px-3 rounded-lg text-xs font-semibold bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-1.5 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-600 font-bold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-gray-500" />
                <span>Copy</span>
              </>
            )}
          </button>

          {/* Export File Button */}
          <button
            onClick={handleDownloadMarkdown}
            title="Download analysis as Markdown document (.md)"
            className="h-8 px-3 rounded-lg text-xs font-semibold bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-gray-500" />
            <span className="hidden sm:inline">Export</span>
          </button>

          {/* Refresh / Reset Query */}
          <button
            onClick={() => refetch()}
            title="Reload latest analysis from server"
            className="h-8 w-8 rounded-lg text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-center transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ── Conversation Stream (ChatGPT Bubble Layout) ── */}
      <div className="space-y-6">
        {messages.map((msg) => {
          if (msg.role === "user") {
            return (
              <div key={msg.id} className="flex justify-end items-start gap-3">
                <div className="max-w-2xl bg-emerald-600 text-white rounded-2xl rounded-tr-none px-5 py-3 shadow-sm">
                  <p className="text-[14px] leading-relaxed font-medium whitespace-pre-wrap">
                    {msg.content}
                  </p>
                  <span className="text-[10px] text-emerald-100/75 mt-1 block text-right font-mono">
                    {msg.timestamp}
                  </span>
                </div>
                <div className="w-8 h-8 rounded-xl bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-200 shrink-0 mt-0.5">
                  <UserIcon className="w-4 h-4" />
                </div>
              </div>
            );
          }

          return (
            <div
              key={msg.id}
              className="flex items-start gap-3.5 bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 rounded-3xl p-6 md:p-8 shadow-sm transition-colors duration-300"
            >
              {/* <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shrink-0 mt-1 shadow-sm">
                <Sparkles className="w-4 h-4" />
              </div> */}

              <div className="flex-1 overflow-hidden space-y-3">
                {msg.prompt && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-900/50 text-[11px] font-semibold mb-2">
                    <Sparkles className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    <span>Prompt: &ldquo;{msg.prompt}&rdquo;</span>
                  </div>
                )}

                <MarkdownViewer content={msg.content} isRaw={isRawView} />

                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800 text-[11px] text-gray-400 dark:text-gray-500 font-medium">
                  <span>Renofield Tender AI • {msg.timestamp}</span>
                  <button
                    onClick={handleCopy}
                    className="hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-1 transition-colors"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy text</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {/* ── Thinking / Loading Indicator ── */}
        {activePromptExecuting && (
          <div className="flex items-start gap-3.5 bg-white dark:bg-[#111827] border border-emerald-100 dark:border-emerald-900/40 rounded-3xl p-6 shadow-sm animate-pulse">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white shrink-0 mt-1">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-bold text-emerald-700 dark:text-emerald-300">
                  AI is analyzing tender documents...
                </span>
                <span className="text-xs text-gray-400">
                  Prompt: &ldquo;{activePromptExecuting}&rdquo;
                </span>
              </div>
              <div className="h-3 bg-emerald-50 dark:bg-emerald-950/40 rounded w-3/4 animate-pulse" />
              <div className="h-3 bg-emerald-50 dark:bg-emerald-950/40 rounded w-1/2 animate-pulse" />
            </div>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* ── Bottom ChatGPT Prompt Bar (Non-sticky, hidden on Summary tab) ── */}
      {canShowPromptBar && (
        <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-3xl p-4 sm:p-5 shadow-sm shadow-[#0000000a] space-y-3 transition-colors duration-300 mt-2">
          {/* Quick Suggestion Chips */}
          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1">
            <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mr-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-600" /> Prompts:
            </span>
            {suggestions.map((sug, i) => (
              <button
                key={i}
                type="button"
                disabled={isReanalyzing}
                onClick={() => handleSendPrompt(sug)}
                className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-gray-50 dark:bg-gray-800/80 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-700 dark:hover:text-emerald-300 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700/80 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
              >
                {sug}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <div className="relative flex items-center bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/80 rounded-2xl p-2 pl-4 focus-within:border-emerald-500 dark:focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all shadow-inner">
            <textarea
              ref={textareaRef}
              rows={1}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendPrompt();
                }
              }}
              placeholder={`Ask AI to reanalyze, adjust or expand this ${displayTitle} section... (Enter to send)`}
              className="w-full bg-transparent resize-none text-[13px] sm:text-[14px] text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none max-h-32 py-1.5 leading-relaxed"
            />

            <button
              type="button"
              onClick={() => handleSendPrompt()}
              disabled={isReanalyzing || !prompt.trim()}
              title="Send prompt to AI"
              className="w-9 h-9 rounded-xl bg-[#009966] hover:bg-emerald-700 disabled:bg-gray-200 dark:disabled:bg-gray-700 text-white disabled:text-gray-400 flex items-center justify-center transition-all ml-2 shrink-0 shadow-sm disabled:cursor-not-allowed hover:scale-105 active:scale-95"
            >
              {isReanalyzing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ArrowUp className="w-4 h-4" />
              )}
            </button>
          </div>

          <div className="flex items-center justify-between text-[11px] text-gray-400 dark:text-gray-500 px-1">
            <span>AI can make mistakes. Verify critical pricing and scope numbers with drawings.</span>
            <span className="hidden sm:inline font-mono">Shift + Enter for new line</span>
          </div>
        </div>
      )}
    </div>
  );
}
