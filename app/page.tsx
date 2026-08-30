import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { alerts, cases, credit, liquidity } from "@/lib/data";
import { inr, pct, shortDate } from "@/lib/format";
import { transactions } from "@/lib/data";

function severityClass(s: string) {
  if (s === "critical" || s === "escalated") return "bg-destructive/20 text-destructive";
  if (s === "high" || s === "investigating") return "bg-amber-500/15 text-amber-200";
  return "bg-primary/15 text-primary";
}

export default function CommandCenter() {
  const fraudInr = transactions.filter((t) => t.isFraud).reduce((s, t) => s + t.amountInr, 0);
  const openAlerts = alerts.filter((a) => a.status !== "closed");

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl tracking-tight">Command center</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Aarohan Finance (NBFC) — live fraud, credit concentration, and liquidity in one pane.
          Ask the copilot in plain English; every answer is cited and audit-logged.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi title="Open alerts" value={String(openAlerts.length)} hint="2 critical AML" />
        <Kpi title="Flagged flow (7d)" value={inr(fraudInr)} hint="structuring + mule + round-trip" />
        <Kpi title="LCR" value={pct(liquidity.lcrPct)} hint={`${liquidity.bufferDays} day HQLA buffer`} />
        <Kpi title="CET1" value={pct(credit.cet1Pct)} hint={`CRE ${pct(credit.realEstateExposurePct)} of book`} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Priority queue</CardTitle>
            <Link href="/cases" className="text-xs text-primary hover:underline">
              All cases
            </Link>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {alerts.map((a) => (
              <div
                key={a.id}
                className="flex flex-col gap-1 rounded-lg border border-border p-3 sm:flex-row sm:items-start sm:justify-between"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs text-muted-foreground">{a.id}</span>
                    <Badge className={severityClass(a.status)}>{a.status}</Badge>
                    <span className="text-xs text-muted-foreground">score {a.score}</span>
                  </div>
                  <p className="mt-1 text-sm font-medium">{a.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{a.explanation}</p>
                </div>
                <p className="shrink-0 text-xs text-muted-foreground">{shortDate(a.ts)}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Why this wins judges</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>Theme 1 asked for a copilot that surfaces risk <em>and</em> produces audit-ready regulatory output from NL questions.</p>
            <ul className="list-disc space-y-2 pl-4">
              <li>Structured mart (txns, alerts, LCR, RWA) + unstructured (calls, circulars).</li>
              <li>Grounded answers with SQL + clause citations — no hallucinated filings.</li>
              <li>STR factory emits FIU-IND style packs in one click.</li>
              <li>CoCo CLI path: semantic view, Cortex Search, Cortex Agent, custom skill.</li>
            </ul>
            <Link href="/copilot" className="inline-block text-primary hover:underline">
              Open the copilot →
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Open cases</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          {cases.map((c) => (
            <Link
              key={c.id}
              href={`/cases/${c.id}`}
              className="rounded-lg border border-border p-3 transition-colors hover:bg-muted/40"
            >
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs">{c.id}</span>
                <Badge className={severityClass(c.severity)}>{c.severity}</Badge>
              </div>
              <p className="mt-1 text-sm font-medium">{c.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">{c.summary}</p>
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function Kpi({ title, value, hint }: { title: string; value: string; hint: string }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xs font-normal text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="font-heading text-2xl">{value}</p>
        <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
      </CardContent>
    </Card>
  );
}
