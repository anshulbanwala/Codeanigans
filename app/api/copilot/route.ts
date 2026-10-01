import { NextResponse } from "next/server";
import { answerQuestion } from "@/lib/engine";
import { askAgent } from "@/lib/agent";
import { logAudit } from "@/lib/audit";
import { isSnowflakeConfigured } from "@/lib/snowflake-config";
import { warmupSnowflakeForCopilot } from "@/lib/warmup";
import { getCachedAgentResult, setCachedAgentResult } from "@/lib/copilot-cache";

export type CopilotEngine = "agent" | "local-fallback" | "local";

/** Vercel Pro recommended — Cortex agent answers can exceed 60s. */
export const maxDuration = 300;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { question?: string };
    const question = body.question ?? "";

    if (!question.trim()) {
      return NextResponse.json({ error: "Empty question" }, { status: 400 });
    }

    const useAgent = isSnowflakeConfigured();

    if (useAgent) {
      const start = Date.now();
      try {
        await warmupSnowflakeForCopilot();

        const cached = getCachedAgentResult(question);
        if (cached) {
          const durationMs = Date.now() - start;
          await logAudit({
            auditId: `AUD-${Date.now()}`,
            question,
            answer: cached.response.answer,
            confidence: cached.response.confidence,
            citations: cached.response.citations.map((c) => `${c.kind}:${c.label}`).join(", "),
            sqlText: cached.response.sql,
            status: "success",
            durationMs,
            toolsUsed: `${cached.toolsUsed.join(", ") || "agent"},demo-cache`,
          }).catch((e) => console.error("[audit-write]", e));

          return NextResponse.json({
            ...cached.response,
            toolsUsed: cached.toolsUsed,
            engine: "agent" satisfies CopilotEngine,
            auditLogged: true,
            cacheHit: true,
          });
        }

        const { response, toolsUsed } = await askAgent(question);
        setCachedAgentResult(question, { response, toolsUsed });
        const durationMs = Date.now() - start;

        await logAudit({
          auditId: `AUD-${Date.now()}`,
          question,
          answer: response.answer,
          confidence: response.confidence,
          citations: response.citations.map((c) => `${c.kind}:${c.label}`).join(", "),
          sqlText: response.sql,
          status: "success",
          durationMs,
          toolsUsed: toolsUsed.join(", ") || undefined,
        }).catch((e) => console.error("[audit-write]", e));

        return NextResponse.json({
          ...response,
          toolsUsed,
          engine: "agent" satisfies CopilotEngine,
          auditLogged: true,
          cacheHit: false,
        });
      } catch (agentErr) {
        const durationMs = Date.now() - start;
        const errMsg =
          agentErr instanceof Error ? agentErr.message : "Unknown agent error";

        const fallback = answerQuestion(question);

        await logAudit({
          auditId: `AUD-${Date.now()}`,
          question,
          answer: fallback.answer,
          confidence: fallback.confidence,
          citations: fallback.citations.map((c) => `${c.kind}:${c.label}`).join(", "),
          sqlText: fallback.sql,
          status: "success",
          durationMs,
          toolsUsed: "local-fallback",
          errorMessage: `Agent error: ${errMsg}`,
        }).catch((e) => console.error("[audit-write]", e));

        console.error("[copilot-agent]", agentErr);
        return NextResponse.json({
          ...fallback,
          engine: "local-fallback" satisfies CopilotEngine,
          auditLogged: true,
          agentError: errMsg,
        });
      }
    }

    const local = answerQuestion(question);
    return NextResponse.json({
      ...local,
      engine: "local" satisfies CopilotEngine,
      auditLogged: false,
    });
  } catch (err) {
    console.error("[copilot]", err);
    return NextResponse.json(
      { error: "Copilot request failed" },
      { status: 500 },
    );
  }
}
