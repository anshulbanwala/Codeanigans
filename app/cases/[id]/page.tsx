import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { accounts, alerts, callTranscripts, cases, customers, transactions } from "@/lib/data";
import { inr, shortDate } from "@/lib/format";

export default async function CaseDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const c = cases.find((x) => x.id === id);
  if (!c) notFound();

  const people = customers.filter((p) => c.customerIds.includes(p.id));
  const accts = accounts.filter((a) => c.customerIds.includes(a.customerId));
  const txs = transactions.filter((t) => accts.some((a) => a.id === t.accountId));
  const relatedAlerts = alerts.filter((a) => a.caseId === c.id);
  const calls = callTranscripts.filter((t) => c.customerIds.includes(t.customerId));

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-4">
      <div>
        <Link href="/cases" className="text-xs text-primary hover:underline">
          ← Cases
        </Link>
        <h1 className="mt-2 font-heading text-2xl tracking-tight">{c.title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{c.summary}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <Badge>{c.severity}</Badge>
          <Badge variant="outline">{c.status.replace("_", " ")}</Badge>
          <span className="text-xs text-muted-foreground">{c.owner}</span>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {people.map((p) => (
          <Card key={p.id}>
            <CardHeader>
              <CardTitle className="text-base">{p.name}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {p.id} · {p.city} · KYC {p.kycStatus} · {p.occupation}
              {p.pep ? " · PEP" : ""}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs text-muted-foreground">
              <tr>
                <th className="py-2 pr-3">When</th>
                <th className="py-2 pr-3">Amount</th>
                <th className="py-2 pr-3">Channel</th>
                <th className="py-2">Narrative</th>
              </tr>
            </thead>
            <tbody>
              {txs.map((t) => (
                <tr key={t.id} className="border-t border-border">
                  <td className="py-2 pr-3 whitespace-nowrap">{shortDate(t.ts)}</td>
                  <td className="py-2 pr-3">
                    {t.type === "debit" ? "−" : "+"}
                    {inr(t.amountInr)}
                  </td>
                  <td className="py-2 pr-3">{t.channel}</td>
                  <td className="py-2 text-muted-foreground">{t.narrative}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {calls.map((call) => (
        <Card key={call.id}>
          <CardHeader>
            <CardTitle className="text-base">Transcript {call.id}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">{call.text}</CardContent>
        </Card>
      ))}

      <div className="flex gap-3 text-sm">
        <Link href="/str" className="text-primary hover:underline">
          Generate STR pack →
        </Link>
        <Link href="/copilot" className="text-primary hover:underline">
          Ask copilot about this case →
        </Link>
      </div>
      <p className="text-xs text-muted-foreground">
        Linked alerts: {relatedAlerts.map((a) => a.id).join(", ") || "none"}
      </p>
    </div>
  );
}
