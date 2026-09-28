import { Suspense } from "react";

export default function StrLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<p className="text-sm text-muted-foreground">Loading STR factory…</p>}>
      {children}
    </Suspense>
  );
}
