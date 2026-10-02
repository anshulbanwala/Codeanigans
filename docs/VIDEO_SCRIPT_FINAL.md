# Sentinel — FINAL video script (full story, end-to-end)

**Team:** Codeanigans · **Hackathon:** Snowflake CoCo CLI 2026, **GCC Edition**  
**Theme 1:** Risk, Fraud and Regulatory Intelligence Copilot  

**This is the script to record.** It tells the **full product story** (every nav area, case workflow, regulatory output) and still satisfies Hack2skill: **CoCo CLI**, **one workflow**, **Input → Processing → Output**, **2–3 modular capabilities** (Analyst, Search, str-factory skill).

| | |
|--|--|
| **Raw record** | ~6–7 min (tour + CoCo + copilot + CoWork) |
| **Submit** | Edit to **≤ 5:00** (trim Liquidity/Credit to 10 s each; cut spinner waits) |
| **Opens with** | `docs/ONE_PAGER.md` as **PDF** (problem + solution) — optional but strong |
| **Certified** | `docs/judge-runs.md` — **7/7** Next.js + CoWork |

| Prep | |
|------|--|
| App | http://127.0.0.1:43127 or Vercel URL |
| Header pill | Top-right **Snowflake live** (green) |
| CoWork | `SENTINEL.RISK.SENTINEL_AGENT` — URL in `docs/judge-runs.md` |
| Tabs | Terminal (repo) · Sentinel · CoWork |
| Warmup | `docs/demo-warmup.md` · `./scripts/preflight.sh` |

---

## What judges should understand (say once — Part A or Command center)

**Theme 1 asks for two things together:**

1. A **copilot** that surfaces **risk and fraud** from enterprise data (**structured + unstructured**).  
2. **Audit-ready regulatory output** — not chat alone.

**Sentinel delivers:** Snowflake **mart** → **desk UI** → **Cortex Agent** (Analyst + Search + STR skill) → **case workflow** → **STR filing pack** → **audit log**. Built with **CoCo CLI** on Snowflake’s AI Data Cloud.

There is **no separate “Alerts” tab**. Open alerts appear on **Command center** as **Priority queue** and inside **Cases** / **Investigations**.

**Hack2skill vocabulary (weave in, don’t read as bullets):**

| Phase | What you show |
|-------|----------------|
| **Input** | Snowflake mart, command center KPIs/queue, natural-language question |
| **Processing** | CoCo deploy + runtime Cortex Agent (Analyst SQL, Search RAG, tools) |
| **Output** | Answer + citations + SQL, STR JSON/MD, audit row |

---

## The one question (Next.js **and** CoWork)

```text
Show mule accounts with cash-outs after 2am
```

**Same text** in both places. Start in **Risk copilot**; switch to **CoWork** while Next.js is thinking; return to show both answers.

---

## Sidebar order (real UI)

Click these **left nav** labels in this order during the tour:

1. Command center  
2. Investigations  
3. Liquidity  
4. Credit risk  
5. Cases  
6. STR factory  
7. Regulations  
8. Audit log  
9. *(then)* **Risk copilot** → **CoWork tab** → **STR download** → **Audit log** (fresh row)

**Risk copilot** is intentionally **after** the tour so judges see the desk before the agent.

---

## How to read this script

- **ACTION** — exact click / scroll.  
- **SAY** — voice track (spell acronyms **once** on first use).  
- **THEME** — optional rubric line (weave in).

---

# PART A — One-pager (~40 seconds) · **INPUT (context)**

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

# PART B — Product tour (~2½ minutes) · **INPUT (live mart)**

~20–35 seconds per screen. Keep moving.

### B1 · Command center

**ACTION** Click **Command center** (`/`).

**ACTION** Point at green **Snowflake** pill (top right) and **Mart source banner** (Snowflake · SENTINEL.RISK).

**SAY**

> “**Command center** is the morning view. KPIs are **not** hard-coded — they’re **SQL over our Snowflake mart**: open alert counts, flagged transaction volume, **LCR** (**Liquidity Coverage Ratio**), and largest **credit exposure** share.”

**ACTION** Scroll: four **KPI cards** → **Treasury watch** → **Priority queue** (alert worklist) → **Ask Sentinel** examples → charts → **Open cases** grid.

**SAY**

> “**Priority queue** is where analysts see **open alerts** — no separate Alerts menu. **Open cases** link into investigations. Everything feeds schema **SENTINEL.RISK** we built with **CoCo**.”

**THEME** Fraud and liquidity signals in one pane.

---

### B2 · Investigations

**ACTION** Click **Investigations**.

**SAY**

> “**Investigations** is the flagship desk — **CASE-1088** — linking **alerts**, a **transaction timeline**, **network view**, and **call evidence**.”

**ACTION** Stat cards → scroll timeline → one **call evidence** card → point **Open full case file →** (don’t follow yet).

**SAY**

> “Structured payments plus **unstructured** RM calls — both in Snowflake, both searchable by the agent.”

**THEME** Structured + unstructured intelligence.

---

### B3 · Liquidity

**ACTION** Click **Liquidity**.

**SAY**

> “**Liquidity** is treasury risk: **LCR**, **NSFR** (**Net Stable Funding Ratio**), wholesale **runoff**, history charts — same mart, different lens.”

**ACTION** Three metrics + one chart (~10 s if editing for time).

**THEME** Prudential risk alongside fraud.

---

### B4 · Credit risk

**ACTION** Click **Credit risk**.

**SAY**

> “**Credit risk** shows **concentration** — sector shape, **NPA** signal, names like **Golden Peak**. Large-exposure copilot questions use this book.”

**ACTION** CRE share / Top 20 / sector bars (~10 s if short on time).

---

### B5 · Cases

**ACTION** Click **Cases** → open **CASE-1088**.

**SAY**

> “**Cases** is the system of record. A **case file** binds customers, transactions, alerts, and calls — what auditors expect, not a chat thread.”

**ACTION** Scroll case file once → back to nav.

---

### B6 · STR factory

**ACTION** Click **STR factory** → **CASE-1088** in dropdown → scroll preview.

**SAY**

> “Theme 1’s **regulatory output**. An **STR** is the formal package for **FIU-IND** — subjects, transactions, grounds of suspicion, cited clauses.”

**SAY**

> “We generate **JSON** and **Markdown** from the mart — **audit-ready**, not a chat screenshot. We’ll **download** after the copilot run.”

**THEME** Audit-ready regulatory output.

---

### B7 · Regulations

**ACTION** Click **Regulations** → scroll one card (ID, title, excerpt).

**SAY**

> “**Regulatory corpus** — **DOC-PMLA-12**, **DOC-RBI-KYC-54**, **DOC-FIU-STR**, and more. The copilot cites these via **Cortex Search** — **RAG**, **retrieval-augmented generation**: search first, then answer.”

---

### B8 · Audit log

**ACTION** Click **Audit log** → expand one existing row (~5 s).

**SAY**

> “**Audit log** stores turns in **`COPILOT_AUDIT`** when live — question, answer, tools, **SQL**, citations. We’ll add a fresh row when we ask the copilot.”

**THEME** Governance / completeness.

---

# PART C — CoCo CLI · how we built it (~45–70 seconds) · **PROCESSING (build time)**

**CoCo is not in the web UI** — show terminal + repo files (record as its own clip; cut into tour if needed).

**ACTION — Terminal**

```bash
cd /path/to/Codeanigans
export PATH="$HOME/.local/bin:$PATH"
cortex --version
```

**Either** run `./scripts/deploy-cortex.sh` **or** show:

```bash
grep -n "cortex agent-studio" scripts/deploy-cortex.sh
```

**ACTION — Editor (~5 s each)**

1. `coco/PROMPTS.md` (agent + str-factory sections)  
2. `cortex_project/SENTINEL_COPILOT.agent.yaml` (agent name)  
3. `coco/skills/str-factory/SKILL.md`  
4. `output/CASE-1088-STR.json` (subjects / transactions)

**SAY**

> “This is **CoCo CLI** — Snowflake **Cortex Code**. We used **CoCo** to create the mart, search indexes, semantic view, and **Cortex Agent**.
>
> **Processing** at build time: prompts in **coco/PROMPTS.md**, deploy via **cortex agent-studio** in **deploy-cortex.sh**.
>
> **Three modular capabilities:** **one**, **Cortex Analyst** — governed **SQL** on a semantic model; **two**, **Cortex Search** — **RAG** on regulations and RM call transcripts; **three**, **str-factory** **skill** — **STR** packs for **FIU-IND**.
>
> **Output** of that build is **`SENTINEL.RISK.SENTINEL_AGENT`** — what the desk and **CoWork** call at runtime.”

---

# PART D — Risk copilot (~1–1½ min + wait) · **INPUT + PROCESSING (runtime)**

**ACTION** Click **Risk copilot**. Confirm **Cortex Agent** badge (not offline).

**SAY**

> “The app calls **`SENTINEL.RISK.SENTINEL_AGENT`**. It chooses tools: **Cortex Analyst** on our **semantic view** and **Cortex Search** on calls and regulations — not a generic LLM on raw tables.”

**ACTION** Submit:

```text
Show mule accounts with cash-outs after 2am
```

**SAY** (while loading)

> “Same **input** I’ll send in **CoWork** — Snowflake’s in-account agent UI.”

---

# PART E — CoWork (~1 min + wait) · **PROCESSING (same agent)**

**ACTION** Tab to **CoWork** / **Snowflake Intelligence** → agent **`SENTINEL.RISK.SENTINEL_AGENT`**.

**ACTION** Paste **same prompt** → send.

**SAY**

> “Same agent FQN, same account. **CoCo** deployed schema, search services, semantic layer, and agent YAML.”

**ACTION** Return to **Risk copilot** when the Next.js answer is ready.

---

# PART F — Show both answers (~1 minute) · **OUTPUT (grounded answer)**

**ACTION** On `/copilot`, point in order:

1. **Cortex Agent** badge  
2. **Tool chips** (Analyst / Regulatory Search / Call Search)  
3. **Confidence**  
4. Answer — facts vs cautious wording  
5. **Citation** IDs (e.g. **DOC-RBI-AML-MULE**)  
6. Expand **Generated Cortex Analyst SQL**  
7. **CASE-1088** link if shown  

**SAY**

> “**Grounding**: tools before narrative. **SQL** for model risk. Citations tie to **Regulations**. That’s **AML** work the **MLRO** can defend.”

**ACTION** CoWork tab — completed answer briefly.

**SAY**

> “Desk and **CoWork** — one governance model, two surfaces.”

---

# PART G — Close the loop (~45 seconds) · **OUTPUT (filing + audit)**

**ACTION** **STR factory** → **CASE-1088** → **Download JSON** (and **Markdown** if time).

**SAY**

> “From investigation to **filing pack** — same story as **`output/CASE-1088-STR.json`** in the repo.”

**ACTION** **Audit log** → expand row for your copilot question.

**SAY**

> “**Theme 1** end to end: **input** from Snowflake; **processing** via **CoCo**-built **Cortex Agent**; **output** — grounded answer, **STR**, and **audit** trail. **Sentinel** by **Codeanigans** — GitHub **anshulbanwala/Codeanigans**. Synthetic data only. Thank you.”

---

## Rubric map (for you — don’t read aloud)

| Criterion | Where you showed it |
|-----------|---------------------|
| Real-world relevance 30% | NBFC, MLRO, FIU STR, RBI/PMLA IDs, liquidity + credit + fraud |
| Technical execution 40% | Mart, Cortex Agent, Analyst SQL, Search RAG, CoCo, CoWork, str-factory |
| Completeness 30% | All nav areas, case file, STR download, audit, optional abstain |

**Optional CoWork abstain** (+15 s): `What is the crypto mining tax rule 2030?` — must refuse (certified).

---

## Acronym cheat sheet

| First time say | After |
|----------------|-------|
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

- [ ] ONE_PAGER — problem + solution (or equivalent in Part A)  
- [ ] All **8** tour nav items before copilot (Command center → Audit log)  
- [ ] **Priority queue** = alerts (no Alerts tab)  
- [ ] KPIs from **Snowflake mart**  
- [ ] **Part C** — CoCo (`PROMPTS.md`, deploy script, agent YAML, skill, STR JSON)  
- [ ] Same prompt on **Risk copilot** and **CoWork**  
- [ ] Tools, SQL, citations shown  
- [ ] STR **download** + **audit** row after copilot  
- [ ] Say **Input / Processing / Output** at least once each  
- [ ] Final length **≤ 5:00** after edit  

---

## If you run long

1. Shorten **Liquidity** and **Credit risk** to ~10 s each.  
2. Skip PDF open — start on Command center with Part A **SAY** condensed.  
3. **Part C** — IDE only (no live deploy): `PROMPTS.md` + `deploy-cortex.sh` grep + YAML + skill + JSON.  
4. Cut spinner waits to ~3 s in edit.  
5. Drop optional abstain.

**Never cut:** Command center queue, **Cases/1088**, **STR**, **CoCo proof**, copilot **SQL + citations**, **CoWork** same prompt, **audit** row.

---

## Hack2skill form reminder

- Repo: https://github.com/anshulbanwala/Codeanigans  
- **1-pager PDF** from `docs/ONE_PAGER.md`  
- **Video** unlisted link (this script, ≤ 5 min)  
- **Prototype** — Vercel (`docs/VERCEL.md`) or CoWork URL in `docs/judge-runs.md`
