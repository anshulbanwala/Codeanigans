import { INSTITUTION, transactions, customers, accounts, callTranscripts } from "@/lib/data";
import { inr } from "@/lib/format";
import type { CaseFile } from "@/lib/types";

export type StrPack = {
  reportType: "STR";
  reportingEntity: string;
  fiucode: string;
  caseId: string;
  subjects: { name: string; pan: string; customerId: string }[];
  groundsOfSuspicion: string;
  typology: string;
  transactions: { id: string; ts: string; amount: string; channel: string; narrative: string }[];
  unstructuredEvidence: string[];
  clauses: string[];
  filingDeadline: string;
  mlroAttestation: string;
};

export function buildStrPack(caseFile: CaseFile): StrPack {
  const subjects = customers
    .filter((c) => caseFile.customerIds.includes(c.id))
    .map((c) => ({ name: c.name, pan: c.pan, customerId: c.id }));
  const accts = accounts.filter((a) => caseFile.customerIds.includes(a.customerId)).map((a) => a.id);
  const txs = transactions.filter((t) => accts.includes(t.accountId) && (t.isFraud || t.typology));
  const evidence = callTranscripts
    .filter((c) => caseFile.customerIds.includes(c.customerId))
    .map((c) => `${c.id}: ${c.text}`);

  const clauses =
    caseFile.typology === "structuring"
      ? ["PMLA Rules 2005 — Rule 3 / 8 (CTR of integrally connected cash > ₹10 lakh)", "FIU-IND STR within 7 working days of suspicion"]
      : caseFile.typology === "mule"
        ? ["RBI guidance on mule accounts and digital fraud", "FIU-IND STR — attempted or completed, amount irrelevant"]
        : caseFile.typology === "pep_unusual"
          ? ["RBI Master Direction KYC — Chapter VII PEPs", "PMLA — ongoing CDD"]
          : ["PMLA — suspicious related-party loops", "RBI KYC — beneficial ownership"];

  return {
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
      "I certify that this pack is generated from governed Snowflake tables, Cortex Search citations, and an immutable copilot audit log. No production customer data was used — synthetic NBFC demo only.",
  };
}
