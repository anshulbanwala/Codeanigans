import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join, resolve } from "node:path";

const envPath = resolve(process.cwd(), ".env.local");
const env = {};
for (const line of readFileSync(envPath, "utf8").split("\n")) {
  const t = line.trim();
  if (!t || t.startsWith("#")) continue;
  const i = t.indexOf("=");
  if (i === -1) continue;
  env[t.slice(0, i).trim()] = t.slice(i + 1).trim();
}
for (const key of Object.keys(process.env)) {
  if (key.startsWith("SNOWFLAKE_") && process.env[key]) {
    env[key] = process.env[key];
  }
}

const required = ["SNOWFLAKE_ACCOUNT", "SNOWFLAKE_USER", "SNOWFLAKE_PASSWORD"];
for (const key of required) {
  if (!env[key]) {
    console.error(`Missing ${key} in .env.local`);
    process.exit(1);
  }
}

const dir = join(homedir(), ".snowflake");
mkdirSync(dir, { recursive: true });
const toml = `[connections.sentinel]
account = "${env.SNOWFLAKE_ACCOUNT}"
user = "${env.SNOWFLAKE_USER}"
password = "${env.SNOWFLAKE_PASSWORD.replace(/"/g, '\\"')}"
role = "${env.SNOWFLAKE_ROLE || "ACCOUNTADMIN"}"
warehouse = "${env.SNOWFLAKE_WAREHOUSE || "SENTINEL_WH"}"
database = "${env.SNOWFLAKE_DATABASE || "SENTINEL"}"
schema = "${env.SNOWFLAKE_SCHEMA || "RISK"}"
`;

writeFileSync(join(dir, "connections.toml"), toml, { mode: 0o600 });
console.log("Wrote ~/.snowflake/connections.toml [connections.sentinel]");
