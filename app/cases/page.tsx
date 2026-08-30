import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cases } from "@/lib/data";

export default function CasesPage() {
  if (cases.length === 0) {
    return (
      <div className="mx-auto max-w-3xl">
        <h1 className="font-heading text-2xl">Cases</h1>
        <p className="mt-4 rounded-lg border border-border p-6 text-sm text-muted-foreground">
          No open cases in the risk mart. Ingestion jobs write here once alerts clear the score threshold.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-4">
      <div>
        <h1 className="font-heading text-2xl tracking-tight">Investigation cases</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Each case binds customers, alerts, transactions, and call transcripts. Open one to walk the evidence.
        </p>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {cases.map((c) => (
          <Link key={c.id} href={`/cases/${c.id}`}>
            <Card className="h-full transition-colors hover:bg-muted/30">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">{c.id}</span>
                  <Badge variant="outline">{c.status.replace("_", " ")}</Badge>
                </div>
                <CardTitle className="text-base">{c.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>{c.summary}</p>
                <p className="text-xs">
                  {c.typology} · {c.owner} · opened {c.openedOn}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
