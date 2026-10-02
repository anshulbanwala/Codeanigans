# Sentinel — FINAL video script (full story, end-to-end)

**Team:** Codeanigans · Snowflake CoCo (Cortex Code) CLI (Command-Line Interface) Hackathon 2026, GCC (Gulf Cooperation Council) Edition · **Theme 1**  
**Record from:** your **one-pager PDF** (same story as `docs/ONE_PAGER.md` — problem, solution, business impact) **then** live Sentinel.

| | |
|--|--|
| **Raw record** | ~6–7 min |
| **Submit** | Edit to **≤ 5:00** (trim Liquidity/Credit; cut waits) |
| **Certified** | `docs/judge-runs.md` — **7/7** Next.js + CoWork |

| Prep | |
|------|--|
| Slide/PDF | One-pager: **The problem** → **What Sentinel is** → **Why Sentinel is built to win real desks** |
| App | http://127.0.0.1:43127 or Vercel · **Snowflake live** (green pill) |
| CoWork | `SENTINEL.RISK.SENTINEL_AGENT` — `docs/judge-runs.md` |
| Tabs | PDF · Sentinel · Terminal · CoWork |
| Warmup | `docs/demo-warmup.md` · `./scripts/preflight.sh` |

---

## Story spine (match the one-pager — say this in order)

| One-pager section | What it means on video |
|-------------------|-------------------------|
| **The problem (challenge)** | Compliance teams juggle spreadsheets, case tools, email, and regulator portals; generic chat is not enough. |
| **What Sentinel is (solution)** | One desk on Snowflake: ask in plain English, get **grounded** answers, **filing-ready STR (Suspicious Transaction Report) packs**, **audit replay**, honest **refusal** when data does not support an answer. |
| **Business impact** | Sell outcomes: less tab-switching, faster investigations, filing packs you can defend, audit you can replay — one Snowflake agent for desk + CoWork. |

**Hack2skill (light touch):** **Input** = mart + question · **Processing** = CoCo (Cortex Code) build + Cortex Agent tools · **Output** = answer + STR (Suspicious Transaction Report) + audit.

**UI (User Interface) note:** There is **no Alerts tab** — open work is **Priority queue** on Command center and in Cases.

---

## The one demo question (Next.js and CoWork)

```text
Show mule accounts with cash-outs after 2am
```

Same words in **Risk copilot** and **CoWork**. Start copilot first; open CoWork while it runs.

---

## Tour order (after Part A)

1. Command center → 2. Investigations → 3. Liquidity → 4. Credit risk → 5. Cases → 6. STR (Suspicious Transaction Report) factory → 7. Regulations → 8. Audit log  
9. **Risk copilot** → **CoWork** → **STR (Suspicious Transaction Report) download** → **Audit log** (new row)

**How to read**

| Label | Meaning |
|-------|---------|
| **ACTION** | What to click or scroll |
| **SAY (oral)** | Speak this out loud — conversational, like training a new analyst on a screen share |
| **COMPONENTS** | UI (User Interface) pieces on this screen; name them as you point (don’t skip) |
| **ONE-PAGER** | Tie-back to the slide (optional — don’t read table rows aloud) |
| **IMPACT (oral)** | Why a real bank cares — human, outcome-focused (use these instead of bullet lists) |

**Narration style:** Use “you’d see…”, “this is where…”, “think of this as…”. Pause half a second when you name a component. You do **not** need to sound like a spec document — explain **what it is** and **why the desk cares**.

**Business impact style:** Talk like you’re convincing a skeptical MLRO (Money Laundering Reporting Officer), not reading a slide. Focus on **time saved**, **risk reduced**, **filings you can defend**, and **audit you can replay**. Never say “feature one, feature two.”

**Abbreviations:** Full form in brackets after each abbrev. in this script (e.g. **STR (Suspicious Transaction Report)**). On first mention in each part, say the short form then the words in brackets once; then short form is fine.

---

# PART A — One-pager (~60–90 seconds) · Challenge → Solution → Impact

**ACTION** Full screen on one-pager PDF. Scroll in **three beats** — pause on each heading.

### A1 · The problem (challenge)

**ACTION** Stop on **The problem**.

**SAY**

> “We’re **Codeanigans**. **Theme 1** is risk, fraud, and regulatory intelligence for Indian lenders.
>
> **The challenge:** **AML (Anti–Money Laundering)** and compliance teams still work across **spreadsheets, case tools, email, and regulator portals**. Analysts lose hours stitching **transaction patterns**, **relationship-manager notes**, and **regulator guidance** — then rebuilding the same story for **suspicious activity reports** and internal audit.
>
> **Generic chatbots are not acceptable** on a real desk. Answers must be **grounded**, **cited**, and **replayable**.”

### A2 · What Sentinel is (solution)

**ACTION** Scroll to **What Sentinel is** — read the bullet list visually (don’t read every bullet; hit the five ideas).

**SAY**

> “**Sentinel** is the copilot for the compliance officer’s desk at **Aarohan Finance** — our synthetic demo NBFC (Non-Banking Financial Company).
>
> **The solution in one sentence:** analysts ask in plain English; Sentinel **surfaces** fraud, liquidity, and credit signals from governed data; **grounds** every answer in database evidence or cited policy excerpts; **produces** download-ready **FIU (Financial Intelligence Unit)-style suspicious transaction report packs**; **records** who asked what in an **audit log**; and **refuses to guess** when the corpus cannot support an answer.
>
> It’s built on **Snowflake’s AI Data Cloud** with the **CoCo (Cortex Code) CLI (Command-Line Interface)** — mart, search on calls and circulars, semantic analytics, and a **Cortex Agent** that orchestrates tools. **Not** a chat box bolted onto a spreadsheet.”

### A3 · Business impact · *Why a desk would actually adopt this*

**ACTION** Scroll to **Why Sentinel is built to win real desks**. **Glance** at the table while you talk — do **not** read row titles like a list. Optional: point once at “regulatory output” and once at “full investigation loop.”

**SAY (oral)**

> “Okay — why does this matter beyond a hackathon demo? Imagine your compliance lead on a Monday morning.
>
> They’re not opening six tools before coffee. They land on **one command center**, see what surfaced overnight — alerts, liquidity, concentration — and the work is already **ranked** in a queue. That’s not a nicer dashboard; that’s hours you get back before anyone writes a narrative.
>
> When an analyst asks a question in plain English, they’re not betting the farm on a generic chatbot. The **same agent** can pull hard numbers from the warehouse — payments, alerts, exposures — **and** the soft stuff: what the relationship manager said on a call, what the RBI (Reserve Bank of India) circular actually states. So the story to the MLRO (Money Laundering Reporting Officer) isn’t duct-taped from email and Excel; it’s **one thread**, with evidence you can point to.
>
> And when suspicion is real, the business doesn’t stop at a clever paragraph. You need a **filing pack** — our **STR (Suspicious Transaction Report) factory** builds JSON (JavaScript Object Notation) for systems and Markdown for humans, tied to a **real case ID**, not a screenshot of chat. That’s the step teams still rebuild manually in Word the night before a deadline.
>
> Every copilot turn can land in an **audit log** — who asked, what ran, which SQL (Structured Query Language), which policy IDs. So when internal audit or the board asks *how* AI influenced a decision, you’re not embarrassed. And when the question is out of scope, Sentinel is designed to **say no** instead of inventing law — that’s how you keep trust on a regulated desk.
>
> We deployed it the way a bank would want: **one agent** in Snowflake, same brain in our desk UI (User Interface) and in **CoWork**, reproducible scripts for the team. What you’ll see next is that Monday-morning story end to end — **synthetic data**, but the **workflow** is real.”

**ACTION** Close PDF. Open Sentinel — left nav visible.

**SAY (oral)** (transition)

> “So that’s the story on paper. Now I’ll open the actual desk — same product — and I’ll call out what each part of the UI (User Interface) is for as we go. Then we’ll peek at CoCo (Cortex Code) in the repo, run one real question in the copilot and in CoWork, and close with a filing pack and the audit trail.”

---

# PART B — Product tour (~2½–3 min) · Prove every promise on the one-pager

Keep ~25–40 seconds per screen unless you’re cutting for time. Each stop answers: *“We said X on the slide — here it is.”*

### B1 · Command center · *Monitor the desk*

**ACTION**
1. Click **Command center** (first nav item).
2. Point **Snowflake live** pill (top right) — proves this is not a mock UI (User Interface).
3. Point **Mart source** banner (`Snowflake · SENTINEL.RISK`).
4. Scroll slowly: four **KPI (Key Performance Indicator) cards** (open alerts, flagged flow, liquidity ratio, largest exposure).
5. **Treasury watch** / liquidity pulse strip.
6. **Priority queue** — pause on 2–3 rows (alert ID, score, title, status).
7. Glance **Ask Sentinel** example questions on the right.
8. **Channel mix** / network charts — one second each.
9. **Open cases** grid at bottom — point **CASE-1088** if visible.

**COMPONENTS** (name as you point)

| On screen | Say naturally |
|-----------|----------------|
| **Left sidebar** | “This is the whole product in one nav — command center through audit.” |
| **Snowflake live** pill | “Green means we’re hitting live Snowflake, not a fake offline demo.” |
| **Mart source** banner | “Everything here reads from our risk mart — schema SENTINEL dot RISK.” |
| **KPI (Key Performance Indicator) cards** (×4) | “Four headline numbers the MLRO (Money Laundering Reporting Officer) checks first — open alerts, flagged payment volume, liquidity coverage, biggest credit name.” |
| **Treasury watch** strip | “Quick liquidity pulse — treasury and compliance both glance at this.” |
| **Priority queue** table | “This *is* the alert inbox — we didn’t hide alerts in another tab.” |
| **Ask Sentinel** card | “Suggested questions — same engine as the copilot screen.” |
| **Channel mix / network** charts | “How money moves — useful context when a mule pattern shows up.” |
| **Open cases** grid | “Investigations ready to open — case 1088 is our mule storyline today.” |

**SAY (oral)**

> “Okay, **Command center** — think of this as the morning stand-up screen. On the slide we said analysts are stuck jumping between spreadsheets and tools; this is meant to be the opposite: one place to see if anything is on fire.
>
> Top right, that **Snowflake live** pill — if it’s green, you’re looking at real warehouse data, not props in the UI (User Interface). Under the title, the **mart source** line tells you which Snowflake schema feeds the page.
>
> These four **KPI (Key Performance Indicator) cards** — each one is a SQL (Structured Query Language) query over the mart. Open alerts, how much flow got flagged, how liquid we are, and who our largest exposure is. Nobody typed these numbers into React; they came from the warehouse this morning.
>
> Scroll down — **Treasury watch** is the liquidity heartbeat. Then the **priority queue** — this is important: there is no ‘Alerts’ menu item. Open alerts *live here*. Each row is an alert ID, a score, a title, a status — what an analyst would sort before picking up the phone.
>
> On the side, **Ask Sentinel** is a teaser for the copilot — example questions you can ask in plain English. The charts — **channel mix**, **network** — give pattern context. And at the bottom, **open cases** — if you need to go deep, you click into a case file from here. Case 1088 is the one we’ll follow through the demo.”

**IMPACT (oral)**

> “For the business, that’s fewer ‘swivel-chair’ minutes every morning — fraud, treasury, and credit in **one honest picture** before anyone exports a spreadsheet.”

**THEME** Theme 1 relevance — fraud **and** prudential risk in one pane.

---

### B2 · Investigations · *Work case files with full context*

**ACTION**
1. Click **Investigations**.
2. Point three stat cards: active case, alerts linked, call artifacts.
3. Scroll **transaction timeline** — a few high-risk payments.
4. Open one **call evidence** card — RM (Relationship Manager) quote / summary.
5. Point **network** or entity view if on screen.
6. Point **Open full case file →** (top right) — do **not** click yet.

**COMPONENTS**

| On screen | Say naturally |
|-----------|----------------|
| **Investigations** nav item | “A focused war room for one hot case, not the full case catalog.” |
| **Stat cards** (×3) | “Active case ID, how many alerts tied in, how many call recordings we indexed.” |
| **Transaction timeline** | “Payments in time order — when you’re looking for after-hours cash-outs, this is where you’d eyeball it.” |
| **Call evidence** cards | “RM (Relationship Manager) call snippets — unstructured notes, but stored in Snowflake and searchable.” |
| **Network / entity view** | “Who’s connected to whom — mule rings aren’t one account in isolation.” |
| **Open full case file →** | “Jumps to the formal case record — we’ll open that on the Cases screen too.” |

**SAY (oral)**

> “Next, **Investigations**. On the one-pager we said people waste hours stitching payments and RM (Relationship Manager) notes together. This page is that stitch, already done, for case **1088** — our synthetic mule-ring story.
>
> The three **stat cards** at the top tell you what you’re looking at: which case is active, how many alerts feed it, how many call artifacts we have.
>
> The **timeline** is the structured story — transactions laid out so you can see timing, amounts, channels. Scroll to a **call evidence** card — that’s the unstructured side: what the relationship manager actually said, pulled from transcripts in the mart, not from someone’s inbox.
>
> If there’s a **network** view on screen, that’s the ‘who else is involved’ lens. And **open full case file** takes you to the official record — customers, transactions, alerts, calls in one dossier. When we ask the copilot about mule cash-outs after 2 a.m., it’s this same world the agent is allowed to query.”

**IMPACT (oral)**

> “This is what ‘one agent, two worlds’ feels like for an investigator — payments **and** call notes in one place, so you’re not rebuilding the story at 8 p.m. because someone forgot to forward a transcript.”

**THEME** Unstructured evidence on Snowflake, not in email attachments.

---

### B3 · Liquidity · *Treasury and compliance together*

**ACTION**
1. Click **Liquidity**.
2. Point the three headline metrics (coverage ratio, stable funding, wholesale runoff).
3. One history chart — trend line.
4. Optional: hover **Ask Sentinel about liquidity →** (don’t run yet).

**COMPONENTS**

| On screen | Say naturally |
|-----------|----------------|
| **Liquidity** page | “Treasury risk view — same Snowflake mart, different questions than fraud.” |
| **Headline metrics** (×3) | “Coverage ratio, stable funding, wholesale runoff — the usual treasury stress trio.” |
| **History chart** | “Trend over time — ‘are we getting tighter week on week?’” |
| **Ask Sentinel about liquidity →** | “Shortcut to the copilot with a liquidity-flavored prompt.” |

**SAY (oral)**

> “**Liquidity** — I want to show this because Theme 1 isn’t ‘fraud bot only.’ Real NBFC (Non-Banking Financial Company) desks care about treasury stress and compliance in the same week.
>
> These three **headline numbers** are the kind of thing ALCO (Asset–Liability Committee) reviews — how covered you are, how stable your funding is, whether wholesale money is running off. The **chart** is the history — so you’re not looking at a single snapshot in a vacuum.
>
> Same data platform as the command center; we just changed the lens. And if an analyst wonders ‘how tight are we?’, they don’t open a separate tool — they can use **Ask Sentinel** or the copilot, and the answer comes from this governed history, with policy cites when it needs to.”

**IMPACT (oral)**

> “Liquidity and AML (Anti–Money Laundering) don’t live in silos on a real desk — when funding stress and suspicious flow show up in the same week, you want **one platform**, not another login.”

**THEME** Real NBFC (Non-Banking Financial Company) desk breadth (short clip if editing for 5 min).

---

### B4 · Credit risk · *Concentration and policy exposure*

**ACTION**
1. Click **Credit risk**.
2. Point sector / CRE (Commercial Real Estate) share and **Top 20** concentration.
3. Mention **Golden Peak** or largest name on screen (~5 s).

**COMPONENTS**

| On screen | Say naturally |
|-----------|----------------|
| **Credit risk** page | “Concentration risk — who’s too big a slice of the book.” |
| **Sector / CRE (Commercial Real Estate) share** | “Where lending is clustered — real estate, infra, whatever shows on your mart.” |
| **Top 20 / bar chart** | “Names and weights — the copilot can reason about large exposures from here.” |
| **Golden Peak** (or top name) | “Our demo storyline for a name that bumps against large-exposure policy.” |

**SAY (oral)**

> “**Credit risk** is the concentration desk. Who dominates the loan book? Where would RBI (Reserve Bank of India)-style large-exposure rules matter?
>
> You’ll see **sector mix** — how much is commercial real estate, how much is elsewhere. The **top names** chart is the ‘don’t put all your eggs in one borrower’ view. In our synthetic data, **Golden Peak** is the name we use when we demo exposure-breach questions.
>
> Important for judges: when someone asks in the copilot ‘which names breach large-exposure norms,’ that’s not a hallucination — it’s wired to this same semantic layer on Snowflake, the same way the KPIs (Key Performance Indicators) on the command center are.”

**IMPACT (oral)**

> “Concentration risk isn’t a slide-deck exercise — when one borrower is too big, compliance and credit need the **same number**. Sentinel keeps that number governed, not copied from a side file.”

---

### B5 · Cases · *System of record, not a chat thread*

**ACTION**
1. Click **Cases** — scan the card grid (status, severity, summary).
2. Open **CASE-1088** (mule ring).
3. Scroll once: linked **customers**, **transactions**, **alerts**, **calls**.
4. Return via **← Cases** or nav.

**COMPONENTS**

| On screen | Say naturally |
|-----------|----------------|
| **Cases** grid | “Catalog of investigations — status, severity, one-line summary on each card.” |
| **CASE-1088** card | “Our mule-ring case — we’ll file an STR (Suspicious Transaction Report) against this ID later.” |
| **Case detail** sections | “Linked customers, transactions, alerts, calls — the evidence bundle.” |
| **← Cases** / nav | “Back out without losing your place in the demo.” |

**SAY (oral)**

> “**Cases** is the system of record. Investigations is the cinematic view; **Cases** is the filing cabinet.
>
> Each **card** is an investigation: open or closed, how hot it is, a short summary so you don’t open every file. I’m opening **case 1088** — the mule storyline you saw on Investigations.
>
> Inside the **case file**, scroll once with me: here are the **customers** tied in, the **transactions**, the **alerts** that fired, the **calls** we indexed. This is what audit wants — a durable object, not a ChatGPT thread you can’t reproduce.
>
> When the copilot answers in a minute, watch for a link back to **1088**. That’s intentional: narrative glued to evidence.”

**IMPACT (oral)**

> “A case file is what saves you in audit — it’s the object that says *this* investigation happened, with *these* facts, not a chat thread someone deleted.”

---

### B6 · STR (Suspicious Transaction Report) factory · *Regulatory output, not chat only*

**ACTION**
1. Click **STR (Suspicious Transaction Report) factory**.
2. Select **CASE-1088** in the dropdown if needed.
3. Scroll preview: **subjects**, transaction schedule, **grounds of suspicion**, **cited clauses**.
4. Point **Download JSON (JavaScript Object Notation)** / **Markdown** buttons — **do not click yet** (save for Part G).

**COMPONENTS**

| On screen | Say naturally |
|-----------|----------------|
| **STR (Suspicious Transaction Report) factory** | “Where chat becomes a filing artifact — not a screenshot.” |
| **Case dropdown** | “Pick which investigation to render — we use 1088.” |
| **Preview panel** | “Subjects, transaction schedule, grounds of suspicion, cited policy clauses.” |
| **Download JSON (JavaScript Object Notation)** | “Machine-readable pack — systems, workflows, regulators who want JSON (JavaScript Object Notation).” |
| **Download Markdown** | “Human-readable pack — MLRO (Money Laundering Reporting Officer) review, email, doc attach.” |

**SAY (oral)**

> “**STR (Suspicious Transaction Report) factory** — this is the ‘so what’ for Theme 1. A lot of demos stop at chat. We don’t.
>
> **STR (Suspicious Transaction Report)** is just the compliance term for a suspicious-transaction report you’d send toward India’s financial intelligence unit. This screen **builds that pack** from the case.
>
> Use the **dropdown** to pick case **1088**. The **preview** walks you through what a real filing needs: **who** the subjects are, **which transactions** matter, **why** you’re suspicious, and **which policy clauses** you’re leaning on — RBI (Reserve Bank of India), PMLA (Prevention of Money Laundering Act), FIU (Financial Intelligence Unit) timing, that kind of thing, from our indexed corpus.
>
> Two **download** buttons: **JSON (JavaScript Object Notation)** for systems and automation, **Markdown** for humans. Both are generated from the mart — same truth as the case file. I’ll click download after we run the copilot so you see the full loop.”

**IMPACT (oral)**

> “This is the difference between ‘we tried AI’ and ‘we can **file**.’ The MLRO (Money Laundering Reporting Officer) gets a pack they can review and sign off — not a chat export you’re ashamed to attach to an email.”

**THEME** Hack2skill **Output** — filing artifact, not LLM (Large Language Model) prose alone.

---

### B7 · Regulations · *Corpus the copilot must cite*

**ACTION**
1. Click **Regulations**.
2. Scroll one full card: document **ID**, title, excerpt (e.g. PMLA (Prevention of Money Laundering Act) or RBI (Reserve Bank of India) KYC (Know Your Customer)).
3. Point that IDs match what appears as **citation chips** in the copilot.

**COMPONENTS**

| On screen | Say naturally |
|-----------|----------------|
| **Regulations** index | “Library of policy chunks the agent is allowed to quote.” |
| **Document card** | “ID, title, excerpt — like a footnote you can open.” |
| **DOC-… IDs** | “Same IDs you’ll see as citation chips in the copilot.” |

**SAY (oral)**

> “**Regulations** — think of this as the copilot’s law library, not the open internet.
>
> Each **card** is a chunk we indexed: a document ID, a title, a short **excerpt**. PMLA (Prevention of Money Laundering Act) sections, RBI (Reserve Bank of India) KYC (Know Your Customer) circulars, FIU (Financial Intelligence Unit) filing guidance — demo corpus, but structured like production.
>
> When the agent answers ‘what does policy say about mules,’ it’s supposed to **search here first**, then talk. So when you see a chip like **DOC-RBI-AML-MULE** (document ID — RBI (Reserve Bank of India), AML (Anti–Money Laundering)) in the copilot, you can come back to this screen and sanity-check: did we invent that, or is it in the index? That’s the difference between a toy chatbot and something a compliance officer might trust.”

**IMPACT (oral)**

> “Regulators and boards don’t accept ‘the model said so.’ They accept **show me the circular**. This index is how Sentinel earns that conversation.”

---

### B8 · Audit log · *Replayable governance*

**ACTION**
1. Click **Audit log**.
2. Expand one **existing** row — show question snippet, tools, SQL (Structured Query Language) fold, citations.
3. Collapse — leave page ready to return after copilot.

**COMPONENTS**

| On screen | Say naturally |
|-----------|----------------|
| **Audit log** | “Flight recorder for every copilot turn.” |
| **Collapsed row** | “Question, timestamp, who asked — summary line.” |
| **Expanded row** | “Full answer, which tools ran, SQL (Structured Query Language), citation list.” |

**SAY (oral)**

> “Last stop before the copilot: **Audit log**. On the slide we said answers must be **replayable**. This is that.
>
> Each **row** is one question someone asked the agent. Click to **expand** — you get the answer text, which **tools** fired, the **SQL (Structured Query Language)** if Analyst ran, and the **citations** it used. Under the hood that’s stored in Snowflake table **COPILOT_AUDIT** when we’re live.
>
> Right now you’re seeing history; after I ask the mule question, a **new row** should appear. That’s what you’d show internal audit or model risk — not ‘trust me, the model said so.’”

**IMPACT (oral)**

> “Model risk and internal audit stop being blockers when every answer is **replayable** — same question, same tools, same SQL (Structured Query Language), same citations, months later.”

**SAY (oral)** (bridge to Part C)

> “So that’s the whole desk — command center, investigations, liquidity, credit, cases, STR (Suspicious Transaction Report) factory, regulations, audit. Every piece maps to something on the one-pager. Next I’ll show how we **built** the brains on Snowflake with CoCo (Cortex Code), then we’ll **run** one question end to end.”

---

# PART C — CoCo (Cortex Code) CLI (Command-Line Interface) (~60–90 s) · **Processing** — build time matches the architecture slide

**CoCo (Cortex Code) does not appear in the web UI (User Interface).** Judges need this clip. Record terminal + editor; cut in after B8 or voiceover during copilot load.

### C1 · Terminal — reproducible deploy

**ACTION**

```bash
cd /path/to/Codeanigans
export PATH="$HOME/.local/bin:$PATH"
cortex --version
```

**Either** run (short): `./scripts/deploy-cortex.sh`  
**Or** show intent without full run:

```bash
grep -n "cortex agent-studio" scripts/deploy-cortex.sh
head -20 scripts/deploy-cortex.sh
```

**COMPONENTS**

| Piece | Say naturally |
|-------|----------------|
| **`cortex --version`** | “CoCo (Cortex Code) CLI (Command-Line Interface) is installed — Snowflake’s Cortex Code command line.” |
| **`deploy-cortex.sh`** | “One script the team can rerun — mart, search, agent, same every time.” |
| **Agent FQN (Fully Qualified Name)** | “SENTINEL dot RISK dot SENTINEL_AGENT — the name every UI (User Interface) calls.” |

**SAY (oral)**

> “Quick detour — none of this is visible in the pretty UI (User Interface), but judges need to see **CoCo (Cortex Code)**.
>
> In the terminal, **`cortex --version`** just proves we’re on Snowflake’s Cortex Code CLI. The **`deploy-cortex.sh`** script is how we ship: tables, search indexes, semantic view, agent — same path for every developer on the team.
>
> If you look at the one-pager architecture diagram, it’s analyst → our Next desk → this agent → three tools → STR (Suspicious Transaction Report) skill → audit table. CoCo (Cortex Code) is how that diagram became real objects in the account, all named under **SENTINEL.RISK**.”

### C2 · Repo artifacts — three modular capabilities

**ACTION** In the editor, ~5–8 seconds each — scroll so titles are readable:

| File | What to point at |
|------|------------------|
| `coco/PROMPTS.md` | Agent + str-factory prompt sections |
| `cortex_project/SENTINEL_COPILOT.agent.yaml` | Agent name / tool wiring |
| `coco/skills/str-factory/SKILL.md` | STR pack skill |
| `output/CASE-1088-STR.json` | Subjects + transaction blocks (same as UI (User Interface) download) |

**COMPONENTS**

| File | Say naturally |
|------|----------------|
| **`coco/PROMPTS.md`** | “The prompts we used with CoCo (Cortex Code) to stand up the agent and the STR (Suspicious Transaction Report) skill.” |
| **`SENTINEL_COPILOT.agent.yaml`** | “Agent config — which tools it’s allowed to call.” |
| **`str-factory/SKILL.md`** | “Custom skill — turns a case into a filing pack.” |
| **`CASE-1088-STR.json`** | “Proof output — same shape as the STR (Suspicious Transaction Report) factory download.” |

**SAY (oral)**

> “In the repo, four files tell the build story.
>
> **`PROMPTS.md`** — that’s our CoCo (Cortex Code) conversation history, basically: how we asked Snowflake to create the mart, search, and agent.
>
> **`SENTINEL_COPILOT.agent.yaml`** — wiring diagram in YAML (YAML Ain’t Markup Language): this agent can call Analyst, can call call-search, can call regulation-search.
>
> **`str-factory` skill** — the filing pack generator we mirrored in the **STR (Suspicious Transaction Report) factory** UI (User Interface).
>
> And **`CASE-1088-STR.json`** in output — if you’re a judge at midnight, you can diff this against what we download live.
>
> Hack2skill wants modular capabilities — **one**, Analyst for SQL (Structured Query Language) on the semantic model; **two**, Search for calls and circulars; **three**, the STR (Suspicious Transaction Report) skill. One agent orchestrates all three: **SENTINEL.RISK.SENTINEL_AGENT**.”

**ONE-PAGER** Architecture diagram + *Enterprise naming & deploy*.

**SAY (oral)** (transition)

> “CoCo (Cortex Code) was **build-time** processing. **Runtime** processing is the agent picking tools when an analyst types a question. Let’s do that.”

---

# PART D — Risk copilot (~1–1½ min) · **Input** + runtime **Processing**

**ACTION**
1. Click **Risk copilot**.
2. Confirm badge: **Cortex Agent** (green / live — not offline fallback).
3. Optional: point example prompts — then use the certified one below.
4. Paste and submit:

```text
Show mule accounts with cash-outs after 2am
```

5. **While spinner runs:** switch to CoWork tab (Part E) — do not wait silently.

**COMPONENTS**

| On screen | Say naturally |
|-----------|----------------|
| **Risk copilot** nav | “Chat UI (User Interface) — but the brain is Snowflake, not OpenAI in the browser.” |
| **Cortex Agent** badge | “Live agent path — if this said offline, you’d be on a fallback.” |
| **Prompt input** | “Plain English — no SQL (Structured Query Language) required from the analyst.” |
| **Example chips** (if shown) | “Starters — we’ll use the certified mule prompt.” |
| **Send / submit** | “One click — agent run starts in the account.” |

**SAY (oral)** (before submit)

> “**Risk copilot** — this is where an analyst actually works. Looks like chat; underneath it’s calling **`SENTINEL.RISK.SENTINEL_AGENT`** in Snowflake.
>
> See the **Cortex Agent** badge? That means we’re on the real agent path. I’m going to paste: *Show mule accounts with cash-outs after 2am* — ties back to case 1088 and the priority queue you saw.
>
> **Input** is just that sentence. **Processing** is the agent deciding: do I need SQL (Structured Query Language) on transactions, do I need to search regulations for mule guidance, do I need call transcripts? That’s orchestration — not one big prompt to a raw model.”

**SAY (oral)** (while loading)

> “While this spins — I’ll hop to **CoWork** with the **exact same words**. We certified this prompt: you should see mule activity and a policy cite like **DOC-RBI-AML-MULE** (document ID — RBI (Reserve Bank of India), AML (Anti–Money Laundering)) when it lands.”

**ONE-PAGER** *Ask about mule cash-outs, structuring, PEP (Politically Exposed Person) diligence, large exposures* — we picked the flagship mule prompt.

---

# PART E — CoWork (~45–90 s) · Same solution, Snowflake-native surface

**ACTION**
1. Browser tab: **Snowflake CoWork** / **Snowflake Intelligence** (URL in `docs/judge-runs.md`).
2. Confirm agent selector: **`SENTINEL.RISK.SENTINEL_AGENT`**.
3. Paste **identical** prompt → send.
4. Leave tab open; return to **Risk copilot** when Next.js answer completes.

**COMPONENTS**

| On screen | Say naturally |
|-----------|----------------|
| **CoWork / Snowflake Intelligence** | “Snowflake’s native agent chat — no Codeanigans frontend required.” |
| **Agent picker** | “Must be SENTINEL.RISK.SENTINEL_AGENT — same FQN (Fully Qualified Name) as the desk.” |
| **Chat thread** | “Same question, same account, same tools behind the curtain.” |

**SAY (oral)**

> “This tab is **CoWork** — Snowflake’s in-account agent UI (User Interface). Some teams will never open our Next.js app; they’ll live here.
>
> I’m selecting **`SENTINEL.RISK.SENTINEL_AGENT`** in the **agent dropdown** — same fully qualified name as on the copilot badge. Pasting the **same prompt**, hit send.
>
> So **one agent, two surfaces** from the one-pager: our desk for the demo story, CoWork for the Snowflake-native story. CoCo (Cortex Code) deployed once; governance doesn’t fork. That’s what we mean by ‘built to win real desks,’ not a hackathon-only shell.”

**IMPACT (oral)**

> “IT and compliance don’t want two brains drifting apart — treasury team in Snowflake, fraud team in a startup UI. **One agent, one policy**, whether you use our desk or Snowflake’s own chat. That’s how this actually ships past a pilot.”

**ACTION** If CoWork finishes first, glance at answer — same themes (mules, after-hours cash-out) — then switch back to app.

---

# PART F — Show both answers (~1 min) · **Output** (grounded) + compliance-grade behavior

**ACTION — Next.js `/copilot`** (in order — don’t rush):

1. **Cortex Agent** badge — live Snowflake path.
2. **Tool chips** — e.g. Cortex Analyst + Regulatory Search (names may vary).
3. **Confidence** indicator.
4. **Answer body** — call out **facts** (accounts, amounts, times) vs **interpretive** sentences.
5. **Citation chips** — e.g. **DOC-RBI-AML-MULE** (document ID — RBI (Reserve Bank of India), AML (Anti–Money Laundering)) → “same IDs as Regulations screen.”
6. Expand **Generated Cortex Analyst SQL (Structured Query Language)** — scroll 2–3 lines.
7. **CASE-1088** link or case reference — click if time.

**COMPONENTS** (walk top to bottom on the answer)

| On screen | Say naturally |
|-----------|----------------|
| **Cortex Agent** badge | “Still on Snowflake — confirms live path.” |
| **Tool chips** | “These are the tools it actually invoked — Analyst, regulatory search, call search, etc.” |
| **Confidence** | “How sure the stack is — transparency for the desk.” |
| **Answer text** | “Split facts — accounts, times, amounts — from softer interpretation.” |
| **Citation chips** | “Footnotes — click through to Regulations mentally.” |
| **Generated SQL (Structured Query Language)** (accordion) | “Show-your-work for model risk — here’s the query on the mart.” |
| **Case link** (1088) | “Narrative tied back to the case file we opened.” |

**SAY (oral)**

> “Back on the desk — let’s read the answer like an analyst would.
>
> **Tool chips** first — ‘what did it actually do?’ Not just talk. Analyst for data, search for policy — you should see both for a mule question.
>
> **Confidence** — small thing, big trust: the UI (User Interface) admits uncertainty when it’s uncertain.
>
> The **answer body** — I’d call out the hard facts: which accounts, what time window, what pattern. Then the softer lines where it’s interpreting — the one-pager asked us to separate those.
>
> **Citation chips** — those document IDs match the **Regulations** screen. That’s ‘cited,’ not invented.
>
> Open **Generated SQL (Structured Query Language)** — this is for model risk and audit: ‘show me the query that produced the table numbers.’
>
> If there’s a **case 1088** link, that’s the glue — chat connected to the investigation record.
>
> Flip to **CoWork** for five seconds — same story, same agent. Two UIs, one brain. That’s the product promise.”

**IMPACT (oral)**

> “An analyst can defend this in a meeting: here are the facts from the warehouse, here’s the policy we cited, here’s where we were careful not to overclaim. That’s **compliance-grade** — and it’s why desks buy copilots that are grounded, not flashy.”

**THEME** Technical execution — Cortex Agent + Analyst + Search.

---

# PART G — Close the loop (~45–60 s) · **Output** (filing + audit) + recap

### G1 · STR (Suspicious Transaction Report) download — regulatory deliverable

**ACTION**
1. **STR (Suspicious Transaction Report) factory** → **CASE-1088**.
2. Click **Download JSON (JavaScript Object Notation)** (show file or toast).
3. Optional: **Download Markdown**.
4. Optional: split-screen `output/CASE-1088-STR.json` in repo — “same artifact.”

**SAY (oral)**

> “Back to **STR (Suspicious Transaction Report) factory** — remember the preview? Now I hit **Download JSON (JavaScript Object Notation)**. That’s the filing pack: subjects, transactions, grounds, clauses — not a PDF of the chat window.
>
> **Markdown** is the same content for a human reviewer. Compliance officer can sanity-check before anything goes to a regulator workflow. And yes — it lines up with **`CASE-1088-STR.json`** in the repo if you want to verify offline.”

**IMPACT (oral)**

> “You’re not asking the MLRO (Money Laundering Reporting Officer) to trust a chat bubble — you’re handing them a **work product** that matches the case file and the copilot narrative.”

### G2 · Audit row — prove the copilot turn

**ACTION**
1. **Audit log** → sort/find **newest** row (your mule question).
2. Expand: full question, answer excerpt, tools, SQL (Structured Query Language), citations.

**SAY (oral)**

> “Last piece — **Audit log**, newest **row**, expand it. There’s our mule question, the answer, tools, SQL (Structured Query Language), citations — the flight recorder we showed empty earlier, now filled in.”

**IMPACT (oral)**

> “Walk me through Monday morning again: you **saw** what mattered on the command center, you **investigated** case 1088 with data and calls in one place, you **asked** in plain language and got an answer you can cite, you **downloaded** a filing pack, and you **proved** every step here. That’s less rework, less reputational risk, and a path regulators and audit can follow — built on Snowflake, deployable with CoCo (Cortex Code), usable in CoWork. Synthetic demo — **real** operating model.”

### G3 · Close

**SAY (oral)**

> “That’s **Sentinel** — risk, fraud, and regulatory intelligence that finishes the job, not just the chat. **Codeanigans**, repo **anshulbanwala/Codeanigans**, certify runs and sample STR (Suspicious Transaction Report) included. Thanks for watching.”

**Optional (+15 s, CoWork):** `What is the crypto mining tax rule 2030?` → must **refuse** (certified — *Stay honest* on one-pager).

---

## Rubric map (for you — don’t read aloud)

| Criterion | One-pager + demo proof |
|-----------|-------------------------|
| Relevance 30% | Real desk pain → STR (Suspicious Transaction Report) filing → Indian regulatory context |
| Technical 40% | Snowflake mart, Cortex Agent, CoCo (Cortex Code), Analyst + Search + STR (Suspicious Transaction Report) skill, CoWork |
| Completeness 30% | All nav areas, case 1088, STR (Suspicious Transaction Report) download, audit row, optional abstain |

**Optional (+15 s):** CoWork — `What is the crypto mining tax rule 2030?` → must refuse (`docs/judge-runs.md`).

---

## Recording checklist

- [ ] Part A3: **business impact as a story** (not reading the impact table row by row)  
- [ ] Part B: named **components** aloud (queue, timeline, STR (Suspicious Transaction Report) preview, regulation cards, audit row, etc.)  
- [ ] Part B: **IMPACT (oral)** on key screens; **Priority queue** = alerts; **CASE-1088** on Investigations / Cases / STR (Suspicious Transaction Report)  
- [ ] Part C: terminal + **four repo files**; name Analyst, Search, str-factory  
- [ ] Part D–E: same prompt; CoWork agent FQN (Fully Qualified Name) visible  
- [ ] Part F: tool chips, SQL (Structured Query Language), citations (e.g. **DOC-RBI-AML-MULE** (document ID — RBI (Reserve Bank of India), AML (Anti–Money Laundering))), CoWork parity  
- [ ] Part G: STR (Suspicious Transaction Report) **download** + **new** audit row + loop recap  
- [ ] Said **grounded / cited / replayable** and **regulatory output not chat only**  
- [ ] Edit to **≤ 5:00**

---

## If you run long

1. Part A: keep **problem + solution + two impact rows**; skip reading extra bullets.  
2. Liquidity + Credit ~10 s each.  
3. Part C: IDE only (no live deploy).  
4. Cut spinner to ~3 s in edit.

**Do not cut:** Part A impact table, STR (Suspicious Transaction Report) factory story, CoCo (Cortex Code) proof, copilot grounding, CoWork same question, STR (Suspicious Transaction Report) download, audit.

---

## Hack2skill form

- Repo: https://github.com/anshulbanwala/Codeanigans  
- **1-pager PDF** (`docs/ONE_PAGER.md` or your exported deck)  
- Video ≤ 5 min · prototype: Vercel or CoWork URL in `docs/judge-runs.md`

---

## Abbreviation reference (full forms used in this script)

| Abbrev. | Full form |
|---------|-----------|
| AML | Anti–Money Laundering |
| ALCO | Asset–Liability Committee |
| CLI | Command-Line Interface |
| CoCo | Cortex Code (Snowflake) |
| CRE | Commercial Real Estate |
| FIU / FIU-IND | Financial Intelligence Unit (India) |
| FQN | Fully Qualified Name |
| GCC | Gulf Cooperation Council |
| JSON | JavaScript Object Notation |
| KPI | Key Performance Indicator |
| KYC | Know Your Customer |
| LCR | Liquidity Coverage Ratio |
| LLM | Large Language Model |
| MLRO | Money Laundering Reporting Officer |
| NBFC | Non-Banking Financial Company |
| NPA | Non-Performing Asset |
| NSFR | Net Stable Funding Ratio |
| PEP | Politically Exposed Person |
| PMLA | Prevention of Money Laundering Act |
| RAG | Retrieval-Augmented Generation |
| RBI | Reserve Bank of India |
| RM | Relationship Manager |
| SQL | Structured Query Language |
| STR | Suspicious Transaction Report |
| UI | User Interface |
| YAML | YAML Ain’t Markup Language |
