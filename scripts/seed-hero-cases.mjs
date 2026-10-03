/**
 * Upsert hero investigation cases into SENTINEL.RISK (run once per account).
 * Usage: node scripts/seed-hero-cases.mjs
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import snowflake from "snowflake-sdk";

function loadEnv() {
  const env = {};
  for (const line of readFileSync(resolve(".env.local"), "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i === -1) continue;
    env[t.slice(0, i).trim()] = t.slice(i + 1).trim();
  }
  for (const key of Object.keys(process.env)) {
    if (key.startsWith("SNOWFLAKE_")) env[key] = process.env[key];
  }
  return env;
}

function connectionOptions(env) {
  const opts = {
    account: env.SNOWFLAKE_ACCOUNT,
    username: env.SNOWFLAKE_USER,
    password: env.SNOWFLAKE_PASSWORD,
    warehouse: env.SNOWFLAKE_WAREHOUSE || "SENTINEL_WH",
    database: env.SNOWFLAKE_DATABASE || "SENTINEL",
    schema: env.SNOWFLAKE_SCHEMA || "RISK",
  };
  if (env.SNOWFLAKE_ROLE) opts.role = env.SNOWFLAKE_ROLE;
  return opts;
}

async function run(conn, sql, binds = []) {
  return new Promise((resolve, reject) => {
    conn.execute({
      sqlText: sql,
      binds,
      complete: (err, _stmt, rows) => (err ? reject(err) : resolve(rows)),
    });
  });
}

const CUSTOMERS = [
  ["CUS-1042", "Rahul Mehta", "individual", "BHGPM4421K", "Surat", "partial", false, "critical", "Diamond trader", "2025-11-02"],
  ["CUS-1088", "Kavya Reddy", "individual", "AWRPR8812P", "Hyderabad", "verified", false, "high", "Gig delivery partner", "2026-03-14"],
  ["CUS-1089", "Imran Shaikh", "individual", "CQWPS2290L", "Pune", "expired", false, "high", "Student", "2026-04-02"],
  ["CUS-1090", "Neha Kulkarni", "individual", "DPLPK7711Q", "Nashik", "partial", false, "high", "Homemaker", "2026-04-11"],
  ["CUS-1101", "Hon. Vikram Desai", "individual", "AAAPD9988C", "Ahmedabad", "verified", true, "high", "Former municipal corporator", "2023-06-18"],
  ["CUS-1115", "Meru Logistics Pvt Ltd", "corporate", "AALCM4410F", "Delhi", "verified", false, "high", "Road freight", "2024-01-09"],
  ["CUS-1116", "Sagar Traders", "merchant", "AAMFS2201H", "Delhi", "partial", false, "high", "Wholesale spices", "2024-02-01"],
];

const ACCOUNTS = [
  ["ACC-1042-01", "CUS-1042", "savings", "AFLN0002144", "2025-11-02", 4820000, "watch"],
  ["ACC-1088-01", "CUS-1088", "wallet", "AFLN0003301", "2026-03-14", 12400, "frozen"],
  ["ACC-1089-01", "CUS-1089", "savings", "AFLN0001188", "2026-04-02", 8900, "frozen"],
  ["ACC-1090-01", "CUS-1090", "savings", "AFLN0004410", "2026-04-11", 21000, "watch"],
  ["ACC-1101-01", "CUS-1101", "current", "AFLN0001001", "2023-06-18", 11240000, "watch"],
  ["ACC-1115-01", "CUS-1115", "current", "AFLN0000902", "2024-01-09", 34000000, "watch"],
  ["ACC-1116-01", "CUS-1116", "current", "AFLN0000903", "2024-02-01", 8800000, "watch"],
];

const CASES = [
  ["CASE-1042", "Rahul Mehta — CTR structuring", "str_drafted", "Ananya Iyer (AML L2)", "2026-08-24", "structuring", "critical", "Customer split inflows under ₹10L CTR then layered IMPS. STR draft ready for FIU-IND."],
  ["CASE-1088", "Nexus mule trio — Kavya / Imran / Neha", "in_review", "Rohit Banerjee (Fraud ops)", "2026-08-28", "mule", "critical", "Coordinated mule cash-out after 02:00 IST. Network STR recommended."],
  ["CASE-1101", "PEP Vikram Desai — unexplained wealth", "in_review", "Meera Shah (EDD)", "2026-08-15", "pep_unusual", "high", "Dubai inward remittance and luxury spend vs declared income. EDD overdue."],
  ["CASE-1115", "Meru ↔ Sagar round trip", "new", "Ananya Iyer (AML L2)", "2026-08-19", "round_trip", "high", "Related-party loop before working-capital drawdown."],
];

const ALERTS = [
  ["ALRT-4410", "2026-08-24 19:42:00 +05:30", "CUS-1042", "ACC-1042-01", "Structuring just below CTR (₹10L)", "structuring", 94, "escalated", "CASE-1042", "Five inbound credits of ₹9.4–9.7L in 72h, then outbound IMPS ₹46.8L."],
  ["ALRT-4488", "2026-08-28 03:20:00 +05:30", "CUS-1088", "ACC-1088-01", "Overnight mule ring — cash-out velocity", "mule", 97, "investigating", "CASE-1088", "Three accounts cashed out after 02:00 IST from Nexus Digital Mart."],
  ["ALRT-4501", "2026-08-15 16:25:00 +05:30", "CUS-1101", "ACC-1101-01", "PEP lifestyle vs declared income", "pep_unusual", 78, "open", "CASE-1101", "PEP received Dubai credit and luxury vehicle vs ₹18L declared income."],
  ["ALRT-4515", "2026-08-19 09:40:00 +05:30", "CUS-1115", "ACC-1115-01", "Related-party round tripping", "round_trip", 86, "investigating", "CASE-1115", "Meru Logistics and Sagar Traders looped ₹1.2 Cr in 23 hours."],
  ["ALRT-4489", "2026-08-28 03:22:00 +05:30", "CUS-1089", "ACC-1089-01", "Mule ring — Pune cash-out", "mule", 91, "investigating", "CASE-1088", "Linked to CASE-1088 Nexus ring; ATM cash-out within 40 minutes."],
  ["ALRT-4490", "2026-08-28 03:25:00 +05:30", "CUS-1090", "ACC-1090-01", "Mule ring — Nashik hop", "mule", 88, "investigating", "CASE-1088", "Second-hop credit from Nexus Digital Mart in same network filing."],
  ["ALRT-4516", "2026-08-19 09:42:00 +05:30", "CUS-1116", "ACC-1116-01", "Round trip — return leg", "round_trip", 84, "investigating", "CASE-1115", "Sagar return payment to Meru within 24h of outbound freight advance."],
];

const TRANSACTIONS = [
  ["TXN-STR-1", "2026-08-21 09:12:00 +05:30", "ACC-1042-01", "CUS-1042", "CASH-SURAT-BR14", "CASH", "CREDIT", 940000, "Surat", true, "structuring", "Cash credit just under ₹10L CTR."],
  ["TXN-STR-2", "2026-08-21 11:12:00 +05:30", "ACC-1042-01", "CUS-1042", "UPI-UNKNOWN-HANDLE", "UPI", "CREDIT", 948000, "Surat", true, "structuring", "UPI credit just under ₹10L CTR."],
  ["TXN-STR-3", "2026-08-22 09:12:00 +05:30", "ACC-1042-01", "CUS-1042", "CASH-SURAT-BR14", "CASH", "CREDIT", 956000, "Surat", true, "structuring", "Cash credit just under ₹10L CTR."],
  ["TXN-STR-4", "2026-08-22 11:12:00 +05:30", "ACC-1042-01", "CUS-1042", "UPI-UNKNOWN-HANDLE", "UPI", "CREDIT", 964000, "Surat", true, "structuring", "UPI credit just under ₹10L CTR."],
  ["TXN-STR-5", "2026-08-23 09:12:00 +05:30", "ACC-1042-01", "CUS-1042", "CASH-SURAT-BR14", "CASH", "CREDIT", 972000, "Surat", true, "structuring", "Cash credit just under ₹10L CTR."],
  ["TXN-STR-6", "2026-08-24 19:40:00 +05:30", "ACC-1042-01", "CUS-1042", "HAWALA-LAYER-SING", "IMPS", "DEBIT", 4680000, "Mumbai", true, "structuring", "Outbound IMPS after five inbound credits."],
  ["TXN-MULE-1", "2026-08-28 02:11:00 +05:30", "ACC-1088-01", "CUS-1088", "NEXUS DIGITAL MART", "NEFT", "CREDIT", 385000, "Hyderabad", true, "mule", "Overnight inbound from flagged merchant."],
  ["TXN-MULE-2", "2026-08-28 02:18:00 +05:30", "ACC-1088-01", "CUS-1088", "UPI-IMRAN-S", "UPI", "DEBIT", 120000, "Hyderabad", true, "mule", "Split to fellow mule Imran."],
  ["TXN-MULE-3", "2026-08-28 02:22:00 +05:30", "ACC-1089-01", "CUS-1089", "UPI-KAVYA-R", "UPI", "CREDIT", 120000, "Pune", true, "mule", "Inbound from Kavya within 11 minutes."],
  ["TXN-MULE-4", "2026-08-28 02:41:00 +05:30", "ACC-1089-01", "CUS-1089", "CASH-PUNE-ATM09", "CASH", "DEBIT", 118000, "Pune", true, "mule", "ATM cash-out of 98% of inbound."],
  ["TXN-MULE-5", "2026-08-28 03:05:00 +05:30", "ACC-1090-01", "CUS-1090", "NEXUS DIGITAL MART", "IMPS", "CREDIT", 210000, "Nashik", true, "mule", "Second hop of merchant credit."],
  ["TXN-MULE-6", "2026-08-28 03:16:00 +05:30", "ACC-1090-01", "CUS-1090", "CASH-NASHIK-BR2", "CASH", "DEBIT", 195000, "Nashik", true, "mule", "Branch cash withdrawal after inbound."],
  ["TXN-PEP-1", "2026-08-12 11:00:00 +05:30", "ACC-1101-01", "CUS-1101", "OVERSEAS-DUBAI-LLC", "RTGS", "CREDIT", 7800000, "Ahmedabad", false, "pep_unusual", "Inward remittance labelled consultancy."],
  ["TXN-PEP-2", "2026-08-15 16:20:00 +05:30", "ACC-1101-01", "CUS-1101", "LUXURY-AUTO-AHM", "RTGS", "DEBIT", 4200000, "Ahmedabad", false, "pep_unusual", "Vehicle purchase vs declared income."],
  ["TXN-RT-1", "2026-08-18 10:00:00 +05:30", "ACC-1115-01", "CUS-1115", "Sagar Traders", "NEFT", "DEBIT", 12000000, "Delhi", true, "round_trip", "Freight advance to related trader."],
  ["TXN-RT-2", "2026-08-19 09:30:00 +05:30", "ACC-1116-01", "CUS-1116", "Meru Logistics Pvt Ltd", "NEFT", "DEBIT", 11850000, "Delhi", true, "round_trip", "Return payment within 24h."],
];

const CALLS = [
  ["CALL-1042", "CUS-1042", "2026-08-23 17:10:00 +05:30", "Branch RM: credits are just under ten lakh. Customer: cash is how Surat works. Do not freeze."],
  ["CALL-1088", "CUS-1088", "2026-08-27 21:44:00 +05:30", "WhatsApp: send UPI to Imran then Neha. ATM after 2. If bank calls say I sold my scooty."],
  ["CALL-1101", "CUS-1101", "2026-08-14 12:02:00 +05:30", "RM: need Dubai consultancy contract. Customer: family arrangement. Do not escalate."],
  ["CALL-1115", "CUS-1115", "2026-08-18 15:30:00 +05:30", "Treasury: Meru-Sagar transfers look circular before WC renewal. CFO asks to delay filing."],
];

snowflake.configure({ logLevel: "ERROR" });
const env = loadEnv();

const conn = snowflake.createConnection(connectionOptions(env));

conn.connect(async (err) => {
  if (err) {
    console.error(err.message);
    process.exit(2);
  }
  try {
    await run(conn, "USE WAREHOUSE SENTINEL_WH");
    for (const row of CUSTOMERS) {
      await run(
        conn,
        `MERGE INTO CUSTOMERS t USING (SELECT ? AS CUSTOMER_ID) s ON t.CUSTOMER_ID = s.CUSTOMER_ID
         WHEN MATCHED THEN UPDATE SET NAME=?, TYPE=?, PAN=?, CITY=?, KYC_STATUS=?, PEP=?, RISK_RATING=?, OCCUPATION=?, ONBOARDING_DATE=?
         WHEN NOT MATCHED THEN INSERT (CUSTOMER_ID,NAME,TYPE,PAN,CITY,KYC_STATUS,PEP,RISK_RATING,OCCUPATION,ONBOARDING_DATE)
         VALUES (?,?,?,?,?,?,?,?,?,?)`,
        [row[0], ...row.slice(1), ...row],
      );
    }
    for (const row of ACCOUNTS) {
      await run(
        conn,
        `MERGE INTO ACCOUNTS t USING (SELECT ? AS ACCOUNT_ID) s ON t.ACCOUNT_ID = s.ACCOUNT_ID
         WHEN MATCHED THEN UPDATE SET CUSTOMER_ID=?, PRODUCT=?, IFSC=?, OPENED_ON=?, BALANCE_INR=?, STATUS=?
         WHEN NOT MATCHED THEN INSERT VALUES (?,?,?,?,?,?,?)`,
        [row[0], ...row.slice(1), ...row],
      );
    }
    for (const row of CASES) {
      await run(
        conn,
        `MERGE INTO CASES t USING (SELECT ? AS CASE_ID) s ON t.CASE_ID = s.CASE_ID
         WHEN MATCHED THEN UPDATE SET TITLE=?, STATUS=?, OWNER=?, OPENED_ON=?, TYPOLOGY=?, SEVERITY=?, SUMMARY=?
         WHEN NOT MATCHED THEN INSERT (CASE_ID,TITLE,STATUS,OWNER,OPENED_ON,TYPOLOGY,SEVERITY,SUMMARY) VALUES (?,?,?,?,?,?,?,?)`,
        [row[0], ...row.slice(1), ...row],
      );
    }
    for (const row of ALERTS) {
      await run(
        conn,
        `MERGE INTO ALERTS t USING (SELECT ? AS ALERT_ID) s ON t.ALERT_ID = s.ALERT_ID
         WHEN MATCHED THEN UPDATE SET ALERT_TS=?, CUSTOMER_ID=?, ACCOUNT_ID=?, TITLE=?, TYPOLOGY=?, SCORE=?, STATUS=?, CASE_ID=?, EXPLANATION=?
         WHEN NOT MATCHED THEN INSERT (ALERT_ID,ALERT_TS,CUSTOMER_ID,ACCOUNT_ID,TITLE,TYPOLOGY,SCORE,STATUS,CASE_ID,EXPLANATION)
         VALUES (?,?,?,?,?,?,?,?,?,?)`,
        [row[0], ...row.slice(1), ...row],
      );
    }
    for (const row of TRANSACTIONS) {
      await run(
        conn,
        `MERGE INTO TRANSACTIONS t USING (SELECT ? AS TXN_ID) s ON t.TXN_ID = s.TXN_ID
         WHEN MATCHED THEN UPDATE SET TXN_TS=?, ACCOUNT_ID=?, CUSTOMER_ID=?, COUNTERPARTY=?, CHANNEL=?, TXN_TYPE=?, AMOUNT_INR=?, CITY=?, IS_FRAUD=?, TYPOLOGY=?, NARRATIVE=?
         WHEN NOT MATCHED THEN INSERT (TXN_ID,TXN_TS,ACCOUNT_ID,CUSTOMER_ID,COUNTERPARTY,CHANNEL,TXN_TYPE,AMOUNT_INR,CITY,IS_FRAUD,TYPOLOGY,NARRATIVE)
         VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
        [row[0], ...row.slice(1), ...row],
      );
    }
    for (const row of CALLS) {
      await run(
        conn,
        `MERGE INTO CALL_TRANSCRIPTS t USING (SELECT ? AS CALL_ID) s ON t.CALL_ID = s.CALL_ID
         WHEN MATCHED THEN UPDATE SET CUSTOMER_ID=?, CALL_TS=?, TRANSCRIPT_TEXT=?
         WHEN NOT MATCHED THEN INSERT (CALL_ID,CUSTOMER_ID,CALL_TS,TRANSCRIPT_TEXT) VALUES (?,?,?,?)`,
        [row[0], ...row.slice(1), ...row],
      );
    }
    const check = await run(
      conn,
      `SELECT CASE_ID, COUNT(*) AS CNT FROM ALERTS WHERE CASE_ID IN ('CASE-1042','CASE-1088','CASE-1101','CASE-1115') GROUP BY 1 ORDER BY 1`,
    );
    console.log("Hero alerts in Snowflake:", check);
    conn.destroy(() => console.log("Hero case seed complete."));
  } catch (e) {
    console.error(e.message);
    conn.destroy(() => process.exit(3));
  }
});
