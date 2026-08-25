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

**`mp4` sources get the custom DarbPlayer** (`assets/js/player.js`): seek bar with buffered + hover-time tooltip, ±10s, playback rate, volume, Picture-in-Picture, fullscreen, next-episode; a **floating mini-player** that docks to the corner when you scroll away mid-playback (the `<video>` element is never re-parented, so playback never restarts); keyboard shortcuts (Space/K play, M mute, F fullscreen, P PiP, ← → ±5s, J/L ±10s, ↑ ↓ volume, 0–9 jump); **resume** (position per episode in `localStorage`); remembered volume + rate; and an end-screen with a next-episode countdown. `youtube`/`telegram` keep their own embed chrome (the floating dock still applies).

> **mp4 seeking needs HTTP Range (`206`) support** — every real static host (Netlify, nginx, S3, GitHub Pages) provides it, and so does the bundled dev server.

The episode page pairs the player with a **programme playlist rail** (all episodes, current one flagged with a live equalizer); "related episodes" below is drawn from *other* programmes, since the current one already lives in the rail.

**Demo playback:** the bottom of `data.js` has a clearly marked block that assigns sources to every episode lacking a real one — 4 local HD clips in `assets/video/` on flagship episodes, 4 YouTube embeds, and the tiny branded `assets/video/demo/` clips (~32 KB each) for the rest. Setting a real `video` on an episode makes the loop skip it. **Delete that block — and the `assets/video/` sample files — before launch.**

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
