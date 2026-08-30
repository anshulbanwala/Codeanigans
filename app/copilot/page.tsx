"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { suggestedPrompts } from "@/lib/engine";
import type { CopilotResponse } from "@/lib/types";
import { appendAudit } from "@/lib/audit-client";

type Turn = { q: string; a: CopilotResponse };

export default function CopilotPage() {
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [turns, setTurns] = useState<Turn[]>([]);

  const empty = turns.length === 0;

  async function ask(question: string) {
    const q = question.trim();
    if (!q) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      });
      if (!res.ok) throw new Error("Copilot service returned an error.");
      const a = (await res.json()) as CopilotResponse;
      setTurns((t) => [...t, { q, a }]);
      appendAudit({ question: q, response: a });
      setInput("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  const last = turns.at(-1);

  const graphHint = useMemo(() => {
    if (!last) return null;
    if (last.a.relatedCaseIds.includes("CASE-1088")) return "mule";
    if (last.a.relatedCaseIds.includes("CASE-1115")) return "round";
    return null;
  }, [last]);

  return (
    <div className="mx-auto grid max-w-6xl gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="font-heading text-2xl tracking-tight">Risk copilot</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Natural language over the risk mart. Answers abstain when ungrounded. SQL and clause citations travel with every response.
          </p>
        </div>

        {empty && (
          <Card>
            <CardHeader>
              <CardTitle>Try a judge-ready prompt</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {suggestedPrompts.map((p) => (
                <Button key={p} variant="outline" size="sm" onClick={() => ask(p)}>
                  {p}
                </Button>
              ))}
            </CardContent>
          </Card>
        )}

        <div className="flex flex-col gap-4">
          {turns.map((t, i) => (
            <Card key={i}>
              <CardHeader>
                <p className="text-xs text-muted-foreground">You</p>
                <CardTitle className="text-base font-medium">{t.q}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex gap-2">
                  <Badge variant="outline">confidence {t.a.confidence}</Badge>
                  {t.a.strReady && <Badge>STR-ready</Badge>}
                </div>
                <p>{t.a.answer}</p>
                {t.a.bullets.length > 0 && (
                  <ul className="list-disc space-y-1 pl-4 text-muted-foreground">
                    {t.a.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                )}
                {t.a.sql && (
                  <pre className="overflow-x-auto rounded-lg bg-muted/50 p-3 font-mono text-[11px] text-muted-foreground">
                    {t.a.sql}
                  </pre>
                )}
                <div className="flex flex-wrap gap-2">
                  {t.a.citations.map((c) => (
                    <span key={c.label} className="rounded-md border border-border px-2 py-1 text-[11px]">
                      <span className="text-primary">{c.kind}</span> · {c.label}
                    </span>
                  ))}
                </div>
                {t.a.relatedCaseIds.length > 0 && (
                  <p className="text-xs">
                    Cases:{" "}
                    {t.a.relatedCaseIds.map((id) => (
                      <Link key={id} href={`/cases/${id}`} className="mr-2 text-primary hover:underline">
                        {id}
                      </Link>
                    ))}
                    {t.a.strReady && (
                      <Link href="/str" className="text-primary hover:underline">
                        Open STR factory
                      </Link>
                    )}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {error && (
          <p className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
            {error} Check the API route or retry. The local engine is still available via suggestion chips.
          </p>
        )}

        <form
          className="sticky bottom-3 flex flex-col gap-2 rounded-xl border border-border bg-card p-3"
          onSubmit={(e) => {
            e.preventDefault();
            void ask(input);
          }}
        >
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. Show mule accounts with cash-outs after 2am"
            className="min-h-20"
          />
          <div className="flex justify-between">
            <p className="text-[11px] text-muted-foreground">Logged to the audit trail with citations.</p>
            <Button type="submit" disabled={busy || !input.trim()}>
              {busy ? "Grounding…" : "Ask"}
            </Button>
          </div>
        </form>
      </div>

      <aside className="flex flex-col gap-3">
        <Card>
          <CardHeader>
            <CardTitle>Routing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs text-muted-foreground">
            <p>Metrics, counts, LCR, RWA → Cortex Analyst / semantic view.</p>
            <p>Calls, circulars, grounds of suspicion → Cortex Search.</p>
            <p>This demo mirrors that routing locally so you can rehearse without waiting on a warehouse.</p>
          </CardContent>
        </Card>
        {graphHint && (
          <Card>
            <CardHeader>
              <CardTitle>Network sketch</CardTitle>
            </CardHeader>
            <CardContent>
              <svg viewBox="0 0 220 140" className="w-full text-primary">
                {graphHint === "mule" ? (
                  <>
                    <circle cx="110" cy="24" r="16" fill="currentColor" opacity="0.3" />
                    <text x="110" y="28" textAnchor="middle" className="fill-foreground text-[9px]">
                      Nexus
                    </text>
                    <line x1="110" y1="40" x2="50" y2="80" stroke="currentColor" />
                    <line x1="110" y1="40" x2="170" y2="80" stroke="currentColor" />
                    <circle cx="50" cy="92" r="16" fill="currentColor" opacity="0.5" />
                    <text x="50" y="96" textAnchor="middle" className="fill-foreground text-[9px]">
                      Kavya
                    </text>
                    <line x1="50" y1="108" x2="110" y2="128" stroke="currentColor" />
                    <circle cx="170" cy="92" r="16" fill="currentColor" opacity="0.5" />
                    <text x="170" y="96" textAnchor="middle" className="fill-foreground text-[9px]">
                      Neha
                    </text>
                    <circle cx="110" cy="128" r="12" fill="currentColor" opacity="0.5" />
                    <text x="110" y="132" textAnchor="middle" className="fill-foreground text-[9px]">
                      Imran
                    </text>
                  </>
                ) : (
                  <>
                    <circle cx="60" cy="70" r="22" fill="currentColor" opacity="0.35" />
                    <text x="60" y="74" textAnchor="middle" className="fill-foreground text-[9px]">
                      Meru
                    </text>
                    <line x1="82" y1="70" x2="138" y2="70" stroke="currentColor" />
                    <circle cx="160" cy="70" r="22" fill="currentColor" opacity="0.35" />
                    <text x="160" y="74" textAnchor="middle" className="fill-foreground text-[9px]">
                      Sagar
                    </text>
                  </>
                )}
              </svg>
            </CardContent>
          </Card>
        )}
      </aside>
    </div>
  );
}
