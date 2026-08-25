# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

static HTML/CSS/JS (user-confirmed). Multi-page site, all content driven from `assets/js/data.js` so it can be wired to a CMS/API later. No build step; must run from any static host.

## Users

Arabic-speaking followers of Darb Media (primarily reached today via Telegram @DarbM22 and Instagram @darbm22). They arrive to: discover newly uploaded episodes, browse programs like playlists, search/filter for a specific episode, watch it, and share short links outside the site. RTL Arabic-first audience, heavy mobile usage.

## Product Purpose

A permanent, searchable public archive for Darb Media's video programs and episodes. [Inferred from the client's brief docx] The channel faces repeated takedowns/targeting on Telegram, so the site is the durable reference: followers must always be able to return to old content. Success = an episode is findable in seconds and its short link is shareable anywhere.

## Positioning

"نحكي عن فلسطين.. بطريقة أخرى" — an independent Arabic media platform telling Palestine's story through crafted narrative programs (e.g. the "إيجاز" bulletin simulating liberation-day news). The site is a premium streaming-grade archive, not a news website. UX inspiration (client-named): Shahid, Akwam — without copying their visual design.

## Operating Context

Content originates on Telegram/Instagram/YouTube. The site mirrors it as Program → Episodes → Episode page. Episodes carry: title, thumbnail, video URL, program, description, publish date, duration, slug, short share URL (/e/{code} concept), tags. Programs carry: title, cover, description, slug, episode count.

## Capabilities and Constraints

- Static hosting; short-link path /e/{code} is emulated as episode.html?e={code} in this build (production rewrite documented in README).
- Video sources supported by the player: YouTube embed, direct MP4, Telegram post embed. [Assumption] Sample episodes ship without real video URLs; the player shows an authored "source not yet linked" state.
- All sample episode/program content is synthetic demo content authored for design fidelity, labeled in data.js for replacement.
- Search/filtering runs fully client-side over data.js.

## Brand Commitments

- Logo: provided JPG (processed transparent variants in assets/img/). Preserve proportions; visible but never dominating.
- Colors (pinned): deep navy ≈ #20283F (credibility/journalism), brand yellow ≈ #F5C21C (accent only: CTAs, play, active states, key metadata). White/off-white base, very light gray secondary surfaces. Yellow must not be overused.
- Typography (pinned list): premium Arabic — IBM Plex Sans Arabic / Noto Kufi Arabic / Tajawal / Cairo. Chosen: Noto Kufi Arabic (display) + IBM Plex Sans Arabic (body/UI).
- Tone (pinned): Editorial + Cinematic + Modern + Minimal + Premium. Avoid: SaaS genericity, heavy gradients/glassmorphism, childish cards, template layouts, extreme rounding, colorful UI.
- Brand statement: "نحكي عن فلسطين.. بطريقة أخرى".
- Primary experience: sophisticated light theme with navy editorial sections; dark mode optional (not built in v1).

## Evidence on Hand

- Logo file: d8e0593f96e820ee4083925ff268dc65.jpg (+ derived assets/img/logo.png, logo-dark.png, mark.png, mark-dark.png, wordmark.png).
- Client brief: موقع درب ميديا.docx (goals, features, inspiration links).
- Real program evidence: "إيجاز" bulletin (covered by Shehab News); Telegram channel t.me/DarbM22 exists with 200+ posts. No verified YouTube channel found. Do not fabricate subscriber counts, press quotes, or view counts.

## Product Principles

1. Archive first: old content is as reachable as new content — search, filters, and program pages are core, not secondary.
2. Streaming-grade discovery: the homepage sells the latest episode cinematically; everything else is one click deep.
3. Share is a first-class action: every episode has a copy-able short link with instant feedback.
4. Navy speaks, yellow points: yellow appears only where attention or action lives.
5. Mobile is a first-class design, not a shrunken desktop.
