// Time-slot maths for healer bookings. Everything visitors see is Nepal time (UTC+5:45, no daylight
// saving); slot starts are stored as UTC instants. Pure functions, shared by server and client.

export const NEPAL_OFFSET_MINUTES = 345;
/** Start times are offered on this grid. */
export const SLOT_STEP_MINUTES = 30;
/** Bookable from tomorrow up to this many days ahead. */
export const BOOKING_WINDOW_DAYS = 30;

export const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const;

const DAY_MS = 86_400_000;

/** YYYY-MM-DD of an instant, on the Nepal calendar. */
export function nepalDate(instant: Date) {
  return new Date(instant.getTime() + NEPAL_OFFSET_MINUTES * 60_000).toISOString().slice(0, 10);
}

/** Minutes since Nepal midnight for an instant. */
export function nepalMinuteOfDay(instant: Date) {
  const local = new Date(instant.getTime() + NEPAL_OFFSET_MINUTES * 60_000);
  return local.getUTCHours() * 60 + local.getUTCMinutes();
}

/** The UTC instant of `minute` past midnight on a Nepal calendar day. */
export function nepalInstant(date: string, minute: number) {
  return new Date(Date.parse(`${date}T00:00:00Z`) + (minute - NEPAL_OFFSET_MINUTES) * 60_000);
}

export function isDateString(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));
}

/** 0 = Sunday … 6 = Saturday, for a calendar day. */
export function weekdayOf(date: string) {
  return new Date(`${date}T00:00:00Z`).getUTCDay();
}

export function addDays(date: string, days: number) {
  return new Date(Date.parse(`${date}T00:00:00Z`) + days * DAY_MS).toISOString().slice(0, 10);
}

/** Calendar days that can be booked today: tomorrow … today + BOOKING_WINDOW_DAYS. */
export function bookableDates(now: Date = new Date()) {
  const today = nepalDate(now);
  return Array.from({ length: BOOKING_WINDOW_DAYS }, (_, i) => addDays(today, i + 1));
}

export function isBookableDate(date: string, now: Date = new Date()) {
  const today = nepalDate(now);
  return isDateString(date) && date > today && date <= addDays(today, BOOKING_WINDOW_DAYS);
}

export type MinuteRange = { start: number; end: number };

/**
 * Start minutes (on the step grid) where a session of `duration` fits inside the working `window`
 * without overlapping any `busy` range.
 */
export function freeSlotStarts(window: MinuteRange, duration: number, busy: MinuteRange[], step = SLOT_STEP_MINUTES) {
  const starts: number[] = [];
  for (let start = window.start; start + duration <= window.end; start += step) {
    const end = start + duration;
    if (!busy.some((b) => start < b.end && end > b.start)) starts.push(start);
  }
  return starts;
}

/** "10:30 AM" from minutes since midnight. */
export function formatMinute(minute: number) {
  const h = Math.floor(minute / 60);
  const m = minute % 60;
  return `${h % 12 === 0 ? 12 : h % 12}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
}

/** "HH:MM" (24h) ↔ minutes since midnight, for time inputs. */
export function parseClock(value: string) {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value);
  if (!match) return null;
  const minute = Number(match[1]) * 60 + Number(match[2]);
  return minute >= 0 && minute <= 24 * 60 ? minute : null;
}

export function toClock(minute: number) {
  return `${String(Math.floor(minute / 60)).padStart(2, "0")}:${String(minute % 60).padStart(2, "0")}`;
}

/** "Mon, Oct 12, 2026" for a calendar day. */
export function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", { weekday: "short", day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(
    new Date(`${date}T00:00:00Z`),
  );
}

/** "Mon, Oct 12, 2026, 10:30 AM" (Nepal time) for a stored slot start. */
export function formatSlot(startsAt: Date) {
  return `${formatDate(nepalDate(startsAt))}, ${formatMinute(nepalMinuteOfDay(startsAt))}`;
}

export function formatRupees(amount: number) {
  return `Rs ${amount.toLocaleString("en-IN")}`;
}
