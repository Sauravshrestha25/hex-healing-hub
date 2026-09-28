"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { saveBlog } from "@/features/admin/server/blogs";
import type { FormState } from "@/features/shared/lib/form-state";
import { Field, FormActions } from "./form-bits";
import { ImageUploadField } from "./image-upload-field";
import { RichTextEditor } from "./rich-text-editor";
import { usePreservingSubmit } from "@/features/shared/lib/use-preserving-submit";

type BlogValues = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  coverImage: string;
  content: string;
  published: boolean;
};

export function BlogForm({ blog }: { blog?: BlogValues }) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(saveBlog, {});
  const onSubmit = usePreservingSubmit(formAction);

  return (
    <form action={formAction} onSubmit={onSubmit} className="grid max-w-4xl gap-6">
      {blog && <input type="hidden" name="id" value={blog.id} />}
      <div className="grid gap-6 md:grid-cols-2">
        <Field id="title" label="Title">
          <Input id="title" name="title" defaultValue={blog?.title} required maxLength={200} />
        </Field>
        <Field id="slug" label="URL slug" hint="Leave blank to generate from the title.">
          <Input id="slug" name="slug" defaultValue={blog?.slug} maxLength={80} />
        </Field>
        <Field id="category" label="Category">
          <Input id="category" name="category" defaultValue={blog?.category} required maxLength={80} />
        </Field>
        <div className="flex items-center gap-3 self-end pb-2">
          <Switch id="published" name="published" value="on" defaultChecked={blog?.published ?? false} />
          <Label htmlFor="published">Published</Label>
        </div>
      </div>
      <Field id="excerpt" label="Excerpt" hint="Shown on the blog list and in search results.">
        <Textarea id="excerpt" name="excerpt" defaultValue={blog?.excerpt} required maxLength={400} rows={3} />
      </Field>
      <ImageUploadField name="coverImage" label="Cover image" defaultValue={blog?.coverImage} aspect="aspect-video max-w-xl" />
      <div className="grid gap-2">
        <Label>Article</Label>
        <RichTextEditor name="content" defaultValue={blog?.content} />
      </div>
      <FormActions pending={pending} cancelHref="/admin/blogs" error={state.error} />
    </form>
  );
}
