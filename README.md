# Hex Healing Hub — Frontend

Single Next.js app (App Router). Feature-based structure:

```
app/            routes only — pages compose feature components
features/
  home/         homepage sections
  about/        about page sections
  services/     portfolio & services page sections + data
  contact/      contact form
  blog/         blog listing/detail sections
  shared/       nav, footer, cta, shared lib
```

Content (services, portfolio items, blog posts) is static, defined in `features/shared/lib/data.ts` and `features/services/data.ts` — no backend/CMS. Edit those files directly to update content.

The contact form has no backend either — on submit it opens the visitor's email client via a pre-filled `mailto:` link to `Hexhealinghub@gmail.com`.

## Setup

```bash
pnpm install
pnpm dev
```

## Build

```bash
pnpm build
pnpm start
```

## VPS deployment

```bash
pnpm install && pnpm build
pm2 start "pnpm start" --name hex-healing-frontend
```

Point Nginx at the app's port (3000 by default) and set up SSL with certbot.

## Media licensing

Homepage background videos (`public/videos/scene-1..5.mp4`) are from [Mixkit](https://mixkit.co), clips 3350, 4148, 4281, 4040 and 4999, all under the **Mixkit Stock Video Free License** (free for commercial use, no attribution required). They were re-encoded as forward-and-reverse seamless loops. Mixkit items under the *Restricted* license were deliberately avoided.
