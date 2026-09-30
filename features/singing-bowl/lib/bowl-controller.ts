import { gsap } from "@/features/shared/lib/gsap";
import { BowlAudio } from "./bowl-sound";
import { angleDelta, approach, clamp01, readRim, resolveContact, rimPoint, smoothstep, type BowlEllipse } from "./rim";

export type SoundState = "locked" | "on" | "muted" | "unavailable";

export type BowlElements = {
  stage: HTMLElement;
  svg: SVGSVGElement;
  bowl: SVGGElement;
  glow: SVGElement;
  song: SVGElement;
  contact: SVGCircleElement;
  ripples: SVGEllipseElement[];
  mallet: SVGGElement;
};

const REST_ANGLE_DEG = -32;
/** The bowl's resting tilt, and the point on its base it rocks about. */
const BOWL_TILT_DEG = -0.6;
const BOWL_PIVOT = { x: 300, y: 372 };
/** Physics runs in fixed small steps so springs stay stable at any frame rate. */
const STEP = 1 / 120;

/** Mallet: a hand-held mass on a slightly under-damped spring (it trails, then settles with weight). */
const MALLET_STIFFNESS = 260;
const MALLET_DAMPING = 2 * 0.78 * Math.sqrt(MALLET_STIFFNESS);
/** Its swing about the tip: softer and looser, so fast hand movements make it sway a little. */
const SWING_STIFFNESS = 140;
const SWING_DAMPING = 2 * 0.5 * Math.sqrt(SWING_STIFFNESS);
const SWING_FROM_ACCELERATION = 0.5;
/** The bowl sits on a cushion: stiff, well-damped springs for sliding and rocking. */
const BOWL_SLIDE_STIFFNESS = 900;
const BOWL_SLIDE_DAMPING = 2 * 0.5 * Math.sqrt(BOWL_SLIDE_STIFFNESS);
const BOWL_ROCK_STIFFNESS = 500;
const BOWL_ROCK_DAMPING = 2 * 0.35 * Math.sqrt(BOWL_ROCK_STIFFNESS);
/** How fast the hand must move in onto the rim (rim radii per second) for it to count as a strike. */
const STRIKE_HAND_SPEED = 5;
const toRad = (deg: number) => (deg * Math.PI) / 180;
const toDeg = (rad: number) => (rad * 180) / Math.PI;

/**
 * Drives the singing bowl: pointer → mallet → rim contact → resonance → sound, all outside React.
 * Pointer events can fire hundreds of times a second, so nothing here causes a re-render; one
 * requestAnimationFrame loop runs while the bowl is touched or still ringing, then stops.
 *
 *   rubbing the rim   → energy builds slowly (a real bowl needs a few turns to sing)
 *   moving faster     → fuller, brighter tone; slower → softer
 *   pressing harder   → more friction and a fuller tone; too hard and fast → the mallet chatters
 *   resting on rim    → the mallet damps it
 *   moving away       → it rings out naturally
 *   flicking into rim → strike (harder impact, louder strike); click/tap also strikes
 *
 * The mallet is a mass on a spring behind the pointer, the bowl is solid (the tip can't pass through
 * its wall), and the bowl itself slides and rocks very slightly on its cushion.
 */
export class BowlController {
  private readonly audio = new BowlAudio();
  private sound: SoundState = BowlAudio.isSupported ? "locked" : "unavailable";
  private reducedMotion: MediaQueryList;

  private pointer: { x: number; y: number } | null = null;
  /** Last pointer distance from the rim (normalised) and when, for detecting a flick onto it. */
  private lastHand: { radial: number; time: number } | null = null;
  private engaged = false;
  private downAt: { x: number; y: number } | null = null;

  // Resonance
  private energy = 0;
  private strike = 0;
  private lastAngle = Math.PI / 2;
  /** Smoothed signed angular speed of the tip around the rim, rad/s. */
  private angularVelocity = 0;
  private pressure = 0;

  // Mallet (tip position/velocity in SVG units; rotation in degrees, unwrapped)
  private tip = { x: 0, y: 0, vx: 0, vy: 0, ax: 0, ay: 0 };
  private rotation = REST_ANGLE_DEG;
  private spin = 0;
  /** A tiny, quickly-fading slip of the tip off its line: the odd nick of wood on metal. */
  private nick = 0;
  private malletVisible = false;

  // Bowl on its cushion
  private slide = 0;
  private slideVelocity = 0;
  private rock = 0;
  private rockVelocity = 0;

  private rippleCooldown = 0;
  private rippleIndex = 0;
  private lastTime = 0;
  private accumulator = 0;
  private frame: number | null = null;
  private readonly cleanups: (() => void)[] = [];

  constructor(
    private readonly el: BowlElements,
    private readonly rim: BowlEllipse,
    private readonly onSoundState: (state: SoundState) => void,
  ) {
    this.tip.x = rim.cx + rim.rx + 60;
    this.tip.y = rim.cy + 40;
    this.reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const { stage } = el;
    stage.addEventListener("pointermove", this.onPointerMove);
    stage.addEventListener("pointerdown", this.onPointerDown);
    stage.addEventListener("pointerup", this.onPointerUp);
    stage.addEventListener("pointercancel", this.onPointerUp);
    stage.addEventListener("pointerleave", this.onPointerLeave);
    document.addEventListener("visibilitychange", this.onVisibility);
    this.cleanups.push(() => {
      stage.removeEventListener("pointermove", this.onPointerMove);
      stage.removeEventListener("pointerdown", this.onPointerDown);
      stage.removeEventListener("pointerup", this.onPointerUp);
      stage.removeEventListener("pointercancel", this.onPointerUp);
      stage.removeEventListener("pointerleave", this.onPointerLeave);
      document.removeEventListener("visibilitychange", this.onVisibility);
    });
  }

  // ---- public API (buttons) ----

  toggleSound() {
    if (this.sound === "locked") return void this.unlockAudio();
    if (this.sound === "unavailable") return;
    this.setSound(this.sound === "on" ? "muted" : "on");
    this.audio.setMuted(this.sound === "muted");
  }

  /** Keyboard-friendly strike at the front of the rim. */
  strikeFront() {
    void this.unlockAudio();
    this.strikeAt(Math.PI / 2, 0.85);
  }

  dispose() {
    if (this.frame !== null) cancelAnimationFrame(this.frame);
    for (const cleanup of this.cleanups) cleanup();
    gsap.killTweensOf([this.el.mallet, ...this.el.ripples]);
    this.audio.dispose();
  }

  // ---- pointer handling ----

  private readonly onVisibility = () => {
    if (document.hidden) this.audio.suspend();
  };

  private readonly onPointerMove = (event: PointerEvent) => {
    const p = this.toSvg(event);
    if (!p) return;
    this.pointer = p;
    this.detectFlick(p, event.timeStamp);
    if (event.pointerType === "mouse") {
      this.engaged = true;
      this.showMallet(p);
      // Hovering isn't a user gesture, but once the visitor has clicked anywhere on the page
      // the browser allows audio to start (or resume after an idle pause).
      if (this.sound === "on" || (this.sound === "locked" && navigator.userActivation?.hasBeenActive)) {
        void this.unlockAudio();
      }
    }
    this.wake();
  };

  private readonly onPointerDown = (event: PointerEvent) => {
    const p = this.toSvg(event);
    if (!p) return;
    void this.unlockAudio(); // a real gesture: audio may always start here
    this.pointer = p;
    this.engaged = true;
    this.downAt = p;
    this.lastAngle = readRim(p.x, p.y, this.rim).angle;
    if (event.pointerType !== "mouse") {
      this.el.stage.setPointerCapture(event.pointerId);
      this.showMallet(p);
    } else {
      const reading = readRim(p.x, p.y, this.rim);
      if (reading.contact > 0.4) this.strikeAt(reading.angle, 0.75);
    }
    this.wake();
  };

  private readonly onPointerUp = (event: PointerEvent) => {
    if (event.pointerType === "mouse") return;
    const p = this.toSvg(event);
    // A touch that didn't drag is a tap: strike the rim where it landed.
    if (p && this.downAt && Math.hypot(p.x - this.downAt.x, p.y - this.downAt.y) < 8) {
      const reading = readRim(p.x, p.y, this.rim);
      if (reading.contact > 0.4) this.strikeAt(reading.angle, 0.75);
    }
    this.downAt = null;
    this.engaged = false;
    this.hideMallet();
    this.wake();
  };

  private readonly onPointerLeave = (event: PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    this.engaged = false;
    this.lastHand = null;
    this.hideMallet();
    this.wake(); // keep running so the tone rings out and the bowl settles
  };

  /** A quick move from outside onto the rim is a strike, harder the faster the hand arrives. */
  private detectFlick(p: { x: number; y: number }, time: number) {
    const reading = readRim(p.x, p.y, this.rim);
    const last = this.lastHand;
    this.lastHand = { radial: reading.radial, time };
    if (!last || !this.malletVisible) return;
    const dt = (time - last.time) / 1000;
    if (dt <= 0 || dt > 0.1) return;
    const arriving = last.radial > 1.12 && reading.radial <= 1.08 && reading.radial > 0.5;
    const speed = (last.radial - reading.radial) / dt;
    if (arriving && speed > STRIKE_HAND_SPEED) this.strikeAt(reading.angle, clamp01((speed - STRIKE_HAND_SPEED) / 12) * 0.8 + 0.2);
  }

  // ---- frame loop ----

  private wake() {
    this.frame ??= requestAnimationFrame(this.tick);
  }

  private readonly tick = (time: number) => {
    const dt = this.lastTime ? Math.min(0.05, (time - this.lastTime) / 1000) : 1 / 60;
    this.lastTime = time;

    // Fixed-step physics (at most a few steps per frame).
    this.accumulator = Math.min(this.accumulator + dt, 0.05);
    while (this.accumulator >= STEP) {
      this.stepMallet(STEP);
      this.stepBowl(STEP);
      this.accumulator -= STEP;
    }

    // What the tip is actually doing against the rim.
    const reading = readRim(this.tip.x, this.tip.y, this.rim);
    const contact = this.engaged && this.malletVisible ? reading.contact : 0;
    if (contact > 0.05) {
      const instant = angleDelta(this.lastAngle, reading.angle) / dt;
      this.angularVelocity += (instant - this.angularVelocity) * approach(dt, 0.08);
    } else {
      this.angularVelocity *= 1 - approach(dt, 0.12);
    }
    const angle = contact > 0.05 ? reading.angle : this.lastAngle;
    this.lastAngle = angle;
    const pressure = this.pressure * contact;

    // About one slow circle every 2 s (≈3 rad/s) gives a full, calm tone. Pressing harder drives it more.
    const speed = smoothstep(0.25, 4, Math.abs(this.angularVelocity));
    const drive = clamp01(contact * speed * (0.75 + 0.5 * pressure));

    if (drive > this.energy) {
      this.energy += (drive - this.energy) * approach(dt, 1.3);
    } else {
      // A mallet resting on the rim damps the bowl (more so when pressed); lifted away, it rings on.
      const resting = contact > 0.35 && speed < 0.1;
      this.energy *= Math.exp(-dt / (resting ? 1.8 - 1.0 * pressure : 7));
    }
    this.strike *= Math.exp(-dt / 3.4);

    // Now and then the tip catches for an instant: a pixel-sized nick off its line, gone in a blink.
    this.nick *= Math.exp(-dt / 0.06);
    if (contact > 0.5 && speed > 0.2 && Math.random() < speed * dt * 2.5) this.nick = (Math.random() - 0.5) * 2.2;

    // Pressing too hard while moving fast makes the mallet skip and chatter against the rim.
    const chatter = pressure > 0.55 && speed > 0.6 ? (pressure - 0.55) * speed * 55 : 0;
    if (chatter > 0 && Math.random() < chatter * dt) {
      this.audio.rattle(0.6 + 0.4 * Math.random());
      this.energy *= 0.985; // chatter spoils the tone, as it does on a real bowl
      this.nick = (Math.random() - 0.5) * 3;
    }

    // Friction drags the bowl along the direction the rim is moving; it springs back when released.
    if (contact > 0.05 && !this.reducedMotion.matches) {
      const tangentX = -this.rim.rx * Math.sin(angle);
      const tangentY = this.rim.ry * Math.cos(angle);
      const along = tangentX / (Math.hypot(tangentX, tangentY) || 1);
      this.slideVelocity += Math.sign(this.angularVelocity) * along * drive * (0.4 + pressure) * 1000 * dt;
    }

    this.audio.update({
      energy: this.energy,
      strike: this.strike,
      friction: drive * (1 - 0.6 * this.energy),
      pressure,
      angle,
      pan: Math.cos(angle),
    });
    this.renderBowl(time, dt, angle, contact, speed, drive);
    this.renderMallet(angle);

    const settling = Math.abs(this.slide) > 0.01 || Math.abs(this.rock) > 0.005;
    // Stop once the ring-out is well below hearing, so an idle bowl costs nothing.
    if (this.engaged || settling || this.energy > 0.002 || this.strike > 0.002) {
      this.frame = requestAnimationFrame(this.tick);
    } else {
      this.frame = null;
      this.lastTime = 0;
      this.audio.suspend();
    }
  };

  /** The tip chases where the hand wants it (a damped spring), then collides with the solid bowl. */
  private stepMallet(h: number) {
    const tip = this.tip;
    if (this.pointer && this.engaged) {
      const wanted = resolveContact(this.pointer.x, this.pointer.y, this.rim);
      this.pressure += (wanted.pressure - this.pressure) * approach(h, 0.06);
      tip.ax = MALLET_STIFFNESS * (wanted.tip.x - tip.x) - MALLET_DAMPING * tip.vx;
      tip.ay = MALLET_STIFFNESS * (wanted.tip.y - tip.y) - MALLET_DAMPING * tip.vy;
    } else {
      this.pressure *= 1 - approach(h, 0.1);
      tip.ax = -MALLET_DAMPING * tip.vx;
      tip.ay = -MALLET_DAMPING * tip.vy;
    }
    tip.vx += tip.ax * h;
    tip.vy += tip.ay * h;
    // Friction: a tip pressed onto the rim drags instead of gliding freely.
    const drag = Math.exp(-h * 7 * this.pressure);
    tip.vx *= drag;
    tip.vy *= drag;
    tip.x += tip.vx * h;
    tip.y += tip.vy * h;
    this.collide();

    // The mallet sways about the tip: a spring toward its natural angle, pushed by the hand's acceleration.
    const theta = toRad(this.rotation);
    const across = -tip.ax * Math.sin(theta) + tip.ay * Math.cos(theta);
    const contact = readRim(tip.x, tip.y, this.rim).contact;
    const torque = -across * SWING_FROM_ACCELERATION * (1 - 0.7 * contact);
    const error = toDeg(angleDelta(theta, toRad(this.targetRotation())));
    this.spin += (SWING_STIFFNESS * error - SWING_DAMPING * this.spin + torque) * h;
    this.rotation += this.spin * h;
  }

  /** The bowl is solid: the tip can't enter its wall. Hitting it fast is a strike. */
  private collide() {
    if (!this.engaged || !this.pointer) return;
    const tip = this.tip;
    const { cx, cy, rx, ry } = this.rim;
    const nx = (tip.x - cx) / rx;
    const ny = (tip.y - cy) / ry;
    const radial = Math.hypot(nx, ny);
    // Only the wall near the rim is solid; far inside is the open mouth of the bowl.
    if (radial >= 1 || radial < 0.55 || resolveContact(this.pointer.x, this.pointer.y, this.rim).contact < 0.5) return;

    const ux = nx / radial;
    const uy = ny / radial;
    // Velocity in rim-normalised units, split into the part along the rim's normal.
    const vx = tip.vx / rx;
    const vy = tip.vy / ry;
    const inward = vx * ux + vy * uy; // negative = moving into the bowl
    tip.x = cx + ux * rx;
    tip.y = cy + uy * ry;
    if (inward < 0) {
      // Mostly inelastic: a small bounce off the bronze.
      const bounce = 1.15 * inward;
      tip.vx = (vx - bounce * ux) * rx;
      tip.vy = (vy - bounce * uy) * ry;
    }
  }

  private stepBowl(h: number) {
    this.slideVelocity += (-BOWL_SLIDE_STIFFNESS * this.slide - BOWL_SLIDE_DAMPING * this.slideVelocity) * h;
    this.slide += this.slideVelocity * h;
    this.rockVelocity += (-BOWL_ROCK_STIFFNESS * this.rock - BOWL_ROCK_DAMPING * this.rockVelocity) * h;
    this.rock += this.rockVelocity * h;
  }

  /** Handle points outward from the bowl (held against the outside of the rim), relaxing when far away. */
  private targetRotation() {
    const reading = readRim(this.tip.x, this.tip.y, this.rim);
    const outward = toDeg(Math.atan2(this.tip.y - this.rim.cy, this.tip.x - this.rim.cx));
    const nearness = clamp01((2.3 - reading.radial) / 1.1);
    // Friction leans the handle back against the direction of travel, more so when pressing.
    const lean = Math.max(-16, Math.min(16, -this.angularVelocity * 3 * (0.6 + this.pressure))) * reading.contact;
    return REST_ANGLE_DEG + toDeg(angleDelta(toRad(REST_ANGLE_DEG), toRad(outward))) * nearness + lean;
  }

  private renderBowl(time: number, dt: number, angle: number, contact: number, speed: number, drive: number) {
    const level = clamp01(this.energy + this.strike * 0.8);
    this.el.glow.setAttribute("opacity", Math.min(0.6, level * 0.65).toFixed(3));
    // Standing-wave rings inside breathe slowly while the bowl sings.
    this.el.song.setAttribute("opacity", (level * 0.5 * (0.72 + 0.28 * Math.sin(time * 0.0047))).toFixed(3));

    const point = rimPoint(angle, this.rim);
    this.el.contact.setAttribute("cx", point.x.toFixed(1));
    this.el.contact.setAttribute("cy", point.y.toFixed(1));
    this.el.contact.setAttribute("opacity", (contact * (0.2 + 0.6 * speed)).toFixed(3));

    if (this.reducedMotion.matches) {
      this.el.bowl.setAttribute("transform", `rotate(${BOWL_TILT_DEG} ${BOWL_PIVOT.x} ${BOWL_PIVOT.y})`);
      return;
    }
    // Slide and rock on the cushion, plus a barely-there shimmer while it sings (under a pixel).
    const shimmer = this.energy * 0.6 + this.strike * 0.9;
    const dx = this.slide + Math.sin(time * 0.0565) * shimmer;
    const dy = Math.cos(time * 0.0491) * shimmer * 0.3;
    this.el.bowl.setAttribute(
      "transform",
      `translate(${dx.toFixed(2)} ${dy.toFixed(2)}) rotate(${(BOWL_TILT_DEG + this.rock).toFixed(3)} ${BOWL_PIVOT.x} ${BOWL_PIVOT.y})`,
    );

    this.rippleCooldown -= dt;
    if (drive > 0.18 && this.rippleCooldown <= 0) {
      this.spawnRipple(point.x, point.y, 0.25 + 0.3 * this.energy);
      this.rippleCooldown = 0.95 - 0.45 * this.energy;
    }
  }

  private renderMallet(angle: number) {
    // Nicks push the tip slightly off the rim along its normal; the physics state itself stays on the circle.
    const x = this.tip.x + Math.cos(angle) * this.nick;
    const y = this.tip.y + Math.sin(angle) * this.nick * (this.rim.ry / this.rim.rx);
    // Rotating about the group's own origin (the tip) keeps the tip exactly where it touches.
    this.el.mallet.setAttribute("transform", `translate(${x.toFixed(2)} ${y.toFixed(2)}) rotate(${this.rotation.toFixed(2)})`);
  }

  private spawnRipple(x: number, y: number, strength: number) {
    const ripple = this.el.ripples[this.rippleIndex++ % this.el.ripples.length];
    if (!ripple) return;
    gsap.killTweensOf(ripple);
    gsap.fromTo(
      ripple,
      { attr: { cx: x, cy: y, rx: 4, ry: 2 }, opacity: strength },
      { attr: { rx: 46, ry: 16 }, opacity: 0, duration: 1.8, ease: "sine.out" },
    );
  }

  // ---- helpers ----

  private strikeAt(angle: number, velocity: number) {
    this.strike = Math.min(1, this.strike + 0.55 * velocity);
    this.energy = Math.min(1, this.energy + 0.08 * velocity);
    this.audio.strike(velocity);
    // The blow nudges the bowl away from the struck side and rocks it on its base.
    if (!this.reducedMotion.matches) {
      this.slideVelocity -= Math.cos(angle) * velocity * 60;
      this.rockVelocity -= Math.cos(angle) * velocity * 14;
    }
    const point = rimPoint(angle, this.rim);
    if (!this.reducedMotion.matches) this.spawnRipple(point.x, point.y, 0.55);
    this.wake();
  }

  private showMallet(at: { x: number; y: number }) {
    if (this.malletVisible) return;
    this.malletVisible = true;
    // Appear where the pointer is instead of flying in from where it was last seen.
    this.tip = { x: at.x, y: at.y, vx: 0, vy: 0, ax: 0, ay: 0 };
    this.spin = 0;
    gsap.to(this.el.mallet, { opacity: 1, duration: 0.35, ease: "power2.out", overwrite: "auto" });
  }

  private hideMallet() {
    if (!this.malletVisible) return;
    this.malletVisible = false;
    gsap.to(this.el.mallet, { opacity: 0, duration: 0.6, ease: "power2.out", overwrite: "auto" });
  }

  private async unlockAudio() {
    if (this.sound === "unavailable") return;
    const running = await this.audio.unlock();
    if (running && this.sound === "locked") this.setSound("on");
  }

  private setSound(state: SoundState) {
    this.sound = state;
    this.onSoundState(state);
  }

  private toSvg(event: PointerEvent) {
    const matrix = this.el.svg.getScreenCTM();
    if (!matrix) return null;
    const p = new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix.inverse());
    return { x: p.x, y: p.y };
  }
}
