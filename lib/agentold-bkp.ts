import { executeQuery } from "@/lib/snowflake";
import type { CopilotResponse, CopilotCitation } from "@/lib/types";

const AGENT_FQN = "SENTINEL.RISK.SENTINEL_COPILOT";

type AgentContentBlock =
  | { type: "text"; text: string }
  | { type: "tool_use"; tool_use: { name: string; input: Record<string, unknown> } }
  | {
      type: "tool_result";
      tool_result: {
        name: string;
        status: string;
        content: { type: string; json: Record<string, unknown> }[];
      };
    }
  | { type: "suggested_queries"; suggested_queries: { query: string }[] };

type AgentResponse = {
  content: AgentContentBlock[];
  status: string;
  metadata?: Record<string, unknown>;
};

export async function askAgent(question: string): Promise<CopilotResponse> {
  const messagesJson = JSON.stringify({
    messages: [
      {
        role: "user",
        content: [{ type: "text", text: question }],
      },
    ],
  });

  const sql = `SELECT SNOWFLAKE.CORTEX.DATA_AGENT_RUN(?, ?) AS response`;
  const rows = await executeQuery<{ RESPONSE: string }>(sql, [AGENT_FQN, messagesJson]);

  if (!rows.length || !rows[0].RESPONSE) {
    return fallback("Agent returned no response.");
  }

  const raw: AgentResponse = JSON.parse(rows[0].RESPONSE);

  if (raw.status !== "completed") {
    return fallback("Agent did not complete successfully.");
  }

  return parseAgentResponse(raw);
}

function parseAgentResponse(raw: AgentResponse): CopilotResponse {
  let answer = "";
  const citations: CopilotCitation[] = [];
  let sql: string | undefined;
  const caseIds = new Set<string>();
  const alertIds = new Set<string>();

  for (const block of raw.content) {
    if (block.type === "text") {
      answer += block.text;
    }

    if (block.type === "tool_result") {
      const tr = block.tool_result;
      if (!tr.content) continue;

      for (const item of tr.content) {
        if (item.type !== "json" || !item.json) continue;
        const j = item.json as Record<string, unknown>;

        // Extract SQL from Analyst tool results
        if (typeof j.sql === "string") {
          sql = j.sql;
          citations.push({ kind: "sql", label: "Cortex Analyst", detail: j.sql as string });
        }

        // Extract search results (search service tool results have result_set or text)
        if (tr.name && typeof tr.name === "string") {
          if (tr.name.includes("search") || tr.name.includes("reg_doc") || tr.name.includes("call")) {
            citations.push({
              kind: "doc",
              label: tr.name,
              detail: tr.status === "success" ? "Search completed" : tr.status,
            });
          }
        }
      }
    }
  }

  // Extract case and alert IDs from the answer text
  for (const m of answer.matchAll(/CASE-\d+/g)) caseIds.add(m[0]);
  for (const m of answer.matchAll(/ALR-\d+/g)) alertIds.add(m[0]);

  // Parse bullets from markdown list items
  const bullets: string[] = [];
  for (const line of answer.split("\n")) {
    const trimmed = line.trim();
    if (/^[-•*]\s+/.test(trimmed)) {
      bullets.push(trimmed.replace(/^[-•*]\s+/, ""));
    }
  }

  // Determine confidence based on agent completion and tool usage
  const usedTools = raw.content.some((b) => b.type === "tool_result");
  const confidence: CopilotResponse["confidence"] = usedTools ? "high" : "medium";

  // Check STR readiness
  const strReady =
    /\bSTR\b/i.test(answer) &&
    (caseIds.size > 0 || /filing|report|suspicious transaction/i.test(answer));

  return {
    answer,
    bullets,
    citations,
    sql,
    relatedCaseIds: [...caseIds],
    relatedAlertIds: [...alertIds],
    strReady: strReady || undefined,
    confidence,
  };
}

function fallback(message: string): CopilotResponse {
  return {
    answer: message,
    bullets: [],
    citations: [],
    relatedCaseIds: [],
    relatedAlertIds: [],
    confidence: "low",
  };
}
