"use client";

import { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { readAudit, type AuditRow } from "@/lib/audit-client";
import { shortDate } from "@/lib/format";

type ServerRow = {
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

type NormalizedRow = {
  id: string;
  at: string;
  user: string;
  question: string;
  confidence: string;
  citations: string;
  sql?: string;
  status: string;
  durationMs?: number;
  toolsUsed?: string;
  errorMessage?: string;
  source: "snowflake" | "local";
};

function normalizeServer(r: ServerRow): NormalizedRow {
  return {
    id: r.AUDIT_ID,
    at: r.ASKED_AT,
    user: r.USER_NAME ?? "unknown",
    question: r.QUESTION,
    confidence: r.CONFIDENCE ?? "unknown",
    citations: r.CITATIONS ?? "",
    sql: r.SQL_TEXT ?? undefined,
    status: r.STATUS ?? "success",
    durationMs: r.DURATION_MS ?? undefined,
    toolsUsed: r.TOOLS_USED ?? undefined,
    errorMessage: r.ERROR_MESSAGE ?? undefined,
    source: "snowflake",
  };
}

function normalizeLocal(r: AuditRow): NormalizedRow {
  return {
    id: r.id,
    at: r.at,
    user: r.user,
    question: r.question,
    confidence: r.confidence,
    citations: r.citations.join(", "),
    sql: r.sql,
    status: "success",
    source: "local",
  };
}

// function subscribeLocal(onStoreChange: () => void) {
//   window.addEventListener("sentinel-audit", onStoreChange);
//   window.addEventListener("storage", onStoreChange);
//   return () => {
//     window.removeEventListener("sentinel-audit", onStoreChange);
//     window.removeEventListener("storage", onStoreChange);
//   };
// }

export default function AuditPage() {
  const [localRows, setLocalRows] = useState<AuditRow[]>([]);
  const [serverRows, setServerRows] = useState<NormalizedRow[]>([]);
  const [serverSource, setServerSource] = useState<"loading" | "snowflake" | "none" | "error">("loading");

  const fetchServer = useCallback(async () => {
    try {
      const res = await fetch("/api/audit");
      if (!res.ok) {
        setServerSource("error");
        return;
      }
      const data = (await res.json()) as { rows: ServerRow[]; source: string };
      if (data.source === "snowflake" && data.rows.length > 0) {
        setServerRows(data.rows.map(normalizeServer));
        setServerSource("snowflake");
      } else {
        setServerSource(data.source as "none" | "error");
      }
    } catch {
      setServerSource("error");
    }
  }, []);

  useEffect(() => {
    const refreshLocal = () => {
      setLocalRows(readAudit());
    };

    refreshLocal();

    window.addEventListener("sentinel-audit", refreshLocal);
    window.addEventListener("storage", refreshLocal);

    return () => {
      window.removeEventListener("sentinel-audit", refreshLocal);
      window.removeEventListener("storage", refreshLocal);
    };
  }, []);

  useEffect(() => {
    fetchServer();
  }, [fetchServer]);

  const useServer = serverSource === "snowflake" && serverRows.length > 0;
  const rows: NormalizedRow[] = useServer
    ? serverRows
    : localRows.map(normalizeLocal);

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-4">
      <div>
        <h1 className="font-heading text-2xl tracking-tight">Copilot audit log</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Every natural-language answer is immutable here: who asked, what was cited, and the SQL that would run in Snowflake.
          {useServer
            ? " Showing records from SENTINEL.RISK.COPILOT_AUDIT."
            : " Showing local browser records (Snowflake audit not connected)."}
        </p>
      </div>
      {rows.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-sm text-muted-foreground">
            {serverSource === "loading"
              ? "Loading audit records..."
              : "No questions yet. Ask the copilot something — this page will fill from this browser session."}
          </CardContent>
        </Card>
      ) : (
        rows.map((r) => (
          <Card key={r.id}>
            <CardHeader>
              <CardTitle className="text-base font-medium">{r.question}</CardTitle>
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span>{r.id}</span>
                <span>·</span>
                <span>{shortDate(r.at)}</span>
                <span>·</span>
                <span>{r.user}</span>
                <Badge variant="outline" className="text-[10px]">
                  {r.confidence}
                </Badge>
                {r.status === "error" && (
                  <Badge variant="destructive" className="text-[10px]">
                    error
                  </Badge>
                )}
                {r.durationMs != null && (
                  <span>{(r.durationMs / 1000).toFixed(1)}s</span>
                )}
                <Badge variant="secondary" className="text-[10px]">
                  {r.source}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-1 text-xs text-muted-foreground">
              {r.citations && <p>Citations: {r.citations}</p>}
              {r.toolsUsed && <p>Tools: {r.toolsUsed}</p>}
              {r.errorMessage && (
                <p className="text-destructive">Error: {r.errorMessage}</p>
              )}
              {r.sql && (
                <pre className="mt-2 overflow-x-auto rounded-md bg-muted/40 p-2 font-mono">
                  {r.sql}
                </pre>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
