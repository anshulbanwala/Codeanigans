import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MartSourceBanner } from "@/components/mart-source-banner";
import {
  getAlertsForCase,
  getCallsForCustomers,
  getCaseById,
  getCases,
  getTransactionsForCase,
} from "@/lib/mart";
import { inr, shortDate } from "@/lib/format";
import { CaseInvestigationVisual } from "@/components/risk-visuals";

export const dynamic = "force-dynamic";

const HERO_CASE_IDS = ["CASE-1088", "CASE-1042", "CASE-1101", "CASE-1115"] as const;

const CASE_COPILOT_PROMPTS: Record<string, string> = {
  "CASE-1088": "Show mule accounts with cash-outs after 2am",
  "CASE-1042": "Is Rahul Mehta structuring under the ₹10L CTR?",
  "CASE-1101": "What does RBI require for PEP enhanced due diligence for Vikram Desai?",
  "CASE-1115": "Summarize the Meru and Sagar related-party round trip before WC renewal",
};

export default async function InvestigationsPage({
  searchParams,
}: {
  searchParams: Promise<{ case?: string }>;
}) {
  const params = await searchParams;
  const requested = params.case?.toUpperCase();
  const caseId =
    requested && HERO_CASE_IDS.includes(requested as (typeof HERO_CASE_IDS)[number])
      ? requested
      : "CASE-1088";

  const casesResult = await getCases();
  const caseResult = await getCaseById(caseId);
  const focusCase = caseResult.data;

  if (!focusCase) {
    return <p className="text-sm text-muted-foreground">No investigations available.</p>;
  }

  const [alertsResult, txResult, callsResult] = await Promise.all([
    getAlertsForCase(focusCase.id),
    getTransactionsForCase(focusCase.id, focusCase.customerIds),
    getCallsForCustomers(focusCase.customerIds),
  ]);

  const caseAlerts = alertsResult.data;
  const caseTransactions = txResult.data.sort(
    (a, b) => new Date(a.ts).getTime() - new Date(b.ts).getTime(),
  );
  const caseCalls = callsResult.data;
  const flaggedInr = caseTransactions
    .filter((t) => t.isFraud || t.typology)
    .reduce((s, t) => s + t.amountInr, 0);
  const copilotQ = CASE_COPILOT_PROMPTS[focusCase.id] ?? "Summarize open AML alerts by typology";

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-5">
      <MartSourceBanner source={caseResult.source} />

      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-primary">
            Investigation desk
          </p>
          <h1 className="mt-1 font-heading text-3xl tracking-tight">
            Follow the evidence, not the noise.
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Hero AML investigations from the Sentinel mart — alerts, transaction trail, and call
            artifacts in one workspace.
          </p>
        </div>
        <Link href={`/cases/${focusCase.id}`} className="text-sm text-primary hover:underline">
          Open full case file →
        </Link>
      </div>

      <div className="flex flex-wrap gap-2">
        {HERO_CASE_IDS.map((id) => {
          const meta = casesResult.data.find((c) => c.id === id);
          const active = id === focusCase.id;
          return (
            <Link key={id} href={`/investigations?case=${id}`}>
              <Button variant={active ? "default" : "outline"} size="sm" className="text-xs">
                {id}
                {meta ? ` · ${meta.typology}` : ""}
              </Button>
            </Link>
          );
        })}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Active case" value={focusCase.id} detail={focusCase.severity} />
        <Stat label="Linked alerts" value={String(caseAlerts.length)} detail="unique in mart" />
        <Stat label="Transactions" value={String(caseTransactions.length)} detail="chronological" />
        <Stat label="Flagged flow" value={inr(flaggedInr)} detail={`${caseCalls.length} calls`} />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-3">
            <div>
              <CardTitle>{focusCase.title}</CardTitle>
              <p className="mt-1 max-w-3xl text-xs text-muted-foreground">{focusCase.summary}</p>
            </div>
            <Badge variant="outline">{focusCase.status.replaceAll("_", " ")}</Badge>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Link href={`/copilot?q=${encodeURIComponent(copilotQ)}`}>
              <Button size="sm" variant="secondary">Ask copilot about this case</Button>
            </Link>
            <Link href={`/str?caseId=${focusCase.id}`}>
              <Button size="sm" variant="outline">STR factory</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            {caseAlerts.length === 0 ? (
              <p className="text-xs text-muted-foreground">No alerts linked to this case.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-[10px]">ID</TableHead>
                    <TableHead className="text-[10px]">Score</TableHead>
                    <TableHead className="text-[10px]">Typology</TableHead>
                    <TableHead className="text-[10px]">Title</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {caseAlerts.map((a) => (
                    <TableRow key={a.id}>
                      <TableCell className="font-mono text-[10px]">{a.id}</TableCell>
                      <TableCell className="text-[11px]">{a.score}</TableCell>
                      <TableCell className="text-[11px]">{a.typology}</TableCell>
                      <TableCell className="max-w-[200px] truncate text-[11px]" title={a.title}>
                        {a.title}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <CaseInvestigationVisual caseId={focusCase.id} />

        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm">Transaction trail</CardTitle>
          </CardHeader>
          <CardContent>
            {caseTransactions.length === 0 ? (
              <p className="text-sm text-muted-foreground">No transactions linked in the mart.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-[10px]">Time</TableHead>
                    <TableHead className="text-[10px]">Channel</TableHead>
                    <TableHead className="text-[10px]">Amount</TableHead>
                    <TableHead className="text-[10px]">Counterparty</TableHead>
                    <TableHead className="text-[10px]">Typology</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {caseTransactions.slice(0, 40).map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="whitespace-nowrap font-mono text-[10px]">
                        {shortDate(transaction.ts)}
                      </TableCell>
                      <TableCell className="text-[11px]">{transaction.channel}</TableCell>
                      <TableCell className="text-[11px]">{inr(transaction.amountInr)}</TableCell>
                      <TableCell className="max-w-[180px] truncate text-[11px]">
                        {transaction.counterparty}
                      </TableCell>
                      <TableCell className="text-[11px]">
                        {transaction.typology ?? (transaction.isFraud ? "fraud" : "—")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <CardTitle className="text-sm">Call evidence</CardTitle>
            <Badge variant="outline" className="text-[10px]">{caseCalls.length} transcripts</Badge>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
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
