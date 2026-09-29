import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import snowflake from "snowflake-sdk";

const file = process.argv[2];
if (!file) {
  console.error("Usage: node scripts/run-sql-file.mjs <path.sql>");
  process.exit(1);
}

const envPath = resolve(process.cwd(), ".env.local");
const env = {};
for (const line of readFileSync(envPath, "utf8").split("\n")) {
  const t = line.trim();
  if (!t || t.startsWith("#")) continue;
  const i = t.indexOf("=");
  if (i === -1) continue;
  const key = t.slice(0, i).trim();
  if (!env[key]) env[key] = t.slice(i + 1).trim();
}
for (const key of Object.keys(process.env)) {
  if (key.startsWith("SNOWFLAKE_") && process.env[key]) {
    env[key] = process.env[key];
  }
}

snowflake.configure({ logLevel: "ERROR" });
const conn = snowflake.createConnection({
  account: env.SNOWFLAKE_ACCOUNT,
  username: env.SNOWFLAKE_USER,
  password: env.SNOWFLAKE_PASSWORD,
  role: env.SNOWFLAKE_ROLE || "ACCOUNTADMIN",
  warehouse: env.SNOWFLAKE_WAREHOUSE || "SENTINEL_WH",
});

const sql = readFileSync(resolve(file), "utf8");
const statements = sql
  .split(/;\s*\n/)
  .map((s) => s.trim())
  .filter((s) => s && !s.startsWith("--"));

conn.connect((err) => {
  if (err) {
    console.error(err.message);
    process.exit(2);
  }
  let i = 0;
  const runNext = () => {
    if (i >= statements.length) {
      conn.destroy(() => {
        console.log(`OK: ${statements.length} statements from ${file}`);
      });
      return;
    }
    const stmt = statements[i++];
    if (/^USE /i.test(stmt) || /^CREATE |^ALTER |^GRANT |^INSERT |^SELECT /i.test(stmt)) {
      conn.execute({
        sqlText: stmt,
        complete: (e) => {
          if (e) {
            console.error(`Failed statement ${i}:`, e.message);
            console.error(stmt.slice(0, 120));
            conn.destroy(() => process.exit(3));
            return;
          }
          runNext();
        },
      });
    } else {
      runNext();
    }
  };
  runNext();
});
