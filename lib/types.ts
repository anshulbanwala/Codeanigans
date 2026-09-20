export type RiskRating = "low" | "medium" | "high" | "critical";
export type AlertStatus = "open" | "investigating" | "escalated" | "closed";
export type CaseStatus = "new" | "in_review" | "str_drafted" | "filed" | "cleared";

export type Customer = {
  id: string;
  name: string;
  type: "individual" | "corporate" | "merchant";
  pan: string;
  city: string;
  kycStatus: "verified" | "expired" | "partial";
  pep: boolean;
  riskRating: RiskRating;
  occupation: string;
  onboardingDate: string;
};

export type Account = {
  id: string;
  customerId: string;
  product: "savings" | "current" | "loan" | "wallet";
  ifsc: string;
  openedOn: string;
  balanceInr: number;
  status: "active" | "frozen" | "watch";
};

export type Transaction = {
  id: string;
  ts: string;
  accountId: string;
  counterparty: string;
  channel: "UPI" | "NEFT" | "IMPS" | "RTGS" | "CASH" | "CARD";
  type: "credit" | "debit";
  amountInr: number;
  city: string;
  isFraud: boolean;
  typology?: string;
  narrative: string;
};

export type Alert = {
  id: string;
  ts: string;
  customerId: string;
  accountId: string;
  title: string;
  typology: string;
  score: number;
  status: AlertStatus;
  caseId?: string;
  explanation: string;
};

export type CaseFile = {
  id: string;
  title: string;
  customerIds: string[];
  status: CaseStatus;
  owner: string;
  openedOn: string;
  typology: string;
  severity: RiskRating;
  summary: string;
};

export type RegulatoryDoc = {
  id: string;
  title: string;
  source: string;
  clause: string;
  topic: string;
  excerpt: string;
};

export type LiquiditySnapshot = {
  asOf: string;
  lcrPct: number;
  nsfrPct: number;
  hqlAInrCr: number;
  wholesaleRunoffInrCr: number;
  bufferDays: number;
};

export type CreditMetric = {
  asOf: string;
  totalRwaInrCr: number;
  cet1Pct: number;
  npaPct: number;
  top20ConcentrationPct: number;
  realEstateExposurePct: number;
};

export type CopilotCitation = {
  kind: "sql" | "doc" | "alert" | "case";
  label: string;
  detail: string;
};

export type CopilotResponse = {
  answer: string;
  bullets: string[];
  citations: CopilotCitation[];
  sql?: string;
  relatedCaseIds: string[];
  relatedAlertIds: string[];
  strReady?: boolean;
  confidence: "high" | "medium" | "low";
  toolsUsed?: string[];
};
