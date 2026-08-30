import {
  alerts,
  callTranscripts,
  cases,
  credit,
  customers,
  liquidity,
  regulations,
  transactions,
} from "@/lib/data";
import { inr } from "@/lib/format";
import type { CopilotResponse, RegulatoryDoc } from "@/lib/types";

function searchDocs(query: string): RegulatoryDoc[] {
  const tokens = query.toLowerCase().split(/\s+/).filter((t) => t.length > 3);
  return regulations
    .map((doc) => ({
      doc,
      score: tokens.reduce((s, t) => {
        const hay = `${doc.title} ${doc.topic} ${doc.excerpt} ${doc.clause}`.toLowerCase();
        return s + (hay.includes(t) ? 1 : 0);
      }, 0),
    }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((x) => x.doc);
}

function has(q: string, ...words: string[]) {
  return words.some((w) => q.includes(w));
}

export function answerQuestion(raw: string): CopilotResponse {
  const q = raw.toLowerCase().trim();
  if (!q) {
    return {
      answer: "Ask a natural-language question about fraud, liquidity, credit risk, or a regulation.",
      bullets: [],
      citations: [],
      relatedCaseIds: [],
      relatedAlertIds: [],
      confidence: "low",
    };
  }

  if (has(q, "structur", "smurf", "ctr", "10 lakh", "10l", "rahul", "mehta", "cash report")) {
    const txs = transactions.filter((t) => t.typology === "structuring");
    const totalIn = txs.filter((t) => t.type === "credit").reduce((s, t) => s + t.amountInr, 0);
    return {
      answer:
        "Yes — this is a textbook structuring pattern against the PMLA ₹10 lakh cash-transaction threshold. Rahul Mehta (CUS-1042) received five inbound credits of ₹9.4–9.7 lakh over 72 hours, then layered ₹46.8 lakh outbound via IMPS the same evening. CASE-1042 already has an STR draft ready for FIU-IND.",
      bullets: [
        `Inbound credits: ${txs.filter((t) => t.type === "credit").length} totalling ${inr(totalIn)}`,
        "Each credit sits 3–6% under the CTR trigger, which is the classic smurfing signature.",
        "Call transcript CALL-1042: customer told the RM 'cash is how Surat works' and asked not to freeze.",
        "Recommended action: file STR within 7 working days of suspicion (FIU-IND), keep account on watch, and freeze further cash credits.",
      ],
      citations: [
        {
          kind: "alert",
          label: "ALRT-4410",
          detail: alerts.find((a) => a.id === "ALRT-4410")!.explanation,
        },
        {
          kind: "doc",
          label: "PMLA Rule 3 / 8",
          detail: regulations[0].excerpt,
        },
        {
          kind: "case",
          label: "CASE-1042",
          detail: cases[0].summary,
        },
      ],
      sql: `SELECT txn_id, txn_ts, amount_inr, channel, counterparty
FROM RISK.TRANSACTIONS
WHERE customer_id = 'CUS-1042'
  AND txn_ts >= '2026-08-20'
ORDER BY txn_ts;`,
      relatedCaseIds: ["CASE-1042"],
      relatedAlertIds: ["ALRT-4410"],
      strReady: true,
      confidence: "high",
    };
  }

  if (has(q, "mule", "nexus", "kavya", "imran", "neha", "cash-out", "cash out", "velocity", "device")) {
    return {
      answer:
        "A three-node mule ring cashed out ₹6.1 lakh after 02:00 IST on 28 Aug. Nexus Digital Mart funded Kavya Reddy; she split to Imran Shaikh (ATM cash-out in 23 min) and Neha Kulkarni (branch cash, KYC photo mismatch). Shared UPI device fingerprint. All three accounts are frozen. File one network STR, not three isolated reports.",
      bullets: [
        "Typology: cyber-enabled mule / money mule (RBI digital fraud guidance).",
        "Elapsed time from first credit to last cash-out: 65 minutes.",
        "Voice note CALL-1088 coaches the split order: Imran first, then Neha, ATM after 2am.",
        "Next action: notify originating bank of Nexus Digital Mart, add handles to watchlist, STR to FIU-IND.",
      ],
      citations: [
        {
          kind: "alert",
          label: "ALRT-4488",
          detail: alerts.find((a) => a.id === "ALRT-4488")!.explanation,
        },
        {
          kind: "doc",
          label: "RBI mule-account guidance",
          detail: regulations.find((d) => d.id === "DOC-RBI-AML-MULE")!.excerpt,
        },
      ],
      sql: `SELECT customer_id, account_id, txn_ts, amount_inr, channel, type
FROM RISK.TRANSACTIONS
WHERE typology = 'mule'
ORDER BY txn_ts;`,
      relatedCaseIds: ["CASE-1088"],
      relatedAlertIds: ["ALRT-4488"],
      strReady: true,
      confidence: "high",
    };
  }

  if (has(q, "pep", "vikram", "desai", "dubai", "politic", "edd")) {
    return {
      answer:
        "Hon. Vikram Desai is a PEP (former municipal corporator). He received ₹78 lakh from OVERSEAS-DUBAI-LLC labelled consultancy with no contract on file, then spent ₹42 lakh on a luxury vehicle. Declared income is ₹18 lakh. RBI KYC Master Direction requires enhanced ongoing monitoring. Do not clear until source-of-wealth pack is complete.",
      bullets: [
        "EDD status: overdue (RM was asked not to escalate — CALL-1101).",
        "Risk: unexplained wealth + possible concealment of beneficial ownership.",
        "Recommended: source-of-funds affidavit, adverse-media refresh, STR if suspicion crystallises.",
      ],
      citations: [
        {
          kind: "doc",
          label: "RBI KYC MD — PEPs",
          detail: regulations.find((d) => d.id === "DOC-RBI-KYC-54")!.excerpt,
        },
        {
          kind: "alert",
          label: "ALRT-4501",
          detail: alerts.find((a) => a.id === "ALRT-4501")!.explanation,
        },
      ],
      sql: `SELECT * FROM RISK.CUSTOMERS c
JOIN RISK.TRANSACTIONS t ON t.customer_id = c.customer_id
WHERE c.pep = TRUE AND t.txn_ts >= DATEADD(day, -30, CURRENT_DATE());`,
      relatedCaseIds: ["CASE-1101"],
      relatedAlertIds: ["ALRT-4501"],
      confidence: "high",
    };
  }

  if (has(q, "round", "meru", "sagar", "related", "trade-based", "tbl")) {
    return {
      answer:
        "Meru Logistics and Sagar Traders share two directors. ₹1.20 Cr left Meru as a 'freight advance' on 18 Aug and ₹1.185 Cr returned the next morning as 'goods return' — a 1.25% haircut loop consistent with round-tripping / trade-based laundering ahead of a working-capital drawdown.",
      bullets: [
        "Related-party graph: two shared directors, same registered address cluster in Delhi.",
        "Invoice quality: no e-way bill numbers on the spice lot.",
        "Credit overlay: Meru has a ₹4.2 Cr WC limit coming up for renewal on 12 Sep.",
      ],
      citations: [
        {
          kind: "alert",
          label: "ALRT-4515",
          detail: alerts.find((a) => a.id === "ALRT-4515")!.explanation,
        },
        {
          kind: "case",
          label: "CASE-1115",
          detail: cases.find((c) => c.id === "CASE-1115")!.summary,
        },
      ],
      sql: `SELECT a.customer_id, b.customer_id, a.amount_inr, b.amount_inr, DATEDIFF('hour', a.txn_ts, b.txn_ts) hrs
FROM RISK.TRANSACTIONS a
JOIN RISK.TRANSACTIONS b
  ON a.counterparty_customer_id = b.customer_id
 AND b.counterparty_customer_id = a.customer_id
WHERE DATEDIFF('hour', a.txn_ts, b.txn_ts) BETWEEN 0 AND 36;`,
      relatedCaseIds: ["CASE-1115"],
      relatedAlertIds: ["ALRT-4515"],
      strReady: true,
      confidence: "high",
    };
  }

  if (has(q, "lcr", "liquidity", "nsfr", "wholesale", "runoff", "hqla")) {
    return {
      answer: `Aarohan Finance is inside the LCR floor but tight. LCR is ${liquidity.lcrPct}% (regulatory 100%) with ${liquidity.bufferDays} days of HQLA cover. Wholesale runoff of ₹${liquidity.wholesaleRunoffInrCr} Cr over the 30-day stress window is the binding constraint — a two-notch rating scare or CP market freeze would push LCR under 100%.`,
      bullets: [
        `HQLA: ₹${liquidity.hqlAInrCr} Cr | NSFR ${liquidity.nsfrPct}%`,
        "Action: pre-position ₹80 Cr T-bills, stagger CP maturities, and generate the ALCO pack from this copilot.",
        "Basel III LCR is designed for a 30-day significant stress; RBI has extended graded LCR to upper-layer NBFCs.",
      ],
      citations: [
        {
          kind: "doc",
          label: "Basel III / RBI LCR",
          detail: regulations.find((d) => d.id === "DOC-BASEL-LCR")!.excerpt,
        },
      ],
      sql: `SELECT as_of, lcr_pct, nsfr_pct, hqla_inr_cr, wholesale_runoff_inr_cr
FROM RISK.LIQUIDITY_DAILY
WHERE as_of >= DATEADD(day, -14, CURRENT_DATE())
ORDER BY as_of;`,
      relatedCaseIds: [],
      relatedAlertIds: [],
      confidence: "high",
    };
  }

  if (has(q, "basel", "rwa", "cet1", "capital", "npa", "concentration", "real estate", "cre", "golden peak")) {
    return {
      answer: `Credit risk is within CET1 (${credit.cet1Pct}%) but concentration is the real issue. Golden Peak Realty is 11.4% of the book — above the 10% board-reporting trigger in RBI SBR large-exposure norms. CRE is ${credit.realEstateExposurePct}% of exposures. Top-20 names are ${credit.top20ConcentrationPct}%.`,
      bullets: [
        `RWA ₹${credit.totalRwaInrCr} Cr · GNPA ${credit.npaPct}%`,
        "ALRT-4602 is open for the CRE concentration.",
        "Regulatory output: generate the Board large-exposure note (RBI SBR) from the STR/regulatory factory.",
      ],
      citations: [
        {
          kind: "doc",
          label: "RBI SBR large exposures",
          detail: regulations.find((d) => d.id === "DOC-RBI-NBFC-LE")!.excerpt,
        },
        {
          kind: "alert",
          label: "ALRT-4602",
          detail: alerts.find((a) => a.id === "ALRT-4602")!.explanation,
        },
      ],
      sql: `SELECT customer_name, exposure_inr, exposure_inr / SUM(exposure_inr) OVER () AS book_share
FROM RISK.CREDIT_EXPOSURES
QUALIFY book_share >= 0.10
ORDER BY exposure_inr DESC;`,
      relatedCaseIds: [],
      relatedAlertIds: ["ALRT-4602"],
      confidence: "high",
    };
  }

  if (has(q, "str", "sar", "fiu", "file", "audit ready", "regulatory output", "draft")) {
    return {
      answer:
        "Two filings are audit-ready now: CASE-1042 (structuring STR) and CASE-1088 (network mule STR). FIU-IND requires filing within seven working days of a finding of suspicion, irrespective of amount. Open the STR Factory to export FINNet-style packs with transaction schedules, grounds of suspicion, and clause citations.",
      bullets: [
        "CASE-1042 status: STR drafted — awaiting MLRO sign-off.",
        "CASE-1088 status: in review — recommend network filing.",
        "Every copilot answer is written to the audit log with SQL, citations, and user.",
      ],
      citations: [
        {
          kind: "doc",
          label: "FIU-IND STR timing",
          detail: regulations.find((d) => d.id === "DOC-FIU-STR")!.excerpt,
        },
      ],
      relatedCaseIds: ["CASE-1042", "CASE-1088"],
      relatedAlertIds: ["ALRT-4410", "ALRT-4488"],
      strReady: true,
      confidence: "high",
    };
  }

  if (has(q, "open alert", "how many", "today", "overview", "summary", "dashboard", "risk")) {
    const open = alerts.filter((a) => a.status !== "closed");
    return {
      answer: `Aarohan Finance has ${open.length} open risk signals. Two are critical AML (structuring + mule ring), one PEP EDD, one related-party loop, and one CRE concentration. Liquidity LCR ${liquidity.lcrPct}% is above the floor; CET1 ${credit.cet1Pct}% is healthy; concentration is not.`,
      bullets: open.map((a) => `${a.id} · ${a.title} · score ${a.score}`),
      citations: open.slice(0, 3).map((a) => ({
        kind: "alert" as const,
        label: a.id,
        detail: a.title,
      })),
      sql: `SELECT alert_id, typology, score, status FROM RISK.ALERTS WHERE status != 'closed' ORDER BY score DESC;`,
      relatedCaseIds: cases.map((c) => c.id),
      relatedAlertIds: open.map((a) => a.id),
      confidence: "high",
    };
  }

  const docs = searchDocs(q);
  if (docs.length) {
    const top = docs[0];
    return {
      answer: `${top.title} (${top.clause}). ${top.excerpt}`,
      bullets: docs.slice(1, 3).map((d) => `${d.title}: ${d.excerpt.slice(0, 160)}…`),
      citations: docs.slice(0, 3).map((d) => ({
        kind: "doc" as const,
        label: d.clause,
        detail: d.excerpt,
      })),
      relatedCaseIds: [],
      relatedAlertIds: [],
      confidence: "medium",
    };
  }

  const hits = customers.filter((c) => q.includes(c.name.toLowerCase().split(" ")[0].toLowerCase()));
  if (hits.length) {
    const c = hits[0];
    return {
      answer: `${c.name} (${c.id}) is a ${c.type} in ${c.city}, KYC ${c.kycStatus}, risk ${c.riskRating}${c.pep ? ", PEP" : ""}.`,
      bullets: [`Occupation: ${c.occupation}`, `PAN ${c.pan} · onboarded ${c.onboardingDate}`],
      citations: [],
      relatedCaseIds: cases.filter((cs) => cs.customerIds.includes(c.id)).map((cs) => cs.id),
      relatedAlertIds: alerts.filter((a) => a.customerId === c.id).map((a) => a.id),
      confidence: "medium",
    };
  }

  return {
    answer:
      "I could not ground that question in the Aarohan risk mart with high confidence, so I am abstaining rather than guessing. Try a prompt from the suggestion chips — fraud, mule, PEP, LCR, Basel, or STR.",
    bullets: callTranscripts.slice(0, 1).map((t) => `Unstructured evidence available: ${t.id}`),
    citations: [],
    relatedCaseIds: [],
    relatedAlertIds: [],
    confidence: "low",
  };
}

export const suggestedPrompts = [
  "Show mule accounts with cash-outs after 2am",
  "Is Rahul Mehta structuring under the ₹10L CTR?",
  "Draft the FIU-IND STR pack that is due this week",
  "How tight is our LCR and wholesale runoff?",
  "Which names breach RBI large-exposure norms?",
  "What does RBI require for PEP enhanced due diligence?",
];
