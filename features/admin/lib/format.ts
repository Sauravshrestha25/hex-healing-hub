export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en", { day: "numeric", month: "short", year: "numeric" }).format(date);
}

export function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("en", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" }).format(date);
}

/** A calendar day stored as a DATE column (midnight UTC), shown without shifting across time zones. */
export function formatDay(date: Date) {
  return new Intl.DateTimeFormat("en", { weekday: "short", day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(date);
}

const relative = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

/** "2 hours ago", "yesterday"; falls back to a date after a week. */
export function timeAgo(date: Date, now = Date.now()) {
  // Clamp: a clock slightly ahead of the server shouldn't read "in 2 minutes".
  const seconds = Math.min(0, Math.round((date.getTime() - now) / 1000));
  const steps: [Intl.RelativeTimeFormatUnit, number][] = [
    ["second", 60],
    ["minute", 60],
    ["hour", 24],
    ["day", 7],
  ];
  let value = seconds;
  for (const [unit, size] of steps) {
    if (Math.abs(value) < size) return unit === "second" ? "just now" : relative.format(value, unit);
    value = Math.round(value / size);
  }
  return formatDate(date);
}

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join("");
}
