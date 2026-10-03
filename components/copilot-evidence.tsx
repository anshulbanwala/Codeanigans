import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { CopilotDataTable, CopilotSearchHit } from "@/lib/types";

export function CopilotDataTables({ tables }: { tables: CopilotDataTable[] }) {
  if (!tables.length) return null;

  return (
    <div className="space-y-4">
      {tables.map((table, index) => (
        <div
          key={`${table.title}-${index}`}
          className="overflow-hidden rounded-lg border border-border bg-muted/10"
        >
          <div className="border-b border-border px-3 py-2 text-xs font-medium text-muted-foreground">
            {table.title}
            {table.rows.length >= 50 && (
              <span className="ml-2 text-[10px]">(first 50 rows)</span>
            )}
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                {table.columns.map((col) => (
                  <TableHead key={col} className="text-[11px] whitespace-nowrap">
                    {col}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {table.rows.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <TableCell
                      key={cellIndex}
                      className="max-w-[200px] truncate font-mono text-[11px]"
                      title={cell}
                    >
                      {cell}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ))}
    </div>
  );
}

export function CopilotSearchHits({ hits }: { hits: CopilotSearchHit[] }) {
  if (!hits.length) return null;

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <div className="border-b border-border px-3 py-2 text-xs font-medium text-muted-foreground">
        Retrieved evidence ({hits.length})
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-[11px]">ID</TableHead>
            <TableHead className="text-[11px]">Source</TableHead>
            <TableHead className="text-[11px]">Excerpt</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {hits.map((hit) => (
            <TableRow key={`${hit.kind}-${hit.id}-${hit.title}`}>
              <TableCell className="font-mono text-[10px] text-primary">{hit.id}</TableCell>
              <TableCell className="text-[11px]">
                <span className="text-muted-foreground">
                  {hit.kind === "regulation" ? "Regulation" : "Call"} ·
                </span>{" "}
                {hit.title}
                {hit.meta && (
                  <p className="mt-0.5 text-[10px] text-muted-foreground">{hit.meta}</p>
                )}
              </TableCell>
              <TableCell className="text-[11px] leading-relaxed text-muted-foreground">
                {hit.snippet}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
