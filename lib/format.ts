export function inr(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function inrCr(amountInr: number) {
  return `₹${(amountInr / 1_00_00_000).toFixed(1)} Cr`;
}

export function pct(value: number) {
  return `${value.toFixed(1)}%`;
}

export function shortDate(iso: string) {
  const date = parseDate(iso);
  if (!date) return "Date unavailable";
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function dayOnly(iso: string) {
  const date = parseDate(iso);
  if (!date) return "Date unavailable";
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function parseDate(value: string | null | undefined) {
  if (!value || value === "Invalid Date") return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}
