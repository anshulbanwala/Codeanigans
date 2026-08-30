import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { regulations } from "@/lib/data";

export default function RegulationsPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-4">
      <div>
        <h1 className="font-heading text-2xl tracking-tight">Regulatory corpus</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Chunked circulars indexed as Cortex Search would be. The copilot cites these clauses instead of inventing law.
        </p>
      </div>
      {regulations.map((doc) => (
        <Card key={doc.id}>
          <CardHeader>
            <p className="font-mono text-xs text-muted-foreground">{doc.id}</p>
            <CardTitle className="text-base">{doc.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              {doc.source} · {doc.clause}
            </p>
            <p className="text-foreground">{doc.excerpt}</p>
            <p className="text-xs">Topic: {doc.topic}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
