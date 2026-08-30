"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  FileWarning,
  LayoutDashboard,
  MessageSquareText,
  Scale,
  Shield,
} from "lucide-react";
import { INSTITUTION } from "@/lib/data";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/", label: "Command center", icon: LayoutDashboard },
  { href: "/copilot", label: "Risk copilot", icon: MessageSquareText },
  { href: "/cases", label: "Cases", icon: FileWarning },
  { href: "/str", label: "STR factory", icon: Scale },
  { href: "/regulations", label: "Regulations", icon: BookOpen },
  { href: "/audit", label: "Audit log", icon: Shield },
];

function NavLinks() {
  const pathname = usePathname();
  return (
    <nav className="flex gap-1 overflow-x-auto md:flex-col">
      {nav.map((item) => {
        const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
              active
                ? "bg-sidebar-accent text-foreground"
                : "text-muted-foreground hover:bg-sidebar-accent/70 hover:text-foreground",
            )}
          >
            <item.icon className="size-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col bg-background md:flex-row">
      <aside className="border-b border-sidebar-border bg-sidebar p-3 md:flex md:w-60 md:shrink-0 md:flex-col md:border-r md:border-b-0 md:p-4">
        <div className="mb-3 md:mb-6">
          <p className="font-heading text-sm tracking-wide text-primary">{INSTITUTION.product}</p>
          <p className="text-xs text-muted-foreground">
            by {INSTITUTION.team} · {INSTITUTION.name}
          </p>
        </div>
        <NavLinks />
        <p className="mt-auto hidden pt-6 text-[11px] leading-relaxed text-muted-foreground md:block">
          Synthetic NBFC data only. Grounded answers cite PMLA, RBI KYC, FIU-IND and Basel.
        </p>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-border px-4 py-3">
          <div>
            <p className="text-sm font-medium">Risk, fraud & regulatory intelligence</p>
            <p className="text-xs text-muted-foreground">Live · 30 Aug 2026 · Mumbai books</p>
          </div>
          <span className="hidden rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[11px] text-primary sm:inline">
            CoCo · Cortex Analyst · Cortex Search
          </span>
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
