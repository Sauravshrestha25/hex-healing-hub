"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { GalleryItem } from "@/features/shared/lib/data";


export function Gallery({ items }: { items: GalleryItem[] }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const isOpen = active !== null;
  const selected = active === null ? null : items[active];

  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [isOpen]);

  function step(direction: number) {
    setActive(current => current === null ? null : (current + direction + items.length) % items.length);
  }

  return (
    <>
      <section id="gallery" aria-labelledby="gallery-title" className="mx-auto w-[90%] scroll-mt-24 py-20 lg:py-28">
        <div className="page-reveal flex flex-col justify-between gap-5 border-b hairline-gold pb-8 sm:flex-row sm:items-end">
          <div>
            <h2 id="gallery-title" className="mt-5 font-heading text-3xl sm:text-4xl">Moments that invite <span className="text-gold-light">a pause.</span></h2>
          </div>
          <p className="text-xs text-lavender">{String(items.length).padStart(2, "0")} {items.length === 1 ? "image" : "images"} · Select an image to explore</p>
        </div>
        <div className="grid items-start gap-x-12 gap-y-12 pt-12 md:grid-cols-2 lg:gap-x-24">
          {items.map((item, index) => (
            <figure key={item.id} className={`page-reveal ${index % 2 === 1 ? "md:pt-24" : ""}`}>
              <button
                type="button"
                aria-label={`View ${item.title}`}
                aria-haspopup="dialog"
                onClick={() => { setActive(index); dialog.current?.showModal(); }}
                className={`group relative block w-full cursor-zoom-in overflow-hidden bg-purple focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold ${index % 3 === 0 ? "aspect-[4/5]" : "aspect-[4/3]"}`}
              >
                <Image src={item.image} alt={item.alt} fill sizes="(min-width: 768px) 43vw, 90vw" className={`object-cover transition-transform duration-700 motion-safe:group-hover:scale-105 ${index === 0 ? "object-[65%_center]" : ""}`} />
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/35 to-transparent" />
                <span aria-hidden="true" className="absolute bottom-5 right-5 flex h-11 w-11 items-center justify-center rounded-full border border-white/40 bg-ink/40 text-xl text-white backdrop-blur-sm">↗</span>
              </button>
              <figcaption className="flex items-start justify-between gap-4 border-b hairline-gold py-6">
                <div>
                  <p className="mb-2 text-[0.65rem] uppercase tracking-[0.2em] text-gold">{item.category}</p>
                  <h3 className="font-heading text-xl sm:text-2xl">{item.title}</h3>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
      <dialog
        ref={dialog}
        aria-labelledby="gallery-dialog-title"
        onClose={() => setActive(null)}
        onClick={event => {
          if (event.target !== event.currentTarget) return;
          const bounds = event.currentTarget.getBoundingClientRect();
          if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.current?.close();
        }}
        onKeyDown={event => {
          if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
            event.preventDefault();
            step(event.key === "ArrowRight" ? 1 : -1);
          }
        }}
        className="fixed inset-0 m-auto max-h-[92dvh] w-[92vw] max-w-6xl border border-gold/30 bg-ink p-4 text-ivory backdrop:bg-ink/95 backdrop:backdrop-blur-sm sm:p-6"
      >
        <div className="mb-4 flex items-center justify-between gap-4">
          <p id="gallery-dialog-title" className="font-heading text-lg">{selected?.title ?? "Image viewer"}</p>
          <button type="button" onClick={() => dialog.current?.close()} aria-label="Close image viewer" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold/30 text-xl hover:bg-white/10">×</button>
        </div>
        {selected && <div className="relative h-[58dvh]"><Image src={selected.image} alt={selected.alt} fill sizes="90vw" className="object-contain" /></div>}
        <div className="mt-4 flex items-center justify-between gap-3">
          <button type="button" onClick={() => step(-1)} className="min-h-11 px-3 text-sm text-gold-light">← Previous</button>
          <p aria-live="polite" className="text-xs text-lavender">{active === null ? 0 : active + 1} / {items.length}</p>
          <button type="button" onClick={() => step(1)} className="min-h-11 px-3 text-sm text-gold-light">Next →</button>
        </div>
      </dialog>
    </>
  );
}
