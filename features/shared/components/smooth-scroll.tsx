"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/features/shared/lib/gsap";

let lenis: Lenis | null = null;

/**
 * Lenis smooth scrolling for the public site, driven by GSAP's ticker so ScrollTrigger animations
 * stay in step with the eased scroll. Off for visitors who prefer reduced motion. It pauses while
 * something locks the page (mobile menu, image viewer set body overflow: hidden).
 */
export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const instance = new Lenis({
      autoRaf: false,
      // Measure the page through <body>: <html> is fixed at full-screen height (h-full), so watching it
      // would miss the page growing after load and stop the scroll short of the bottom.
      content: document.body,
      lerp: 0.1,
      anchors: { offset: -88 },
      allowNestedScroll: true,
      stopInertiaOnNavigate: true,
    });
    lenis = instance;

    instance.on("scroll", ScrollTrigger.update);
    // Re-measure whenever ScrollTrigger recalculates (images, fonts, split text, opened FAQs, new pages).
    const resize = () => instance.resize();
    ScrollTrigger.addEventListener("refresh", resize);
    const tick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Follow scroll locks set elsewhere (menu, dialogs) by watching the body's overflow.
    const sync = () => (document.body.style.overflow === "hidden" ? instance.stop() : instance.start());
    const observer = new MutationObserver(sync);
    observer.observe(document.body, { attributes: true, attributeFilter: ["style"] });

    return () => {
      observer.disconnect();
      ScrollTrigger.removeEventListener("refresh", resize);
      gsap.ticker.remove(tick);
      instance.destroy();
      lenis = null;
    };
  }, []);

  // New page: start at the top, without easing from the previous page's position.
  useEffect(() => {
    lenis?.resize();
    if (window.location.hash) return;
    lenis?.scrollTo(0, { immediate: true, force: true });
  }, [pathname]);

  return null;
}
