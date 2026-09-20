import { NextResponse } from "next/server";
import { answerQuestion } from "@/lib/engine";
import { askAgent } from "@/lib/agent";
import { logAudit } from "@/lib/audit";

const useAgent =
  !!process.env.SNOWFLAKE_ACCOUNT &&
  !!process.env.SNOWFLAKE_USER &&
  !!process.env.SNOWFLAKE_PASSWORD;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { question?: string };
    const question = body.question ?? "";

    if (!question.trim()) {
      return NextResponse.json({ error: "Empty question" }, { status: 400 });
    }

    if (useAgent) {
      const start = Date.now();
      try {
        const { response, toolsUsed } = await askAgent(question);
        const durationMs = Date.now() - start;

        logAudit({
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

        return NextResponse.json({ ...response, toolsUsed });
      } catch (agentErr) {
        const durationMs = Date.now() - start;
        const errMsg =
          agentErr instanceof Error ? agentErr.message : "Unknown agent error";

        logAudit({
          auditId: `AUD-${Date.now()}`,
          question,
          answer: "",
          confidence: "low",
          citations: "",
          status: "error",
          durationMs,
          errorMessage: errMsg,
        }).catch((e) => console.error("[audit-write]", e));

        console.error("[copilot-agent]", agentErr);
        return NextResponse.json(
          { error: "Copilot request failed" },
          { status: 500 },
        );
      }
    }

    return NextResponse.json(answerQuestion(question));
  } catch (err) {
    console.error("[copilot]", err);
    return NextResponse.json(
      { error: "Copilot request failed" },
      { status: 500 },
    );
  }
}
