# Sentinel — FINAL video script (Hack2skill upload)

**Team:** Codeanigans · **Theme 1** · **Target length:** 4:00–4:45 (edit to **≤ 5:00**)  
**Prompt (use twice — Next.js + CoWork):**

```text
Show mule accounts with cash-outs after 2am
```

**Tabs before Record:** Terminal (repo) · Sentinel app · Snowflake CoWork (`SENTINEL.RISK.SENTINEL_AGENT`)  
**Prep:** `./scripts/preflight.sh` · `docs/demo-warmup.md` · header **Snowflake live** (green)

Record **7 scenes** separately; cut spinners in edit.

---

## SCENE 1 · INPUT · Product (0:00–0:30)

**ON SCREEN:** Sentinel → **Command center** (first item in left nav).

**DO**
1. Point at green **Snowflake** pill (top right).
2. Point at **Mart source banner** (Snowflake · SENTINEL.RISK).
3. Scroll: four **KPI** cards → **Priority queue** (2–3 alert rows) → one card in **Open cases** at bottom.

**SAY**

> “Hi, we’re **Codeanigans**. This is **Sentinel** for **Theme 1** — risk, fraud, and regulatory intelligence for Indian lenders.
>
> **Input** is live data in **Snowflake** for a synthetic **NBFC**, a **Non-Banking Financial Company** called **Aarohan Finance**.
>
> Analysts start on the **command center**: KPIs from the warehouse, and the **priority queue** — that’s our open **alert** worklist. There’s no separate Alerts tab. Everything below comes from schema **SENTINEL.RISK**.”

---

## SCENE 2 · CoCo CLI · Build (0:30–1:10)

**ON SCREEN:** Terminal + editor (split or cut between them).

**DO — Terminal**
```bash
cd /path/to/Codeanigans
export PATH="$HOME/.local/bin:$PATH"
cortex --version
```
Then **either** run `./scripts/deploy-cortex.sh` **or** show:
```bash
grep -n "cortex agent-studio" scripts/deploy-cortex.sh
```

**DO — Editor (scroll ~5 seconds each)**
1. `coco/PROMPTS.md` (sections on agent + str-factory)
2. `cortex_project/SENTINEL_COPILOT.agent.yaml` (top: agent name)
3. `coco/skills/str-factory/SKILL.md`
4. `output/CASE-1088-STR.json` (scroll subjects / transactions)

**SAY**

> “This is **CoCo CLI** — Snowflake **Cortex Code**. We didn’t only build a web UI; we used **CoCo** to create the mart, search indexes, semantic view, and **Cortex Agent**.
>
> **Processing** at build time: prompts in **coco/PROMPTS.md**, deploy with **cortex agent-studio** in **deploy-cortex.sh**.
>
> Three modular capabilities: **one**, **Cortex Analyst** — governed **SQL** on a semantic model; **two**, **Cortex Search** — **RAG**, retrieval on regulations and **RM** call transcripts; **three**, our **str-factory** **skill** — it produces **STR**, **Suspicious Transaction Report**, packs for **FIU-IND**, India’s **Financial Intelligence Unit**.
>
> **Output** of that build is agent **SENTINEL.RISK.SENTINEL_AGENT** — what you’ll see next in the app and in **CoWork**.”

---

## SCENE 3 · PROCESSING · Risk copilot (1:10–2:20)

**ON SCREEN:** Sentinel → **Risk copilot**.

**DO**
1. Confirm **Cortex Agent** badge (not offline engine).
2. Paste prompt → Enter.
3. While loading: switch to CoWork tab (Scene 5) OR talk over spinner.
4. When done: point **tool chips** → **confidence** → answer → **citation** IDs → expand **Generated Cortex Analyst SQL** → **CASE-1088** link if shown.

**SAY** (before submit)

> “**Runtime processing:** one natural-language **input**.”

**SAY** (after answer)

> “The **Cortex Agent** chose tools — **Analyst** for mart **SQL**, **Search** for policy and calls. Citations like **DOC-RBI-AML-MULE** are indexed regulatory chunks, not invented text. That’s grounded **AML**, **Anti–Money Laundering**, analysis for the **MLRO**, the **Money Laundering Reporting Officer**.”

---

## SCENE 4 · OUTPUT · STR factory (2:20–2:50)

**ON SCREEN:** **STR factory** → dropdown **CASE-1088** → scroll preview → **Download JSON**.

**SAY**

> “Theme 1 also needs **audit-ready regulatory output**. An **STR** is the formal report when the bank forms suspicion — subjects, transactions, grounds, cited **RBI** and **PMLA** clauses.
>
> **Output:** filing pack **JSON** and **Markdown** from the same mart — not a chat screenshot. This matches our **str-factory** skill output in the repo.”

---

## SCENE 5 · Product · Case evidence (2:50–3:10)

**ON SCREEN:** **Investigations** *or* **Cases** → **CASE-1088** → scroll one **call evidence** block.

**SAY**

> “Structured transactions plus **unstructured** relationship-manager calls — both in Snowflake, both searchable by the agent.”

---

## SCENE 6 · PROCESSING · CoWork (3:10–3:50)

**ON SCREEN:** Snowflake **CoWork** / **Snowflake Intelligence** → agent **SENTINEL.RISK.SENTINEL_AGENT**.

**DO:** Paste **same prompt** → send → show completed answer.

**SAY**

> “Same **input**, same agent on Snowflake — **CoWork** for GCC teams who live in the Snowflake UI. **Processing** and **output** match our **Next.js** desk; one governance model.”

---

## SCENE 7 · OUTPUT · Audit + close (3:50–4:30)

**ON SCREEN:** **Audit log** → expand newest row (question, answer snippet, SQL).

**SAY**

> “**Output** for governance: every copilot turn in **COPILOT_AUDIT** — replay for audit and the **MLRO**.
>
> **Sentinel** by **Codeanigans**: **Input** — Snowflake risk mart; **Processing** — **CoCo**-built **Cortex Agent** with **Analyst**, **Search**, and **STR** skill; **Output** — investigation, **STR** pack, and audit trail. Theme 1, synthetic data only. GitHub: **anshulbanwala/Codeanigans**. Thank you.”

---

## After editing

| Hack2skill ask | Your video |
|----------------|------------|
| 3–5 minutes | Scenes 1–7 ≈ 4–4½ min |
| CoCo CLI | Scene 2 |
| Input → Processing → Output | Say those words in Scenes 1, 2–3–6, 4–7 |
| One full workflow | Command center → copilot → case → STR → audit + CoWork |
| 2–3 modular capabilities | Analyst, Search, str-factory (Scene 2 + 4) |

**Upload:** unlisted link + Hack2skill form (repo, ONE_PAGER PDF, prototype URL).

---

## Emergency shortcuts

- **No terminal:** Scene 2 = IDE only (`PROMPTS.md` + `deploy-cortex.sh` + agent YAML + skill + JSON).
- **Copilot slow:** Voiceover Scene 2 while waiting; cut wait to 3 s.
- **Skip Scene 5** if over 5:00 — keep Scenes 2, 3, 4, 6, 7.
