import { Suspense } from "react";

export default function CopilotLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<p className="text-sm text-muted-foreground">Loading copilot…</p>}>
      {children}
    </Suspense>
  );
}
