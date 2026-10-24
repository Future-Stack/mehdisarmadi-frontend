"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface MarkdownViewerProps {
  content: string;
  isRaw?: boolean;
  className?: string;
}

export function MarkdownViewer({ content, isRaw = false, className }: MarkdownViewerProps) {
  if (isRaw) {
    return (
      <pre className={cn("p-6 rounded-2xl bg-gray-50 dark:bg-[#0B0F19] border border-gray-200 dark:border-gray-800 text-xs sm:text-sm font-mono text-gray-800 dark:text-gray-200 overflow-x-auto whitespace-pre-wrap leading-relaxed select-text", className)}>
        {content}
      </pre>
    );
  }

  // Parse markdown lines
  const lines = content.split("\n");
  const renderedElements: React.ReactNode[] = [];

  let inTable = false;
  let tableRows: string[][] = [];
  let inCodeBlock = false;
  let codeBlockLines: string[] = [];

  const flushTable = (key: number) => {
    if (!tableRows.length) return null;
    const headerRow = tableRows[0];
    const bodyRows = tableRows.slice(1).filter(r => !r.every(cell => cell.match(/^[-:]+$/)));

    const el = (
      <div key={`table-${key}`} className="my-4 overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-gray-100/70 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-800">
              {headerRow.map((col, idx) => (
                <th key={idx} className="p-3 font-bold text-gray-900 dark:text-white text-xs uppercase tracking-wider">
                  {col.trim()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {bodyRows.map((row, rIdx) => (
              <tr key={rIdx} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                {row.map((cell, cIdx) => (
                  <td key={cIdx} className="p-3 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                    {parseInlineMarkdown(cell.trim())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
    tableRows = [];
    inTable = false;
    return el;
  };

  const flushCodeBlock = (key: number) => {
    const el = (
      <pre key={`code-${key}`} className="my-3 p-4 rounded-xl bg-gray-900 text-gray-100 text-xs sm:text-sm font-mono overflow-x-auto">
        {codeBlockLines.join("\n")}
      </pre>
    );
    codeBlockLines = [];
    inCodeBlock = false;
    return el;
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    // Check code blocks
    if (trimmed.startsWith("```")) {
      if (inCodeBlock) {
        renderedElements.push(flushCodeBlock(i));
      } else {
        if (inTable) renderedElements.push(flushTable(i));
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeBlockLines.push(rawLine);
      continue;
    }

    // Check tables
    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      inTable = true;
      const cells = trimmed
        .slice(1, -1)
        .split("|")
        .map(c => c.trim());
      tableRows.push(cells);
      continue;
    } else if (inTable) {
      renderedElements.push(flushTable(i));
    }

    // Horizontal Rule
    if (trimmed === "---" || trimmed === "***" || trimmed === "___") {
      renderedElements.push(
        <hr key={`hr-${i}`} className="my-5 border-gray-200 dark:border-gray-800" />
      );
      continue;
    }

    // Headings
    if (trimmed.startsWith("# ")) {
      renderedElements.push(
        <h1 key={`h1-${i}`} className="text-xl sm:text-2xl font-black text-gray-950 dark:text-white mt-5 mb-2.5 tracking-tight flex items-center gap-2">
          {parseInlineMarkdown(trimmed.replace(/^#\s+/, ""))}
        </h1>
      );
      continue;
    }

    if (trimmed.startsWith("## ")) {
      renderedElements.push(
        <h2 key={`h2-${i}`} className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mt-4 mb-2 tracking-tight">
          {parseInlineMarkdown(trimmed.replace(/^##\s+/, ""))}
        </h2>
      );
      continue;
    }

    if (trimmed.startsWith("### ")) {
      renderedElements.push(
        <h3 key={`h3-${i}`} className="text-sm sm:text-base font-bold text-gray-800 dark:text-gray-200 mt-3 mb-1.5">
          {parseInlineMarkdown(trimmed.replace(/^###\s+/, ""))}
        </h3>
      );
      continue;
    }

    if (trimmed.startsWith("#### ")) {
      renderedElements.push(
        <h4 key={`h4-${i}`} className="text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 mt-2 mb-1">
          {parseInlineMarkdown(trimmed.replace(/^####\s+/, ""))}
        </h4>
      );
      continue;
    }

    // Blockquote
    if (trimmed.startsWith("> ")) {
      renderedElements.push(
        <blockquote key={`quote-${i}`} className="border-l-4 border-emerald-500/60 dark:border-emerald-600 pl-4 py-1.5 my-2.5 text-xs sm:text-sm italic text-gray-600 dark:text-gray-400 bg-gray-50/60 dark:bg-gray-800/30 rounded-r-xl">
          {parseInlineMarkdown(trimmed.replace(/^>\s+/, ""))}
        </blockquote>
      );
      continue;
    }

    // Lists
    if (trimmed.match(/^[-*•]\s+/)) {
      const isSub = rawLine.startsWith("  ") || rawLine.startsWith("\t");
      renderedElements.push(
        <div key={`li-${i}`} className={cn("flex items-start gap-2 my-1 text-xs sm:text-sm text-gray-800 dark:text-gray-200", isSub ? "ml-6" : "ml-1")}>
          <span className="text-emerald-500 font-bold select-none leading-relaxed">•</span>
          <div className="flex-1 leading-relaxed">{parseInlineMarkdown(trimmed.replace(/^[-*•]\s+/, ""))}</div>
        </div>
      );
      continue;
    }

    // Numbered lists
    const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
    if (numMatch) {
      renderedElements.push(
        <div key={`num-${i}`} className="flex items-start gap-2.5 my-1.5 text-xs sm:text-sm text-gray-800 dark:text-gray-200 ml-1">
          <span className="font-bold text-emerald-600 dark:text-emerald-400 select-none text-xs min-w-[20px] pt-0.5">
            {numMatch[1]}.
          </span>
          <div className="flex-1 leading-relaxed">{parseInlineMarkdown(numMatch[2])}</div>
        </div>
      );
      continue;
    }

    // Empty lines
    if (!trimmed) {
      renderedElements.push(<div key={`sp-${i}`} className="h-2" />);
      continue;
    }

    // Regular paragraphs
    renderedElements.push(
      <p key={`p-${i}`} className="my-1.5 text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
        {parseInlineMarkdown(trimmed)}
      </p>
    );
  }

  if (inTable) renderedElements.push(flushTable(lines.length));
  if (inCodeBlock) renderedElements.push(flushCodeBlock(lines.length));

  return (
    <div className={cn("prose-sm max-w-none text-gray-800 dark:text-gray-200 select-text leading-relaxed font-sans", className)}>
      {renderedElements}
    </div>
  );
}

function parseInlineMarkdown(text: string): React.ReactNode {
  if (!text) return "";

  // Split by inline markdown tokens: `code`, **bold**, *italic*
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*.*?\*\*|\*.*?\*|`.*?`)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    const token = match[0];
    if (token.startsWith("**") && token.endsWith("**")) {
      parts.push(
        <strong key={match.index} className="font-bold text-gray-950 dark:text-white">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith("*") && token.endsWith("*")) {
      parts.push(
        <em key={match.index} className="italic text-gray-600 dark:text-gray-400">
          {token.slice(1, -1)}
        </em>
      );
    } else if (token.startsWith("`") && token.endsWith("`")) {
      parts.push(
        <code key={match.index} className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-emerald-700 dark:text-emerald-400 font-mono text-[11px] sm:text-xs">
          {token.slice(1, -1)}
        </code>
      );
    }

    lastIndex = match.index + token.length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length ? parts : text;
}
