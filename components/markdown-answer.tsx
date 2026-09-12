import type { ReactNode } from "react";

type MarkdownAnswerProps = {
  content: string;
};

function renderInline(text: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);

  return parts.filter(Boolean).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>;
    }

    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={index} className="rounded bg-muted px-1 py-0.5 font-mono text-[0.9em] text-foreground">
          {part.slice(1, -1)}
        </code>
      );
    }

    return part;
  });
}

export function MarkdownAnswer({ content }: MarkdownAnswerProps) {
  const lines = content.replace(/\r\n/g, "\n").split("\n");
  const blocks: ReactNode[] = [];
  let paragraph: string[] = [];
  let bullets: string[] = [];
  let ordered: string[] = [];

  const flushParagraph = () => {
    if (!paragraph.length) return;
    const text = paragraph.join(" ").trim();
    if (text) {
      blocks.push(
        <p key={`p-${blocks.length}`} className="leading-7 text-foreground/90">
          {renderInline(text)}
        </p>,
      );
    }
    paragraph = [];
  };

  const flushBullets = () => {
    if (!bullets.length) return;
    blocks.push(
      <ul key={`ul-${blocks.length}`} className="list-disc space-y-1.5 pl-5 text-foreground/85 marker:text-muted-foreground">
        {bullets.map((item, index) => (
          <li key={`${item}-${index}`} className="leading-6">
            {renderInline(item)}
          </li>
        ))}
      </ul>,
    );
    bullets = [];
  };

  const flushOrdered = () => {
    if (!ordered.length) return;
    blocks.push(
      <ol key={`ol-${blocks.length}`} className="list-decimal space-y-1.5 pl-5 text-foreground/85 marker:text-muted-foreground">
        {ordered.map((item, index) => (
          <li key={`${item}-${index}`} className="leading-6">
            {renderInline(item)}
          </li>
        ))}
      </ol>,
    );
    ordered = [];
  };

  const flushAll = () => {
    flushParagraph();
    flushBullets();
    flushOrdered();
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      flushAll();
      continue;
    }

    const heading = line.match(/^(#{1,4})\s+(.+)$/);
    if (heading) {
      flushAll();
      const level = heading[1].length;
      const text = heading[2];
      const className =
        level === 1
          ? "pt-1 font-heading text-xl font-semibold tracking-tight"
          : level === 2
            ? "pt-1 font-heading text-lg font-semibold tracking-tight"
            : "pt-1 text-base font-semibold text-foreground";
      blocks.push(
        <div key={`h-${blocks.length}`} className={className}>
          {renderInline(text)}
        </div>,
      );
      continue;
    }

    const bullet = line.match(/^[-*•]\s+(.+)$/);
    if (bullet) {
      flushParagraph();
      flushOrdered();
      bullets.push(bullet[1]);
      continue;
    }

    const numbered = line.match(/^\d+[.)]\s+(.+)$/);
    if (numbered) {
      flushParagraph();
      flushBullets();
      ordered.push(numbered[1]);
      continue;
    }

    if (line.startsWith("> ")) {
      flushAll();
      blocks.push(
        <blockquote key={`q-${blocks.length}`} className="border-l-2 border-primary/40 pl-3 italic leading-6 text-muted-foreground">
          {renderInline(line.slice(2))}
        </blockquote>,
      );
      continue;
    }

    paragraph.push(line);
  }

  flushAll();

  return <div className="space-y-3">{blocks}</div>;
}
