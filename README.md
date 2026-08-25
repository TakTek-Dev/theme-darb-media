# Darb Media — Archive Website

Premium Arabic RTL media archive for **درب ميديا** (Darb Media): a permanent, searchable home for the platform's programs and episodes.

> نحكي عن فلسطين.. بطريقة أخرى

## Stack

Static multi-page site — no build step, runs on any static host.

- `index.html` — home (cinematic featured episode + latest + programs + picks)
- `programs.html` / `program.html?p={slug}` — programs index / program archive
- `episodes.html` — full archive with filters (program / year / month / sort)
- `search.html` — live search with filters (program / year / content type)
- `episode.html?e={id}` — watch page (player, about, next-in-program, related)
- `about.html` — about the platform
- `assets/css/main.css` — design system (navy `#20283F` family + gold `#F5C21C`)
- `assets/js/data.js` — **all content lives here** (programs + episodes)
- `assets/js/app.js` — rendering engine (header/footer, cards, thumbs, search, filters, player)

## Content

`assets/js/data.js` ships with **synthetic demo content** (labeled in the file header). Replace it with real content, or generate the same JSON shape from a CMS/API.

Episode fields: `id` (short-link code), `slug`, `program`, `no`, `title`, `description`, `date`, `duration`, `tags[]`, `video {type, src}`.

### Video sources

The player supports three source types per episode:

```js
video: { type: "youtube", src: "VIDEO_ID" }
video: { type: "mp4",     src: "https://.../file.mp4" }
video: { type: "telegram", src: "DarbM22/123" }   // channel/post
```

Empty `type` shows an authored "source not linked yet" state.

**Demo playback:** the bottom of `data.js` has a clearly marked block that fills every episode lacking a real source with a self-hosted branded clip from `assets/video/demo/` (5 clips, ~32 KB each, generated with ffmpeg — no external dependency, works offline). Setting a real `video` on an episode makes the loop skip it. **Delete that block before launch.**

## Short links

Every episode's canonical short link is `/e/{id}`. On static hosting it is emulated as `episode.html?e={id}`. For production, add a rewrite so `/e/{id}` serves the episode page, e.g.:

- **Netlify** `_redirects`: `/e/* /episode.html?e=:splat 200`
- **nginx**: `location ~ ^/e/(.+)$ { rewrite ^/e/(.+)$ /episode.html?e=$1 last; }`

## Social sharing (OG)

Every page carries Open Graph + Twitter meta with a brand card (`assets/img/og-card.png`). In production, change `og:image` to an **absolute URL** (crawlers ignore relative ones), and ideally serve per-episode OG tags from the `/e/{id}` rewrite.

## Cache busting

All CSS/JS references carry `?v=N`. Bump `N` on every asset change.

## Fonts

Google Fonts: **Noto Kufi Arabic** (display) + **IBM Plex Sans Arabic** (body/UI). Self-host for full independence if needed.
