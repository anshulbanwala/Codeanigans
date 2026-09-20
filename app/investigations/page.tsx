import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { alerts, callTranscripts, cases, transactions } from "@/lib/data";
import { inr, shortDate } from "@/lib/format";
import { MuleNetwork } from "@/components/risk-visuals";

const focusCase = cases.find((item) => item.id === "CASE-1088") ?? cases[0];

export default function InvestigationsPage() {
  if (!focusCase) return <p className="text-sm text-muted-foreground">No investigations available.</p>;

  const caseAlerts = alerts.filter((alert) => alert.caseId === focusCase.id);
  const caseCustomers = focusCase.customerIds;
  const caseTransactions = transactions.filter((transaction) => caseCustomers.some((id) => transaction.accountId.includes(id.slice(-4)) || transaction.narrative.toLowerCase().includes("mule")));
  const caseCalls = callTranscripts.filter((call) => caseCustomers.includes(call.customerId));

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-primary">Investigation desk</p>
          <h1 className="mt-1 font-heading text-3xl tracking-tight">Follow the evidence, not the noise.</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">A focused case workspace for linked alerts, transaction movement, call context, and recommended next action.</p>
        </div>
        <Link href={`/cases/${focusCase.id}`} className="text-sm text-primary hover:underline">Open full case file →</Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Active case" value={focusCase.id} detail={focusCase.severity} />
        <Stat label="Alerts linked" value={String(caseAlerts.length)} detail="scored evidence" />
        <Stat label="Customer nodes" value={String(caseCustomers.length)} detail="shared investigation" />
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
            <div className="relative space-y-4 border-l border-border pl-5">
              {caseTransactions.slice(0, 6).map((transaction) => (
                <div key={transaction.id} className="relative">
                  <span className="absolute -left-[25px] top-1.5 size-2 rounded-full bg-primary ring-4 ring-background" />
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                    <span className="font-mono">{shortDate(transaction.ts)}</span>
                    <span>{transaction.channel}</span>
                    <span className="text-foreground">{inr(transaction.amountInr)}</span>
                  </div>
                  <p className="mt-1 text-sm font-medium">{transaction.counterparty}</p>
                  <p className="text-xs text-muted-foreground">{transaction.narrative}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-border pt-4">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Investigator recommendation</p>
              <p className="mt-2 text-sm">Treat the three accounts as one linked mule investigation. Validate shared-device evidence, reconcile the overnight cash-outs, and prepare a network STR if suspicion is established.</p>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-4">
          <MuleNetwork />
          <Card>
            <CardHeader><CardTitle className="text-sm">Call evidence</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {caseCalls.slice(0, 3).map((call) => (
                <div key={call.id} className="border-l-2 border-primary/40 pl-3">
                  <p className="font-mono text-[10px] text-primary">{call.id}</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{call.text}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, detail }: { label: string; value: string; detail: string }) {
  return <Card size="sm"><CardContent><p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">{label}</p><p className="mt-2 font-heading text-xl tracking-tight">{value}</p><p className="mt-1 text-xs capitalize text-muted-foreground">{detail}</p></CardContent></Card>;
}
