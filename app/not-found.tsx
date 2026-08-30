import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg py-16 text-center">
      <h1 className="font-heading text-2xl">That record is not in the risk mart</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        The case or page does not exist in the synthetic Aarohan Finance dataset.
      </p>
      <Link href="/" className="mt-4 inline-block text-sm text-primary hover:underline">
        Back to command center
      </Link>
    </div>
  );
}
