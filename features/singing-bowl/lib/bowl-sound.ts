/**
 * Singing-bowl sound. The interaction never "plays a sound"; it continuously reports how much
 * the bowl is vibrating (a BowlFrame) and the sound follows those values smoothly.
 *
 * To use a recorded bowl instead of synthesis: implement BowlSound with an AudioBufferSourceNode
 * looping the sample (gain from `energy`, a touch of `playbackRate`/filter from `strike`), and
 * return it from `createSound` below. Nothing else changes.
 */

export type BowlFrame = {
  /** 0..1 sustained resonance built up by rubbing the rim. */
  energy: number;
  /** 0..1 decaying energy from a strike (tap/click on the rim). */
  strike: number;
  /** 0..1 wood-on-metal rub: strongest when the bowl hasn't started singing yet. */
  friction: number;
  /** 0..1 how hard the mallet presses on the rim: a harder press gives a grittier, brighter rub. */
  pressure: number;
  /** Contact point around the rim, radians. The beating pattern follows the mallet, as on a real bowl. */
  angle: number;
  /** -1..1 stereo position of the contact point. */
  pan: number;
};

export interface BowlSound {
  update(frame: BowlFrame, time: number): void;
  /** The short "tock" of the mallet meeting the rim. */
  strikeTransient(velocity: number): void;
  /** One tiny tick of the mallet chattering against the rim (pressing too hard, too fast). */
  rattle(intensity: number): void;
  setMuted(muted: boolean): void;
  dispose(): void;
}

/**
 * Inharmonic partials of a hand-hammered Tibetan bowl (ratios ≈ 1 : 2.7 : 5.2 : 8.4). Each is a pair
 * of slightly detuned oscillators: real bowls are never perfectly round, so every mode splits in two
 * and beats (the slow "wah-wah"). `brightness` > 1 means the partial only wakes up when driven harder.
 */
const PARTIALS = [
  { ratio: 1, beatHz: 0.75, weight: 0.5, brightness: 1 },
  { ratio: 2.71, beatHz: 1.8, weight: 0.3, brightness: 1.6 },
  { ratio: 5.18, beatHz: 3.1, weight: 0.12, brightness: 2.3 },
  { ratio: 8.35, beatHz: 4.3, weight: 0.05, brightness: 3 },
] as const;

const FUNDAMENTAL_HZ = 196;
const OUTPUT_LEVEL = 0.7;

class SynthBowlSound implements BowlSound {
  private readonly output: GainNode;
  private readonly compressor: DynamicsCompressorNode;
  private readonly filter: BiquadFilterNode;
  private readonly panner: StereoPannerNode;
  private readonly partialGains: GainNode[] = [];
  private readonly oscillators: OscillatorNode[][] = [];
  private readonly noiseBuffer: AudioBuffer;
  private readonly noise: AudioBufferSourceNode;
  private readonly noiseGain: GainNode;
  private readonly rub: BiquadFilterNode;

  constructor(private readonly ctx: AudioContext) {
    this.compressor = new DynamicsCompressorNode(ctx, { threshold: -18, knee: 12, ratio: 3, attack: 0.01, release: 0.4 });
    this.compressor.connect(ctx.destination);
    this.output = new GainNode(ctx, { gain: OUTPUT_LEVEL });
    this.output.connect(this.compressor);
    this.panner = new StereoPannerNode(ctx, { pan: 0 });
    this.panner.connect(this.output);
    // A little room: bowls are always heard in a space, never bone-dry.
    const room = new ConvolverNode(ctx, { buffer: roomImpulse(ctx, 2.8) });
    const wet = new GainNode(ctx, { gain: 0.22 });
    this.panner.connect(room).connect(wet).connect(this.output);
    this.filter = new BiquadFilterNode(ctx, { type: "lowpass", frequency: 800, Q: 0.4 });
    this.filter.connect(this.panner);

    for (const partial of PARTIALS) {
      const gain = new GainNode(ctx, { gain: 0 });
      gain.connect(this.filter);
      const frequency = FUNDAMENTAL_HZ * partial.ratio;
      const pair = [frequency, frequency + partial.beatHz].map((hz) => {
        const osc = new OscillatorNode(ctx, { type: "sine", frequency: hz });
        osc.connect(gain);
        osc.start();
        return osc;
      });
      this.partialGains.push(gain);
      this.oscillators.push(pair);
    }

    // Friction: soft band-passed noise, the sound of suede/wood dragging on bronze.
    this.noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const data = this.noiseBuffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    this.noise = new AudioBufferSourceNode(ctx, { buffer: this.noiseBuffer, loop: true });
    this.rub = new BiquadFilterNode(ctx, { type: "bandpass", frequency: 1800, Q: 0.7 });
    this.noiseGain = new GainNode(ctx, { gain: 0 });
    this.noise.connect(this.rub).connect(this.noiseGain).connect(this.panner);
    this.noise.start();
  }

  update(frame: BowlFrame, time: number) {
    // More energy opens the filter: the tone brightens as the bowl sings harder.
    this.filter.frequency.setTargetAtTime(650 + 4800 * frame.energy + 3200 * frame.strike, time, 0.12);
    this.panner.pan.setTargetAtTime(frame.pan * 0.35, time, 0.25);

    PARTIALS.forEach((partial, i) => {
      const sustained = partial.weight * frame.energy ** partial.brightness;
      // Higher partials die away faster after a strike (the exponent shrinks them sooner).
      const struck = partial.weight * 1.4 * frame.strike ** (1 + i * 0.5);
      // The lower modes' loudness shifts with where the mallet is, so circling the rim "turns" the tone.
      const orientation = i < 2 ? 0.86 + 0.14 * Math.cos(2 * frame.angle + i * 1.3) : 1;
      this.partialGains[i].gain.setTargetAtTime((sustained * orientation + struck) * 0.5, time, 0.06);

      // Slow, never-repeating drift of a few cents so the tone keeps evolving.
      const drift = Math.sin(time * 0.11 * (i + 1) + i * 2.1) * 4 + Math.sin(time * 0.037 * (i + 2)) * 3;
      for (const osc of this.oscillators[i]) osc.detune.setTargetAtTime(drift, time, 0.5);
    });

    // Pressing harder makes the rub louder and grittier (higher band), as with a real mallet.
    this.noiseGain.gain.setTargetAtTime(frame.friction * (0.022 + 0.04 * frame.pressure), time, 0.05);
    this.rub.frequency.setTargetAtTime(1500 + 1600 * frame.pressure, time, 0.1);
  }

  strikeTransient(velocity: number) {
    this.tick(0.09 * velocity, 2600, 0.08);
  }

  rattle(intensity: number) {
    // Shorter and brighter than a strike: a dry metallic tick.
    this.tick(0.03 * intensity, 5200, 0.025);
  }

  private tick(level: number, brightness: number, length: number) {
    const now = this.ctx.currentTime;
    const click = new AudioBufferSourceNode(this.ctx, { buffer: this.noiseBuffer, playbackRate: 0.8 + Math.random() * 0.4 });
    const tone = new BiquadFilterNode(this.ctx, { type: "lowpass", frequency: brightness });
    const envelope = new GainNode(this.ctx, { gain: 0 });
    envelope.gain.setValueAtTime(0, now);
    envelope.gain.linearRampToValueAtTime(level, now + 0.003);
    envelope.gain.exponentialRampToValueAtTime(0.0001, now + length);
    click.connect(tone).connect(envelope).connect(this.panner);
    click.start(now, Math.random() * 1.5);
    click.stop(now + length + 0.02);
    click.onended = () => click.disconnect();
  }

  setMuted(muted: boolean) {
    this.output.gain.setTargetAtTime(muted ? 0 : OUTPUT_LEVEL, this.ctx.currentTime, 0.15);
  }

  dispose() {
    for (const pair of this.oscillators) for (const osc of pair) osc.stop();
    this.noise.stop();
    this.output.disconnect();
    this.compressor.disconnect();
  }
}

/** A generated room impulse: decaying stereo noise, darker as it fades (like a warm, quiet room). */
function roomImpulse(ctx: AudioContext, seconds: number) {
  const length = Math.floor(ctx.sampleRate * seconds);
  const impulse = ctx.createBuffer(2, length, ctx.sampleRate);
  for (let channel = 0; channel < 2; channel++) {
    const data = impulse.getChannelData(channel);
    let smoothed = 0;
    for (let i = 0; i < length; i++) {
      const t = i / length;
      // One-pole low-pass that closes over time: high frequencies die first.
      const cutoff = 0.9 - 0.8 * t;
      smoothed += cutoff * ((Math.random() * 2 - 1) - smoothed);
      data[i] = smoothed * (1 - t) ** 2.4;
    }
  }
  return impulse;
}

function createSound(ctx: AudioContext): BowlSound {
  return new SynthBowlSound(ctx);
}

/**
 * Owns the AudioContext. Browsers only allow audio after a real user gesture (click / tap / key),
 * so the context is created lazily in `unlock()`, called from such a gesture.
 */
export class BowlAudio {
  private ctx: AudioContext | null = null;
  private sound: BowlSound | null = null;
  private muted = false;
  private unlocking: Promise<boolean> | null = null;

  static get isSupported() {
    return typeof window !== "undefined" && "AudioContext" in window;
  }

  get isRunning() {
    return this.ctx?.state === "running";
  }

  unlock(): Promise<boolean> {
    if (!BowlAudio.isSupported) return Promise.resolve(false);
    this.unlocking ??= (async () => {
      this.ctx ??= new AudioContext({ latencyHint: "interactive" });
      this.sound ??= createSound(this.ctx);
      this.sound.setMuted(this.muted);
      if (this.ctx.state !== "running") await this.ctx.resume().catch(() => undefined);
      return this.ctx.state === "running";
    })().finally(() => {
      this.unlocking = null;
    });
    return this.unlocking;
  }

  update(frame: BowlFrame) {
    if (this.ctx?.state === "running") this.sound?.update(frame, this.ctx.currentTime);
  }

  strike(velocity: number) {
    if (this.ctx?.state === "running" && !this.muted) this.sound?.strikeTransient(velocity);
  }

  rattle(intensity: number) {
    if (this.ctx?.state === "running" && !this.muted) this.sound?.rattle(intensity);
  }

  setMuted(muted: boolean) {
    this.muted = muted;
    this.sound?.setMuted(muted);
  }

  /** Pause the audio thread while the bowl is silent; `unlock()` resumes it. */
  suspend() {
    if (this.ctx?.state === "running") void this.ctx.suspend();
  }

  dispose() {
    this.sound?.dispose();
    void this.ctx?.close();
    this.sound = null;
    this.ctx = null;
  }
}
