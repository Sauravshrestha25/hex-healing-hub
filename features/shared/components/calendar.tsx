"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { addDays, formatDate, weekdayOf } from "@/features/healers/lib/slots";

const WEEKDAY_LETTERS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const monthOf = (date: string) => date.slice(0, 7);

function monthLabel(month: string) {
  return new Intl.DateTimeFormat("en", { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${month}-01T00:00:00Z`));
}

function shiftMonth(month: string, by: number) {
  const [year, index] = month.split("-").map(Number) as [number, number];
  return new Date(Date.UTC(year, index - 1 + by, 1)).toISOString().slice(0, 7);
}

/** Every calendar day (YYYY-MM-DD) of a month. */
function daysIn(month: string) {
  const days: string[] = [];
  for (let day = `${month}-01`; monthOf(day) === month; day = addDays(day, 1)) days.push(day);
  return days;
}

/**
 * A month calendar for picking days. Dates are plain YYYY-MM-DD strings (no time zones involved).
 * Only days for which `isSelectable` is true can be chosen; the month arrows stay within `min`…`max`.
 * Used for booking a healer (single day) and marking days off in the dashboard (several days).
 */
export function Calendar({
  min,
  max,
  selected,
  isSelectable,
  onSelect,
  label,
}: {
  min: string;
  max: string;
  selected: string[];
  isSelectable: (date: string) => boolean;
  onSelect: (date: string) => void;
  /** Accessible name, e.g. "Choose a day". */
  label: string;
}) {
  // Open on the month of the first choice, or the first selectable day.
  const [month, setMonth] = useState(() => {
    if (selected[0]) return monthOf(selected[0]);
    for (let day = min; day <= max; day = addDays(day, 1)) if (isSelectable(day)) return monthOf(day);
    return monthOf(min);
  });
  const days = daysIn(month);
  const canGoBack = month > monthOf(min);
  const canGoForward = month < monthOf(max);
  const navButton =
    "grid size-9 place-items-center rounded-full ring-1 ring-inset ring-brand-purple/25 transition-colors hover:ring-brand-purple disabled:opacity-30 disabled:hover:ring-brand-purple/25";

  return (
    <div role="group" aria-label={label} className="w-full max-w-sm text-brand-purple">
      <div className="flex items-center justify-between gap-3">
        <button type="button" onClick={() => setMonth(shiftMonth(month, -1))} disabled={!canGoBack} aria-label="Previous month" className={navButton}>
          <ChevronLeft className="size-4" aria-hidden="true" />
        </button>
        <p aria-live="polite" className="font-heading text-base font-semibold">
          {monthLabel(month)}
        </p>
        <button type="button" onClick={() => setMonth(shiftMonth(month, 1))} disabled={!canGoForward} aria-label="Next month" className={navButton}>
          <ChevronRight className="size-4" aria-hidden="true" />
        </button>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-1 text-center">
        {WEEKDAY_LETTERS.map((letter) => (
          <span key={letter} aria-hidden="true" className="py-1 text-xs font-medium opacity-60">
            {letter}
          </span>
        ))}
        {/* Empty cells so the 1st lands under its weekday. */}
        {Array.from({ length: weekdayOf(days[0]!) }, (_, index) => (
          <span key={`pad-${index}`} />
        ))}
        {days.map((day) => {
          const active = selected.includes(day);
          const enabled = day >= min && day <= max && isSelectable(day);
          return (
            <button
              key={day}
              type="button"
              data-date={day}
              disabled={!enabled}
              aria-pressed={active}
              aria-label={formatDate(day)}
              onClick={() => onSelect(day)}
              className={`mx-auto grid aspect-square w-full max-w-11 place-items-center rounded-full text-sm transition-colors ${
                active
                  ? "bg-brand-purple font-semibold text-brand-cream"
                  : enabled
                    ? "font-medium ring-1 ring-inset ring-brand-purple/25 hover:ring-brand-purple"
                    : "opacity-30"
              }`}
            >
              {Number(day.slice(8))}
            </button>
          );
        })}
      </div>
    </div>
  );
}
