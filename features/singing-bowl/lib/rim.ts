/**
 * Geometry for "where is the mallet relative to the rim". The bowl is drawn in a 3/4 view,
 * so its rim is an ellipse; distances are measured in ellipse-normalised space, which makes
 * circling the rim on screen feel like circling a real, round rim.
 */

export type BowlEllipse = { cx: number; cy: number; rx: number; ry: number };

export type RimReading = {
  /** Position around the rim in radians: 0 = right, π/2 = front (nearest the viewer). */
  angle: number;
  /** 1 exactly on the rim, below 1 inside the opening, above 1 outside the bowl. */
  radial: number;
  /** 0..1: how firmly the mallet is on the rim (1 = right on it). */
  contact: number;
};

/** Half-width of the band around the rim that counts as touching it (normalised units). */
const RIM_BAND = 0.14;

export function readRim(x: number, y: number, bowl: BowlEllipse): RimReading {
  const nx = (x - bowl.cx) / bowl.rx;
  const ny = (y - bowl.cy) / bowl.ry;
  const radial = Math.hypot(nx, ny);
  const offset = (radial - 1) / RIM_BAND;
  return { angle: Math.atan2(ny, nx), radial, contact: Math.exp(-offset * offset) };
}

/** Below this (normalised) the pointer is over the bowl's opening rather than pressing on its wall. */
const PRESS_DEPTH = 0.35;
/** Out to this distance the mallet stays locked onto the rim; beyond it, it lets go. */
const CAPTURE_START = 1.6;
const CAPTURE_END = 2;

export type Contact = {
  /** 0..1 how firmly the tip is on the rim. */
  contact: number;
  /** 0..1 how hard the hand is pushing the tip into the rim (pointer inside the rim line). */
  pressure: number;
  /** Where the tip actually is. */
  tip: { x: number; y: number };
};

/**
 * Where the mallet tip goes for a given pointer. Near the bowl it stays on the rim: moving the hand
 * roughly around the bowl moves the tip around the circle, never off it. Pushing "into" the bowl presses
 * harder instead of passing through (the bowl is solid); far inside, over the opening, it lifts away;
 * well outside, it lets go and follows the hand freely.
 */
export function resolveContact(x: number, y: number, bowl: BowlEllipse): Contact {
  const reading = readRim(x, y, bowl);
  const onRim = rimPoint(reading.angle, bowl);
  const toward = (amount: number) => ({ x: onRim.x + (x - onRim.x) * amount, y: onRim.y + (y - onRim.y) * amount });

  if (reading.radial >= 1) {
    const release = smoothstep(CAPTURE_START, CAPTURE_END, reading.radial);
    return { contact: 1 - release, pressure: 0, tip: toward(release) };
  }
  const depth = 1 - reading.radial;
  const lift = smoothstep(PRESS_DEPTH, PRESS_DEPTH + 0.15, depth);
  return { contact: 1 - lift, pressure: clamp01(depth / PRESS_DEPTH) * (1 - lift), tip: toward(lift) };
}

export function rimPoint(angle: number, bowl: BowlEllipse) {
  return { x: bowl.cx + bowl.rx * Math.cos(angle), y: bowl.cy + bowl.ry * Math.sin(angle) };
}

/** Shortest signed turn from `from` to `to`, in radians, within (-π, π]. */
export function angleDelta(from: number, to: number) {
  let delta = (to - from) % (2 * Math.PI);
  if (delta > Math.PI) delta -= 2 * Math.PI;
  if (delta <= -Math.PI) delta += 2 * Math.PI;
  return delta;
}

export const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

export function smoothstep(edge0: number, edge1: number, value: number) {
  const t = clamp01((value - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

/** Exponential approach factor for a time constant, frame-rate independent. */
export const approach = (dt: number, timeConstant: number) => 1 - Math.exp(-dt / timeConstant);
