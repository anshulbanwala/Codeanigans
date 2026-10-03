import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { liquidity as localLiquidity, transactions } from "@/lib/data";
import { inr } from "@/lib/format";
import type { LiquiditySnapshot } from "@/lib/types";

function defaultChannelTotals() {
  return ["CASH", "ATM", "UPI", "NEFT", "IMPS", "RTGS"].map((channel) => ({
    channel,
    amount: transactions
      .filter((transaction) => transaction.channel === channel)
      .reduce((total, transaction) => total + transaction.amountInr, 0),
  }));
}

function chartPoints(values: number[], width: number, height: number, padding = 6) {
  const minimum = Math.min(...values);
  const maximum = Math.max(...values);
  const range = maximum - minimum || 1;
  return values.map((value, index) => ({
    x: padding + (index * (width - padding * 2)) / Math.max(values.length - 1, 1),
    y: height - padding - ((value - minimum) / range) * (height - padding * 2),
  }));
}

function Sparkline({ values, color = "#8ce0d0" }: { values: number[]; color?: string }) {
  const points = chartPoints(values, 300, 82);
  const path = points.map((point, index) => `${index === 0 ? "M" : "L"}${point.x},${point.y}`).join(" ");
  return (
    <svg viewBox="0 0 300 82" className="h-20 w-full" role="img" aria-label="Trend chart">
      <path d="M6 76H294" stroke="currentColor" strokeOpacity="0.12" />
      <path d="M6 42H294" stroke="currentColor" strokeOpacity="0.08" strokeDasharray="3 5" />
      <path d={path} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {points.slice(-1).map((point) => <circle key={`${point.x}-${point.y}`} cx={point.x} cy={point.y} r="3.5" fill={color} />)}
    </svg>
  );
}

export function LiquidityPulse({ snapshot }: { snapshot?: LiquiditySnapshot }) {
  const liquidity = snapshot ?? localLiquidity;
  const values = [
    liquidity.lcrPct - 4.8,
    liquidity.lcrPct - 3.2,
    liquidity.lcrPct - 5.5,
    liquidity.lcrPct - 1.8,
    liquidity.lcrPct - 2.6,
    liquidity.lcrPct - 0.7,
    liquidity.lcrPct,
  ];
  return (
    <Card className="border-white/10 bg-white/[0.045] text-white shadow-none">
      <CardHeader className="flex flex-row items-start justify-between gap-4 pb-2">
        <div>
          <CardTitle className="text-sm font-medium text-white">Liquidity pulse</CardTitle>
          <p className="mt-1 text-xs text-white/45">Seven-day LCR trajectory</p>
        </div>
        <span className="rounded-full bg-emerald-300/10 px-2 py-1 text-[10px] font-medium text-emerald-200">Stable</span>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="font-heading text-3xl tracking-tight">{liquidity.lcrPct}%</p>
            <p className="mt-1 text-xs text-white/45">{liquidity.bufferDays} days HQLA cover</p>
          </div>
          <p className="text-right text-xs text-white/45">floor<br /><span className="text-white/80">100%</span></p>
        </div>
        <Sparkline values={values} />
      </CardContent>
    </Card>
  );
}

export function ChannelMix({
  channels,
}: {
  channels?: { channel: string; amount: number }[];
}) {
  const channelTotals = channels ?? defaultChannelTotals();
  const maxChannelAmount = Math.max(...channelTotals.map((item) => item.amount), 1);
  return (
    <Card className="border-border/80 bg-card/80 shadow-none">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Fraud flow by channel</CardTitle>
        <p className="text-xs text-muted-foreground">Flagged volume in the current story mart</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {channelTotals.map((item) => (
          <div key={item.channel} className="grid grid-cols-[42px_1fr_74px] items-center gap-3 text-xs">
            <span className="font-mono text-muted-foreground">{item.channel}</span>
            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-primary" style={{ width: `${Math.max(4, (item.amount / maxChannelAmount) * 100)}%` }} />
            </div>
            <span className="text-right text-muted-foreground">{inr(item.amount)}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

const networkNodes = [
  { id: "Nexus", x: 150, y: 32, tone: "merchant" },
  { id: "Kavya", x: 72, y: 112, tone: "customer" },
  { id: "Imran", x: 150, y: 154, tone: "customer" },
  { id: "Neha", x: 228, y: 112, tone: "customer" },
  { id: "ATM", x: 150, y: 220, tone: "evidence" },
];

export function RoundTripNetwork() {
  return (
    <Card className="border-border/80 bg-card/80 shadow-none">
      <CardHeader className="flex flex-row items-start justify-between gap-4 pb-2">
        <div>
          <CardTitle className="text-sm">Related-party round trip</CardTitle>
          <p className="text-xs text-muted-foreground">CASE-1115 · Meru Logistics ↔ Sagar Traders</p>
        </div>
        <span className="rounded-full bg-amber-500/10 px-2 py-1 text-[10px] font-medium text-amber-700 dark:text-amber-200">High</span>
      </CardHeader>
      <CardContent>
        <svg viewBox="0 0 300 120" className="h-32 w-full" role="img" aria-label="Round trip between Meru and Sagar">
          <circle cx="70" cy="60" r="28" fill="#8ce0d0" fillOpacity="0.25" stroke="#8ce0d0" />
          <text x="70" y="64" textAnchor="middle" className="fill-current text-[10px] font-medium">Meru</text>
          <path d="M98 60 H202" stroke="currentColor" strokeOpacity="0.35" strokeWidth="2" markerEnd="url(#arrow)" />
          <path d="M202 72 H98" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1.5" strokeDasharray="4 4" />
          <text x="150" y="52" textAnchor="middle" className="fill-muted-foreground text-[9px]">₹1.2 Cr WC window</text>
          <circle cx="230" cy="60" r="28" fill="#f2b35b" fillOpacity="0.2" stroke="#f2b35b" />
          <text x="230" y="64" textAnchor="middle" className="fill-current text-[10px] font-medium">Sagar</text>
        </svg>
        <p className="border-t border-border pt-3 text-[11px] text-muted-foreground">
          Reconcile related-party transfers before working-capital renewal; file STR if economic purpose is absent.
        </p>
      </CardContent>
    </Card>
  );
}

export function StructuringCtrChart() {
  const deposits = [
    { label: "Credit 1", amount: 9.7 },
    { label: "Credit 2", amount: 9.5 },
    { label: "Credit 3", amount: 9.6 },
    { label: "Credit 4", amount: 9.4 },
    { label: "Credit 5", amount: 9.55 },
  ];
  const max = 11;

  return (
    <Card className="border-border/80 bg-card/80 shadow-none">
      <CardHeader className="flex flex-row items-start justify-between gap-4 pb-2">
        <div>
          <CardTitle className="text-sm">CTR structuring pattern</CardTitle>
          <p className="text-xs text-muted-foreground">CASE-1042 · Rahul Mehta · PMLA ₹10L cash threshold</p>
        </div>
        <span className="rounded-full bg-red-500/10 px-2 py-1 text-[10px] font-medium text-red-600 dark:text-red-300">Critical</span>
      </CardHeader>
      <CardContent>
        <svg viewBox="0 0 300 160" className="h-40 w-full" role="img" aria-label="Deposits just under ten lakh CTR line">
          <line x1="40" y1="24" x2="280" y2="24" stroke="#ef7c7c" strokeWidth="1.5" strokeDasharray="4 3" />
          <text x="282" y="28" className="fill-muted-foreground text-[8px]">₹10L CTR</text>
          {deposits.map((d, i) => {
            const barH = (d.amount / max) * 100;
            const x = 48 + i * 48;
            return (
              <g key={d.label}>
                <rect x={x} y={130 - barH} width={28} height={barH} rx="3" fill="#8ce0d0" fillOpacity="0.55" />
                <text x={x + 14} y={145} textAnchor="middle" className="fill-muted-foreground text-[7px]">{d.label}</text>
                <text x={x + 14} y={125 - barH} textAnchor="middle" className="fill-foreground text-[7px]">₹{d.amount}L</text>
              </g>
            );
          })}
        </svg>
        <p className="border-t border-border pt-3 text-[11px] text-muted-foreground">
          Five integrally connected credits sit 3–6% under CTR, followed by IMPS layering — classic smurfing before STR filing.
        </p>
      </CardContent>
    </Card>
  );
}

export function PepEddPanel() {
  return (
    <Card className="border-border/80 bg-card/80 shadow-none">
      <CardHeader className="flex flex-row items-start justify-between gap-4 pb-2">
        <div>
          <CardTitle className="text-sm">PEP enhanced due diligence</CardTitle>
          <p className="text-xs text-muted-foreground">CASE-1101 · Hon. Vikram Desai</p>
        </div>
        <span className="rounded-full bg-amber-500/10 px-2 py-1 text-[10px] font-medium text-amber-700 dark:text-amber-200">EDD overdue</span>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div className="rounded-lg border border-border/80 bg-muted/20 p-2">
            <p className="text-muted-foreground">Declared income</p>
            <p className="font-medium">₹18L / yr</p>
          </div>
          <div className="rounded-lg border border-border/80 bg-muted/20 p-2">
            <p className="text-muted-foreground">Observed spend</p>
            <p className="font-medium">Luxury vehicle · Dubai transfers</p>
          </div>
        </div>
        <ul className="list-disc space-y-1 pl-4 text-[11px] text-muted-foreground">
          <li>RBI KYC: PEP identification + enhanced monitoring</li>
          <li>Source-of-wealth review for consultancy inflows</li>
          <li>STR if suspicion after EDD — FIU 7 working days</li>
        </ul>
      </CardContent>
    </Card>
  );
}

export function CaseInvestigationVisual({ caseId }: { caseId: string }) {
  switch (caseId) {
    case "CASE-1088":
      return <MuleNetwork />;
    case "CASE-1115":
      return <RoundTripNetwork />;
    case "CASE-1042":
      return <StructuringCtrChart />;
    case "CASE-1101":
      return <PepEddPanel />;
    default:
      return (
        <Card className="border-border/80 bg-card/80 shadow-none">
          <CardHeader>
            <CardTitle className="text-sm">Investigation context</CardTitle>
          </CardHeader>
          <CardContent className="text-[11px] text-muted-foreground">
            Review alerts and transaction trail for {caseId}. Use the copilot for a grounded summary.
          </CardContent>
        </Card>
      );
  }
}

export function MuleNetwork() {
  return (
    <Card className="border-border/80 bg-card/80 shadow-none">
      <CardHeader className="flex flex-row items-start justify-between gap-4 pb-2">
        <div>
          <CardTitle className="text-sm">Mule network</CardTitle>
          <p className="text-xs text-muted-foreground">CASE-1088 · linked evidence graph</p>
        </div>
        <span className="rounded-full bg-red-500/10 px-2 py-1 text-[10px] font-medium text-red-600 dark:text-red-300">Critical</span>
      </CardHeader>
      <CardContent>
        <svg viewBox="0 0 300 250" className="h-64 w-full" role="img" aria-label="Mule network showing Nexus Digital Mart connected to Kavya, Imran, Neha and ATM cash-out evidence">
          <defs>
            <filter id="network-glow"><feGaussianBlur stdDeviation="4" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          </defs>
          <path d="M150 51L78 96M150 51L150 138M150 51L222 96M78 130L150 202M150 172L150 202M222 130L150 202" stroke="currentColor" strokeOpacity="0.18" strokeWidth="1.5" strokeDasharray="4 5" />
          {networkNodes.map((node) => {
            const isMerchant = node.tone === "merchant";
            const isEvidence = node.tone === "evidence";
            return (
              <g key={node.id} filter={isMerchant ? "url(#network-glow)" : undefined}>
                <circle cx={node.x} cy={node.y} r={isMerchant ? 26 : 21} fill={isMerchant ? "#f2b35b" : isEvidence ? "#ef7c7c" : "#8ce0d0"} fillOpacity={isMerchant ? 0.95 : 0.22} stroke={isMerchant ? "#f2b35b" : isEvidence ? "#ef7c7c" : "#8ce0d0"} strokeOpacity="0.8" />
                <text x={node.x} y={node.y + 4} textAnchor="middle" className="fill-current text-[10px] font-medium">{node.id}</text>
              </g>
            );
          })}
        </svg>
        <div className="flex items-center justify-between border-t border-border pt-3 text-[11px] text-muted-foreground">
          <span>3 customer nodes</span>
          <span>2:11–03:16 IST</span>
          <span>4 linked artifacts</span>
        </div>
      </CardContent>
    </Card>
  );
}
