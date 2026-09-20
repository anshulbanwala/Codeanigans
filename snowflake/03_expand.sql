USE DATABASE SENTINEL;
USE SCHEMA RISK;
USE WAREHOUSE SENTINEL_WH;

INSERT INTO TRANSACTIONS (
  TXN_ID,
  TXN_TS,
  ACCOUNT_ID,
  CUSTOMER_ID,
  COUNTERPARTY,
  CHANNEL,
  TXN_TYPE,
  AMOUNT_INR,
  CITY,
  IS_FRAUD,
  TYPOLOGY,
  NARRATIVE
)
WITH seq AS (
  SELECT ROW_NUMBER() OVER (ORDER BY 1) AS rn
  FROM TABLE(GENERATOR(ROWCOUNT => 800))
),
customer_map AS (
  SELECT * FROM VALUES
    (0, 'CUS-1042', 'ACC-1042-01', 'Surat'),
    (1, 'CUS-1088', 'ACC-1088-01', 'Hyderabad'),
    (2, 'CUS-1089', 'ACC-1089-01', 'Pune'),
    (3, 'CUS-1090', 'ACC-1090-01', 'Nashik'),
    (4, 'CUS-1101', 'ACC-1101-01', 'Ahmedabad'),
    (5, 'CUS-1115', 'ACC-1115-01', 'Delhi'),
    (6, 'CUS-1116', 'ACC-1116-01', 'Delhi'),
    (7, 'CUS-1201', 'ACC-1201-01', 'Kochi'),
    (8, 'CUS-1208', 'ACC-1208-01', 'Bengaluru'),
    (9, 'CUS-1304', 'ACC-1304-01', 'Mumbai')
  AS t(idx, CUSTOMER_ID, ACCOUNT_ID, CITY)
)
SELECT
  CONCAT('TXN-EXP-', LPAD(CAST(s.rn AS STRING), 4, '0')) AS TXN_ID,
  TIMESTAMPADD(HOUR, MOD(s.rn, 24), DATEADD(DAY, MOD(s.rn - 1, 14), TIMESTAMP '2026-08-17 00:00:00+05:30')) AS TXN_TS,
  m.ACCOUNT_ID,
  m.CUSTOMER_ID,
  CASE
    WHEN s.rn <= 140 THEN CASE MOD(s.rn, 4)
      WHEN 0 THEN 'NEXUS DIGITAL MART'
      WHEN 1 THEN 'UPI-RENT-HUB'
      WHEN 2 THEN 'CASH-ATM-BLR-41'
      ELSE 'AMRIT-TRADING-CO'
    END
    WHEN MOD(s.rn, 7) = 0 THEN 'SALARY-REMITTANCE'
    WHEN MOD(s.rn, 7) = 1 THEN 'UPI-RENT-HUB'
    WHEN MOD(s.rn, 7) = 2 THEN 'CASH-ATM-BLR-41'
    WHEN MOD(s.rn, 7) = 3 THEN 'GOODWILL-LOGISTICS'
    WHEN MOD(s.rn, 7) = 4 THEN 'DUBAI-CLIENT-ALPHA'
    WHEN MOD(s.rn, 7) = 5 THEN 'AMRIT-TRADING-CO'
    ELSE 'PAYROLL-OPS'
  END AS COUNTERPARTY,
  CASE
    WHEN MOD(s.rn, 6) = 0 THEN 'UPI'
    WHEN MOD(s.rn, 6) = 1 THEN 'IMPS'
    WHEN MOD(s.rn, 6) = 2 THEN 'NEFT'
    WHEN MOD(s.rn, 6) = 3 THEN 'RTGS'
    WHEN MOD(s.rn, 6) = 4 THEN 'CASH'
    ELSE 'ATM'
  END AS CHANNEL,
  CASE WHEN MOD(s.rn, 2) = 0 THEN 'credit' ELSE 'debit' END AS TXN_TYPE,
  CASE
    WHEN s.rn <= 140 THEN CASE MOD(s.rn, 5)
      WHEN 0 THEN 950000
      WHEN 1 THEN 1200000
      WHEN 2 THEN 1890000
      WHEN 3 THEN 2750000
      ELSE 3300000
    END
    ELSE 25000 + MOD(s.rn, 20) * 4000 + MOD(s.rn, 9) * 1200
  END AS AMOUNT_INR,
  m.CITY,
  CASE WHEN s.rn <= 140 THEN TRUE ELSE FALSE END AS IS_FRAUD,
  CASE
    WHEN s.rn <= 20 THEN 'structuring'
    WHEN s.rn <= 40 THEN 'mule'
    WHEN s.rn <= 60 THEN 'round_trip'
    WHEN s.rn <= 80 THEN 'pep_unusual'
    WHEN s.rn <= 100 THEN 'shell_layering'
    WHEN s.rn <= 140 THEN 'cash_smurfing'
    ELSE 'benign'
  END AS TYPOLOGY,
  CASE
    WHEN s.rn <= 140 THEN 'Synthetic expansion fraud event aligned to the known risk scenario set.'
    ELSE 'Routine operational payment activity within expected day-to-day volume.'
  END AS NARRATIVE
FROM seq s
JOIN customer_map m
  ON MOD(s.rn - 1, 10) = m.idx
WHERE NOT EXISTS (
  SELECT 1
  FROM TRANSACTIONS t
  WHERE t.TXN_ID = CONCAT('TXN-EXP-', LPAD(CAST(s.rn AS STRING), 4, '0'))
);

INSERT INTO ALERTS (ALERT_ID, ALERT_TS, CUSTOMER_ID, ACCOUNT_ID, TITLE, TYPOLOGY, SCORE, STATUS, CASE_ID, EXPLANATION)
VALUES
('ALRT-EXP-01', '2026-08-17 09:10:00 +05:30', 'CUS-1042', 'ACC-1042-01', 'Expanded structuring watch', 'structuring', 90, 'ESCALATED', 'CASE-1042', 'Synthetic expansion repeated sub-threshold inflows and rapid layering.'),
('ALRT-EXP-02', '2026-08-18 03:12:00 +05:30', 'CUS-1088', 'ACC-1088-01', 'Night-time mule velocity', 'mule', 94, 'INVESTIGATING', 'CASE-1088', 'Synthetic mule sequence indicates sudden after-midnight velocity.'),
('ALRT-EXP-03', '2026-08-19 05:11:00 +05:30', 'CUS-1089', 'ACC-1089-01', 'Mule cash-out cluster', 'mule', 92, 'OPEN', 'CASE-1088', 'Follow-on mule cluster detected in the same known ring.'),
('ALRT-EXP-04', '2026-08-20 01:24:00 +05:30', 'CUS-1115', 'ACC-1115-01', 'Round-trip cash movement', 'round_trip', 88, 'OPEN', 'CASE-1115', 'Related-party movement consistent with synthetic round-trip behaviour.'),
('ALRT-EXP-05', '2026-08-21 05:11:00 +05:30', 'CUS-1116', 'ACC-1116-01', 'Related-party return loop', 'round_trip', 87, 'CLOSED', 'CASE-1115', 'Counterparties reversed nearly identical flows within 24 hours.'),
('ALRT-EXP-06', '2026-08-22 18:09:00 +05:30', 'CUS-1101', 'ACC-1101-01', 'PEP funding anomaly', 'pep_unusual', 81, 'OPEN', 'CASE-1101', 'Unexplained foreign credit and lifestyle spend require EDD review.'),
('ALRT-EXP-07', '2026-08-23 09:41:00 +05:30', 'CUS-1101', 'ACC-1101-01', 'PEP source-of-funds check', 'pep_unusual', 79, 'INVESTIGATING', 'CASE-1101', 'Source-of-funds information remains incomplete for the PEP relationship.'),
('ALRT-EXP-08', '2026-08-24 11:57:00 +05:30', 'CUS-1042', 'ACC-1042-01', 'Layering through shell corridor', 'shell_layering', 95, 'ESCALATED', 'CASE-1042', 'Sub-threshold credits were moved through layered beneficiary chains.'),
('ALRT-EXP-09', '2026-08-25 00:43:00 +05:30', 'CUS-1090', 'ACC-1090-01', 'Cash smurfing pattern', 'cash_smurfing', 90, 'OPEN', 'CASE-1088', 'Branch cash withdrawals align with a coordinated smurfing pattern.'),
('ALRT-EXP-10', '2026-08-26 08:33:00 +05:30', 'CUS-1088', 'ACC-1088-01', 'Repeated mule account refill', 'mule', 93, 'INVESTIGATING', 'CASE-1088', 'Night-time refill matches the known merchant-linked mule flow.'),
('ALRT-EXP-11', '2026-08-27 21:35:00 +05:30', 'CUS-1115', 'ACC-1115-01', 'Merchant layering event', 'shell_layering', 84, 'OPEN', 'CASE-1115', 'Synthetic beneficiary chain indicates rapid payment churning.'),
('ALRT-EXP-12', '2026-08-28 02:18:00 +05:30', 'CUS-1089', 'ACC-1089-01', 'Cash-out urgency to ATM', 'cash_smurfing', 91, 'ESCALATED', 'CASE-1088', 'Cash-out followed a mule inbound funding event.'),
('ALRT-EXP-13', '2026-08-29 10:18:00 +05:30', 'CUS-1101', 'ACC-1101-01', 'PEP behaviour watch', 'pep_unusual', 76, 'OPEN', 'CASE-1101', 'Unusual rapid credit and debit flows merit ongoing EDD review.'),
('ALRT-EXP-14', '2026-08-30 07:40:00 +05:30', 'CUS-1042', 'ACC-1042-01', 'Structuring repeat alert', 'structuring', 89, 'INVESTIGATING', 'CASE-1042', 'Repeat sub-threshold patterns remain active in the synthetic data.'),
('ALRT-EXP-15', '2026-08-30 15:02:00 +05:30', 'CUS-1115', 'ACC-1115-01', 'Cross-entity circularity watch', 'round_trip', 86, 'OPEN', 'CASE-1115', 'Circular payment pattern still under review by the case team.');

INSERT INTO CASES (CASE_ID, TITLE, STATUS, OWNER, OPENED_ON, TYPOLOGY, SEVERITY, SUMMARY)
VALUES
('CASE-1001', 'Aarohan small-business smurfing burst', 'OPEN', 'Riya Patil', '2026-08-10', 'screening', 'LOW', 'Synthetic expansion case for small-business layering across several days.'),
('CASE-1002', 'Bengaluru ATM cash-out ring', 'IN_REVIEW', 'Sanjay Nair', '2026-08-11', 'cash_smurfing', 'MEDIUM', 'Cash-out cluster observed in a synthetic urban transaction ring.'),
('CASE-1003', 'Nashik branch cash round', 'CLOSED', 'Kunal Shah', '2026-08-11', 'cash_smurfing', 'LOW', 'Branch cash withdrawals from multiple users were closed as false positive.'),
('CASE-1004', 'Surat micro-merchant layering', 'OPEN', 'Ananya Iyer', '2026-08-12', 'structuring', 'MEDIUM', 'Sub-threshold deposits recorded across multiple micro-merchant accounts.'),
('CASE-1005', 'Hyderabad device-sharing mule', 'OPEN', 'Rohit Banerjee', '2026-08-12', 'mule', 'HIGH', 'Shared device activity and rapid onward transfers suggest mule activity.'),
('CASE-1006', 'Delhi food-delivery fund migration', 'FILED_STR', 'Meera Shah', '2026-08-13', 'mule', 'CRITICAL', 'Repeated food-delivery fund movements were re-routed immediately after receipt.'),
('CASE-1007', 'Ahmedabad export remittance anomaly', 'IN_REVIEW', 'Suryakant Joshi', '2026-08-13', 'pep_unusual', 'MEDIUM', 'Unusual remittance pattern called for additional source-of-funds verification.'),
('CASE-1008', 'Pune UPI test loop', 'CLOSED', 'Tanvi Mehta', '2026-08-14', 'shell_layering', 'LOW', 'Transaction loop was eventually closed after documentary evidence was received.'),
('CASE-1009', 'Mumbai shared-wallet churn', 'OPEN', 'Aman Joshi', '2026-08-14', 'mule', 'HIGH', 'Wallet churn showed multiple small cash-outs across a short period.'),
('CASE-1010', 'Kochi salary diversion watch', 'IN_REVIEW', 'Amit Ghosh', '2026-08-15', 'benign', 'LOW', 'Salary inflow followed by questionable cash-out behaviour under review.'),
('CASE-1011', 'Delhi exporter circularity', 'OPEN', 'Poonam Iyer', '2026-08-16', 'round_trip', 'HIGH', 'Synthetic trade-name circularity flagged by the transaction monitoring team.'),
('CASE-1012', 'Surat pairwise structuring', 'FILED_STR', 'Ananya Iyer', '2026-08-17', 'structuring', 'CRITICAL', 'Multiple small inflows were rapidly consolidated and moved off-book.'),
('CASE-1013', 'Maharashtra merchant shell watch', 'OPEN', 'Kunal Shah', '2026-08-17', 'shell_layering', 'HIGH', 'Merchant accounts received and re-disbursed cash on short cycles.'),
('CASE-1014', 'Bengaluru digital lending churn', 'IN_REVIEW', 'Divya Sen', '2026-08-18', 'shell_layering', 'MEDIUM', 'Unusual movement across digital lending counters and wallets.'),
('CASE-1015', 'Ahmedabad political exposure follow-up', 'OPEN', 'Meera Shah', '2026-08-18', 'pep_unusual', 'HIGH', 'PEP watch and lifestyle review continued due to inconsistent declarations.');

INSERT INTO CALL_TRANSCRIPTS (CALL_ID, CUSTOMER_ID, CALL_TS, TRANSCRIPT_TEXT)
VALUES
('CALL-2001', 'CUS-1042', '2026-08-17 09:12:00 +05:30', 'Supplier made three small credits over a week. The money is for an order and not for any cash movement.'),
('CALL-2002', 'CUS-1088', '2026-08-18 00:42:00 +05:30', 'A merchant sent money at 2 AM, then I moved it to a friend for a small cash request. It was only once.'),
('CALL-2003', 'CUS-1089', '2026-08-18 02:05:00 +05:30', 'My friend asked me to move UPI cash and then take out money from the ATM. I did not understand the purpose.'),
('CALL-2004', 'CUS-1090', '2026-08-19 03:09:00 +05:30', 'I was asked to keep the amount small and withdraw from branch cash. My cousin said it was for a short-term payment.'),
('CALL-2005', 'CUS-1101', '2026-08-19 13:30:00 +05:30', 'I have no record of the Dubai client. This was a one-off consultation payment and I can share the business note later.'),
('CALL-2006', 'CUS-1115', '2026-08-20 10:15:00 +05:30', 'We sent a freight advance to Sagar because the seasonal stock movement required urgent replenishment of raw inventory.'),
('CALL-2007', 'CUS-1116', '2026-08-21 09:30:00 +05:30', 'We only moved the payment to keep the working-capital rotation smooth. There was no intention to distort records.'),
('CALL-2008', 'CUS-1201', '2026-08-22 09:00:00 +05:30', 'My salary credit is normal and the rent debit is recurring. I have no suspicious activity to report.'),
('CALL-2009', 'CUS-1208', '2026-08-23 15:10:00 +05:30', 'Our retail collections are high volume and this is normal invoice settlement for the apparel cycle.'),
('CALL-2010', 'CUS-1304', '2026-08-24 08:08:00 +05:30', 'This is a property project account. We are transferring funds in line with the project schedule and construction milestones.');

INSERT INTO REG_DOCS (DOC_ID, TITLE, SOURCE, CLAUSE, TOPIC, EXCERPT)
VALUES
('DOC-SYN-01', 'Synthetic: Digital Lending Customer Due Diligence', 'Synthetic: RBI Digital Lending Guidelines', 'Customer onboarding', 'digital_lending', 'Synthetic material notes borrower onboarding data should be complete, traceable and consistent with underwriting records.'),
('DOC-SYN-02', 'Synthetic: AML Monitoring of Small Value Flows', 'Synthetic: FIU-IND Surveillance Guidance', 'Monitoring triggers', 'aml_monitoring', 'Unusual value fragmentation and velocity patterns should be assessed in context.'),
('DOC-SYN-03', 'Synthetic: KYC Refresh and Updates', 'Synthetic: RBI KYC Refresh', 'Periodic refresh', 'kyc_refresh', 'KYC refresh and source verification should be treated as ongoing monitoring obligations.'),
('DOC-SYN-04', 'Synthetic: PEP Family and Associate Review', 'Synthetic: RBI KYC PEP Guidance', 'PEP associates', 'pep_monitoring', 'PEP enhanced due diligence should consider family and associate relationships.'),
('DOC-SYN-05', 'Synthetic: Large Exposure Reporting', 'Synthetic: RBI Concentration Norms', 'Large exposure', 'concentration', 'Large single-name and sector concentrations should be reviewed against board thresholds.'),
('DOC-SYN-06', 'Synthetic: Liquidity Stress Buffer', 'Synthetic: RBI Liquidity Risk Management', 'Liquidity risk', 'liquidity', 'Liquidity buffers and runoff assumptions should be reviewed against stress scenarios.'),
('DOC-SYN-07', 'Synthetic: LCR and HQLA Management', 'Synthetic: Basel LCR', 'Liquidity coverage', 'lcr', 'HQLA quality and the 30-day stress buffer are core monitoring items.'),
('DOC-SYN-08', 'Synthetic: NSFR Stability', 'Synthetic: Basel NSFR', 'Stability metrics', 'nsfr', 'Stable funding analysis is important in medium-term stress scenarios.'),
('DOC-SYN-09', 'Synthetic: Account Freezing Decisions', 'Synthetic: RBI AML Action Guidance', 'Rapid action', 'freeze', 'Swift action is appropriate when mule or fraud rings are supported by violative behaviour.'),
('DOC-SYN-10', 'Synthetic: Transaction Monitoring Escalations', 'Synthetic: FIU-IND Escalation Guidance', 'Escalation and case management', 'case_management', 'Escalation should include senior review and ownership clarity.');

INSERT INTO LIQUIDITY_DAILY (AS_OF, LCR_PCT, NSFR_PCT, HQLA_INR_CR, WHOLESALE_RUNOFF_INR_CR, BUFFER_DAYS)
WITH daily AS (
  SELECT ROW_NUMBER() OVER (ORDER BY 1) AS rn
  FROM TABLE(GENERATOR(ROWCOUNT => 29))
)
SELECT
  DATEADD(day, rn - 1, DATE '2026-08-01') AS AS_OF,
  98.4 + MOD(rn, 3) * 0.8 AS LCR_PCT,
  96.9 + MOD(rn, 2) * 0.5 AS NSFR_PCT,
  620 + MOD(rn, 5) * 12 AS HQLA_INR_CR,
  130 + MOD(rn, 4) * 7 AS WHOLESALE_RUNOFF_INR_CR,
  18 + MOD(rn, 3) AS BUFFER_DAYS
FROM daily;

INSERT INTO CREDIT_EXPOSURES (CUSTOMER_ID, CUSTOMER_NAME, EXPOSURE_INR, SECTOR)
VALUES
('CUS-1001', 'Astreya Foods Pvt Ltd', 4200000000, 'MSME'),
('CUS-1002', 'Bharat Warehousing Ltd', 5500000000, 'LOGISTICS'),
('CUS-1003', 'Crescent Hospitals Group', 6100000000, 'HEALTHCARE'),
('CUS-1004', 'Dhananjay Infra Projects', 7300000000, 'INFRA'),
('CUS-1005', 'Eagle Steel Works', 4800000000, 'MANUFACTURING'),
('CUS-1006', 'Futura Solar Holdings', 5200000000, 'SERVICES'),
('CUS-1007', 'Greenfield Agri Ventures', 2900000000, 'AGRICULTURE'),
('CUS-1008', 'Horizon Retail Chain', 3600000000, 'RETAIL'),
('CUS-1009', 'Indore Hospitality Group', 3100000000, 'SERVICES'),
('CUS-1010', 'Jaldris Infra Constructions', 6900000000, 'INFRA');

SELECT 'CUSTOMERS' AS table_name, COUNT(*) AS row_count FROM CUSTOMERS
UNION ALL
SELECT 'ACCOUNTS', COUNT(*) FROM ACCOUNTS
UNION ALL
SELECT 'TRANSACTIONS', COUNT(*) FROM TRANSACTIONS
UNION ALL
SELECT 'ALERTS', COUNT(*) FROM ALERTS
UNION ALL
SELECT 'CASES', COUNT(*) FROM CASES
UNION ALL
SELECT 'CALL_TRANSCRIPTS', COUNT(*) FROM CALL_TRANSCRIPTS
UNION ALL
SELECT 'REG_DOCS', COUNT(*) FROM REG_DOCS
UNION ALL
SELECT 'LIQUIDITY_DAILY', COUNT(*) FROM LIQUIDITY_DAILY
UNION ALL
SELECT 'CREDIT_EXPOSURES', COUNT(*) FROM CREDIT_EXPOSURES;

SELECT COUNT(*) AS FRAUD_TRANSACTIONS FROM TRANSACTIONS WHERE IS_FRAUD = TRUE;
SELECT COUNT(*) AS POST_2AM_CASH_OUTS FROM TRANSACTIONS WHERE TXN_TYPE = 'debit' AND CHANNEL IN ('CASH', 'ATM', 'UPI') AND HOUR(TXN_TS) >= 2;
SELECT COUNT(*) AS KNOWN_CASE_COUNT FROM CASES WHERE CASE_ID IN ('CASE-1042', 'CASE-1088', 'CASE-1101', 'CASE-1115');
