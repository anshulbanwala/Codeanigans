"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cases as localCases } from "@/lib/data";
import { buildStrPack } from "@/lib/str";
import type { StrPack } from "@/lib/str";

type CaseOption = { id: string; title: string };

export default function StrFactory() {
  const searchParams = useSearchParams();
  const [caseOptions, setCaseOptions] = useState<CaseOption[]>(
    localCases.map((c) => ({ id: c.id, title: c.title })),
  );
  const caseIdFromUrl = searchParams.get("caseId");
  const [id, setId] = useState(caseIdFromUrl ?? localCases[0]?.id ?? "");
  const [syncedCaseParam, setSyncedCaseParam] = useState(caseIdFromUrl);
  if (caseIdFromUrl && caseIdFromUrl !== syncedCaseParam) {
    setSyncedCaseParam(caseIdFromUrl);
    setId(caseIdFromUrl);
  }
  const [pack, setPack] = useState<StrPack | null>(null);
  const [source, setSource] = useState<"snowflake" | "local" | "loading">("loading");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/cases")
      .then((r) => r.json())
      .then((data: { cases?: CaseOption[] }) => {
        if (!data.cases?.length) return;
        setCaseOptions(data.cases);
        setId((current) =>
          data.cases!.some((c) => c.id === current) ? current : data.cases![0].id,
        );
      })
      .catch(() => {
        // keep local fallback list
      });
  }, []);

  const loadPack = useCallback(async (caseId: string) => {
    setSource("loading");
    setError(null);
    try {
      const res = await fetch(`/api/str?caseId=${encodeURIComponent(caseId)}`);
      if (res.ok) {
        const data = (await res.json()) as { pack: StrPack; source: string };
        setPack(data.pack);
        setSource(data.source === "snowflake" ? "snowflake" : "local");
        return;
      }
    } catch {
      // fall through to local
    }
    const c = localCases.find((x) => x.id === caseId);
    if (c) {
      setPack(buildStrPack(c));
      setSource("local");
    } else {
      setPack(null);
      setError("Case not found in mart.");
    }
  }, []);

  useEffect(() => {
    if (!id) return;
    const handle = window.setTimeout(() => {
      void loadPack(id);
    }, 0);
    return () => window.clearTimeout(handle);
  }, [id, loadPack]);

  function downloadJson() {
    if (!pack) return;
    const blob = new Blob([JSON.stringify(pack, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${pack.caseId}-STR.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function downloadMarkdown() {
    if (!pack) return;
    const md = [
      `# STR pack · ${pack.caseId}`,
      ``,
      `**Reporting entity:** ${pack.reportingEntity} (${pack.fiucode})`,
      `**Typology:** ${pack.typology}`,
      ``,
      `## Grounds of suspicion`,
      pack.groundsOfSuspicion,
      ``,
      `## Subjects`,
      ...pack.subjects.map((s) => `- ${s.name} · ${s.pan} · ${s.customerId}`),
      ``,
      `## Transactions`,
      ...pack.transactions.map(
        (t) => `- ${t.id} · ${t.ts} · ${t.amount} · ${t.channel} — ${t.narrative}`,
      ),
      ``,
      `## Clauses`,
      ...pack.clauses.map((c) => `- ${c}`),
      ``,
      `_${pack.filingDeadline}_`,
      ``,
      pack.mlroAttestation,
    ].join("\n");
    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${pack.caseId}-STR.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (!pack && source === "loading") {
    return <p className="text-sm text-muted-foreground">Loading STR pack from mart…</p>;
  }

  if (!pack) {
    return (
      <p className="text-sm text-muted-foreground">
        {error ?? "No cases available to file. Load the risk mart first."}
      </p>
    );
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-4">
      <div>
        <h1 className="font-heading text-2xl tracking-tight">STR factory</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Audit-ready Suspicious Transaction Report in FIU-IND style. This is the output Theme 1 asked for — not a chatbot screenshot.
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          Pack source:{" "}
          <span className="font-medium text-foreground">
            {source === "snowflake" ? "Snowflake SENTINEL.RISK" : "Local fallback"}
          </span>
        </p>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
        <select
          value={id}
          onChange={(e) => setId(e.target.value)}
          className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm sm:min-w-80"
        >
          {caseOptions.map((c) => (
            <option key={c.id} value={c.id} className="bg-background">
              {c.id} · {c.title}
            </option>
          ))}
        </select>
        <div className="flex gap-2">
          <Button variant="outline" onClick={downloadMarkdown}>Download Markdown</Button>
          <Button onClick={downloadJson}>Download JSON</Button>
        </div>
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
              {pack.transactions.slice(0, 25).map((t) => (
                <li key={t.id} className="rounded-md border border-border p-2">
                  <span className="font-mono text-xs">{t.id}</span> · {t.ts} · {t.amount} · {t.channel}
                  <p className="text-xs text-muted-foreground">{t.narrative}</p>
                </li>
              ))}
            </ul>
            {pack.transactions.length > 25 && (
              <p className="mt-2 text-xs text-muted-foreground">
                + {pack.transactions.length - 25} more rows in the downloaded pack.
              </p>
            )}
          </div>
          {pack.unstructuredEvidence.length > 0 && (
            <div>
              <p className="text-muted-foreground">Unstructured evidence (Cortex Search)</p>
              {pack.unstructuredEvidence.map((e, index) => (
                <p key={`${pack.caseId}-ev-${index}`} className="mt-1 text-xs text-muted-foreground">
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
