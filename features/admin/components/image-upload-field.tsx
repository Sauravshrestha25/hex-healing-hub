"use client";

import { useId, useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
}: {
  name: string;
  label: string;
  defaultValue?: string;
  aspect?: string;
}) {
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState(defaultValue ?? "");
  const [status, setStatus] = useState<{ uploading: boolean; error?: string }>({ uploading: false });

  async function onFile(file: File | undefined) {
    if (!file) return;
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

  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <input type="hidden" name={name} value={url} />
      <div className={`relative ${aspect} w-full overflow-hidden rounded-lg border bg-muted`}>
        {url ? (
          <Image src={url} alt="" fill sizes="(min-width: 1024px) 480px, 100vw" className="object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">No image yet</div>
        )}
        {status.uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/70">
            <Loader2 className="size-5 animate-spin" aria-label="Uploading" />
          </div>
        )}
      </div>
      <div className="flex items-center gap-3">
        <Button type="button" variant="outline" size="sm" disabled={status.uploading} onClick={() => input.current?.click()}>
          <ImagePlus />
          {url ? "Replace image" : "Upload image"}
        </Button>
        <span className="text-xs text-muted-foreground">JPEG, PNG, WebP or AVIF, up to 10 MB</span>
      </div>
      <input
        ref={input}
        id={id}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="sr-only"
        onChange={(event) => onFile(event.target.files?.[0])}
      />
      {status.error && (
        <p role="alert" className="text-sm text-destructive">
          {status.error}
        </p>
      )}
    </div>
  );
}
