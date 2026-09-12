import snowflake from "snowflake-sdk";

snowflake.configure({ logLevel: "WARN" });

let cachedConnection: snowflake.Connection | null = null;
let connecting: Promise<snowflake.Connection> | null = null;

function connect(): Promise<snowflake.Connection> {
  if (cachedConnection) return Promise.resolve(cachedConnection);
  if (connecting) return connecting;

  const account = process.env.SNOWFLAKE_ACCOUNT;
  const username = process.env.SNOWFLAKE_USER;
  const password = process.env.SNOWFLAKE_PASSWORD;
  const database = process.env.SNOWFLAKE_DATABASE ?? "SENTINEL";
  const schema = process.env.SNOWFLAKE_SCHEMA ?? "RISK";
  const warehouse = process.env.SNOWFLAKE_WAREHOUSE ?? "SENTINEL_WH";

  if (!account || !username || !password) {
    return Promise.reject(
      new Error(
        "Missing Snowflake credentials. Set SNOWFLAKE_ACCOUNT, SNOWFLAKE_USER, and SNOWFLAKE_PASSWORD in .env.local",
      ),
    );
  }

  const conn = snowflake.createConnection({
    account,
    username,
    password,
    database,
    schema,
    warehouse,
  });

  connecting = new Promise<snowflake.Connection>((resolve, reject) => {
    conn.connect((err) => {
      connecting = null;
      if (err) {
        reject(err);
      } else {
        cachedConnection = conn;
        resolve(conn);
      }
    });
  });

  return connecting;
}

export async function executeQuery<T = Record<string, unknown>>(
  sql: string,
  binds?: snowflake.Binds,
): Promise<T[]> {
  const conn = await connect();
  return new Promise<T[]>((resolve, reject) => {
    conn.execute({
      sqlText: sql,
      binds,
      complete(
        err: snowflake.SnowflakeError | undefined,
        _stmt: snowflake.RowStatement,
        rows: T[] | undefined,
      ) {
        if (err) reject(err);
        else resolve((rows ?? []) as T[]);
      },
    });
  });
}
