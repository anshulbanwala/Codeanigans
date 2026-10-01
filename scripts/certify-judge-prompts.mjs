/**
 * POST each judge prompt to /api/copilot and score basic evidence.
 * Usage: npm run dev, then node scripts/certify-judge-prompts.mjs
 */
const BASE = process.env.BASE_URL ?? "http://127.0.0.1:43127";

const PROMPTS = [
  {
    prompt: "Show mule accounts with cash-outs after 2am",
    must: ["mule"],
    any: ["DOC-RBI-AML-MULE", "1088", "1089", "RBI"],
  },
  {
    prompt: "Is Rahul Mehta structuring under the ₹10L CTR?",
    must: ["1042", "Mehta"],
    any: ["PMLA", "DOC-PMLA", "10"],
  },
  {
    prompt: "How tight is our LCR and wholesale runoff?",
    must: ["LCR"],
    any: ["runoff", "DOC-BASEL", "liquidity"],
  },
  {
    prompt: "Which names breach RBI large-exposure norms?",
    must: ["Golden Peak"],
    any: ["DOC-RBI-NBFC", "exposure", "10"],
  },
  {
    prompt: "What does RBI require for PEP enhanced due diligence?",
    must: ["PEP"],
    any: ["DOC-RBI-KYC", "KYC", "enhanced"],
  },
  {
    prompt: "Draft the FIU-IND STR pack that is due this week",
    must: ["STR"],
    any: ["FIU", "DOC-FIU", "seven", "7", "1088", "1042"],
    timeoutMs: 180_000,
  },
  {
    prompt: "What is the crypto mining tax rule 2030?",
    must: [],
    abstain: true,
    forbid: ["2030 tax", "mining tax is", "rate of"],
  },
];

async function ask(question, timeoutMs = 120_000) {
  const start = Date.now();
  const res = await fetch(`${BASE}/api/copilot`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
    signal: AbortSignal.timeout(timeoutMs),
  });
  const body = await res.json();
  const seconds = Math.round((Date.now() - start) / 1000);
  return { status: res.status, seconds, body };
}

function score(item, text) {
  const lower = text.toLowerCase();
  const missing = item.must.filter((m) => !lower.includes(m.toLowerCase()));
  const hitAny =
    !item.any?.length ||
    item.any.some((m) => lower.includes(m.toLowerCase()));
  if (item.abstain) {
    const bad = (item.forbid ?? []).some((f) => lower.includes(f.toLowerCase()));
    const abstainWords =
      /cannot|can't|not available|no information|unable to|don't have|do not have|not in|abstain|synthetic|ungrounded|outside the scope|falls outside|don't have anything|don't have any information/i.test(
        text,
      );
    const pass = abstainWords && !bad && text.length < 8000;
    return { pass, missing: [], hitAny, note: pass ? "abstain-ok" : "needs-abstain" };
  }
  const pass = missing.length === 0 && hitAny;
  return { pass, missing, hitAny, note: pass ? "ok" : "check-manually" };
}

async function main() {
  await fetch(`${BASE}/api/warmup`).catch(() => {});

  const results = [];
  for (const item of PROMPTS) {
    process.stderr.write(`\n>> ${item.prompt}\n`);
    const { status, seconds, body } = await ask(item.prompt, item.timeoutMs ?? 120_000);
    const engine = body.engine ?? "?";
    const answer = body.answer ?? body.error ?? JSON.stringify(body);
    const tools = (body.toolsUsed ?? []).join(", ");
    const { pass, missing, note } = score(item, answer);
    results.push({
      prompt: item.prompt,
      http: status,
      engine,
      seconds,
      pass: pass && engine === "agent",
      note,
      missing,
      tools,
    });
    console.log(
      JSON.stringify({
        prompt: item.prompt.slice(0, 50),
        pass: pass && engine === "agent",
        engine,
        seconds,
        note,
        missing,
      }),
    );
  }

  console.log("\n=== SUMMARY ===");
  console.log(JSON.stringify(results, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
