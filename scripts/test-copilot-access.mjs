import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import snowflake from "snowflake-sdk";

const envPath = resolve(process.cwd(), ".env.local");
try {
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i === -1) continue;
    const key = t.slice(0, i).trim();
    const val = t.slice(i + 1).trim();
    if (!process.env[key]) process.env[key] = val;
  }
} catch {
  // optional .env.local
}

const account = process.env.SNOWFLAKE_ACCOUNT;
const username = process.env.SNOWFLAKE_USER;
const password = process.env.SNOWFLAKE_PASSWORD;
const role = process.env.SNOWFLAKE_ROLE ?? "APP_DEVELOPER";
const warehouse = process.env.SNOWFLAKE_WAREHOUSE ?? "SENTINEL_WH";
const database = process.env.SNOWFLAKE_DATABASE ?? "SENTINEL";
const schema = process.env.SNOWFLAKE_SCHEMA ?? "RISK";

if (!account || !username || !password) {
  console.error("Set SNOWFLAKE_ACCOUNT, SNOWFLAKE_USER, SNOWFLAKE_PASSWORD");
  process.exit(1);
}

snowflake.configure({ logLevel: "ERROR" });

const conn = snowflake.createConnection({
  account,
  username,
  password,
  role,
  database,
  schema,
  warehouse,
});

function run(sql, binds) {
  return new Promise((resolve, reject) => {
    conn.execute({
      sqlText: sql,
      binds,
      complete: (err, _stmt, rows) => {
        if (err) reject(err);
        else resolve(rows);
      },
    });
  });
}

conn.connect(async (err) => {
  if (err) {
    console.error("CONNECT_FAILED:", err.message);
    process.exit(2);
  }
  try {
    const grants = await run(`
      SHOW GRANTS TO ROLE APP_DEVELOPER
    `);
    console.log("GRANTS_COUNT", grants.length);

    const agentTest = await run(
      `SELECT SNOWFLAKE.CORTEX.DATA_AGENT_RUN(?, ?) AS RESPONSE`,
      [
        "SENTINEL.RISK.SENTINEL_AGENT",
        JSON.stringify({
          messages: [
            {
              role: "user",
              content: [{ type: "text", text: "How many open alerts are there? One sentence." }],
            },
          ],
        }),
      ],
    );
    const raw = agentTest[0]?.RESPONSE;
    console.log("AGENT_OK", raw ? String(raw).slice(0, 120) + "..." : "empty");

    const auditId = `AUD-TEST-${Date.now()}`;
    await run(
      `INSERT INTO SENTINEL.RISK.COPILOT_AUDIT
        (AUDIT_ID, ASKED_AT, USER_NAME, QUESTION, ANSWER, CONFIDENCE,
         CITATIONS, SQL_TEXT, STATUS, DURATION_MS, TOOLS_USED, ERROR_MESSAGE)
       VALUES (?, CURRENT_TIMESTAMP(), 'test@aarohan.fin', 'perm test', 'ok', 'high',
               '[]', NULL, 'success', 1, NULL, NULL)`,
      [auditId],
    );
    console.log("AUDIT_INSERT_OK", auditId);
  } catch (e) {
    console.error("FAILED:", e.message);
    process.exit(3);
  } finally {
    conn.destroy(() => process.exit(0));
  }
});
