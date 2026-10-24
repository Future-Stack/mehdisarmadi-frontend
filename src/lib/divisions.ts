import { Division } from "@/store/api/projectApi";

export interface DeduplicatedDivision extends Division {
  allIds: string[];
}

export function normalizeDivisionCode(code: string): string {
  const clean = (code || "").replace(/^div\s*/i, "").trim();
  const num = parseInt(clean, 10);
  return !isNaN(num) ? num.toString().padStart(2, "0") : clean;
}

/**
 * Deduplicates and sorts CSI divisions so each division is displayed exactly once.
 * Also preserves all matching IDs (e.g. from old 'Div 01' or unpadded '1' records)
 * so that existing project selections match correctly.
 */
export function deduplicateDivisions(
  rawDivisions: Division[] | undefined | null
): DeduplicatedDivision[] {
  if (!rawDivisions || !Array.isArray(rawDivisions)) return [];

  const map = new Map<string, DeduplicatedDivision>();

  for (const div of rawDivisions) {
    if (!div) continue;
    const normCode = normalizeDivisionCode(div.code || "");
    const cleanName = (div.name || "").trim().toLowerCase();
    // Unique key combines normalized code and name to distinguish divisions
    const key = normCode || cleanName;

    if (!map.has(key)) {
      map.set(key, {
        ...div,
        code: normCode || div.code,
        allIds: [div.id],
      });
    } else {
      const existing = map.get(key)!;
      if (!existing.allIds.includes(div.id)) {
        existing.allIds.push(div.id);
      }
      // Prefer clean 2-digit code over 'Div ' prefix
      if (/^div\s*/i.test(existing.code) && !/^div\s*/i.test(div.code)) {
        existing.id = div.id;
        existing.code = normCode || div.code;
        existing.name = div.name;
      }
    }
  }

  return Array.from(map.values()).sort((a, b) => {
    const numA = parseInt(a.code, 10);
    const numB = parseInt(b.code, 10);
    if (!isNaN(numA) && !isNaN(numB)) {
      return numA - numB;
    }
    return (a.code || "").localeCompare(b.code || "");
  });
}
