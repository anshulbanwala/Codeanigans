# Sentinel — judge-facing demo script (accurate UI clicks)

**Team:** Codeanigans · **Hackathon:** Snowflake CoCo CLI 2026, **GCC Edition**  
**Theme 1:** Risk, Fraud and Regulatory Intelligence Copilot  
**Length:** ~5½–7 min (tour + copilot + CoWork; trim pauses in edit)  
**Opens with:** `docs/ONE_PAGER.md` as **PDF** (problem + solution only)  
**Then:** Live app — **every sidebar item once (brief)** → **Risk copilot** (one prompt) → **CoWork** (same prompt)

**Certified:** `docs/judge-runs.md` — 7/7 on Next.js and CoWork.

| Prep | |
|------|--|
| App | http://127.0.0.1:43127 or Vercel URL |
| Header pill | Top-right should show **Snowflake live** (green), not offline |
| CoWork | Agent `SENTINEL.RISK.SENTINEL_AGENT` — URL in `docs/judge-runs.md` |
| Warmup | `docs/demo-warmup.md` · `./scripts/preflight.sh` |

---

## What reviewers should understand (say once up front)

**Theme 1 asks for two things together:**

1. A **copilot** that surfaces **risk and fraud** from enterprise data (structured + unstructured).  
2. **Audit-ready regulatory output** — not chat alone.

**Sentinel delivers:** Snowflake **mart** → **desk UI** → **Cortex Agent** (Analyst + Search) → **case workflow** → **STR filing pack** → **audit log**. Built with **CoCo CLI** on Snowflake’s AI Data Cloud.

There is **no separate “Alerts” tab**. Open alerts appear on the **Command center** as **Priority queue** and inside **Cases** / **Investigations**.

---

## The one question (Next.js **and** CoWork)

```text
Show mule accounts with cash-outs after 2am
```

Use the **same text** in both places. Start it in **Risk copilot** first; switch to **CoWork** while Next.js is still thinking; come back to show both answers.

---

## Sidebar order (this is the real UI)

Click **only these labels** in the left nav:

1. Command center  
2. Risk copilot *(later — after tour)*  
3. Investigations  
4. Liquidity  
5. Credit risk  
6. Cases  
7. STR factory  
8. Regulations  
9. Audit log  

Then: **Risk copilot** → **CoWork tab** → optional return to **Audit log**.

---

## How to read this script

- **ACTION** — exact click / scroll.  
- **SAY** — your voice track (plain English; spell acronyms **once** when they first appear).  
- **THEME** — optional line tying to rubric (weave in, don’t read as a list).

---

# PART A — One-pager (~40 seconds)

**ACTION** Open ONE_PAGER PDF. Scroll **The problem** and **What Sentinel is**. Stop before the long object table.

**SAY**

> “We’re **Codeanigans**. **Sentinel** is for **Theme 1**: a **risk, fraud, and regulatory intelligence copilot** for Indian lenders.
>
> Our demo bank is **Aarohan Finance**, an **NBFC** — a **Non-Banking Financial Company**.
>
> Compliance runs **AML** — **Anti–Money Laundering**. The executive owner is the **MLRO** — **Money Laundering Reporting Officer**.
>
> When the bank suspects financial crime, it may file an **STR** — a **Suspicious Transaction Report** — with **FIU-IND**, India’s **Financial Intelligence Unit**.
>
> Rules come from **RBI** — **Reserve Bank of India** — and laws like **PMLA**, **Prevention of Money Laundering Act**.
>
> Teams today use too many tools. **Sentinel** is one **MLRO desk** on **Snowflake**: see risk, investigate, produce a **filing pack**, and **audit** AI. All data here is **synthetic**.”

**ACTION** Close PDF. Open Sentinel. Left nav visible.

---

# PART B — Product tour (click every nav item, ~2½ minutes)

Do **not** deep-dive each screen. **~20–35 seconds per item.** Keep moving.

---

### B1 · Command center

**ACTION** Click **Command center** (first nav item). You land on `/`.

**ACTION** Point at **Mart source banner** under the subtitle (Snowflake · SENTINEL.RISK).

**SAY**

> “**Command center** is the morning view. KPIs are **not** hard-coded in the UI — they’re **SQL over our Snowflake mart**: open alert counts, flagged transaction volume, **LCR** (**Liquidity Coverage Ratio**), and largest **credit exposure** share.”

**ACTION** Scroll down slowly:

- Four **KPI cards** (Open alerts, Flagged flow, LCR, Largest exposure)  
- Dark **Treasury watch** / liquidity pulse  
- **Priority queue** (this is the **alert worklist** — IDs, status, scores, titles)  
- Right card **Ask Sentinel** with example questions  
- **Channel mix** and **network** charts  
- **Open cases** grid at the bottom  

**SAY**

> “**Priority queue** is where analysts see **open alerts** — there’s no separate Alerts menu. Below that, **open cases** link into investigations. Everything you see is fed from the same **SENTINEL.RISK** schema we built with **CoCo**.”

**THEME** Surfaces **fraud and liquidity signals** in one pane (relevance).

---

### B2 · Investigations

**ACTION** Click **Investigations**.

**SAY**

> “**Investigations** is a focused desk for our flagship case — here **CASE-1088** — linking **alerts**, a **transaction timeline**, a **network view**, and **call evidence** from the mart.”

**ACTION** Glance at the three stat cards (Active case, Alerts linked, Call artifacts). Scroll the **transaction timeline** and one **call evidence** card. Point at **Open full case file →** (top right) but don’t follow yet.

**SAY**

> “Structured payments plus **unstructured** RM calls — both in Snowflake, both searchable by the agent.”

**THEME** Structured + unstructured intelligence.

---

### B3 · Liquidity

**ACTION** Click **Liquidity**.

**SAY**

> “**Liquidity** is treasury risk: **LCR**, **NSFR** (**Net Stable Funding Ratio**), wholesale **runoff**, and history charts — same mart, different lens. Compliance and ALCO care about this alongside fraud.”

**ACTION** Point at the three metrics and one chart. Optional: click **Ask Sentinel about liquidity →** (you won’t ask yet).

**THEME** Risk is not only fraud — regulatory / prudential context.

---

### B4 · Credit risk

**ACTION** Click **Credit risk**.

**SAY**

> “**Credit risk** shows **concentration** — sector shape, **NPA** signal, names like **Golden Peak** in the copy. Large-exposure questions in the copilot use this book.”

**ACTION** Point at CRE share / Top 20 / sector bars (~5 seconds).

---

### B5 · Cases

**ACTION** Click **Cases**.

**SAY**

> “**Cases** is the system of record: each card is an investigation with status, severity, and summary.”

**ACTION** Click **CASE-1088** (or the mule-ring case). On `/cases/CASE-1088`, scroll once: customers, transactions, related alerts, calls.

**SAY**

> “A **case file** binds entities and evidence — what auditors expect, not a chat thread.”

**ACTION** Click **← Cases** or use nav — don’t linger.

---

### B6 · STR factory

**ACTION** Click **STR factory**.

**SAY**

> “This is Theme 1’s **regulatory output**. An **STR** is the formal **Suspicious Transaction Report** package for **FIU-IND** — subjects, transactions, grounds of suspicion, cited clauses, filing language.”

**ACTION** In the **dropdown**, select **CASE-1088** if needed. Point at the preview card (subjects, transaction schedule, clauses). **Do not download yet** unless you prefer to — download works well **after** the copilot links this case.

**SAY**

> “We generate **JSON** and **Markdown** from the mart — **audit-ready**, not a screenshot of chat.”

**THEME** “Audit-ready regulatory output” requirement.

---

### B7 · Regulations

**ACTION** Click **Regulations**.

**SAY**

> “**Regulatory corpus** lists indexed chunks — **DOC-PMLA-12**, **DOC-RBI-KYC-54**, **DOC-FIU-STR**, and others. The copilot cites these IDs via **Cortex Search** — that’s our **RAG** layer: **retrieval-augmented generation**, search first, then answer.”

**ACTION** Scroll one card (ID, title, excerpt).

---

### B8 · Audit log

**ACTION** Click **Audit log**.

**SAY**

> “**Audit log** stores copilot turns in **`COPILOT_AUDIT`** when live — question, answer, tools, **SQL**, citations. We’ll see a fresh row after we ask the copilot.”

**ACTION** Expand one existing row if present (~5 s). Leave page.

**THEME** Governance / completeness.

---

# PART C — Risk copilot (~1–1½ minutes + wait)

**ACTION** Click **Risk copilot**.

**SAY**

> “Now the **copilot**. The app calls Snowflake **`SENTINEL.RISK.SENTINEL_AGENT`** — a **Cortex Agent**. It chooses tools: **Cortex Analyst** (governed **SQL** on our **semantic view**) and **Cortex Search** (**RAG** on calls and regulations). No generic LLM guessing on raw tables.”

**ACTION** Type and submit:

```text
Show mule accounts with cash-outs after 2am
```

**SAY** (while loading)

> “I’ll ask the **identical question** in **CoWork** — Snowflake’s in-account agent UI — so GCC teams see the same brain without our Next.js shell.”

---

# PART D — CoWork (~1 minute + wait)

**ACTION** Switch browser tab to **Snowflake CoWork** / **Snowflake Intelligence**. Confirm agent **`SENTINEL.RISK.SENTINEL_AGENT`**.

**ACTION** Paste the **same prompt** and send.

**SAY**

> “Same agent FQN, same Snowflake account. **CoCo CLI** is how we deployed schema, search services, semantic layer, and agent YAML.”

**ACTION** Return to **Risk copilot** tab when the Next.js answer is ready.

---

# PART E — Show both answers (~1 minute)

**ACTION** On `/copilot`, point in order:

1. **Cortex Agent** badge  
2. **Tool chips** (Cortex Analyst / Regulatory Search / Call Search)  
3. **Confidence**  
4. Answer text — facts vs cautious wording  
5. **Citation chips** (document IDs)  
6. Expand **Generated Cortex Analyst SQL**  
7. **CASE-1088** link if shown  

**SAY**

> “**Grounding**: tools ran before narrative. **SQL** is visible for model risk. Citations tie to our **Regulations** index. Interpretation stays separate from fact.”

**ACTION** Switch to **CoWork** — show completed answer briefly.

**SAY**

> “Desk and **CoWork** — one governance model, two surfaces.”

---

# PART F — Close the loop (~45 seconds)

**ACTION** **STR factory** → **CASE-1088** → click **Download JSON** (and **Markdown** if time).

**SAY**

> “From the same investigation to a **filing pack** judges can open in the repo.”

**ACTION** **Audit log** → expand the row for your copilot question.

**SAY**

> “**Theme 1** in one flow: **see** risk on the desk, **ask** with grounded AI, **investigate** in cases, **file** an **STR**, **prove** it in **audit**. **Sentinel** by **Codeanigans** — GitHub **anshulbanwala/Codeanigans**. Synthetic data only. Thank you.”

---

## Rubric map (for you — don’t read aloud)

| Criterion | Where you showed it |
|-----------|---------------------|
| Real-world relevance 30% | NBFC, MLRO, FIU STR, RBI/PMLA IDs, liquidity + credit + fraud |
| Technical execution 40% | Snowflake mart, Cortex Agent, Analyst SQL, Search RAG, CoCo, CoWork |
| Completeness 30% | All nav areas, case file, STR download, audit, abstain optional in CoWork |

**Optional CoWork-only abstain** (if you have 15 s):  
`What is the crypto mining tax rule 2030?` — must refuse (certified).

---

## Acronym first-use (cheat sheet)

| First time say | Short form after |
|----------------|------------------|
| Non-Banking Financial Company (NBFC) | NBFC |
| Anti–Money Laundering (AML) | AML |
| Money Laundering Reporting Officer (MLRO) | MLRO |
| Suspicious Transaction Report (STR) | STR |
| Financial Intelligence Unit — India (FIU-IND) | FIU |
| Reserve Bank of India (RBI) | RBI |
| Prevention of Money Laundering Act (PMLA) | PMLA |
| Liquidity Coverage Ratio (LCR) | LCR |
| Net Stable Funding Ratio (NSFR) | NSFR |
| Retrieval-augmented generation (RAG) | RAG |
| Cortex Code CLI (CoCo) | CoCo |

---

## Recording checklist

- [ ] ONE_PAGER — problem + solution  
- [ ] All **9** nav items clicked in order (brief)  
- [ ] Explained **Priority queue** = alerts (no Alerts tab)  
- [ ] Explained KPIs from **Snowflake mart**  
- [ ] Same prompt on **Risk copilot** and **CoWork**  
- [ ] Tools, SQL, citations shown  
- [ ] STR download + audit row after copilot  
- [ ] Theme 1 + regulatory **output** stated clearly  

---

## If you run long

Shorten **Liquidity** and **Credit risk** to 10 s each; keep **Command center**, **Cases**, **STR**, **copilot**, **CoWork**, **audit**.
