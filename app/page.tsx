import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { alerts, cases, credit, liquidity } from "@/lib/data";
import { inr, pct, shortDate } from "@/lib/format";
import { transactions } from "@/lib/data";
import { executeQuery } from "@/lib/snowflake";
import { ChannelMix, LiquidityPulse, MuleNetwork } from "@/components/risk-visuals";

export const dynamic = "force-dynamic";

type LiveKpis = {
  openAlerts: number;
  fraudVolume: number;
  lcrPct: number;
  bufferDays: number;
  largestExposure: number;
  source: "snowflake" | "local";
};

async function readLiveKpis(): Promise<LiveKpis> {
  const configured = Boolean(
    process.env.SNOWFLAKE_ACCOUNT &&
      process.env.SNOWFLAKE_USER &&
      process.env.SNOWFLAKE_PASSWORD,
  );
  const local = {
    openAlerts: alerts.filter((a) => a.status !== "closed").length,
    fraudVolume: transactions.filter((t) => t.isFraud).reduce((s, t) => s + t.amountInr, 0),
    lcrPct: liquidity.lcrPct,
    bufferDays: liquidity.bufferDays,
    largestExposure: credit.realEstateExposurePct,
    source: "local" as const,
  };

  if (!configured) return local;

  try {
    const rows = await executeQuery<{
      OPEN_ALERTS: number;
      FRAUD_VOLUME: number;
      LCR_PCT: number;
      BUFFER_DAYS: number;
      LARGEST_EXPOSURE: number;
    }>(`SELECT
      (SELECT COUNT(*) FROM SENTINEL.RISK.ALERTS WHERE STATUS IN ('open', 'OPEN', 'investigating', 'INVESTIGATING', 'escalated', 'ESCALATED')) AS OPEN_ALERTS,
      (SELECT COALESCE(SUM(AMOUNT_INR), 0) FROM SENTINEL.RISK.TRANSACTIONS WHERE IS_FRAUD = TRUE) AS FRAUD_VOLUME,
      (SELECT LCR_PCT FROM SENTINEL.RISK.LIQUIDITY_DAILY ORDER BY AS_OF DESC LIMIT 1) AS LCR_PCT,
      (SELECT BUFFER_DAYS FROM SENTINEL.RISK.LIQUIDITY_DAILY ORDER BY AS_OF DESC LIMIT 1) AS BUFFER_DAYS,
      (SELECT COALESCE(MAX(EXPOSURE_INR / NULLIF((SELECT SUM(EXPOSURE_INR) FROM SENTINEL.RISK.CREDIT_EXPOSURES), 0) * 100), 0) FROM SENTINEL.RISK.CREDIT_EXPOSURES) AS LARGEST_EXPOSURE`);
    const row = rows[0];
    if (!row) return local;
    return {
      openAlerts: Number(row.OPEN_ALERTS),
      fraudVolume: Number(row.FRAUD_VOLUME),
      lcrPct: Number(row.LCR_PCT),
      bufferDays: Number(row.BUFFER_DAYS),
      largestExposure: Number(row.LARGEST_EXPOSURE),
      source: "snowflake",
    };
  } catch (error) {
    console.error("[dashboard-kpis]", error);
    return local;
  }
}

function severityClass(s: string) {
  if (s === "critical" || s === "escalated") return "bg-destructive/20 text-destructive";
  if (s === "high" || s === "investigating") return "bg-amber-500/15 text-amber-200";
  return "bg-primary/15 text-primary";
}

export default async function CommandCenter() {
  const kpis = await readLiveKpis();

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl tracking-tight">Command center</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Aarohan Finance (NBFC) — live fraud, credit concentration, and liquidity in one pane.
          Ask the copilot in plain English; every answer is cited and audit-logged.
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          KPI source: <span className="font-medium text-foreground">{kpis.source === "snowflake" ? "Snowflake SENTINEL.RISK" : "local synthetic fallback"}</span>
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi title="Open alerts" value={String(kpis.openAlerts)} hint="structured mart count" />
        <Kpi title="Flagged flow" value={inr(kpis.fraudVolume)} hint="fraud-marked transaction volume" />
        <Kpi title="LCR" value={pct(kpis.lcrPct)} hint={`${kpis.bufferDays} day HQLA buffer`} />
        <Kpi title="Largest exposure" value={pct(kpis.largestExposure)} hint="share of credit book" />
      </div>

      <section className="overflow-hidden rounded-2xl bg-[#0b1113] px-4 py-5 text-white shadow-2xl shadow-black/10 md:px-6 md:py-6">
        <div className="mb-5 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-emerald-200/70">Treasury watch</p>
            <h2 className="mt-1 font-heading text-xl tracking-tight">The book is liquid, but not asleep.</h2>
          </div>
          <p className="max-w-xs text-xs leading-relaxed text-white/45">A compact view of the pressure signals that deserve an MLRO or ALCO conversation today.</p>
        </div>
        <LiquidityPulse />
      </section>

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
            <CardTitle>Ask Sentinel</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>Investigate risk across structured data, call evidence, and regulatory material from one natural-language question.</p>
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-wide text-foreground">Try</p>
              <p className="rounded-lg border border-border p-2 text-xs">“Investigate Rahul Mehta&apos;s structuring concern.”</p>
              <p className="rounded-lg border border-border p-2 text-xs">“Which exposures drive credit concentration?”</p>
              <p className="rounded-lg border border-border p-2 text-xs">“What guidance applies to PEP enhanced monitoring?”</p>
            </div>
            <Link href="/copilot" className="inline-block text-primary hover:underline">
              Open Risk Copilot →
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_1.15fr]">
        <ChannelMix />
        <MuleNetwork />
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
