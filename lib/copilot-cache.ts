import type { AgentResult } from "@/lib/agent";

const TTL_MS = 10 * 60 * 1000;

type Entry = { result: AgentResult; at: number };

const cache = new Map<string, Entry>();

function normalize(question: string): string {
  return question.trim().toLowerCase().replace(/\s+/g, " ");
}

export function getCachedAgentResult(question: string): AgentResult | null {
  if (process.env.COPILOT_DEMO_CACHE !== "true") return null;
  const key = normalize(question);
  const hit = cache.get(key);
  if (!hit) return null;
  if (Date.now() - hit.at > TTL_MS) {
    cache.delete(key);
    return null;
  }
  return hit.result;
}

export function setCachedAgentResult(question: string, result: AgentResult): void {
  if (process.env.COPILOT_DEMO_CACHE !== "true") return;
  cache.set(normalize(question), { result, at: Date.now() });
}
