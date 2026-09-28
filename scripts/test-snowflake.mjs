import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import snowflake from "snowflake-sdk";

const envPath = resolve(process.cwd(), ".env.local");
for (const line of readFileSync(envPath, "utf8").split("\n")) {
  const t = line.trim();
  if (!t || t.startsWith("#")) continue;
  const i = t.indexOf("=");
  if (i === -1) continue;
  const key = t.slice(0, i).trim();
  const val = t.slice(i + 1).trim();
  if (!process.env[key]) process.env[key] = val;
}

const account = process.env.SNOWFLAKE_ACCOUNT;
const username = process.env.SNOWFLAKE_USER;
const password = process.env.SNOWFLAKE_PASSWORD;
const role = process.env.SNOWFLAKE_ROLE ?? "APP_DEVELOPER";
const warehouse = process.env.SNOWFLAKE_WAREHOUSE ?? "SENTINEL_WH";
const database = process.env.SNOWFLAKE_DATABASE ?? "SENTINEL";
const schema = process.env.SNOWFLAKE_SCHEMA ?? "RISK";

if (!account || !username || !password) {
  console.error("Missing SNOWFLAKE_ACCOUNT, SNOWFLAKE_USER, or SNOWFLAKE_PASSWORD in .env.local");
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

conn.connect((err) => {
  if (err) {
    console.error("CONNECT_FAILED:", err.message);
    process.exit(2);
  }
  conn.execute({
    sqlText: `
      SELECT CURRENT_ROLE() AS ROLE, CURRENT_DATABASE() AS DB, CURRENT_SCHEMA() AS SCHEMA,
             (SELECT COUNT(*) FROM SENTINEL.RISK.CASES) AS CASE_COUNT,
             (SELECT COUNT(*) FROM SENTINEL.RISK.ALERTS) AS ALERT_COUNT
    `,
    complete: (e, _stmt, rows) => {
      conn.destroy(() => {});
      if (e) {
        console.error("QUERY_FAILED:", e.message);
        process.exit(3);
      }
      console.log(JSON.stringify({ ok: true, ...rows[0] }, null, 2));
    },
  });
});
