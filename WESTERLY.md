# CODEANIGANS — current status, demo plan, and next improvements

**Read this file first.** It is the only handover your co-developer needs.

- Hackathon: [Snowflake CoCo CLI Hackathon 2026 — GCC Edition](https://hack2skill.com/event/cococlihack-gccedition/)
- Theme: **1 — Risk, Fraud and Regulatory Intelligence Copilot**
- Team: **Codeanigans**
- Product: **Sentinel** (NBFC: Aarohan Finance Ltd.)
- **Current checkpoint: 20 September 2026** — prototype stack is live; keep Snowflake objects available through evaluation.
- Rubric: relevance 30% · technical execution 40% · completeness 30%
- Support: cococlihackgcc-support@hack2skill.com

---

## 1. What it is

Sentinel is an MLRO copilot. An analyst asks a question in English. The system:

1. Surfaces fraud / credit / liquidity risk (structuring under the ₹10L CTR, mule rings, PEP unexplained wealth, related-party round-tripping, CRE concentration, tight LCR).
2. Grounds the answer in **SQL** (structured mart) or a **cited circular** (PMLA, RBI KYC, FIU-IND, Basel / RBI LCR).
3. Emits an **audit-ready FIU-IND style STR pack** (this is the half of Theme 1 most teams will skip).
4. Writes an **audit log** of who asked what, with citations. If it cannot ground the answer, it **abstains**.

Judges from Snowflake will look for the **CoCo CLI path they taught** (data → Cortex Search → semantic view / Cortex Analyst → Cortex Agent → CoWork), not a generic chatbot with a Snowflake logo.

### What already works locally (done)

| Piece | Where |
| --- | --- |
| Command center (KPIs, alerts, cases) | `app/page.tsx` |
| Risk copilot (NL + SQL + citations) | `app/copilot/page.tsx`, `lib/engine.ts`, `app/api/copilot/route.ts` |
| Case files + transcripts | `app/cases/` |
| STR factory (download JSON) | `app/str/page.tsx`, `lib/str.ts` |
| Regulatory corpus | `app/regulations/page.tsx`, `lib/data.ts` |
| Copilot audit log | `app/audit/page.tsx` |
| Synthetic story mart (hero data) | `lib/data.ts` |
| Snowflake DDL + seed | `snowflake/01_schema.sql`, `snowflake/02_seed.sql` |
| CoCo copy-paste session | `coco/PROMPTS.md` |
| Custom STR skill draft | `coco/skills/str-factory/SKILL.md` |
| Extra background | `docs/HACKATHON.md` |

Run: `npm install && npm run dev` → http://127.0.0.1:43127

Demo prompts (memorise):

- Show mule accounts with cash-outs after 2am
- Is Rahul Mehta structuring under the ₹10L CTR?
- Draft the FIU-IND STR pack that is due this week
- How tight is our LCR and wholesale runoff?
- Which names breach RBI large-exposure norms?
- What does RBI require for PEP enhanced due diligence?

Story cases: **CASE-1042** Mehta (CTR smurf) · **CASE-1088** mule trio · **CASE-1101** PEP Desai · **CASE-1115** Meru↔Sagar round trip · overlay Golden Peak CRE + LCR.

---

## 2. Current status

| Status | Item |
| --- | --- |
| Done | Local demo app + narrative data + SQL sketches + CoCo prompt pack |
| Done | Snowflake schema, synthetic expansion data, Cortex Search services, semantic view, and Cortex Agent |
| Done | Live agent `SENTINEL.RISK.SENTINEL_AGENT` wired through `DATA_AGENT_RUN` |
| Done | Shared `APP_DEVELOPER` role access and Snowflake-backed `COPILOT_AUDIT` |
| Done | GitHub repository published; secrets remain in ignored `.env.local` |
| Next | Certify the six prompts and record the CoCo + product demo |
| **Not done** | Optional IBM AML sample table in Snowflake (see §4) |
| Added | Optional Streamlit-in-Snowflake companion in `streamlit/` |
| Out of scope | Real customer data, full PaySim 24M, training a heavy GNN |

Do not rebuild the UI from scratch. Extend this.

---

## 3. What to do for the rest of the days (30 Aug → 13 Sep)

Split: **A** = person with Snowflake login / CoCo. **B** = co-developer (app, story, submit). Swap if needed; do not both edit `lib/engine.ts` and Snowflake objects blindly.

### Completed — warehouse, agent, and repository

- Snowflake account objects are live under `SENTINEL.RISK`.
- The canonical agent is `SENTINEL.RISK.SENTINEL_AGENT`; keep this name in CoCo, YAML, and the app.
- The repository is published at `https://github.com/anshulbanwala/Codeanigans`.
- Use `/api/health` to verify the app's active role and warehouse before recording.

### 1–3 Sep — data + search

- A: Cortex Search on `CALL_TRANSCRIPTS` and `REG_DOCS`. Semantic view skill → `SENTINEL.RISK.RISK_ANALYTICS`.
- A (optional but strong): load **IBM HI-Small only**, 50k–100k row sample, into `SENTINEL.RISK.IBM_AML` (see §4). Do not replace the Aarohan hero cases.
- B: Add a “Data sources” line on the command center (Aarohan synthetic + IBM sample). Tighten empty/error copy.

### 4–6 Sep — agent (this is the 40% score)

- A: Cortex Agent skill (`coco/PROMPTS.md` §4). Test the six prompts against the **live agent**. Deploy to CoWork.
- A: Copy `coco/skills/str-factory/SKILL.md` into CoCo skills; generate one real STR from CASE-1042 in Snowflake.
- B: Record a dry-run of the 3-minute script (below). Note where the UI is slow or unclear.

### 7–9 Sep — completeness

- A: Streamlit-in-Snowflake dashboard on the same mart (CoCo can scaffold it). Optional: wire Next.js to Cortex Agent REST if you have a token; otherwise keep local engine + live CoCo clip in the video.
- B: 1-pager PDF: problem, architecture diagram (copy from `docs/HACKATHON.md`), object names `SENTINEL.*`, six prompts, “synthetic + IBM sample, no production PII”.
- Both: freeze the four case names. Do not add new typologies.

### 10–11 Sep — dry runs

- Two full demos: (1) Next.js, (2) Snowflake CoWork agent. If Wi-Fi dies, Next.js is the fallback.
- Confirm STR JSON downloads. Confirm copilot **abstains** on garbage questions.
- Cut the video: 60s CoCo terminal + 2–3 min product.

### 12 Sep — freeze

- No new features. Fix only demo-breakers.
- Fill Hack2skill form: Theme 1, repo URL, video, 1-pager.

### 13 Sep — submit and stop

- Submit early in the day. Keep Snowflake objects up until evaluation ends.

### 3-minute live script

1. 0:00 Aarohan is an NBFC. FIU still gets Word docs. Sentinel is on Snowflake CoCo.
2. 0:20 Command center — two critical alerts.
3. 0:40 Copilot mule prompt — SQL + RBI mule citation.
4. 1:20 Copilot Rahul CTR — PMLA Rule 3.
5. 1:50 CASE-1088 transcript + freeze.
6. 2:10 STR factory download — 7-day FIU clock.
7. 2:30 Audit log.
8. 2:45 CoCo terminal creating the agent. Stop.

---

## 4. Data you should use (Kaggle and otherwise)

**Hero mart = Aarohan synthetic** (`lib/data.ts` + CoCo-generated Snowflake rows). That is what you *demo*. Public datasets are *volume and typology proof*, not the story.

### Use (in this order)

| Dataset | Link | How to use | Do not |
| --- | --- | --- | --- |
| **IBM Transactions for AML** (best public fit) | https://www.kaggle.com/datasets/ealtman2019/ibm-transactions-for-anti-money-laundering-aml | Download **HI-Small_Trans.csv** + **HI-Small_Patterns.txt** only. Sample 50k–100k rows into `IBM_AML`. License: CDLA-Sharing-1.0 (share-alike; cite IBM). Patterns map to fan-in/fan-out, cycles, bipartite — good “we didn’t only fake 20 rows” slide. | Do not load Medium/Large. Do not replace CASE-1042/1088. |
| **CoCo synthetic** (required) | generate via `coco/PROMPTS.md` | 800+ Aarohan-shaped INR txns, calls, circulars. This is the official Snowflake workshop method. | Do not skip this for Kaggle. |
| **RBI / FIU / PMLA text** (public law, not Kaggle) | RBI KYC Master Direction; PMLA Rules 2005 Rule 3/8; FIU-IND STR guidance | Chunk into `REG_DOCS` for Cortex Search. Already seeded in `lib/data.ts`. | Do not paste entire PDFs into the UI. |
| **PaySim** (optional, last) | https://www.kaggle.com/datasets/ealaxi/paysim1 | If you want cash-out/mule velocity only: **sample 20k rows**, map `isFraud` → typology `mule`, ignore African mobile-money story. | Do **not** load all ~6M rows. Wrong geography for an India NBFC demo. |
| **Bank Account Fraud (NeurIPS 2022)** (optional) | https://www.kaggle.com/datasets/sgpjesus/bank-account-fraud-dataset-neurips-2022 | Onboarding / application fraud slice if you add a KYC tab. Fully synthetic. | Do not make this the main copilot. |

### Skip

| Dataset | Why |
| --- | --- |
| https://www.kaggle.com/datasets/mlg-ulb/creditcardfraud | PCA features, no names/accounts. Useless for an NL copilot demo. |
| IEEE-CIS fraud competition | Huge, US e-commerce, weeks of feature work. |
| Elliptic Bitcoin | Crypto, off-theme. |
| Any real bank extract / scraped PAN-Aadhaar | Disqualification risk. Theme 4 even says synthetic only; we stay synthetic too. |

### Cite on the 1-pager

“Structured data: synthetic Aarohan Finance mart generated with Snowflake CoCo CLI, plus a 50k-row sample of IBM HI-Small AML (CDLA-Sharing-1.0, Kaggle ealtman2019). Unstructured: synthetic RM transcripts and public RBI/PMLA/FIU clause chunks. No production customer data.”

Kaggle download (once, locally, then `PUT` to a Snowflake stage — do not commit CSVs):

```bash
# requires kaggle CLI + API token in ~/.kaggle/kaggle.json
pip install kaggle
kaggle datasets download -d ealtman2019/ibm-transactions-for-anti-money-laundering-aml -p ./data/kaggle --unzip
# load only HI-Small_Trans.csv (sample in SQL or pandas head)
```

---

## 5. GitHub and shared development

The repository is published at `https://github.com/anshulbanwala/Codeanigans`.

1. Settings → Collaborators → invite the co-developer by GitHub username.
2. Both clone the GitHub URL and use short feature branches.
3. Keep secrets out of Git: `.env*` is ignored and `.env.example` is the shareable template.

---

## 6. Architecture (one slide)

```
Analyst NL
  → Cortex Agent (built with CoCo CLI)
       ├ Cortex Analyst + semantic view   txns, alerts, LCR, RWA
       ├ Cortex Search                    calls + RBI/PMLA chunks
       └ STR factory skill                FIU-IND pack
  → Next.js demo (this repo) and optional Streamlit-in-Snowflake
  → COPILOT_AUDIT
```

If Cortex models are missing in APJ (ACCOUNTADMIN):  
`ALTER ACCOUNT SET CORTEX_ENABLED_CROSS_REGION = 'AWS_US';`

---

## 7. Do not

- Fine-tune XGBoost on ULB credit-card fraud and wrap a chat UI.
- Use real customers.
- Split energy across five hackathon themes.
- Invent a regulation the copilot did not cite.
- Commit Snowflake passwords.

Questions while building: live AMA recordings on Hack2skill; public CoCo agent workshop https://youtu.be/0o_7TmiaeGY.
