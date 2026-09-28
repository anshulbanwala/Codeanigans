"use client";

import { useEffect, useState } from "react";

type Health = {
  status: string;
  mode: string;
  snowflake: string;
  agent?: string;
  role?: string | null;
  warehouse?: string | null;
};

export function DataSourceStatus() {
  const [health, setHealth] = useState<Health | null>(null);

  useEffect(() => {
    fetch("/api/health")
      .then((r) => r.json())
      .then((data: Health) => setHealth(data))
      .catch(() => setHealth(null));
  }, []);

  if (!health) {
    return (
      <span className="hidden rounded-full border border-border px-2 py-0.5 text-[11px] text-muted-foreground sm:inline">
        Connecting…
      </span>
    );
  }

  const live = health.snowflake === "connected" && health.status === "ok";

  return (
    <span
      className={`hidden rounded-full border px-2 py-0.5 text-[11px] sm:inline ${
        live
          ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
          : "border-amber-500/40 bg-amber-500/10 text-amber-800 dark:text-amber-200"
      }`}
      title={health.agent ?? "Sentinel"}
    >
      {live ? "Snowflake live" : "Offline demo"}
      {live && health.warehouse ? ` · ${health.warehouse}` : ""}
    </span>
  );
}
