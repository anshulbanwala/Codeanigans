# Sentinel — award demo script (3–5 min)

**Team:** Codeanigans (Anshul + **mycowdeveloper**)  
**Record:** 1080p, unlisted YouTube/Vimeo · Warm warehouse first (`docs/demo-warmup.md`)

Speak calmly; show **Snowflake banner** and **Cortex Agent** on copilot answers.

---

## 0:00–0:20 — Hook

**[Screen: title or command center loading]**

> “Indian NBFCs fight fraud and file suspicious activity reports to FIU-IND—but analysts still jump between Excel, case tools, and PDF circulars. **Sentinel** is one desk on Snowflake: ask in English, get cited evidence, download the STR pack, and audit every answer.”

---

## 0:20–0:45 — Command center

**[Screen: `/` — KPIs, alert list, Snowflake data source visible]**

> “This is **Aarohan Finance**—synthetic data only. Live mart on **`SENTINEL.RISK`**: thousands of transactions, open alerts, liquidity, and credit concentration. Two critical items: a mule typology and a structuring case.”

**Click:** one alert → optional peek at cases list.

---

## 0:45–1:35 — Copilot #1 (fraud)

**[Screen: `/copilot`]**

**Type:** `Show mule accounts with cash-outs after 2am`

**Pause** for tools/SQL chips to appear.

> “The **Cortex Agent** routes to analytics and regulation search—not a black box. Here’s late-night cash-out patterning, grounded SQL, and **RBI mule guidance** with document IDs. Facts separated from interpretation.”

**Point at:** citation / `DOC-RBI-AML-MULE` if visible.

---

## 1:35–2:15 — Copilot #2 (regulatory + risk)

**Type:** `Is Rahul Mehta structuring under the ₹10L CTR?`  
*(or if slow, use: `How tight is our LCR and wholesale runoff?`)*

> “Same agent handles **PMLA cash reporting** and **balance-sheet risk**—structured data plus the policy corpus. That’s the GCC story: governed AI on enterprise data.”

---

## 2:15–2:45 — Investigation

**[Screen: `/cases` → CASE-1088]**

> “**CASE-1088**: mule ring narrative—customers, timeline, RM **call transcript**. This is where unstructured search and cases meet.”

**Optional:** one line from transcript on screen.

---

## 2:45–3:15 — Regulatory deliverable (money shot)

**[Screen: `/str?caseId=CASE-1088` → Download JSON or Markdown]**

> “Theme one isn’t only chat—it’s **audit-ready output**. Sentinel generates an **FIU-style STR pack**: transactions, narrative, regulatory hooks—downloadable JSON and Markdown from the same Snowflake mart.”

**[Optional flash:** `output/CASE-1088-STR.json` in repo.]

---

## 3:15–3:35 — Governance

**[Screen: `/audit` — expand latest row]**

> “Every question is logged: answer text, SQL, tools, citations. MLRO and internal audit can **replay** what the copilot said—no shadow AI.”

---

## 3:35–4:15 — Snowflake + CoCo (credibility)

**[Screen: CoWork or terminal `cortex` / deploy snippet]**

> “Built with **Snowflake CoCo CLI**: semantic view, dual Cortex Search services, agent **`SENTINEL.RISK.SENTINEL_AGENT`**. Same agent in our Next.js app and in **CoWork**—one stack, not a sidecar.”

**[CoWork:** one short prompt if live; else show agent FQN in Snowsight.]

---

## 4:15–4:30 — Close

**[Screen: architecture slide or ONE_PAGER diagram + repo URL]**

> “**Sentinel** by **Codeanigans**—risk, fraud, and regulatory intelligence on Snowflake. Repo on GitHub; synthetic data; ready for the MLRO desk. Thank you.”

**End card:** `github.com/anshulbanwala/Codeanigans` · Theme 1 · Codeanigans

---

## Backup if live agent is slow

- Say: “Warehouse warming—here’s the certified path from our judge runs.”
- Show **`docs/judge-runs.md`** or pre-recorded copilot clip.
- STR page still works from API—always show download.

## Do not

- Invent regulations on camera (use abstain only if demonstrating governance).
- Run a 2-minute STR generation **inside** chat—use **STR factory** page.
- Hide the Snowflake/offline banner—must show **Snowflake connected**.
