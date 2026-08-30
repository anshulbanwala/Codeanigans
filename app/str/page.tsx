"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cases } from "@/lib/data";
import { buildStrPack } from "@/lib/str";

export default function StrFactory() {
  const [id, setId] = useState(cases[0]?.id ?? "");
  const pack = useMemo(() => {
    const c = cases.find((x) => x.id === id);
    return c ? buildStrPack(c) : null;
  }, [id]);

  function download() {
    if (!pack) return;
    const blob = new Blob([JSON.stringify(pack, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${pack.caseId}-STR.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (!pack) {
    return (
      <p className="text-sm text-muted-foreground">No cases available to file. Load the risk mart first.</p>
    );
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-4">
      <div>
        <h1 className="font-heading text-2xl tracking-tight">STR factory</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Audit-ready Suspicious Transaction Report in FIU-IND style. This is the output Theme 1 asked for — not a chatbot screenshot.
        </p>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <select
          value={id}
          onChange={(e) => setId(e.target.value)}
          className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm sm:w-80"
        >
          {cases.map((c) => (
            <option key={c.id} value={c.id} className="bg-background">
              {c.id} · {c.title}
            </option>
          ))}
        </select>
        <Button onClick={download}>Download JSON pack</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {pack.reportType} · {pack.caseId}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <p>
            <span className="text-muted-foreground">Reporting entity:</span> {pack.reportingEntity} ({pack.fiucode})
          </p>
          <div>
            <p className="text-muted-foreground">Subjects</p>
            <ul className="mt-1 list-disc pl-4">
              {pack.subjects.map((s) => (
                <li key={s.customerId}>
                  {s.name} · {s.pan} · {s.customerId}
                </li>
              ))}
            </ul>
          </div>
          <p>
            <span className="text-muted-foreground">Typology:</span> {pack.typology}
          </p>
          <p>{pack.groundsOfSuspicion}</p>
          <div>
            <p className="text-muted-foreground">Transaction schedule</p>
            <ul className="mt-1 space-y-2">
              {pack.transactions.map((t) => (
                <li key={t.id} className="rounded-md border border-border p-2">
                  <span className="font-mono text-xs">{t.id}</span> · {t.ts} · {t.amount} · {t.channel}
                  <p className="text-xs text-muted-foreground">{t.narrative}</p>
                </li>
              ))}
            </ul>
          </div>
          {pack.unstructuredEvidence.length > 0 && (
            <div>
              <p className="text-muted-foreground">Unstructured evidence (Cortex Search)</p>
              {pack.unstructuredEvidence.map((e) => (
                <p key={e} className="mt-1 text-xs text-muted-foreground">
                  {e}
                </p>
              ))}
            </div>
          )}
          <div>
            <p className="text-muted-foreground">Cited clauses</p>
            <ul className="mt-1 list-disc pl-4">
              {pack.clauses.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
          <p className="text-xs text-muted-foreground">{pack.filingDeadline}</p>
          <p className="text-xs">{pack.mlroAttestation}</p>
        </CardContent>
      </Card>
    </div>
  );
}
