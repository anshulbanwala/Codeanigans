---
name: str-factory
description: Build an FIU-IND style Suspicious Transaction Report from a Sentinel case id.
---

# STR factory skill

When the user names a CASE_ID (for example CASE-1042):

1. Query SENTINEL.RISK.CASES, CUSTOMERS, TRANSACTIONS, ALERTS, CALL_TRANSCRIPTS.
2. Pull REG_DOCS whose TOPIC matches the case typology (structuring, mule, pep, round_trip).
3. Write `output/<CASE_ID>-STR.md` and `output/<CASE_ID>-STR.json` with:
   - reporting entity Aarohan Finance Ltd. / FIU code AFLIN0001
   - subjects (name, PAN, customer id)
   - grounds of suspicion (plain language, no hype)
   - transaction schedule
   - unstructured evidence excerpts
   - cited clauses
   - filing clock: 7 working days from finding of suspicion
4. Insert a row into SENTINEL.RISK.COPILOT_AUDIT.
5. Do not use production data. This skill is for the synthetic hackathon mart only.
