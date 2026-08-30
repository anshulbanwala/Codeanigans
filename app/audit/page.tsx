"use client";

import { useSyncExternalStore } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { readAudit } from "@/lib/audit-client";
import { shortDate } from "@/lib/format";

function subscribe(onStoreChange: () => void) {
  window.addEventListener("sentinel-audit", onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener("sentinel-audit", onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

export default function AuditPage() {
  const rows = useSyncExternalStore(subscribe, readAudit, () => []);

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-4">
      <div>
        <h1 className="font-heading text-2xl tracking-tight">Copilot audit log</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Every natural-language answer is immutable here: who asked, what was cited, and the SQL that would run in Snowflake.
          In production this writes to a Snowflake table with row access policies for Internal Audit.
        </p>
      </div>
      {rows.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-sm text-muted-foreground">
            No questions yet. Ask the copilot something — this page will fill from this browser session.
          </CardContent>
        </Card>
      ) : (
        rows.map((r) => (
          <Card key={r.id}>
            <CardHeader>
              <CardTitle className="text-base font-medium">{r.question}</CardTitle>
              <p className="text-xs text-muted-foreground">
                {r.id} · {shortDate(r.at)} · {r.user} · {r.confidence}
              </p>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              <p>Citations: {r.citations.join(", ") || "none"}</p>
              {r.sql && (
                <pre className="mt-2 overflow-x-auto rounded-md bg-muted/40 p-2 font-mono">{r.sql}</pre>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
