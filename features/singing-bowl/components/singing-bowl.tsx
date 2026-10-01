"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { BellRing, Volume2, VolumeX } from "lucide-react";
import { BowlController, type SoundState } from "@/features/singing-bowl/lib/bowl-controller";
import { BowlAudio } from "@/features/singing-bowl/lib/bowl-sound";
import { BowlArt, RIM, type OnBowlPart } from "./bowl-art";

const HINTS: Record<SoundState, string> = {
  locked: "Click or tap the bowl once to wake its sound.",
  on: "Circle the rim slowly. Rest the mallet on it to quiet the tone.",
  muted: "Sound is off. The bowl still responds to your touch.",
  unavailable: "Sound isn't available in this browser, but you can still play the bowl.",
};

const noSubscription = () => () => undefined;

/** The playable bowl: markup and controls. All interaction runs in BowlController, outside React. */
export function SingingBowl() {
  const stage = useRef<HTMLDivElement>(null);
  const elements = useRef(new Map<string, Element>());
  const controller = useRef<BowlController | null>(null);
  const [soundState, setSoundState] = useState<SoundState>("locked");
  const supported = useSyncExternalStore(noSubscription, () => BowlAudio.isSupported, () => true);
  const sound: SoundState = supported ? soundState : "unavailable";

  const onPart: OnBowlPart = (name, element) => {
    if (element) elements.current.set(name, element);
    else elements.current.delete(name);
  };

  useEffect(() => {
    const found = elements.current;
    const svg = found.get("svg");
    const bowl = found.get("bowl");
    const glow = found.get("glow");
    const song = found.get("song");
    const contact = found.get("contact");
    const mallet = found.get("mallet");
    if (
      !stage.current ||
      !(svg instanceof SVGSVGElement) ||
      !(bowl instanceof SVGGElement) ||
      !(glow instanceof SVGElement) ||
      !(song instanceof SVGElement) ||
      !(contact instanceof SVGCircleElement) ||
      !(mallet instanceof SVGGElement)
    ) {
      return;
    }
    const ripples = [...found]
      .filter(([name]) => name.startsWith("ripple-"))
      .map(([, element]) => element)
      .filter((element): element is SVGEllipseElement => element instanceof SVGEllipseElement);

    const bowlController = new BowlController(
      { stage: stage.current, svg, bowl, glow, song, contact, ripples, mallet },
      RIM,
      setSoundState,
    );
    controller.current = bowlController;
    return () => {
      bowlController.dispose();
      controller.current = null;
    };
  }, []);

  return (
    <div className="flex flex-col items-center">
      <div
        ref={stage}
        // Only this stage hides the cursor and captures touch; the rest of the page scrolls normally.
        className="relative aspect-[5/4] w-full max-w-[620px] cursor-none touch-none select-none"
      >
        <BowlArt onPart={onPart} />
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => controller.current?.toggleSound()}
          disabled={sound === "unavailable"}
          aria-pressed={sound === "on"}
          className="inline-flex items-center gap-2 rounded-full border border-gold/30 px-5 py-2.5 text-sm text-ivory transition-colors hover:border-gold hover:text-gold-light disabled:opacity-40"
        >
          {sound === "on" ? <Volume2 className="size-4" aria-hidden="true" /> : <VolumeX className="size-4" aria-hidden="true" />}
          {sound === "on" ? "Sound on" : sound === "muted" ? "Sound off" : "Turn on sound"}
        </button>
        <button
          type="button"
          onClick={() => controller.current?.strikeFront()}
          className="btn-gold inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium"
        >
          <BellRing className="size-4" aria-hidden="true" /> Strike the bowl
        </button>
      </div>
      <p aria-live="polite" className="mt-4 max-w-sm text-center text-xs leading-relaxed text-lavender">
        {HINTS[sound]}
      </p>
    </div>
  );
}
