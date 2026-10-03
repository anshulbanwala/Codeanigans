import {
  accounts as localAccounts,
  alerts as localAlerts,
  callTranscripts as localCalls,
  cases as localCases,
  credit as localCredit,
  customers as localCustomers,
  liquidity as localLiquidity,
  regulations as localRegulations,
  transactions as localTransactions,
} from "@/lib/data";
import { executeQuery } from "@/lib/snowflake";
import { isSnowflakeConfigured } from "@/lib/snowflake-config";
import type {
  Account,
  Alert,
  AlertStatus,
  CaseFile,
  CaseStatus,
  CreditMetric,
  Customer,
  LiquiditySnapshot,
  RegulatoryDoc,
  RiskRating,
  Transaction,
} from "@/lib/types";
import type { StrPack } from "@/lib/str";
import { INSTITUTION } from "@/lib/data";
import { inr } from "@/lib/format";

export type DataSource = "snowflake" | "local";

export type MartResult<T> = {
  source: DataSource;
  data: T;
};

export type CallTranscript = {
  id: string;
  customerId: string;
  ts: string;
  text: string;
};

function asAlertStatus(s: string): AlertStatus {
  const v = s.toLowerCase();
  if (v === "open") return "open";
  if (v === "investigating") return "investigating";
  if (v === "escalated") return "escalated";
  return "closed";
}

function asCaseStatus(s: string): CaseStatus {
  const v = s.toLowerCase();
  if (v === "new") return "new";
  if (v === "in_review" || v === "investigating") return "in_review";
  if (v === "str_drafted" || v === "str filed") return "str_drafted";
  if (v === "filed") return "filed";
  if (v === "cleared" || v === "closed") return "cleared";
  return "in_review";
}

function asRiskRating(s: string): RiskRating {
  const v = s.toLowerCase();
  if (v === "critical") return "critical";
  if (v === "high") return "high";
  if (v === "medium") return "medium";
  return "low";
}

function mapCustomer(row: Record<string, unknown>): Customer {
  return {
    id: String(row.CUSTOMER_ID),
    name: String(row.NAME),
    type: String(row.TYPE) as Customer["type"],
    pan: String(row.PAN),
    city: String(row.CITY),
    kycStatus: String(row.KYC_STATUS) as Customer["kycStatus"],
    pep: Boolean(row.PEP),
    riskRating: asRiskRating(String(row.RISK_RATING ?? "medium")),
    occupation: String(row.OCCUPATION ?? ""),
    onboardingDate: String(row.ONBOARDING_DATE ?? ""),
  };
}

function mapAccount(row: Record<string, unknown>): Account {
  return {
    id: String(row.ACCOUNT_ID),
    customerId: String(row.CUSTOMER_ID),
    product: String(row.PRODUCT) as Account["product"],
    ifsc: String(row.IFSC),
    openedOn: String(row.OPENED_ON ?? ""),
    balanceInr: Number(row.BALANCE_INR ?? 0),
    status: String(row.STATUS) as Account["status"],
  };
}

function mapTransaction(row: Record<string, unknown>): Transaction {
  const channel = String(row.CHANNEL ?? "UPI").toUpperCase();
  return {
    id: String(row.TXN_ID),
    ts: String(row.TXN_TS),
    accountId: String(row.ACCOUNT_ID),
    counterparty: String(row.COUNTERPARTY ?? ""),
    channel: channel as Transaction["channel"],
    type: String(row.TXN_TYPE).toLowerCase() === "debit" ? "debit" : "credit",
    amountInr: Number(row.AMOUNT_INR ?? 0),
    city: String(row.CITY ?? ""),
    isFraud: Boolean(row.IS_FRAUD),
    typology: row.TYPOLOGY ? String(row.TYPOLOGY) : undefined,
    narrative: String(row.NARRATIVE ?? ""),
  };
}

function dedupeById<T>(items: T[], idOf: (item: T) => string): T[] {
  const byId = new Map<string, T>();
  for (const item of items) {
    const id = idOf(item);
    if (!byId.has(id)) byId.set(id, item);
  }
  return [...byId.values()];
}

function dedupeAlerts(items: Alert[]): Alert[] {
  const byId = new Map<string, Alert>();
  for (const alert of items) {
    const existing = byId.get(alert.id);
    if (!existing || alert.score > existing.score) {
      byId.set(alert.id, alert);
    }
  }
  return [...byId.values()].sort((a, b) => b.score - a.score);
}

function dedupeTransactions(items: Transaction[]): Transaction[] {
  return dedupeById(items, (t) => t.id).sort((a, b) => a.ts.localeCompare(b.ts));
}

function dedupeCalls(items: CallTranscript[]): CallTranscript[] {
  return dedupeById(items, (c) => c.id).sort((a, b) => a.ts.localeCompare(b.ts));
}

function dedupeCases(items: CaseFile[]): CaseFile[] {
  return dedupeById(items, (c) => c.id);
}

function dedupeRegulations(items: RegulatoryDoc[]): RegulatoryDoc[] {
  return dedupeById(items, (d) => d.id);
}

function mapAlert(row: Record<string, unknown>): Alert {
  return {
    id: String(row.ALERT_ID),
    ts: String(row.ALERT_TS),
    customerId: String(row.CUSTOMER_ID),
    accountId: String(row.ACCOUNT_ID),
    title: String(row.TITLE),
    typology: String(row.TYPOLOGY),
    score: Number(row.SCORE ?? 0),
    status: asAlertStatus(String(row.STATUS)),
    caseId: row.CASE_ID ? String(row.CASE_ID) : undefined,
    explanation: String(row.EXPLANATION ?? ""),
  };
}

async function fetchCaseCustomerMap(): Promise<Map<string, string[]>> {
  const rows = await executeQuery<{ CASE_ID: string; CUSTOMER_ID: string }>(
    `SELECT DISTINCT CASE_ID, CUSTOMER_ID
     FROM SENTINEL.RISK.ALERTS
     WHERE CASE_ID IS NOT NULL AND CUSTOMER_ID IS NOT NULL`,
  );
  const map = new Map<string, string[]>();
  for (const row of rows) {
    const list = map.get(row.CASE_ID) ?? [];
    list.push(row.CUSTOMER_ID);
    map.set(row.CASE_ID, list);
  }
  return map;
}

function mapCase(row: Record<string, unknown>, customerIds: string[]): CaseFile {
  return {
    id: String(row.CASE_ID),
    title: String(row.TITLE),
    customerIds,
    status: asCaseStatus(String(row.STATUS)),
    owner: String(row.OWNER),
    openedOn: String(row.OPENED_ON ?? ""),
    typology: String(row.TYPOLOGY),
    severity: asRiskRating(String(row.SEVERITY ?? "medium")),
    summary: String(row.SUMMARY ?? ""),
  };
}

export async function getCases(): Promise<MartResult<CaseFile[]>> {
  if (!isSnowflakeConfigured()) {
    return { source: "local", data: localCases };
  }
  try {
    const [caseRows, customerMap] = await Promise.all([
      executeQuery<Record<string, unknown>>(
        `SELECT * FROM SENTINEL.RISK.CASES ORDER BY OPENED_ON DESC`,
      ),
      fetchCaseCustomerMap(),
    ]);
    const data = dedupeCases(
      caseRows.map((row) =>
        mapCase(row, customerMap.get(String(row.CASE_ID)) ?? []),
      ),
    );
    return { source: "snowflake", data };
  } catch (error) {
    console.error("[mart-cases]", error);
    return { source: "local", data: localCases };
  }
}

export async function getCaseById(caseId: string): Promise<MartResult<CaseFile | null>> {
  const all = await getCases();
  const found = all.data.find((c) => c.id === caseId) ?? null;
  return { source: all.source, data: found };
}

export async function getAlertsForCase(caseId: string): Promise<MartResult<Alert[]>> {
  const all = await getAlerts(300);
  return { source: all.source, data: all.data.filter((a) => a.caseId === caseId) };
}

export async function getAlerts(limit = 50): Promise<MartResult<Alert[]>> {
  if (!isSnowflakeConfigured()) {
    return { source: "local", data: localAlerts };
  }
  try {
    const rows = await executeQuery<Record<string, unknown>>(
      `SELECT * FROM SENTINEL.RISK.ALERTS
       ORDER BY SCORE DESC
       LIMIT ?`,
      [limit],
    );
    return { source: "snowflake", data: dedupeAlerts(rows.map(mapAlert)) };
  } catch (error) {
    console.error("[mart-alerts]", error);
    return { source: "local", data: localAlerts };
  }
}

export async function getOpenAlertsForDashboard(): Promise<MartResult<Alert[]>> {
  if (!isSnowflakeConfigured()) {
    const open = localAlerts.filter((a) => a.status !== "closed");
    return { source: "local", data: open };
  }
  try {
    const rows = await executeQuery<Record<string, unknown>>(
      `SELECT *
       FROM SENTINEL.RISK.ALERTS
       WHERE LOWER(STATUS) IN ('open', 'investigating', 'escalated')
       QUALIFY ROW_NUMBER() OVER (PARTITION BY ALERT_ID ORDER BY ALERT_TS DESC) = 1
       ORDER BY SCORE DESC
       LIMIT 12`,
    );
    return { source: "snowflake", data: dedupeAlerts(rows.map(mapAlert)) };
  } catch (error) {
    console.error("[mart-open-alerts]", error);
    return {
      source: "local",
      data: localAlerts.filter((a) => a.status !== "closed"),
    };
  }
}

export async function getCustomers(): Promise<MartResult<Customer[]>> {
  if (!isSnowflakeConfigured()) {
    return { source: "local", data: localCustomers };
  }
  try {
    const rows = await executeQuery<Record<string, unknown>>(
      `SELECT * FROM SENTINEL.RISK.CUSTOMERS ORDER BY NAME`,
    );
    return { source: "snowflake", data: rows.map(mapCustomer) };
  } catch (error) {
    console.error("[mart-customers]", error);
    return { source: "local", data: localCustomers };
  }
}

export async function getAccountsForCustomers(
  customerIds: string[],
): Promise<MartResult<Account[]>> {
  if (!customerIds.length) return { source: "local", data: [] };
  if (!isSnowflakeConfigured()) {
    return {
      source: "local",
      data: localAccounts.filter((a) => customerIds.includes(a.customerId)),
    };
  }
  try {
    const placeholders = customerIds.map(() => "?").join(", ");
    const rows = await executeQuery<Record<string, unknown>>(
      `SELECT * FROM SENTINEL.RISK.ACCOUNTS WHERE CUSTOMER_ID IN (${placeholders})`,
      customerIds,
    );
    const source: DataSource = "snowflake";
    return { source, data: rows.map(mapAccount) };
  } catch (error) {
    console.error("[mart-accounts]", error);
    return {
      source: "local",
      data: localAccounts.filter((a) => customerIds.includes(a.customerId)),
    };
  }
}

export async function getTransactionsForCase(
  _caseId: string,
  customerIds: string[],
): Promise<MartResult<Transaction[]>> {
  if (!customerIds.length) {
    return isSnowflakeConfigured()
      ? { source: "snowflake", data: [] }
      : { source: "local", data: [] };
  }
  if (!isSnowflakeConfigured()) {
    const accountIds = localAccounts
      .filter((a) => customerIds.includes(a.customerId))
      .map((a) => a.id);
    return {
      source: "local",
      data: dedupeTransactions(
        localTransactions.filter((t) => accountIds.includes(t.accountId)),
      ),
    };
  }
  try {
    const placeholders = customerIds.map(() => "?").join(", ");
    const rows = await executeQuery<Record<string, unknown>>(
      `SELECT TXN_ID, TXN_TS, ACCOUNT_ID, CUSTOMER_ID, COUNTERPARTY, CHANNEL, TXN_TYPE,
              AMOUNT_INR, CITY, IS_FRAUD, TYPOLOGY, NARRATIVE
       FROM SENTINEL.RISK.TRANSACTIONS
       WHERE CUSTOMER_ID IN (${placeholders})
       QUALIFY ROW_NUMBER() OVER (PARTITION BY TXN_ID ORDER BY TXN_TS DESC) = 1
       ORDER BY TXN_TS`,
      customerIds,
    );
    return { source: "snowflake", data: dedupeTransactions(rows.map(mapTransaction)) };
  } catch (error) {
    console.error("[mart-transactions]", error);
    const accountIds = localAccounts
      .filter((a) => customerIds.includes(a.customerId))
      .map((a) => a.id);
    return {
      source: "local",
      data: dedupeTransactions(
        localTransactions.filter((t) => accountIds.includes(t.accountId)),
      ),
    };
  }
}

export async function getCallsForCustomers(
  customerIds: string[],
): Promise<MartResult<CallTranscript[]>> {
  if (!customerIds.length) {
    return isSnowflakeConfigured()
      ? { source: "snowflake", data: [] }
      : { source: "local", data: [] };
  }
  if (!isSnowflakeConfigured()) {
    return {
      source: "local",
      data: dedupeCalls(localCalls.filter((c) => customerIds.includes(c.customerId))),
    };
  }
  try {
    const placeholders = customerIds.map(() => "?").join(", ");
    const rows = await executeQuery<Record<string, unknown>>(
      `SELECT CALL_ID, CUSTOMER_ID, CALL_TS, TRANSCRIPT_TEXT
       FROM SENTINEL.RISK.CALL_TRANSCRIPTS
       WHERE CUSTOMER_ID IN (${placeholders})
       QUALIFY ROW_NUMBER() OVER (PARTITION BY CALL_ID ORDER BY CALL_TS DESC) = 1
       ORDER BY CALL_TS`,
      customerIds,
    );
    return {
      source: "snowflake",
      data: dedupeCalls(
        rows.map((row) => ({
          id: String(row.CALL_ID),
          customerId: String(row.CUSTOMER_ID),
          ts: String(row.CALL_TS),
          text: String(row.TRANSCRIPT_TEXT),
        })),
      ),
    };
  } catch (error) {
    console.error("[mart-calls]", error);
    return {
      source: "local",
      data: dedupeCalls(localCalls.filter((c) => customerIds.includes(c.customerId))),
    };
  }
}

export async function getRegulations(): Promise<MartResult<RegulatoryDoc[]>> {
  if (!isSnowflakeConfigured()) {
    return { source: "local", data: localRegulations };
  }
  try {
    const rows = await executeQuery<Record<string, unknown>>(
      `SELECT * FROM SENTINEL.RISK.REG_DOCS ORDER BY DOC_ID`,
    );
    return {
      source: "snowflake",
      data: dedupeRegulations(
        rows.map((row) => ({
          id: String(row.DOC_ID),
          title: String(row.TITLE),
          source: String(row.SOURCE),
          clause: String(row.CLAUSE),
          topic: String(row.TOPIC),
          excerpt: String(row.EXCERPT),
        })),
      ),
    };
  } catch (error) {
    console.error("[mart-regulations]", error);
    return { source: "local", data: localRegulations };
  }
}

export async function getLiquidityLatest(): Promise<MartResult<LiquiditySnapshot>> {
  if (!isSnowflakeConfigured()) {
    return { source: "local", data: localLiquidity };
  }
  try {
    const rows = await executeQuery<Record<string, unknown>>(
      `SELECT * FROM SENTINEL.RISK.LIQUIDITY_DAILY ORDER BY AS_OF DESC LIMIT 1`,
    );
    const row = rows[0];
    if (!row) return { source: "local", data: localLiquidity };
    return {
      source: "snowflake",
      data: {
        asOf: String(row.AS_OF),
        lcrPct: Number(row.LCR_PCT),
        nsfrPct: Number(row.NSFR_PCT),
        hqlAInrCr: Number(row.HQLA_INR_CR),
        wholesaleRunoffInrCr: Number(row.WHOLESALE_RUNOFF_INR_CR),
        bufferDays: Number(row.BUFFER_DAYS),
      },
    };
  } catch (error) {
    console.error("[mart-liquidity]", error);
    return { source: "local", data: localLiquidity };
  }
}

export async function getLiquiditySeries(): Promise<MartResult<LiquiditySnapshot[]>> {
  if (!isSnowflakeConfigured()) {
    return { source: "local", data: [localLiquidity] };
  }
  try {
    const rows = await executeQuery<Record<string, unknown>>(
      `SELECT * FROM SENTINEL.RISK.LIQUIDITY_DAILY ORDER BY AS_OF`,
    );
    return {
      source: "snowflake",
      data: rows.map((row) => ({
        asOf: String(row.AS_OF),
        lcrPct: Number(row.LCR_PCT),
        nsfrPct: Number(row.NSFR_PCT),
        hqlAInrCr: Number(row.HQLA_INR_CR),
        wholesaleRunoffInrCr: Number(row.WHOLESALE_RUNOFF_INR_CR),
        bufferDays: Number(row.BUFFER_DAYS),
      })),
    };
  } catch (error) {
    console.error("[mart-liquidity-series]", error);
    return { source: "local", data: [localLiquidity] };
  }
}

export async function getCreditMetrics(): Promise<MartResult<CreditMetric>> {
  if (!isSnowflakeConfigured()) {
    return { source: "local", data: localCredit };
  }
  try {
    const rows = await executeQuery<{
      TOTAL: number;
      CRE: number;
      TOP20: number;
      MAX_SHARE: number;
    }>(`
      WITH base AS (
        SELECT EXPOSURE_INR, SECTOR FROM SENTINEL.RISK.CREDIT_EXPOSURES
      ),
      ranked AS (
        SELECT EXPOSURE_INR, ROW_NUMBER() OVER (ORDER BY EXPOSURE_INR DESC) AS rn
        FROM base
      )
      SELECT
        (SELECT COALESCE(SUM(EXPOSURE_INR), 0) FROM base) AS TOTAL,
        (SELECT COALESCE(SUM(EXPOSURE_INR), 0) FROM base WHERE UPPER(SECTOR) LIKE '%CRE%' OR UPPER(SECTOR) LIKE '%REAL%') AS CRE,
        (SELECT COALESCE(SUM(EXPOSURE_INR), 0) FROM ranked WHERE rn <= 20) AS TOP20,
        (SELECT COALESCE(MAX(EXPOSURE_INR) / NULLIF((SELECT SUM(EXPOSURE_INR) FROM base), 0) * 100, 0) FROM base) AS MAX_SHARE
    `);
    const row = rows[0];
    if (!row || !row.TOTAL) {
      return { source: "local", data: localCredit };
    }
    const total = Number(row.TOTAL);
    return {
      source: "snowflake",
      data: {
        asOf: localCredit.asOf,
        totalRwaInrCr: localCredit.totalRwaInrCr,
        cet1Pct: localCredit.cet1Pct,
        npaPct: localCredit.npaPct,
        top20ConcentrationPct: (Number(row.TOP20) / total) * 100,
        realEstateExposurePct: (Number(row.CRE) / total) * 100,
      },
    };
  } catch (error) {
    console.error("[mart-credit]", error);
    return { source: "local", data: localCredit };
  }
}

export async function getFraudChannelTotals(): Promise<
  MartResult<{ channel: string; amount: number }[]>
> {
  const channels = ["CASH", "ATM", "UPI", "NEFT", "IMPS", "RTGS"];
  if (!isSnowflakeConfigured()) {
    const totals = channels.map((channel) => ({
      channel,
      amount: localTransactions
        .filter((t) => t.channel === channel && t.isFraud)
        .reduce((s, t) => s + t.amountInr, 0),
    }));
    return { source: "local", data: totals };
  }
  try {
    const rows = await executeQuery<{ CHANNEL: string; AMOUNT: number }>(
      `SELECT CHANNEL, SUM(AMOUNT_INR) AS AMOUNT
       FROM SENTINEL.RISK.TRANSACTIONS
       WHERE IS_FRAUD = TRUE
       GROUP BY CHANNEL`,
    );
    const byChannel = new Map(rows.map((r) => [r.CHANNEL.toUpperCase(), Number(r.AMOUNT)]));
    return {
      source: "snowflake",
      data: channels.map((channel) => ({
        channel,
        amount: byChannel.get(channel) ?? 0,
      })),
    };
  } catch (error) {
    console.error("[mart-channels]", error);
    const totals = channels.map((channel) => ({
      channel,
      amount: localTransactions
        .filter((t) => t.channel === channel && t.isFraud)
        .reduce((s, t) => s + t.amountInr, 0),
    }));
    return { source: "local", data: totals };
  }
}

export async function buildStrPackForCase(caseId: string): Promise<MartResult<StrPack | null>> {
  const caseResult = await getCaseById(caseId);
  const caseFile = caseResult.data;
  if (!caseFile) return { source: caseResult.source, data: null };

  const [txResult, callsResult, regsResult] = await Promise.all([
    getTransactionsForCase(caseId, caseFile.customerIds),
    getCallsForCustomers(caseFile.customerIds),
    getRegulations(),
  ]);

  const customersResult = await getCustomers();
  const subjects = customersResult.data
    .filter((c) => caseFile.customerIds.includes(c.id))
    .map((c) => ({ name: c.name, pan: c.pan, customerId: c.id }));

  const txs = txResult.data.filter((t) => t.isFraud || t.typology);
  const evidence = [...new Set(callsResult.data.map((c) => `${c.id}: ${c.text}`))];

  const clauses =
    caseFile.typology === "structuring"
      ? [
          "PMLA Rules 2005 — Rule 3 / 8 (CTR of integrally connected cash > ₹10 lakh)",
          "FIU-IND STR within 7 working days of suspicion",
        ]
      : caseFile.typology === "mule"
        ? [
            "RBI guidance on mule accounts and digital fraud",
            "FIU-IND STR — attempted or completed, amount irrelevant",
          ]
        : caseFile.typology === "pep_unusual"
          ? ["RBI Master Direction KYC — Chapter VII PEPs", "PMLA — ongoing CDD"]
          : ["PMLA — suspicious related-party loops", "RBI KYC — beneficial ownership"];

  const pack: StrPack = {
    reportType: "STR",
    reportingEntity: `${INSTITUTION.name} (${INSTITUTION.type})`,
    fiucode: INSTITUTION.fiucode,
    caseId: caseFile.id,
    subjects,
    groundsOfSuspicion: caseFile.summary,
    typology: caseFile.typology,
    transactions: txs.map((t) => ({
      id: t.id,
      ts: t.ts,
      amount: inr(t.amountInr),
      channel: `${t.channel} ${t.type}`,
      narrative: t.narrative,
    })),
    unstructuredEvidence: evidence,
    clauses,
    filingDeadline: "Within 7 working days of the finding of suspicion (FIU-IND).",
    mlroAttestation:
      regsResult.source === "snowflake"
        ? "I certify that this pack was generated from governed Snowflake tables (SENTINEL.RISK) and copilot audit logs. Synthetic NBFC demo only."
        : "I certify that this pack is generated from governed mart tables and an immutable copilot audit log. No production customer data was used — synthetic NBFC demo only.",
  };

  return { source: caseResult.source, data: pack };
}
