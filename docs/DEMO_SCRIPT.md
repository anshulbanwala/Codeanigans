# Sentinel — recording script (one-pager + live demo)

**Team:** Codeanigans (Anshul + **mycowdeveloper**)  
**Event:** Snowflake CoCo CLI Hackathon 2026 — **GCC Edition**, **Theme 1**  
**Target length:** **5–5½ minutes** (OK to run to ~6 min if copilot waits are trimmed in edit)  
**What you show:** **`docs/ONE_PAGER.md` as PDF** (intro only) → **Sentinel Next.js app** (full desk) → **Snowflake CoWork** (same agent)  
**Certified prompts:** `docs/judge-runs.md` — **7/7 Pass** (Next.js + CoWork)

**Before record:** `docs/demo-warmup.md` · `./scripts/preflight.sh` · Snowflake banner on homepage (not “offline demo”)

| Tab | URL |
|-----|-----|
| One-pager PDF | Export from `docs/ONE_PAGER.md` (Print → PDF) |
| Sentinel | http://127.0.0.1:43127 or Vercel URL |
| CoWork | Agent `SENTINEL.RISK.SENTINEL_AGENT` — see `docs/judge-runs.md` |

---

## The one copilot question (use on **both** Next.js and CoWork)

Type this **exactly** in **Risk copilot** first, then the **same text** in **CoWork** while the first answer is still generating:

```text
Show mule accounts with cash-outs after 2am
```

**On mic you can say:** “Show me accounts linked to **unusual overnight cash activity** after 2 a.m.” — you do **not** need to explain fraud typology names; the data and citations carry the story.

**Why this prompt:** Certified on both surfaces; triggers **Cortex Analyst** (SQL on the semantic mart) plus **regulatory search** (e.g. `DOC-RBI-AML-MULE`); often links **CASE-1088** for the case/STR part of the demo.

---

## UI map (no separate “Alerts” tab)

Sidebar is only:

| Nav label | Route | Use in video |
|-----------|--------|----------------|
| **Command center** | `/` | **Homepage** — scroll KPIs, **Priority queue** (open alerts live here), charts, **Open cases** |
| **Risk copilot** | `/copilot` | Your **one** NL question |
| Investigations | `/investigations` | Skip in short video (optional) |
| Liquidity / Credit risk | `/liquidity`, `/credit` | Optional 5 s from homepage scroll only |
| **Cases** | `/cases` | List → **CASE-1088** detail |
| **STR factory** | `/str` | Explain STR + download |
| Regulations | `/regulations` | Optional one line |
| **Audit log** | `/audit` | Governance close |

**Priority queue** on the homepage **is** the alert work queue—there is no separate Alerts page.

---

## Legend

- **[ACTION]** — what you do on screen (click, scroll, type).  
- **[SAY]** — what you speak (adjust pace; don’t rush acronyms).  
- **[TECH]** — optional one-liner if you want extra Snowflake credit (can fold into [SAY]).

---

# SCRIPT

---

## 1 · One-pager intro (~0:45)

**[ACTION]** Open the **ONE_PAGER PDF** fullscreen (or browser preview). Scroll slowly through **The problem** and **What Sentinel is** — do **not** read every table; stop before the long object list.

**[SAY]**

> “Hi, we’re **Codeanigans**. This is **Sentinel** — a risk, fraud, and regulatory intelligence copilot for Indian lenders.
>
> **NBFC** means **Non-Banking Financial Company** — think a finance company like our demo bank, **Aarohan Finance**, not a full universal bank.
>
> Compliance teams run **AML**, **Anti–Money Laundering** controls. The senior lead is the **MLRO**, the **Money Laundering Reporting Officer**.
>
> When they suspect crime, India’s **FIU-IND** — the **Financial Intelligence Unit** — expects a filed **STR**, a **Suspicious Transaction Report**, on a defined timeline. They also work under **RBI**, the **Reserve Bank of India**, and laws like **PMLA**, the **Prevention of Money Laundering Act**.
>
> Today that work is split across spreadsheets, case tools, email, and portals. **Sentinel** puts the **MLRO desk** on **Snowflake**: see risk, ask questions in English with **citations**, open **cases**, generate an **STR pack**, and **audit** every AI answer. All data in this demo is **synthetic**.”

**[ACTION]** Close or minimize PDF. Open Sentinel in the next tab. Sidebar visible. You should already be on **Command center** (`/`).

---

## 2 · Command center — scroll the homepage (~1:15)

**[ACTION]** Stay on **Command center**. Point at **Mart source banner** (Snowflake · SENTINEL.RISK).

**[SAY]**

> “This is the **command center** — not a slide, live app on **Snowflake**. The banner shows we’re reading the governed mart, not a local Excel file.”

**[ACTION]** Scroll to the **four KPI tiles**: Open alerts, Flagged flow, **LCR**, Largest exposure.

**[SAY]**

> “**Open alerts** — how much is in the queue. **Flagged flow** — volume already marked suspicious in the mart. **LCR** is **Liquidity Coverage Ratio** — can we cover short-term stress. **Largest exposure** — concentration on one name in the credit book.”

**[ACTION]** Scroll through **Treasury watch** / liquidity pulse (dark section). Keep moving—don’t drill into Liquidity tab unless you have time.

**[SAY]**

> “Treasury and compliance share one pane — liquidity pressure alongside fraud signals.”

**[ACTION]** Scroll to **Priority queue** — point at 2–3 rows (IDs, severity, titles). **Do not** click into a separate Alerts page.

**[SAY]**

> “This **priority queue** is the morning worklist — structured **alerts** from the warehouse, scored and sorted. Analysts start here, then deepen in **cases** or the **copilot**.”

**[ACTION]** Briefly show **Ask Sentinel** card and **Open cases** grid at the bottom; hover **CASE-1088** but don’t open yet.

**[SAY]**

> “Hero **investigation cases** are one click away. Next I’ll ask the **risk copilot** the same question we’ll ask in Snowflake **CoWork** — same **Cortex Agent** behind both.”

**[TECH]** Under the hood: KPIs and queue come from tables in `SENTINEL.RISK`; charts read the same mart CoCo helped us build.

---

## 3 · Risk copilot — start the question (~0:20 + wait)

**[ACTION]** Sidebar → **Risk copilot** (`/copilot`). Confirm badge area will show **Cortex Agent** when live.

**[SAY]**

> “**Risk copilot** calls Snowflake **`SENTINEL.RISK.SENTINEL_AGENT`** — a **Cortex Agent**. It doesn’t hallucinate from a blank model: it **plans** which tools to use — **Cortex Analyst** for governed **SQL** on our **semantic view**, and **Cortex Search** for **RAG** — retrieval-augmented generation — over call transcripts and regulatory chunks.”

**[ACTION]** Click in the input box. **Type and submit:**

```text
Show mule accounts with cash-outs after 2am
```

**[SAY]** (while the loading card runs — 20–45 seconds)

> “The agent is running **inside Snowflake** — same path judges certified in our repo. I’ll open **CoWork** and ask the **identical question** so you see GCC teams can use **Snowflake Intelligence** without our custom UI.”

---

## 4 · CoWork — same query in parallel (~0:45 + wait)

**[ACTION]** Switch browser tab to **Snowflake CoWork** / **Snowflake Intelligence**. Confirm agent **`SENTINEL.RISK.SENTINEL_AGENT`**.

**[SAY]**

> “**CoWork** is Snowflake’s agent chat. **Same agent name**, same account — not a second chatbot we trained elsewhere.”

**[ACTION]** Paste or type the **same prompt**:

```text
Show mule accounts with cash-outs after 2am
```

**[SAY]** (while CoWork thinks)

> “Parallel question — when this finishes, you’ll see the same class of answer: structured facts from the mart, policy excerpts with **document IDs**, and careful **interpretation** language. We built and deployed this stack with **CoCo**, Snowflake’s **Cortex Code CLI** — schema, semantic layer, search indexes, agent YAML.”

**[ACTION]** Switch back to **Sentinel /copilot** tab. If Next.js answer is ready, continue Section 5 here. If not, keep light narration on CoWork tab until one surface completes, then show both.

---

## 5 · Read the Next.js answer — grounding (~1:00)

**[ACTION]** On `/copilot`, with the finished answer visible, point in order:

1. **Tool chips** — Cortex Analyst, Regulatory Search, Call Search if shown  
2. **Confidence** badge  
3. Answer text — facts vs “warrants review”  
4. **Citation chips** — e.g. `DOC-RBI-AML-MULE`  
5. Expand **Generated Cortex Analyst SQL**  
6. **Case** link if **CASE-1088** appears  

**[SAY]**

> “**Grounding**: tools ran before the prose. **Cortex Analyst** generated SQL against our **semantic model** — business definitions for alerts, transactions, customers — not raw guesswork. **Cortex Search** is the **RAG** layer: it retrieved regulatory and call evidence; citations like **DOC-RBI-AML-MULE** are IDs in our indexed corpus, not invented RBI text.
>
> We show **SQL** for audit. The UI is narrative plus citations — not a fake Excel grid — tabular detail lives in **cases** and the **STR pack**.”

**[ACTION]** Flip to **CoWork** tab; show its completed answer briefly (same prompt).

**[SAY]**

> “Same question, same agent family — **desk** or **CoWork**, one governance model.”

---

## 6 · Cases — list and CASE-1088 detail (~0:50)

**[ACTION]** Sidebar → **Cases** (`/cases`). Scroll the list.

**[SAY]**

> “Investigations are **cases** — durable records, not chat history.”

**[ACTION]** Open **CASE-1088** (`/cases/CASE-1088`).

**[SAY]**

> “Here’s the **case file**: customers, accounts, **transactions**, related **alerts**, and **relationship-manager call transcripts** — unstructured evidence stored in Snowflake and searchable by the agent.”

**[ACTION]** Scroll to a **call transcript** block; read one short quote.

**[SAY]**

> “That call is **unstructured** evidence alongside **structured** payments — exactly what Theme 1 asks for.”

---

## 7 · STR factory — what an STR is + download (~0:55)

**[ACTION]** Sidebar → **STR factory** (`/str`). Ensure **CASE-1088** is selected (or open `/str?caseId=CASE-1088`).

**[SAY]**

> “An **STR**, **Suspicious Transaction Report**, is what the bank files with **FIU-IND** when suspicion is formed — narrative, parties, transactions, indicators — not a chat summary.
>
> **Sentinel** produces a **filing pack**: **JSON** for systems and **Markdown** for **MLRO** review, built from the same mart and case.”

**[ACTION]** Scroll the preview. Click **Download JSON** (and **Markdown** if time).

**[SAY]**

> “Sample output is in our GitHub under `output/CASE-1088-STR.json` for judges who don’t run the app.”

**[TECH]** STR assembly uses our agent **skill** and governed tables — regulatory **output**, not only Q&A.

---

## 8 · Audit log (~0:35)

**[ACTION]** Sidebar → **Audit log** (`/audit`). Expand the latest row (your copilot question).

**[SAY]**

> “Every copilot turn can persist to **`COPILOT_AUDIT`** — question, full answer, tools, **SQL**, citations. Internal audit and the **MLRO** can **replay** decisions — required for enterprise AI in compliance.”

---

## 9 · Close (~0:25)

**[ACTION]** Optional: **Regulations** (`/regulations`) — one scroll. Or return to **Command center** and stop on homepage.

**[SAY]**

> “**Sentinel** by **Codeanigans**: Theme 1 on Snowflake — **Cortex Agent**, **Analyst**, **Search RAG**, **STR** factory, **audit**. **Next.js** for the desk, **CoWork** for teams in Snowflake UI. Repo: **github.com/anshulbanwala/Codeanigans**. Synthetic data only. Thank you.”

---

## Acronym cheat sheet (first use in video)

| Say this | Means |
|----------|--------|
| NBFC | Non-Banking Financial Company |
| AML | Anti–Money Laundering |
| MLRO | Money Laundering Reporting Officer |
| FIU-IND | Financial Intelligence Unit — India |
| STR | Suspicious Transaction Report |
| RBI | Reserve Bank of India |
| PMLA | Prevention of Money Laundering Act |
| KYC | Know Your Customer |
| LCR | Liquidity Coverage Ratio |
| RAG | Retrieval-augmented generation (search then answer) |
| CoCo | Snowflake Cortex Code CLI (build/deploy assistant) |
| CoWork | Snowflake Intelligence / in-account agent chat |

---

## Recording checklist

- [ ] ONE_PAGER PDF — problem + solution only (~45 s)  
- [ ] Homepage scroll — KPIs, **Priority queue**, open cases (no Alerts tab)  
- [ ] **Same prompt** on `/copilot` and CoWork  
- [ ] Tool chips, citations, SQL expanded on Next.js answer  
- [ ] CoWork answer shown  
- [ ] CASE-1088 + one call line  
- [ ] STR explained + download  
- [ ] Audit row expanded  
- [ ] Snowflake / Cortex / RAG / CoCo mentioned naturally  

---

## Edit notes

- Trim **duplicate wait** between Next.js and CoWork; keep **both finished answers** on screen for a few seconds each.  
- If one surface is slow, narrate **[TECH]** lines over the spinner rather than going back to the PDF.  
- **5½ min** target: shorten Treasury watch and Regulations; keep copilot + STR + audit.
