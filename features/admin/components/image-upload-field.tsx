"use client";

import { useId, useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Loader2 } from "lucide-react";
import { cn } from "cn";
import { Label } from "@/components/ui/label";

/** Uploads straight to R2 via a signed URL; submits the resulting public URL as `name`. */
export async function uploadImage(file: File) {
  const res = await fetch("/api/admin/uploads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contentType: file.type, size: file.size }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? "Upload failed.");

  const put = await fetch(data.uploadUrl, { method: "PUT", headers: { "Content-Type": file.type }, body: file });
  if (!put.ok) throw new Error("Upload to storage failed. Check the bucket's CORS settings.");
  return data.publicUrl as string;
}

export function ImageUploadField({
  name,
  label,
  defaultValue,
  aspect = "aspect-video",
  readOnly,
  removable,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  aspect?: string;
  readOnly?: boolean;
  /** For optional images: shows a "Remove" action that clears the field. */
  removable?: boolean;
}) {
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState(defaultValue ?? "");
  const [dragging, setDragging] = useState(false);
  const [status, setStatus] = useState<{ uploading: boolean; error?: string }>({ uploading: false });

  async function onFile(file: File | undefined) {
    if (!file || readOnly) return;
    setStatus({ uploading: true });
    try {
      setUrl(await uploadImage(file));
      setStatus({ uploading: false });
    } catch (error) {
      setStatus({ uploading: false, error: error instanceof Error ? error.message : "Upload failed." });
    } finally {
      if (input.current) input.current.value = "";
    }
  }

  const pick = () => !readOnly && !status.uploading && input.current?.click();

  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <input type="hidden" name={name} value={url} />
      <div
        role={readOnly ? undefined : "button"}
        tabIndex={readOnly ? undefined : 0}
        aria-label={readOnly ? undefined : url ? `Replace ${label.toLowerCase()}` : `Upload ${label.toLowerCase()}`}
        onClick={pick}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            pick();
          }
        }}
        onDragOver={(event) => {
          if (readOnly) return;
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          onFile(event.dataTransfer.files?.[0]);
        }}
        className={cn(
          `group relative ${aspect} w-full overflow-hidden rounded-lg border bg-muted outline-none focus-visible:ring-3 focus-visible:ring-ring/50`,
          !url && "border-dashed border-input",
          dragging && "border-brand ring-3 ring-brand/20",
        )}
      >
        {url ? (
          <>
            <Image src={url} alt="" fill sizes="(min-width: 1024px) 640px, 100vw" className="object-cover" />
            {!readOnly && (
              <span className="absolute inset-0 flex items-center justify-center bg-brand/0 text-sm font-medium text-white opacity-0 transition-all group-hover:bg-brand/50 group-hover:opacity-100">
                <ImagePlus className="mr-2 size-4" /> Replace image
              </span>
            )}
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 p-4 text-center text-sm text-muted-foreground">
            <span className="grid size-10 place-items-center rounded-full bg-card text-brand shadow-sm">
              <ImagePlus className="size-5" />
            </span>
            <span>
              <span className="font-medium text-foreground">Click to upload</span> or drag an image here
            </span>
            <span className="text-xs">JPEG, PNG, WebP or AVIF, up to 10 MB</span>
          </div>
        )}
        {status.uploading && (
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-background/75 text-sm font-medium">
            <Loader2 className="size-4 animate-spin" /> Uploading…
          </div>
        )}
      </div>
      <input
        ref={input}
        id={id}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="sr-only"
        tabIndex={-1}
        disabled={readOnly}
        onChange={(event) => onFile(event.target.files?.[0])}
      />
      {removable && url && !readOnly && !status.uploading && (
        <button type="button" onClick={() => setUrl("")} className="w-fit text-sm text-muted-foreground underline-offset-4 hover:text-destructive hover:underline">
          Remove {label.toLowerCase()}
        </button>
      )}
      {status.error && (
        <p role="alert" className="text-sm text-destructive">
          {status.error}
        </p>
      )}
    </div>
  );
}
