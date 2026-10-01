# Sentinel — presentation & demo script (5–6 min)

**Team:** Codeanigans (Anshul + **mycowdeveloper**)  
**Audience:** Judges, business stakeholders, and engineers—**no deep fraud typology**; focus on *what the desk does* and *what Sentinel delivers*.  
**App:** http://127.0.0.1:43127 · **Warm up:** `docs/demo-warmup.md` · **Health:** `/api/health` → ok

Show **two surfaces:** **Next.js desk** (main story) + **Snowflake CoWork** (same agent).

---

## How to think about the story (three perspectives)

| Perspective | What they should take away |
|-------------|----------------------------|
| **Business / compliance** | One place to see risk, ask questions in English, get **filing-ready reports**, and **audit** every AI answer. |
| **Technology** | Everything runs on **Snowflake**—governed data, search over documents, an **agent** that picks the right tool; built with **CoCo** (Snowflake’s coding assistant). |
| **Operations** | Synthetic **Aarohan Finance** demo data; same agent in the **web app** and in **CoWork**; reproducible from GitHub. |

You do **not** need to explain fraud pattern names (mule, layering, smurfing, etc.). Say **“suspicious activity”**, **“high-priority alert”**, **“investigation case”**, **“regulatory filing pack”**.

---

## Terms — full form once (then use short form)

| Say first | Meaning |
|-----------|---------|
| Non-Banking Financial Company (**NBFC**) | Lender like our demo bank Aarohan Finance |
| Anti–money laundering (**AML**) | Controls to detect illicit funds |
| Money Laundering Reporting Officer (**MLRO**) | Senior compliance lead who signs off filings |
| Financial Intelligence Unit — India (**FIU-IND**) | Government unit that receives suspicious activity reports |
| Suspicious Transaction Report (**STR**) | Formal report when the bank suspects illicit activity |
| Reserve Bank of India (**RBI**) | Banking regulator (rules cited in demo) |
| Prevention of Money Laundering Act (**PMLA**) | India’s AML law (demo policy text) |
| Know Your Customer (**KYC**) | Customer identity and risk checks |
| Liquidity Coverage Ratio (**LCR**) | Short-term liquidity health metric |
| Snowflake **CoCo** | Cortex Code CLI—builds agents on Snowflake |
| **Cortex Agent** | Snowflake AI that plans steps and calls tools |

---

# PART 1 — Next.js presentation (~4 min)

## 1 · 0:00–0:30 — Why Sentinel exists

**Show:** Title slide *or* empty command center loading.

**Say:**

> “Compliance teams at Indian NBFCs must monitor risk, investigate alerts, read internal notes and regulator guidance, and prepare **Suspicious Transaction Reports** for **FIU-IND**—often across many tools. **Sentinel** is a single **MLRO desk** on Snowflake: a **dashboard**, a **copilot** that cites evidence, **case files**, **downloadable STR packs**, and an **audit log**. All demo data is **synthetic** for Aarohan Finance.”

---

## 2 · 0:30–1:10 — Command center (dashboard)

**Go to:** Sidebar → **Command center** (`/`)

**Show (point with mouse):**

| On screen | What to say (plain language) |
|-----------|------------------------------|
| **Data source** line (Snowflake · SENTINEL.RISK) | “Live connection to our Snowflake data— not a offline spreadsheet.” |
| **KPI tiles** | “How many **open alerts**, exposure to suspicious activity, **liquidity** ratio, runway in days.” |
| **Alert list** | “Prioritized work queue—**critical** items first. Analysts start here every morning.” |
| *(Optional 15 s)* **Liquidity** (`/liquidity`) | “Treasury view—liquidity ratio and stress assumptions.” |
| *(Optional 15 s)* **Credit risk** (`/credit`) | “Who dominates the loan book—concentration risk.” |

**Do not:** name fraud typologies. Say “**high-priority alert**” or “**this case**.”

---

## 3 · 1:10–2:00 — Risk copilot — question 1

**Go to:** **Risk copilot** (`/copilot`)

**Show:** Agent badge (Cortex Agent) · Snowflake connected.

**Type:** `Show mule accounts with cash-outs after 2am`  
*(On mic you can say: “Ask about **unusual overnight cash activity** tied to our demo alerts.”)*

**Show when answer arrives:**

- Tools used (database / document search)  
- Answer split into **what we saw in data** vs **what it might mean**  
- **Document ID** (e.g. regulator guidance)—“not invented text”

**Say:**

> “Analysts ask in English. The **Cortex Agent** on Snowflake runs **governed queries** and searches our **policy library**. Answers cite **document IDs** and separate **facts** from **interpretation**—what regulators expect from AI in compliance.”

---

## 4 · 2:00–2:40 — Risk copilot — question 2

**Stay on** `/copilot`

**Type:** `Is Rahul Mehta structuring under the ₹10L CTR?`  
*(Say: “**Cash reporting threshold** question on a named customer.”)*

**Or if slow:** `How tight is our LCR and wholesale runoff?`  
*(Say: “**Liquidity** question for treasury and compliance.”)*

**Say:**

> “One agent handles **customer investigations** and **balance-sheet risk**—same governance model, same audit trail.”

---

## 5 · 2:40–3:10 — Cases (investigation workspace)

**Go to:** **Cases** (`/cases`) → open **CASE-1088**

**Show:**

- Case title and status  
- Linked people / accounts (names only—no typology lecture)  
- **Relationship manager call note** (read one short quote)

**Say:**

> “Chat is not the whole job. Analysts open a **case file**: timeline, customers, and **call notes** stored in Snowflake—structured and unstructured evidence together.”

---

## 6 · 3:10–3:40 — STR factory (regulatory deliverable)

**Go to:** **STR factory** (`/str`) or `/str?caseId=CASE-1088`

**Show:**

- Case **CASE-1088** selected  
- Pack preview (narrative + transactions)  
- **Download JSON** and **Download Markdown**

**Say:**

> “When suspicion is formed, the bank files an **STR** with **FIU-IND**. Sentinel generates a **filing pack**—machine-readable JSON and human-readable Markdown—from the same governed data. That’s the regulatory **output**, not just a chat summary.”

---

## 7 · 3:40–4:00 — Audit log (trust)

**Go to:** **Audit log** (`/audit`)

**Show:** Expand latest row—question, full answer, SQL, tools.

**Say:**

> “Internal audit and the **MLRO** can **replay** every copilot answer—who asked what, when, with which SQL and citations. No shadow AI.”

---

## 8 · 4:00–4:10 — Regulations index (optional)

**Go to:** **Regulations** (`/regulations`)

**Say (one line):**

> “Policy excerpts are indexed in Snowflake for search—the same sources the copilot cites.”

---

# PART 2 — CoWork (same brain, ~1 min)

**Why include this:** Proves Sentinel is **Snowflake-native**, not only a custom web app.

1. Log in at https://app.snowflake.com/  
2. Open **CoWork** / **Snowflake Intelligence**  
3. Select **`SENTINEL.RISK.SENTINEL_AGENT`**  
4. Ask: `Show mule accounts with cash-outs after 2am` *(or: “summarize open critical alerts”)*  
5. **Optional:** `What is the crypto mining tax rule 2030?` → show **refusal** (governance)

**Say:**

> “**Same agent name**, same Snowflake account—in our **Next.js desk** and in **CoWork**. One governance model for GCC teams standardizing on Snowflake AI.”

**Save:** Browser URL → `docs/judge-runs.md`

---

# PART 3 — Close (4:10–4:30)

**Show:** GitHub repo · `docs/ONE_PAGER.md` diagram

**Say:**

> “**Sentinel** by **Codeanigans**—Anshul and **mycowdeveloper**. Risk, fraud, and regulatory intelligence on Snowflake. Code and sample STR on GitHub. Thank you.”

**End card:** `github.com/anshulbanwala/Codeanigans` · Theme 1 · Codeanigans

---

## Presentation slide outline (if you use PowerPoint / Google Slides)

1. **Problem** — fragmented AML desk (one sentence)  
2. **Solution** — Sentinel loop: **See → Ask → Investigate → File → Audit**  
3. **Screenshot** — Command center (dashboard)  
4. **Screenshot** — Copilot with citations  
5. **Screenshot** — STR download  
6. **Screenshot** — Audit log  
7. **Architecture** — one diagram from ONE_PAGER (app + CoWork → agent → data + search)  
8. **Team & repo**

---

## Recording checklist

- [ ] Snowflake banner on dashboard  
- [ ] Copilot shows **Cortex Agent**  
- [ ] Case **CASE-1088** + one call line  
- [ ] STR file downloaded  
- [ ] Audit row expanded  
- [ ] CoWork same agent FQN  
- [ ] No long lecture on fraud categories  

---

## If time is short (3 min cut)

Dashboard (30 s) → Copilot ×1 (45 s) → CASE-1088 (20 s) → STR download (25 s) → Audit (20 s) → CoWork ×1 (30 s) → Close (10 s).
