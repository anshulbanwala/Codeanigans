import type { DataSource } from "@/lib/mart";

export function MartSourceBanner({ source }: { source: DataSource }) {
  const live = source === "snowflake";
  return (
    <p className="text-xs text-muted-foreground">
      Data source:{" "}
      <span
        className={`font-medium ${live ? "text-emerald-700 dark:text-emerald-300" : "text-foreground"}`}
      >
        {live ? "Snowflake SENTINEL.RISK" : "Local synthetic fallback (configure .env.local for live mart)"}
      </span>
    </p>
  );
}
