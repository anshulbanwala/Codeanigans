import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { liquidity } from "@/lib/data";
import { pct } from "@/lib/format";

const lcrSeries = [102, 104, 103, 107, 105, 109, 108, 110, 108, 111, 109, 108, liquidity.lcrPct];
const runoffSeries = [142, 138, 146, 151, 149, 155, 160, 158, 164, 171, 168, 176, liquidity.wholesaleRunoffInrCr];

export default function LiquidityPage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-primary">Treasury risk</p>
          <h1 className="mt-1 font-heading text-3xl tracking-tight">Liquidity, in motion.</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">A 90-day view of coverage, runoff, and the buffer that gives ALCO room to act.</p>
        </div>
        <Link href="/copilot" className="text-sm text-primary hover:underline">Ask Sentinel about liquidity →</Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Metric label="LCR today" value={pct(liquidity.lcrPct)} note="above analytical floor" tone="good" />
        <Metric label="NSFR" value={pct(liquidity.nsfrPct)} note="stable funding ratio" tone="neutral" />
        <Metric label="Wholesale runoff" value={`${liquidity.wholesaleRunoffInrCr} Cr`} note="binding stress assumption" tone="warn" />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
        <Card>
          <CardHeader className="flex flex-row items-start justify-between gap-3"><div><CardTitle className="text-sm">Coverage trajectory</CardTitle><p className="mt-1 text-xs text-muted-foreground">LCR percentage · last 90 observations</p></div><Badge variant="outline">{liquidity.bufferDays} day buffer</Badge></CardHeader>
          <CardContent><LineChart values={lcrSeries} color="#18a895" floor={100} suffix="%" /></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm">Stress readout</CardTitle></CardHeader>
          <CardContent className="space-y-4 text-sm">
            <Readout label="HQLA" value={`₹${liquidity.hqlAInrCr} Cr`} detail="high-quality liquid assets" />
            <Readout label="Runoff" value={`₹${liquidity.wholesaleRunoffInrCr} Cr`} detail="30-day wholesale stress" />
            <Readout label="Decision" value="Watch" detail="pre-position liquid assets before a market shock" />
            <p className="border-t border-border pt-4 text-xs leading-relaxed text-muted-foreground">The analytical floor represented in this demonstration dataset is 100%. Regulatory interpretation still requires an authorized treasury review.</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-sm">Wholesale runoff pressure</CardTitle><p className="text-xs text-muted-foreground">Illustrative stress progression in INR crore</p></CardHeader>
        <CardContent><LineChart values={runoffSeries} color="#d88a38" suffix=" Cr" /></CardContent>
      </Card>
    </div>
  );
}

function Metric({ label, value, note, tone }: { label: string; value: string; note: string; tone: "good" | "warn" | "neutral" }) {
  const toneClass = tone === "good" ? "text-emerald-600 dark:text-emerald-300" : tone === "warn" ? "text-amber-600 dark:text-amber-300" : "text-foreground";
  return <Card size="sm"><CardContent><p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">{label}</p><p className={`mt-2 font-heading text-2xl tracking-tight ${toneClass}`}>{value}</p><p className="mt-1 text-xs text-muted-foreground">{note}</p></CardContent></Card>;
}

function Readout({ label, value, detail }: { label: string; value: string; detail: string }) {
  return <div><div className="flex items-center justify-between gap-3"><span className="text-muted-foreground">{label}</span><span className="font-medium">{value}</span></div><p className="mt-1 text-xs text-muted-foreground">{detail}</p></div>;
}

function LineChart({ values, color, floor, suffix = "" }: { values: number[]; color: string; floor?: number; suffix?: string }) {
  const width = 720;
  const height = 220;
  const minimum = floor == null ? Math.min(...values) * 0.96 : Math.min(floor, ...values) - 2;
  const maximum = Math.max(...values) * 1.04;
  const point = (value: number, index: number) => ({ x: 18 + index * ((width - 36) / (values.length - 1)), y: height - 18 - ((value - minimum) / (maximum - minimum)) * (height - 36) });
  const points = values.map(point);
  const path = points.map((item, index) => `${index === 0 ? "M" : "L"}${item.x},${item.y}`).join(" ");
  const floorY = floor == null ? undefined : height - 18 - ((floor - minimum) / (maximum - minimum)) * (height - 36);
  return <div><div className="mb-2 flex justify-between text-[10px] text-muted-foreground"><span>{values[0]}{suffix}</span><span>{values.at(-1)}{suffix}</span></div><svg viewBox={`0 0 ${width} ${height}`} className="h-56 w-full" role="img" aria-label="Liquidity trend chart"><path d="M18 202H702" stroke="currentColor" strokeOpacity="0.1" />{floorY != null && <><path d={`M18 ${floorY}H702`} stroke="#d88a38" strokeDasharray="5 6" strokeOpacity="0.7" /><text x="24" y={floorY - 8} className="fill-muted-foreground text-[10px]">floor {floor}{suffix}</text></>}<path d={path} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />{points.slice(-1).map((item) => <circle key={`${item.x}-${item.y}`} cx={item.x} cy={item.y} r="5" fill={color} />)}</svg></div>;
}
