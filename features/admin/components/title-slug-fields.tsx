"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { slugify } from "@/features/shared/lib/slugify";
import { Field } from "./form-bits";

/**
 * Title + URL slug. On new items the slug follows the title as you type, until you edit the slug yourself.
 * Clearing the slug hands it back to the title. The server slugifies again, so this is only a preview.
 */
export function TitleSlugFields({
  defaultTitle = "",
  defaultSlug = "",
  pathPrefix,
  titleMaxLength,
  titleName = "title",
  titleLabel = "Title",
}: {
  defaultTitle?: string;
  defaultSlug?: string;
  pathPrefix: string;
  titleMaxLength: number;
  /** Form field name and label for the title input (e.g. "name" / "Name" for people). */
  titleName?: string;
  titleLabel?: string;
}) {
  const [title, setTitle] = useState(defaultTitle);
  // Existing items keep their URL (changing it would break links to them); only new ones follow the title.
  const [custom, setCustom] = useState(Boolean(defaultSlug));
  const [slug, setSlug] = useState(defaultSlug || slugify(defaultTitle));

  return (
    <>
      <Field id={titleName} label={titleLabel}>
        <Input
          id={titleName}
          name={titleName}
          value={title}
          required
          maxLength={titleMaxLength}
          onChange={(event) => {
            setTitle(event.target.value);
            if (!custom) setSlug(slugify(event.target.value));
          }}
        />
      </Field>
      <Field
        id="slug"
        label="URL"
        hint={
          custom
            ? defaultSlug && slug === defaultSlug
              ? `Changing this breaks existing links to the page. Clear it to follow the ${titleLabel.toLowerCase()}.`
              : `Custom URL. Clear it to follow the ${titleLabel.toLowerCase()} again.`
            : `Filled in from the ${titleLabel.toLowerCase()}. Edit it to set your own.`
        }
      >
        <div className="flex h-9 items-center overflow-hidden rounded-lg border border-input bg-transparent shadow-xs focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50">
          <span className="flex h-full items-center border-r bg-muted px-3 font-mono text-xs whitespace-nowrap text-muted-foreground">{pathPrefix}</span>
          <input
            id="slug"
            name="slug"
            value={slug}
            maxLength={80}
            className="h-full min-w-0 flex-1 bg-transparent px-3 font-mono text-sm outline-none"
            onChange={(event) => {
              const next = event.target.value.toLowerCase().replace(/\s+/g, "-");
              setSlug(next);
              setCustom(next !== "");
              if (next === "") setSlug(slugify(title));
            }}
            onBlur={() => setSlug((current) => slugify(current) || slugify(title))}
          />
        </div>
      </Field>
    </>
  );
}
