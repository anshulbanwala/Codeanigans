USE DATABASE SENTINEL;
USE SCHEMA RISK;
USE WAREHOUSE SENTINEL_WH;

INSERT INTO ACCOUNTS VALUES
('ACC-1042-01','CUS-1042','savings','AFLN0002144','2025-11-02',4820000,'watch'),
('ACC-1088-01','CUS-1088','wallet','AFLN0003301','2026-03-14',12400,'frozen'),
('ACC-1089-01','CUS-1089','savings','AFLN0001188','2026-04-02',8900,'frozen'),
('ACC-1090-01','CUS-1090','savings','AFLN0004410','2026-04-11',21000,'watch'),
('ACC-1101-01','CUS-1101','current','AFLN0001001','2023-06-18',11240000,'watch'),
('ACC-1115-01','CUS-1115','current','AFLN0000902','2024-01-09',34000000,'watch'),
('ACC-1116-01','CUS-1116','current','AFLN0000903','2024-02-01',8800000,'watch'),
('ACC-1304-01','CUS-1304','loan','AFLN0000108','2020-11-03',-1860000000,'active');

INSERT INTO TRANSACTIONS VALUES
('TXN-STR-1','2026-08-21 09:12:00 +05:30','ACC-1042-01','CUS-1042','CASH-SURAT-BR14','CASH','credit',948000,'Surat',TRUE,'structuring','Cash credit just under CTR'),
('TXN-STR-2','2026-08-22 10:12:00 +05:30','ACC-1042-01','CUS-1042','UPI-UNKNOWN-HANDLE','UPI','credit',956000,'Surat',TRUE,'structuring','UPI credit just under CTR'),
('TXN-STR-3','2026-08-23 11:12:00 +05:30','ACC-1042-01','CUS-1042','CASH-SURAT-BR14','CASH','credit',964000,'Surat',TRUE,'structuring','Cash credit just under CTR'),
('TXN-STR-4','2026-08-23 12:12:00 +05:30','ACC-1042-01','CUS-1042','UPI-UNKNOWN-HANDLE','UPI','credit',972000,'Surat',TRUE,'structuring','UPI credit just under CTR'),
('TXN-STR-5','2026-08-23 13:12:00 +05:30','ACC-1042-01','CUS-1042','CASH-SURAT-BR14','CASH','credit',980000,'Surat',TRUE,'structuring','Cash credit just under CTR'),
('TXN-STR-6','2026-08-24 19:40:00 +05:30','ACC-1042-01','CUS-1042','HAWALA-LAYER-SING','IMPS','debit',4680000,'Mumbai',TRUE,'structuring','Same-day outbound IMPS'),
('TXN-MULE-1','2026-08-28 02:11:00 +05:30','ACC-1088-01','CUS-1088','NEXUS DIGITAL MART','NEFT','credit',385000,'Hyderabad',TRUE,'mule','Overnight inbound from flagged merchant'),
('TXN-MULE-2','2026-08-28 02:18:00 +05:30','ACC-1088-01','CUS-1088','UPI-IMRAN-S','UPI','debit',120000,'Hyderabad',TRUE,'mule','Split to fellow mule'),
('TXN-MULE-3','2026-08-28 02:22:00 +05:30','ACC-1089-01','CUS-1089','UPI-KAVYA-R','UPI','credit',120000,'Pune',TRUE,'mule','Inbound from Kavya'),
('TXN-MULE-4','2026-08-28 02:41:00 +05:30','ACC-1089-01','CUS-1089','CASH-PUNE-ATM09','CASH','debit',118000,'Pune',TRUE,'mule','ATM cash-out'),
('TXN-MULE-5','2026-08-28 03:05:00 +05:30','ACC-1090-01','CUS-1090','NEXUS DIGITAL MART','IMPS','credit',210000,'Nashik',TRUE,'mule','Second hop'),
('TXN-MULE-6','2026-08-28 03:16:00 +05:30','ACC-1090-01','CUS-1090','CASH-NASHIK-BR2','CASH','debit',195000,'Nashik',TRUE,'mule','Branch cash, KYC mismatch');

INSERT INTO ALERTS VALUES
('ALRT-4410','2026-08-24 19:42:00 +05:30','CUS-1042','ACC-1042-01','Structuring just below CTR','structuring',94,'escalated','CASE-1042','Five inbound credits then outbound IMPS'),
('ALRT-4488','2026-08-28 03:20:00 +05:30','CUS-1088','ACC-1088-01','Overnight mule ring','mule',97,'investigating','CASE-1088','Three accounts cashed out within 40 minutes');

INSERT INTO CASES VALUES
('CASE-1042','Rahul Mehta CTR structuring','str_drafted','Ananya Iyer','2026-08-24','structuring','critical','Smurfing under 10 lakh then IMPS layering'),
('CASE-1088','Nexus mule trio','in_review','Rohit Banerjee','2026-08-28','mule','critical','Coordinated mule cash-out after 02:00 IST');

INSERT INTO CALL_TRANSCRIPTS VALUES
('CALL-1042','CUS-1042','2026-08-23 17:10:00 +05:30','Sir these cash credits are just under ten lakh. Customer: cash is how Surat works. Do not freeze.'),
('CALL-1088','CUS-1088','2026-08-27 21:44:00 +05:30','Send the UPI to Imran first then Neha. ATM after 2.');

INSERT INTO REG_DOCS VALUES
('DOC-PMLA-12','PMLA Rules CTR','PMLA Rules 2005','Rule 3 r/w Rule 8','CTR / structuring','Record all cash transactions of more than ten lakh rupees, including integrally connected transactions.'),
('DOC-FIU-STR','FIU-IND STR','FINNet 2.0','STR timing','STR filing','File STR within seven working days of a finding of suspicion, irrespective of amount.'),
('DOC-RBI-AML-MULE','RBI mule guidance','RBI circulars 2024-26','Rapid freeze','mule','Detect mule behaviour with velocity and device analytics and file STRs for cyber-enabled fraud proceeds.');
