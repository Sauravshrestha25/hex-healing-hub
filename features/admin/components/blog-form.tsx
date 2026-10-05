"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { saveBlog } from "@/features/admin/server/blogs";
import type { FormState } from "@/features/shared/lib/form-state";
import { usePreservingSubmit } from "@/features/shared/lib/use-preserving-submit";
import { FORM_SECTIONS, Field, FormActions, FormSection } from "./form-bits";
import { ImageUploadField } from "./image-upload-field";
import { RichTextEditor } from "./rich-text-editor";
import { TitleSlugFields } from "./title-slug-fields";

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

export function BlogForm({ blog, readOnly }: { blog?: BlogValues; readOnly?: boolean }) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(saveBlog, {});
  const onSubmit = usePreservingSubmit(formAction);

  return (
    <form action={formAction} onSubmit={onSubmit}>
      {blog && <input type="hidden" name="id" value={blog.id} />}
      <fieldset disabled={readOnly} className={FORM_SECTIONS}>
        <FormSection title="Basics" description="The title, where it lives and how it's listed.">
          <TitleSlugFields defaultTitle={blog?.title} defaultSlug={blog?.slug} pathPrefix="/blog/" titleMaxLength={200} />
          <Field id="category" label="Category" hint="e.g. Mindfulness, Healing practices">
            <Input id="category" name="category" defaultValue={blog?.category} required maxLength={80} />
          </Field>
          <Field id="excerpt" label="Excerpt" hint="One or two sentences for the blog list and search results.">
            <Textarea id="excerpt" name="excerpt" defaultValue={blog?.excerpt} required maxLength={400} rows={3} />
          </Field>
        </FormSection>

        <FormSection title="Cover image" description="Shown at the top of the post and on the blog list.">
          <ImageUploadField name="coverImage" label="Cover image" defaultValue={blog?.coverImage} aspect="aspect-video" readOnly={readOnly} />
        </FormSection>

        <FormSection wide title="Article" description="Use headings to break up longer posts. Images upload as you add them.">
          <RichTextEditor name="content" defaultValue={blog?.content} readOnly={readOnly} />
        </FormSection>

        <FormSection title="Visibility">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Label htmlFor="published">Published</Label>
              <p className="mt-1 text-sm text-muted-foreground">Visible on the website. Turn off to keep it as a draft.</p>
            </div>
            <Switch id="published" name="published" value="on" defaultChecked={blog?.published ?? false} />
          </div>
        </FormSection>
      </fieldset>
      <FormActions pending={pending} cancelHref="/admin/blogs" error={state.error} readOnly={readOnly} label={blog ? "Save changes" : "Create post"} />
    </form>
  );
}
