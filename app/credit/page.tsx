import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { credit, customers } from "@/lib/data";
import { pct } from "@/lib/format";

const sectors = [
  ["CRE", 34], ["MSME", 23], ["Infrastructure", 18], ["Manufacturing", 12], ["Healthcare", 8], ["Other", 5],
] as const;

export default function CreditPage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-primary">Credit risk</p>
          <h1 className="mt-1 font-heading text-3xl tracking-tight">Concentration before it concentrates.</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">A clear view of borrower weight, sector shape, and the names that deserve committee attention.</p>
        </div>
        <Link href="/copilot" className="text-sm text-primary hover:underline">Ask Sentinel about exposures →</Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Metric label="CRE share" value={pct(credit.realEstateExposurePct)} note="Golden Peak overlay" />
        <Metric label="Top 20" value={pct(credit.top20ConcentrationPct)} note="book concentration" />
        <Metric label="NPA ratio" value={pct(credit.npaPct)} note="portfolio signal" />
      </div>

      <div className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
        <Card>
          <CardHeader><CardTitle className="text-sm">Sector shape</CardTitle><p className="text-xs text-muted-foreground">Share of total exposure</p></CardHeader>
          <CardContent className="space-y-4">
            {sectors.map(([sector, share]) => <div key={sector} className="grid grid-cols-[110px_1fr_40px] items-center gap-3 text-xs"><span className="text-muted-foreground">{sector}</span><div className="h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${share}%` }} /></div><span className="text-right font-medium">{share}%</span></div>)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-start justify-between gap-3"><div><CardTitle className="text-sm">Borrower watchlist</CardTitle><p className="text-xs text-muted-foreground">Names to carry into the next credit committee</p></div><Badge variant="outline">{customers.filter((customer) => customer.riskRating === "high" || customer.riskRating === "critical").length} high risk names</Badge></CardHeader>
          <CardContent className="space-y-3">
            <Borrower name="Golden Peak Realty" sector="CRE" share={credit.realEstateExposurePct} tone="critical" />
            <Borrower name="Meru Logistics Pvt Ltd" sector="Logistics" share={7.8} tone="watch" />
            <Borrower name="Dhananjay Infra Projects" sector="Infrastructure" share={6.4} tone="watch" />
            <Borrower name="Crescent Hospitals Group" sector="Healthcare" share={5.7} tone="normal" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-sm">Committee readout</CardTitle></CardHeader>
        <CardContent className="grid gap-4 text-sm md:grid-cols-3"><Readout title="Observed" text="CRE remains the dominant sector exposure, with Golden Peak Realty as the named concentration overlay." /><Readout title="Derived" text="A single-name shock would be more material than the portfolio average suggests." /><Readout title="Next action" text="Refresh collateral, review connected parties, and confirm board-limit treatment before renewal." /></CardContent>
      </Card>
    </div>
  );
}

function Metric({ label, value, note }: { label: string; value: string; note: string }) { return <Card size="sm"><CardContent><p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">{label}</p><p className="mt-2 font-heading text-2xl tracking-tight">{value}</p><p className="mt-1 text-xs text-muted-foreground">{note}</p></CardContent></Card>; }
function Borrower({ name, sector, share, tone }: { name: string; sector: string; share: number; tone: "critical" | "watch" | "normal" }) { const color = tone === "critical" ? "text-red-600 dark:text-red-300" : tone === "watch" ? "text-amber-600 dark:text-amber-300" : "text-foreground"; return <div className="flex items-center justify-between gap-4 rounded-xl border border-border p-3"><div><p className="text-sm font-medium">{name}</p><p className="mt-1 text-xs text-muted-foreground">{sector} · exposure share</p></div><p className={`font-heading text-xl ${color}`}>{share}%</p></div>; }
function Readout({ title, text }: { title: string; text: string }) { return <div><p className="text-xs font-medium uppercase tracking-wide text-primary">{title}</p><p className="mt-2 leading-relaxed text-muted-foreground">{text}</p></div>; }
