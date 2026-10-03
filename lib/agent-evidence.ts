import type { CopilotDataTable, CopilotSearchHit } from "@/lib/types";

type ToolResultBlock = {
  name: string;
  status: string;
  content?: { type: string; json?: Record<string, unknown> }[];
};

const MAX_TABLE_ROWS = 50;

function normalizeKey(key: string): string {
  return key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function rowsFromObjects(rows: Record<string, unknown>[]): CopilotDataTable | null {
  if (!rows.length) return null;
  const columns = Object.keys(rows[0]).slice(0, 12);
  if (!columns.length) return null;
  return {
    title: "Query results",
    columns: columns.map(normalizeKey),
    rows: rows.slice(0, MAX_TABLE_ROWS).map((row) =>
      columns.map((col) => formatCell(row[col])),
    ),
  };
}

function formatCell(value: unknown): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function tableFromResultSet(meta: unknown, data: unknown): CopilotDataTable | null {
  if (!Array.isArray(data) || data.length === 0) return null;

  const rowType = (meta as { rowType?: { name: string }[] })?.rowType;
  if (rowType?.length && Array.isArray(data[0])) {
    const columns = rowType.map((c) => normalizeKey(c.name));
    const rows = (data as unknown[][]).slice(0, MAX_TABLE_ROWS).map((row) =>
      row.map((cell) => formatCell(cell)),
    );
    return { title: "Query results", columns, rows };
  }

  if (typeof data[0] === "object" && data[0] !== null) {
    return rowsFromObjects(data as Record<string, unknown>[]);
  }

  return null;
}

function extractTableFromJson(j: Record<string, unknown>, toolName: string): CopilotDataTable | null {
  if (typeof j.sql === "string" && !j.result_set && !j.data && !j.rows) {
    return null;
  }

  const resultSet = j.result_set as Record<string, unknown> | undefined;
  if (resultSet) {
    const meta = resultSet.resultSetMetaData ?? resultSet.metadata;
    const data = resultSet.data ?? resultSet.rows;
    const table = tableFromResultSet(meta, data);
    if (table) {
      table.title = toolName.includes("analyst") || toolName.includes("risk")
        ? "Cortex Analyst results"
        : "Structured results";
      return table;
    }
  }

  if (Array.isArray(j.data) && j.data.length > 0) {
    const table = tableFromResultSet(j.metadata, j.data);
    if (table) return table;
  }

  if (Array.isArray(j.rows)) {
    if (typeof j.rows[0] === "object") {
      return rowsFromObjects(j.rows as Record<string, unknown>[]);
    }
    if (Array.isArray(j.columns) && Array.isArray(j.rows[0])) {
      return {
        title: "Query results",
        columns: (j.columns as string[]).map(normalizeKey),
        rows: (j.rows as unknown[][]).slice(0, MAX_TABLE_ROWS).map((r) =>
          r.map(formatCell),
        ),
      };
    }
  }

  return null;
}

function extractSearchHits(
  j: Record<string, unknown>,
  toolName: string,
): CopilotSearchHit[] {
  const hits: CopilotSearchHit[] = [];
  const kind = toolName.includes("reg") ? "regulation" : "call";

  const candidates =
    (j.results as unknown[]) ??
    (j.search_results as unknown[]) ??
    (j.result_set as { results?: unknown[] })?.results;

  if (!Array.isArray(candidates)) return hits;

  for (const item of candidates.slice(0, 8)) {
    if (!item || typeof item !== "object") continue;
    const row = item as Record<string, unknown>;
    const attrs = (row.attributes ?? row.attrs ?? {}) as Record<string, unknown>;
    const text =
      String(row.text ?? row.excerpt ?? row.transcript_text ?? row.content ?? "").trim();
    if (!text && !attrs.title) continue;

    hits.push({
      kind,
      id: String(
        attrs.doc_id ??
          attrs.call_id ??
          attrs.DOC_ID ??
          attrs.CALL_ID ??
          row.id ??
          "—",
      ),
      title: String(attrs.title ?? attrs.TOPIC ?? attrs.customer_id ?? toolName),
      snippet: text.slice(0, 280),
      meta: [attrs.clause, attrs.topic, attrs.CLAUSE, attrs.TOPIC]
        .filter(Boolean)
        .map(String)
        .join(" · "),
    });
  }

  return hits;
}

export function extractEvidenceFromToolResult(tr: ToolResultBlock): {
  tables: CopilotDataTable[];
  searchHits: CopilotSearchHit[];
} {
  const tables: CopilotDataTable[] = [];
  const searchHits: CopilotSearchHit[] = [];
  if (!tr.content) return { tables, searchHits };

  const name = tr.name ?? "";

  for (const item of tr.content) {
    if (item.type !== "json" || !item.json) continue;
    const j = item.json;

    const table = extractTableFromJson(j, name);
    if (table) tables.push(table);

    if (name.includes("search") || name.includes("reg_doc") || name.includes("call")) {
      searchHits.push(...extractSearchHits(j, name));
    }
  }

  return { tables, searchHits };
}

export function mergeDataTables(tables: CopilotDataTable[]): CopilotDataTable[] {
  const seen = new Set<string>();
  const out: CopilotDataTable[] = [];
  for (const t of tables) {
    const key = `${t.title}:${t.columns.join(",")}:${t.rows.length}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(t);
  }
  return out;
}

export function parseConfidenceFromAnswer(
  answer: string,
  opts: {
    toolCount: number;
    hasSql: boolean;
    tableRowCount: number;
    searchHitCount: number;
    caseCount: number;
    alertCount: number;
    usedAnalyst: boolean;
    usedSearch: boolean;
  },
): "high" | "medium" | "low" {
  const explicit = answer.match(/confidence:\s*(high|medium|low)\b/i);
  if (explicit) {
    return explicit[1].toLowerCase() as "high" | "medium" | "low";
  }

  const abstained =
    /\babstain/i.test(answer) ||
    /could not ground/i.test(answer) ||
    /cannot ground/i.test(answer) ||
    /insufficient evidence/i.test(answer);
  if (abstained) return "low";

  let score = 0;
  if (opts.usedAnalyst) score += 2;
  if (opts.usedSearch) score += 1;
  if (opts.hasSql) score += 1;
  if (opts.tableRowCount > 0) score += 2;
  if (opts.searchHitCount > 0) score += 1;
  if (opts.caseCount > 0 || opts.alertCount > 0) score += 1;

  if (score >= 5) return "high";
  if (score >= 2 || opts.toolCount > 0) return "medium";
  return "low";
}
