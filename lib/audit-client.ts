import type { CopilotResponse } from "@/lib/types";

const KEY = "sentinel-audit";

export type AuditRow = {
  id: string;
  at: string;
  user: string;
  question: string;
  confidence: CopilotResponse["confidence"];
  citations: string[];
  sql?: string;
};

export function appendAudit(input: { question: string; response: CopilotResponse }) {
  if (typeof window === "undefined") return;
  const row: AuditRow = {
    id: `AUD-${Date.now()}`,
    at: new Date().toISOString(),
    user: "demo.mlro@aarohan.fin",
    question: input.question,
    confidence: input.response.confidence,
    citations: input.response.citations.map((c) => `${c.kind}:${c.label}`),
    sql: input.response.sql,
  };
  const prev = readAudit();
  localStorage.setItem(KEY, JSON.stringify([row, ...prev].slice(0, 50)));
  window.dispatchEvent(new Event("sentinel-audit"));
}

export function readAudit(): AuditRow[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]") as AuditRow[];
  } catch {
    return [];
  }
}
