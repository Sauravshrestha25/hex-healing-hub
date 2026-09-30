"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import type { GalleryItem } from "@/features/shared/lib/data";

/**
 * Desktop mosaic, repeating every six tiles: one large, two small, three wide. Six tiles fill a 4-column,
 * 3-row block exactly, so there are no gaps. Tablets use a plain 2-column grid, phones a single column.
 */
const TILE_SHAPES = ["lg:col-span-2 lg:row-span-2", "", "", "lg:col-span-2", "lg:col-span-2", "lg:col-span-2"] as const;

const ALL = "All";

export function Gallery({ items }: { items: GalleryItem[] }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [filter, setFilter] = useState<string>(ALL);
  const [active, setActive] = useState<number | null>(null);

  const categories = useMemo(() => [ALL, ...new Set(items.map((item) => item.category))], [items]);
  const shown = useMemo(() => (filter === ALL ? items : items.filter((item) => item.category === filter)), [items, filter]);
  const isOpen = active !== null;
  const selected = active === null ? null : shown[active];

  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  function open(index: number) {
    setActive(index);
    dialog.current?.showModal();
  }

  function step(direction: number) {
    setActive((current) => (current === null ? null : (current + direction + shown.length) % shown.length));
  }

  return (
    <>
      <section id="gallery" aria-labelledby="gallery-title" className="mx-auto w-[90%] scroll-mt-24 pb-24 pt-12 lg:pb-32 lg:pt-16">
        <h2 id="gallery-title" className="sr-only">
          Gallery
        </h2>

        {categories.length > 2 && (
          <div role="group" aria-label="Filter photos" className="page-reveal mb-8 flex flex-wrap justify-center gap-2">
            {categories.map((category) => {
              const isActive = filter === category;
              const count = category === ALL ? items.length : items.filter((item) => item.category === category).length;
              return (
                <button
                  key={category}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setFilter(category)}
                  className={`rounded-full px-5 py-2.5 text-sm transition-colors ${
                    isActive ? "bg-brand-cream text-brand-purple" : "bg-ivory/[0.07] text-ivory/85 hover:bg-ivory/15"
                  }`}
                >
                  {category} <span className={isActive ? "text-brand-purple/60" : "text-lavender"}>{count}</span>
                </button>
              );
            })}
          </div>
        )}

        {shown.length === 0 ? (
          <p className="card-plain py-16 text-center text-lavender">New photos are on their way.</p>
        ) : (
          <ul className="grid auto-rows-[280px] grid-cols-1 gap-4 sm:auto-rows-[260px] sm:grid-cols-2 lg:grid-flow-dense lg:grid-cols-4">
            {shown.map((item, index) => (
              <li key={item.id} className={TILE_SHAPES[index % TILE_SHAPES.length]}>
                <button
                  type="button"
                  aria-label={`View ${item.title}`}
                  aria-haspopup="dialog"
                  onClick={() => open(index)}
                  className="group relative block h-full w-full cursor-zoom-in overflow-hidden rounded-3xl bg-ivory/5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-cream"
                >
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    sizes="(min-width: 1024px) 45vw, 90vw"
                    className="object-cover transition-transform duration-700 motion-safe:group-hover:scale-[1.04]"
                  />
                  <span className="absolute bottom-3 left-3 max-w-[calc(100%-1.5rem)] truncate rounded-full bg-brand-cream px-4 py-2 text-left text-sm font-medium text-brand-purple sm:bottom-4 sm:left-4">
                    {item.title}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <dialog
        ref={dialog}
        aria-labelledby="gallery-dialog-title"
        onClose={() => setActive(null)}
        onClick={(event) => {
          if (event.target !== event.currentTarget) return;
          const bounds = event.currentTarget.getBoundingClientRect();
          if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) {
            dialog.current?.close();
          }
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
            event.preventDefault();
            step(event.key === "ArrowRight" ? 1 : -1);
          }
        }}
        className="fixed inset-0 m-auto max-h-[92dvh] w-[92vw] max-w-6xl rounded-3xl bg-ink p-4 text-ivory backdrop:bg-ink/95 backdrop:backdrop-blur-sm sm:p-6"
      >
        <div className="mb-4 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm text-lavender">{selected?.category}</p>
            <p id="gallery-dialog-title" className="truncate font-heading text-xl">
              {selected?.title ?? "Image viewer"}
            </p>
          </div>
          <button
            type="button"
            onClick={() => dialog.current?.close()}
            aria-label="Close image viewer"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ivory/10 text-xl transition-colors hover:bg-brand-cream hover:text-brand-purple"
          >
            ×
          </button>
        </div>
        {selected && (
          <div className="relative h-[60dvh] overflow-hidden rounded-2xl">
            <Image src={selected.image} alt={selected.alt} fill sizes="90vw" className="object-contain" />
          </div>
        )}
        <div className="mt-4 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => step(-1)}
            className="min-h-11 rounded-full px-4 text-sm transition-colors hover:bg-brand-cream hover:text-brand-purple"
          >
            ← Previous
          </button>
          <p aria-live="polite" className="text-sm text-lavender">
            {active === null ? 0 : active + 1} / {shown.length}
          </p>
          <button
            type="button"
            onClick={() => step(1)}
            className="min-h-11 rounded-full px-4 text-sm transition-colors hover:bg-brand-cream hover:text-brand-purple"
          >
            Next →
          </button>
        </div>
      </dialog>
    </>
  );
}
