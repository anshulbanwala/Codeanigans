# Sentinel — full presentation & demo script (mixed slides + live)

**Team:** Codeanigans (Anshul + **mycowdeveloper**)  
**Event:** Snowflake CoCo CLI Hackathon 2026 — **GCC Edition**, **Theme 1** (Risk, Fraud & Regulatory Intelligence Copilot)  
**Length:** **6–8 minutes** recorded (edit copilot wait times; judges accept 3–5 min if tight)  
**Surfaces:** **8-slide deck** (PDF export from `docs/ONE_PAGER.md` + screenshots) **+** live **Next.js desk** **+** **Snowflake CoWork**

**URLs (fill before recording):**

| Surface | URL |
|---------|-----|
| Local app | http://127.0.0.1:43127 (or your Vercel URL) |
| Health check | `/api/health` → `status: ok`, Snowflake connected |
| CoWork agent | `SENTINEL.RISK.SENTINEL_AGENT` — paste chat URL in `docs/judge-runs.md` |
| GitHub | https://github.com/anshulbanwala/Codeanigans |

**Warmup:** `docs/demo-warmup.md` · **Certify:** `docs/judge-runs.md` — **7/7 Pass** (Next.js + CoWork) · **Preflight:** `./scripts/preflight.sh`

---

## How this script works (mixed format)

You **alternate** between **slides** and **live product**—like a conference talk:

1. **Slide** = one idea (problem, loop, architecture)—**15–25 seconds**, no scrolling a long deck mid-demo.  
2. **Live** = you **navigate** the app and **say what you click** (“I’m opening Command center…”).  
3. **One deep copilot question in Next.js** (primary investigation).  
4. **One deep question in CoWork** (proves same Snowflake agent—not a separate chatbot).  
5. **No second Next.js copilot question** in the video (saves time; CoWork carries the second NL query).

**Do not** read the PDF line-by-line on camera. Slides are **anchors**; the app is **proof**.

**Language:** Avoid fraud typology lectures (mule/layering/smurfing). Say **high-priority alert**, **unusual activity**, **investigation case**, **filing pack**.

---

## Before you hit Record

### Browser tabs (left to right)

1. **Slide deck** — fullscreen (`F`), slide 1 ready. Export from Google Slides/PowerPoint or open PDF.  
2. **Sentinel app** — logged in, sidebar visible.  
3. **CoWork** — already on chat with `SENTINEL.RISK.SENTINEL_AGENT` (cold start done).  
4. **GitHub repo** (optional)—for closing slide.

### Window layout

- **Recording:** 1920×1080, 100–110% browser zoom, hide bookmarks bar.  
- **Mic:** test levels; room quiet.  
- **Snowflake:** confirm header shows **Snowflake live** (not “Offline demo”) on `/` and `/copilot`.

### Slide deck (8 slides — build from `docs/ONE_PAGER.md`)

| # | Title | Content |
|---|--------|---------|
| 1 | Sentinel · Codeanigans | Theme 1, Aarohan Finance (synthetic NBFC), one-line tagline |
| 2 | The problem | Fragmented AML desk: spreadsheets, email, FIU portal, no audit trail |
| 3 | The loop | **See → Ask → Investigate → File → Audit** (diagram) |
| 4 | Architecture | Next.js + CoWork → `SENTINEL_AGENT` → Analyst + Search → STR + audit |
| 5 | Screenshot | Command center KPIs |
| 6 | Screenshot | Copilot with tool chips + citations |
| 7 | Screenshot | STR download + audit row |
| 8 | Thank you | Repo URL, team names, synthetic data disclaimer |

### Copilot UI cheat sheet (what to point at in Next.js)

The copilot does **not** render SQL result grids. It shows:

- **Confidence** badge · **Cortex Agent** badge  
- **Tool chips** — e.g. `Cortex Analyst`, `Regulatory Search`, `Call Search`  
- **Answer text** — bullets and headings (markdown-lite)  
- **Generated Cortex Analyst SQL** — expand the `<details>` block  
- **Citation chips** — Analytics · Regulation · Evidence  
- **Case links** and **Open STR factory** when applicable  

Say: *“The analyst sees the narrative, the SQL behind it, and the document IDs—not a black box.”*

---

## FULL SCRIPT — beat by beat

Timestamps are targets for a **~7 min** take; edit waits in post.

---

### SEGMENT 0 · Slide 1 — Title (0:00–0:20)

**On screen:** Slide 1 fullscreen.

**Say:**

> “Hi—we’re **Codeanigans**. This is **Sentinel**: a risk, fraud, and regulatory intelligence copilot for Indian **NBFCs**, built for the Snowflake **CoCo CLI** hackathon, **Theme 1**. Everything you’ll see uses **synthetic** data for a fictional lender, **Aarohan Finance**. I’ll show the problem on one slide, then walk the live desk on Snowflake.”

**Do:** `Esc` or `Alt+Tab` to browser tab 2 (app). Do **not** advance through all slides now.

---

### SEGMENT 1 · Slide 2 — Problem (0:20–0:45)

**On screen:** Slide 2 (problem).

**Say:**

> “Today, **MLRO** and AML teams jump between dashboards, case tools, email, and the **FIU-IND** portal. They stitch **transactions**, **relationship-manager notes**, and **RBI / PMLA** guidance by hand—then rebuild the same story for a **Suspicious Transaction Report**. Generic chatbots aren’t acceptable: answers must be **grounded**, **cited**, and **replayable** for audit.”

**Do:** Switch to app → sidebar → **Command center** (`/`).

---

### SEGMENT 2 · Live — Command center (0:45–1:25)

**Navigate:** Click **Command center** in the left sidebar if not already there.

**Say while pointing:**

> “This is the **morning desk**. First line—**data source**: we’re on **Snowflake**, schema **SENTINEL.RISK**, not an offline spreadsheet.”

**Point at KPI tiles:**

> “**Open alerts**—the work queue. **Exposure** to flagged activity. **Liquidity coverage** and **runway**—treasury and compliance watch these together at an upper-layer NBFC.”

**Scroll the alert list slowly:**

> “Alerts are **prioritized**. Analysts start here; they don’t start in chat. I’ll open the copilot when an alert needs explanation—but the queue is the system of record for what’s hot.”

**Optional (10 s):** Sidebar → **Liquidity** (`/liquidity`) — “Stress and **LCR** history live in the mart.” → Back to Command center.

**Do:** Sidebar → **Risk copilot** (`/copilot`).

---

### SEGMENT 3 · Slide 3 — The loop (1:25–1:40)

**On screen:** Quick flip to Slide 3 (loop: See → Ask → Investigate → File → Audit).

**Say:**

> “Sentinel closes the loop: **see** risk on the dashboard, **ask** in natural language, **investigate** in a case file, **file** an STR pack, **audit** every AI answer. Next I’ll **ask** in our Next.js copilot—then later the **same agent** in Snowflake **CoWork**.”

**Do:** Back to `/copilot`.

---

### SEGMENT 4 · Live — Next.js copilot (ONE question) (1:40–3:10)

**On screen:** `/copilot` — empty thread or clear if rehearsing.

**Say:**

> “This page calls the same **Cortex Agent** as Snowflake: **`SENTINEL.RISK.SENTINEL_AGENT`**. Badge should read **Cortex Agent** when we’re live on Snowflake.”

**Type exactly (or click suggestion chip if present):**

```text
Show mule accounts with cash-outs after 2am
```

**On mic while waiting (20–45 s):**

> “The agent is **grounding**—it can run **governed SQL** through our **semantic analytics** layer and search **regulatory** and **call** indexes. We’re not pasting data into ChatGPT; the plan and tools run in Snowflake.”

**When the answer appears, point in order:**

1. **Tool chips** — “**Cortex Analyst** hit the mart; if you see **Regulatory Search**, that’s our RBI/PMLA corpus.”  
2. **Confidence** — “We surface **high / medium / low**—not every question is equally grounded.”  
3. **Answer body** — “Read the **facts** first—accounts, amounts, times. Then **interpretation** language—‘warrants review’, not ‘proven guilty’.”  
4. **Citation chips** — “Every policy claim ties to a **document ID**—for example **DOC-RBI-AML-MULE**—demo corpus, not invented law.”  
5. **Click** “**Generated Cortex Analyst SQL**” — “Auditors and model risk can inspect the **exact SQL** the analyst path used.”  
6. **Case links** — “If **CASE-1088** appears, that’s the investigation we’ll open next.”

**Say:**

> “Notice we don’t fake a spreadsheet grid in chat—the **evidence** is prose, **SQL**, and **citations**. Tabular detail lives in **cases** and the **STR pack**.”

**Do not** ask a second question on Next.js in this video.

---

### SEGMENT 5 · Live — Cases (3:10–3:45)

**Navigate:** Sidebar → **Cases** → click **CASE-1088** (or link from copilot).

**Say:**

> “Investigation isn’t only chat. **CASE-1088** is a structured **case file**: status, linked customers, timeline.”

**Scroll to relationship-manager / call evidence:**

> “Here’s **unstructured** evidence—a **call transcript** stored in Snowflake, searchable by the agent. Structured transactions plus RM notes in one place.”

**Do:** Sidebar → **STR factory** or URL `/str?caseId=CASE-1088`.

---

### SEGMENT 6 · Live — STR factory (3:45–4:20)

**On screen:** STR factory with **CASE-1088** selected.

**Say:**

> “When the bank forms suspicion, India’s **FIU-IND** expects an **STR** within the statutory window. Sentinel generates a **filing pack** from the same mart—not a copy-paste from chat.”

**Show:** Preview sections (narrative, transactions, parties).

**Click:** **Download JSON** (and optionally **Markdown**).

> “**JSON** for systems integration; **Markdown** for the MLRO review. Sample output is also in the repo under **`output/CASE-1088-STR.json`**.”

---

### SEGMENT 7 · Live — Audit log (4:20–4:50)

**Navigate:** Sidebar → **Audit log** (`/audit`).

**Say:**

> “Every copilot question in the app can land in **`SENTINEL.RISK.COPILOT_AUDIT`**—question, full answer, tools, SQL, citations.”

**Expand the latest row** (your mule question if fresh).

> “Internal audit and the **MLRO** can **replay** what the AI said last Tuesday—no shadow AI on a compliance desk.”

**Optional (5 s):** **Regulations** (`/regulations`) — “Indexed circulars—the same sources the agent searches.”

---

### SEGMENT 8 · Slide 4 — Architecture (4:50–5:10)

**On screen:** Slide 4 (architecture diagram from one-pager).

**Say:**

> “Under the hood: **Next.js** desk and **CoWork** both call **`SENTINEL_AGENT`**. Tools: **semantic view** for SQL, **Cortex Search** on calls and regulations, **STR skill** for packs, **audit table** for governance. Built and deployed with **CoCo CLI**—schema, agent YAML, semantic view.”

**Do:** Switch to tab 3 — **CoWork**.

---

### SEGMENT 9 · Live — CoWork (ONE question + optional abstain) (5:10–6:30)

**On screen:** Snowflake **CoWork** / **Snowflake Intelligence** chat.

**Verify:** Agent selector shows **`SENTINEL.RISK.SENTINEL_AGENT`** (read FQN on screen).

**Say:**

> “Same **agent name**, same account—this is what GCC teams use in **Snowflake Intelligence** without our custom UI.”

**Type a different prompt than Next.js** (pick one you certified):

```text
How tight is our LCR and wholesale runoff?
```

**Or:**

```text
Which names breach RBI large-exposure norms?
```

**While waiting:**

> “CoWork runs the identical orchestration—Analyst and Search—not a separate prompt wrapper.”

**When answer arrives:**

> “You should see **liquidity metrics** or **Golden Peak / concentration** language plus **DOC-BASEL-LCR** or **DOC-RBI-NBFC-LE**—same governance story as the desk.”

**Optional governance beat (15 s):**

```text
What is the crypto mining tax rule 2030?
```

**Say:**

> “Out-of-corpus questions **abstain**—we don’t invent future tax law. That’s required for regulatory AI.”

**Do:** Copy browser URL → save in `docs/judge-runs.md` if not already.

---

### SEGMENT 10 · Slide 8 — Close (6:30–7:00)

**On screen:** Slide 8 (repo, team, disclaimer).

**Say:**

> “**Sentinel** by **Codeanigans**—Theme 1 on Snowflake: dashboard, evidence-first copilot in **Next.js** and **CoWork**, case files, **STR** packs, audit trail. Code, agent definition, and sample STR on **GitHub**. All customer data is **synthetic**. Thank you.”

**End card text:** `github.com/anshulbanwala/Codeanigans` · Theme 1 · Codeanigans

---

## Slide ↔ live map (quick reference)

| When | Slide | Live route |
|------|-------|------------|
| Open | 1 Title | — |
| Problem | 2 | → `/` Command center |
| Loop | 3 | → `/copilot` (one question) |
| — | — | → `/cases/CASE-1088` → `/str?caseId=CASE-1088` → `/audit` |
| Architecture | 4 | → CoWork (one question + optional abstain) |
| Close | 8 | — |

Slides **5–7** are **backup** for judges who only open the PDF—they match screenshots you take from the live run.

---

## Prompt assignment (do not swap)

| Surface | Prompt | Why |
|---------|--------|-----|
| **Next.js** `/copilot` | `Show mule accounts with cash-outs after 2am` | Shows Analyst + AML doc + case link; certified in `judge-runs.md` |
| **CoWork** | `How tight is our LCR and wholesale runoff?` **or** large-exposure prompt | Proves second domain on **same agent** without repeating mule |
| **CoWork** (optional) | `Abstain test: crypto mining tax rule 2030` | Governance |

---

## Recording checklist

- [ ] Slide deck exported (PDF for Hack2skill + presenter mode for video)  
- [ ] `/api/health` ok · Snowflake banner on `/` and `/copilot`  
- [ ] Next.js: **one** copilot Q — tools, SQL details, citations shown  
- [ ] CASE-1088 + one call line  
- [ ] STR JSON downloaded  
- [ ] Audit row expanded  
- [ ] CoWork: **one** non-mule prompt + agent FQN visible  
- [ ] CoWork abstain (recommended)  
- [ ] 8-slide PDF uploaded separately from video  

---

## 3-minute emergency cut

Slide 1 (10 s) → `/` (20 s) → `/copilot` mule only (60 s) → CASE-1088 (15 s) → STR download (20 s) → `/audit` (15 s) → CoWork LCR or abstain (40 s) → Slide 8 (10 s).

---

## Terms (say full form once)

| Term | Meaning |
|------|---------|
| **NBFC** | Non-Banking Financial Company (Aarohan Finance) |
| **AML** | Anti–money laundering |
| **MLRO** | Money Laundering Reporting Officer |
| **FIU-IND** | Financial Intelligence Unit — India |
| **STR** | Suspicious Transaction Report |
| **RBI** | Reserve Bank of India |
| **PMLA** | Prevention of Money Laundering Act |
| **KYC** | Know Your Customer |
| **LCR** | Liquidity Coverage Ratio |
| **CoCo** | Snowflake Cortex Code CLI |
| **CoWork** | Snowflake Intelligence / agent chat in the Snowflake UI |
