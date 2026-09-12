import { executeQuery } from "@/lib/snowflake";
import type { CopilotResponse } from "@/lib/types";

export type AuditRecord = {
  auditId: string;
  question: string;
  answer: string;
  confidence: CopilotResponse["confidence"];
  citations: string;
  sqlText?: string;
  status: "success" | "error";
  durationMs: number;
  toolsUsed?: string;
  errorMessage?: string;
};

export async function logAudit(record: AuditRecord): Promise<void> {
  const sql = `
    INSERT INTO SENTINEL.RISK.COPILOT_AUDIT
      (AUDIT_ID, ASKED_AT, USER_NAME, QUESTION, ANSWER, CONFIDENCE,
       CITATIONS, SQL_TEXT, STATUS, DURATION_MS, TOOLS_USED, ERROR_MESSAGE)
    VALUES (?, CURRENT_TIMESTAMP(), 'demo.mlro@aarohan.fin', ?, ?, ?,
            ?, ?, ?, ?, ?, ?)`;

  const answerTruncated = record.answer.slice(0, 10000);

  await executeQuery(sql, [
    record.auditId,
    record.question,
    answerTruncated,
    record.confidence,
    record.citations,
    record.sqlText ?? null,
    record.status,
    record.durationMs,
    record.toolsUsed ?? null,
    record.errorMessage ?? null,
  ]);
}

export type ServerAuditRow = {
  AUDIT_ID: string;
  ASKED_AT: string;
  USER_NAME: string;
  QUESTION: string;
  ANSWER: string;
  CONFIDENCE: string;
  CITATIONS: string;
  SQL_TEXT: string | null;
  STATUS: string;
  DURATION_MS: number | null;
  TOOLS_USED: string | null;
  ERROR_MESSAGE: string | null;
};

export async function readAuditRecords(
  limit = 50,
): Promise<ServerAuditRow[]> {
  return executeQuery<ServerAuditRow>(
    `SELECT * FROM SENTINEL.RISK.COPILOT_AUDIT ORDER BY ASKED_AT DESC LIMIT ?`,
    [limit],
  );
}
