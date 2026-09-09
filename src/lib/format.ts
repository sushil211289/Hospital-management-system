export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function formatDate(iso: string, withTime = false) {
  const date = new Date(iso);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    ...(withTime
      ? { hour: "numeric", minute: "2-digit" }
      : {}),
  }).format(date);
}

export function daysAdmitted(admittedAt: string, asOf = new Date()) {
  const start = new Date(admittedAt);
  const days = Math.floor((asOf.getTime() - start.getTime()) / 86_400_000) + 1;
  return Math.max(1, days);
}

export function daysUntil(iso: string, asOf = new Date()) {
  const target = new Date(iso);
  return Math.ceil((target.getTime() - asOf.getTime()) / 86_400_000);
}

export function patientName(first: string, last: string) {
  return `${last}, ${first}`;
}

export function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}${Date.now().toString(36).slice(-4)}`;
}
