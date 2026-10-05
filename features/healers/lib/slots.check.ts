// Run with: pnpm exec tsx features/healers/lib/slots.check.ts
import assert from "node:assert/strict";
import { addDays, bookableDates, formatMinute, formatSlot, freeSlotStarts, isBookableDate, nepalDate, nepalInstant, nepalMinuteOfDay, parseClock, weekdayOf } from "./slots";

// Nepal is UTC+5:45: 10:00 in Kathmandu is 04:15 UTC, and late UTC evenings are already "tomorrow".
assert.equal(nepalInstant("2026-10-12", 600).toISOString(), "2026-10-12T04:15:00.000Z");
assert.equal(nepalDate(new Date("2026-10-11T18:30:00Z")), "2026-10-12");
assert.equal(nepalMinuteOfDay(nepalInstant("2026-10-12", 615)), 615);
assert.equal(weekdayOf("2026-10-12"), 1); // a Monday
assert.equal(addDays("2026-12-31", 1), "2027-01-01");

// 10:00–13:00, 60-minute sessions, 11:00–12:00 taken: only 10:00 and 12:00 fit.
assert.deepEqual(freeSlotStarts({ start: 600, end: 780 }, 60, [{ start: 660, end: 720 }]), [600, 720]);
// A 90-minute session can't end after closing time.
assert.deepEqual(freeSlotStarts({ start: 600, end: 720 }, 90, []), [600, 630]);
// Too short a window for the session: no slots.
assert.deepEqual(freeSlotStarts({ start: 600, end: 640 }, 60, []), []);

// Booking window: tomorrow … +30 days, never today or the past.
const now = new Date("2026-10-05T06:00:00Z");
const dates = bookableDates(now);
assert.equal(dates[0], "2026-10-06");
assert.equal(dates.length, 30);
assert.equal(isBookableDate("2026-10-05", now), false);
assert.equal(isBookableDate("2026-11-04", now), true);
assert.equal(isBookableDate("2026-11-05", now), false);

assert.equal(formatMinute(0), "12:00 AM");
assert.equal(formatMinute(13 * 60 + 5), "1:05 PM");
assert.equal(parseClock("09:30"), 570);
assert.equal(parseClock("25:00"), null);
assert.equal(formatSlot(nepalInstant("2026-10-12", 630)), "Mon, Oct 12, 2026, 10:30 AM");
console.log("slots ok");
