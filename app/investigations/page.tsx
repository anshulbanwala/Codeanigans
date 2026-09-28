import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MartSourceBanner } from "@/components/mart-source-banner";
import {
  getAlerts,
  getCallsForCustomers,
  getCaseById,
  getTransactionsForCase,
} from "@/lib/mart";
import { inr, shortDate } from "@/lib/format";
import { MuleNetwork } from "@/components/risk-visuals";

export const dynamic = "force-dynamic";

export default async function InvestigationsPage() {
  const caseResult = await getCaseById("CASE-1088");
  const focusCase = caseResult.data;
  if (!focusCase) {
    return <p className="text-sm text-muted-foreground">No investigations available.</p>;
  }

  const [alertsResult, txResult, callsResult] = await Promise.all([
    getAlerts(200),
    getTransactionsForCase(focusCase.id, focusCase.customerIds),
    getCallsForCustomers(focusCase.customerIds),
  ]);

  const caseAlerts = alertsResult.data.filter((alert) => alert.caseId === focusCase.id);
  const muleTimeline = txResult.data.filter(
    (t) => t.typology === "mule" || t.isFraud,
  );
  const caseTransactions = (muleTimeline.length ? muleTimeline : txResult.data).slice(0, 8);
  const caseCalls = callsResult.data;
  const caseCustomers = focusCase.customerIds;

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-5">
      <MartSourceBanner source={caseResult.source} />
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-primary">Investigation desk</p>
          <h1 className="mt-1 font-heading text-3xl tracking-tight">Follow the evidence, not the noise.</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Linked alerts, overnight transaction movement, and call context for the mule ring — deduplicated from the Snowflake mart.
          </p>
        </div>
        <Link href={`/cases/${focusCase.id}`} className="text-sm text-primary hover:underline">Open full case file →</Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Active case" value={focusCase.id} detail={focusCase.severity} />
        <Stat label="Alerts linked" value={String(caseAlerts.length)} detail="unique alert ids" />
        <Stat label="Call artifacts" value={String(caseCalls.length)} detail="distinct transcripts" />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <CardTitle>{focusCase.title}</CardTitle>
              <p className="mt-1 text-xs text-muted-foreground">{focusCase.summary}</p>
            </div>
            <Badge variant="outline">{focusCase.status.replaceAll("_", " ")}</Badge>
          </CardHeader>
          <CardContent className="space-y-5">
            <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              Transaction timeline · {caseTransactions.length} events
            </p>
            <div className="relative space-y-4 border-l border-border pl-5">
              {caseTransactions.length === 0 ? (
                <p className="text-sm text-muted-foreground">No transactions linked to this case in the mart.</p>
              ) : (
                caseTransactions.map((transaction) => (
                  <div key={transaction.id} className="relative">
                    <span className="absolute -left-[25px] top-1.5 size-2 rounded-full bg-primary ring-4 ring-background" />
                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                      <span className="font-mono">{shortDate(transaction.ts)}</span>
                      <span>{transaction.channel}</span>
                      <span className="text-foreground">{inr(transaction.amountInr)}</span>
                      {transaction.typology && (
                        <Badge variant="secondary" className="text-[9px]">{transaction.typology}</Badge>
                      )}
                    </div>
                    <p className="mt-1 text-sm font-medium">{transaction.counterparty}</p>
                    <p className="text-xs text-muted-foreground">{transaction.narrative}</p>
                  </div>
                ))
              )}
            </div>
            <div className="rounded-lg border border-amber-500/25 bg-amber-500/5 p-3">
              <p className="text-xs font-medium uppercase tracking-wide text-amber-800 dark:text-amber-200">Investigator recommendation</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Treat the three accounts as one linked mule investigation. Validate shared-device evidence, reconcile the overnight cash-outs, and prepare a network STR if suspicion is established.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-4">
          <MuleNetwork />
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2">
              <CardTitle className="text-sm">Call evidence</CardTitle>
              <Badge variant="outline" className="text-[10px]">{caseCalls.length} distinct</Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              {caseCalls.length === 0 ? (
                <p className="text-xs text-muted-foreground">No call transcripts for linked customers.</p>
              ) : (
                caseCalls.map((call) => (
                  <div key={call.id} className="rounded-lg border border-border/80 bg-muted/20 p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-mono text-[10px] text-primary">{call.id}</p>
                      <p className="text-[10px] text-muted-foreground">{shortDate(call.ts)}</p>
                    </div>
                    <p className="mt-2 border-l-2 border-primary/40 pl-3 text-xs leading-relaxed text-muted-foreground">
                      {call.text}
                    </p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <Card size="sm">
      <CardContent>
        <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="mt-2 font-heading text-xl tracking-tight">{value}</p>
        <p className="mt-1 text-xs capitalize text-muted-foreground">{detail}</p>
      </CardContent>
    </Card>
  );
}
