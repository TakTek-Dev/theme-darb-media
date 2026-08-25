---
name: Darb Media
description: Premium Arabic RTL broadcast archive — a five-rung surface ladder, editorial Kufi type, gold only where action lives.
colors:
  surface-deep: "#0A0F1B"
  surface-dark: "#1C2439"
  surface-dark-raised: "#242E48"
  surface-light: "#EFF2F7"
  surface-bright: "#FFFFFF"
  on-dark-1: "#FFFFFF"
  on-dark-2: "#C3CBDE"
  on-dark-3: "#8B96B3"
  on-dark-4: "#828CA8"
  on-light-1: "#131926"
  on-light-2: "#47516A"
  on-light-3: "#5F697D"
  border-dark: "rgba(255, 255, 255, 0.09)"
  border-light: "#E1E6EF"
  accent: "#FBC118"
  accent-pressed: "#D9A404"
  accent-on-light: "#6E5703"
  navy-950: "#0B101C"
  navy-900: "#101624"
  navy-850: "#141B2C"
  navy-800: "#161D2F"
  navy-700: "#20283F"
  navy-600: "#2A3450"
  navy-500: "#3A4666"
  gold: "#F5C21C"
  gold-strong: "#FBC118"
  gold-deep: "#D9A404"
  paper: "#FFFFFF"
  paper-2: "#F4F6F9"
  paper-3: "#EBEEF4"
  line: "#E2E6EE"
  line-2: "#D3D9E4"
  line-navy: "rgba(255, 255, 255, 0.11)"
  ink: "#1B2233"
  ink-2: "#525C72"
  ink-3: "#656F87"
  on-navy-2: "#A9B3CD"
  on-navy-3: "#8A94B2"
typography:
  display:
    fontFamily: "'Noto Kufi Arabic', 'IBM Plex Sans Arabic', 'Segoe UI', Tahoma, sans-serif"
    fontSize: "clamp(2.1rem, 5.4vw, 3.5rem)"
    fontWeight: 800
    lineHeight: 1.5
    letterSpacing: "-0.025em"
  h1:
    fontFamily: "'Noto Kufi Arabic', 'IBM Plex Sans Arabic', 'Segoe UI', Tahoma, sans-serif"
    fontSize: "clamp(1.75rem, 3.7vw, 3rem)"
    fontWeight: 800
    lineHeight: 1.4
    letterSpacing: "-0.02em"
  h2:
    fontFamily: "'Noto Kufi Arabic', 'IBM Plex Sans Arabic', 'Segoe UI', Tahoma, sans-serif"
    fontSize: "clamp(1.7rem, 3vw, 2.3rem)"
    fontWeight: 800
    lineHeight: 1.35
    letterSpacing: "-0.015em"
  h3:
    fontFamily: "'Noto Kufi Arabic', 'IBM Plex Sans Arabic', 'Segoe UI', Tahoma, sans-serif"
    fontSize: "1.6rem"
    fontWeight: 800
    lineHeight: 1.35
    letterSpacing: "-0.015em"
  body-lg:
    fontFamily: "'IBM Plex Sans Arabic', 'Segoe UI', Tahoma, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.7
  body:
    fontFamily: "'IBM Plex Sans Arabic', 'Segoe UI', Tahoma, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.7
  body-sm:
    fontFamily: "'IBM Plex Sans Arabic', 'Segoe UI', Tahoma, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 600
    lineHeight: 1.6
  meta:
    fontFamily: "'IBM Plex Sans Arabic', 'Segoe UI', Tahoma, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 500
    lineHeight: 1.6
    fontFeature: "tabular-nums"
  label:
    fontFamily: "'IBM Plex Sans Arabic', 'Segoe UI', Tahoma, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.5
    letterSpacing: "0.03em"
rounded:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  pill: "999px"
spacing:
  section: "104px"
  section-sm: "72px"
  component: "44px"
  card: "20px"
  text: "8px"
  control: "12px"
components:
  button-gold:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.navy-900}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    padding: "13px 26px"
  button-gold-hover:
    backgroundColor: "{colors.accent-pressed}"
  button-hero:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.navy-900}"
    typography: "{typography.body-lg}"
    rounded: "{rounded.md}"
    padding: "16px 34px"
  button-quiet:
    backgroundColor: "transparent"
    textColor: "{colors.on-dark-3}"
    typography: "{typography.meta}"
    rounded: "{rounded.md}"
    padding: "10px 14px"
  button-quiet-hover:
    backgroundColor: "rgba(255, 255, 255, 0.08)"
    textColor: "{colors.on-dark-1}"
  button-ghost:
    backgroundColor: "rgba(255, 255, 255, 0.04)"
    textColor: "{colors.on-dark-1}"
    rounded: "{rounded.md}"
    padding: "13px 26px"
  button-outline:
    backgroundColor: "{colors.surface-bright}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "13px 26px"
  button-small:
    typography: "{typography.meta}"
    padding: "10px 18px"
  card-episode:
    backgroundColor: "{colors.surface-bright}"
    textColor: "{colors.on-light-1}"
    rounded: "{rounded.md}"
    padding: "14px 0 0"
  card-episode-dark:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.on-dark-1}"
    rounded: "{rounded.md}"
    padding: "14px 0 0"
  programme-row:
    backgroundColor: "transparent"
    textColor: "{colors.on-dark-1}"
    padding: "0 28px 0 4px"
    height: "132px"
  programme-row-go:
    backgroundColor: "transparent"
    textColor: "{colors.on-dark-3}"
    rounded: "50%"
    size: "38px"
  programme-row-go-hover:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.surface-deep}"
  programme-card:
    backgroundColor: "{colors.surface-dark-raised}"
    textColor: "{colors.on-dark-1}"
    rounded: "{rounded.lg}"
    padding: "{spacing.card}"
  chip-hint:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink-2}"
    typography: "{typography.meta}"
    rounded: "{rounded.pill}"
    padding: "6px 14px"
  tag:
    backgroundColor: "{colors.paper-2}"
    textColor: "{colors.ink-2}"
    typography: "{typography.meta}"
    rounded: "{rounded.pill}"
    padding: "5px 13px"
  field-select:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.meta}"
    rounded: "{rounded.md}"
    padding: "10px 16px"
  segmented-active:
    backgroundColor: "{colors.navy-700}"
    textColor: "{colors.on-dark-1}"
    typography: "{typography.meta}"
    rounded: "{rounded.sm}"
    padding: "8px 18px"
  search-input:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "12px 58px"
    height: "66px"
---

# Design System: Darb Media

Recorded from the built code — `assets/css/main.css`, `assets/js/app.js`, `assets/js/data.js`, and the seven pages, all served at `?v=26`. Product truth (audience, archive purpose, brand commitments) lives in `PRODUCT.md`; this file is strictly visual. Every page is Arabic RTL (`<html lang="ar" dir="rtl">`). All contrast ratios below were computed from the built hex values, not estimated.

## Overview

**Creative North Star: "The Broadcaster's Vault"**

A permanent Arabic archive that feels like a premium broadcaster's vault, not a news portal. The site is built from full-width bands, and the bands are the design: a five-rung **surface ladder** runs from near-black cinema through to paper, and a page is composed by stepping along it so that no two neighbouring bands can ever visually merge. Deep rungs carry video and brand ceremony; bright rungs carry reading and browsing; one gold voice points at everything playable.

The system is now two-layered. A raw palette (navy scale, gold family, paper/ink/line) names the pigments; a **semantic layer** on top names the jobs — surfaces, text steps, borders, accent — and every value in it was chosen against two tests at once: adjacent bands must separate, and the text steps must clear 4.5:1 on each band they are allowed to sit on. New components address the semantic layer only.

Density is editorial: 104px band rhythm, 16:9 media everywhere, 1px rules instead of boxes, a five-step radius scale, restrained shadows. Every thumbnail is an authored inline-SVG poster generated per programme — the site never shows a stock image or a grey placeholder. Confirmed rejections (pinned in PRODUCT.md, honoured by the build): no SaaS genericity, no heavy gradients or glassmorphism, no childish cards, no extreme rounding, no colourful multi-hue UI.

**Key Characteristics:**
- A five-rung surface ladder with measured adjacent separation, not a two-tone navy/white alternation.
- A semantic token layer over the raw palette; components speak semantics.
- Text steps audited per surface — every text/surface pair in the build passes AA (4.5:1).
- Noto Kufi Arabic display over IBM Plex Sans Arabic body, both on a nine-step size scale.
- Authored per-programme SVG poster system (7 motifs, seeded variation, Arabic-Indic numerals).
- One signature auto-motion (hero filmstrip); everything else moves only in response to input.
- RTL-first: logical properties only, LTR islands only where the content demands one.
- Fully data-driven: header, footer, cards and pages render from `data.js` through `app.js`.

## Colors

Two layers over one hue family: a cool navy that carries every dark surface, a paper/ink editorial ground, and a single gold that is never decoration.

### Primary

- **Action Gold / accent** (#FBC118, sampled from the logo): the only saturated colour in the system. It fills primary CTAs and play discs, paints the programme-index rule and the hover state of its arrow, the filmstrip progress hairline and active outline, the focus ring, the filter badge, and the two accented spans in the brand statement. 11.6:1 on `--surface-deep`, 9.4:1 on `--surface-dark`; navy text on a gold fill reads 11.0:1.
- **Pressed Gold / accent-pressed** (#D9A404): the hover/pressed step under any gold fill, and the input caret. (The build still reaches this value through the raw-layer name `--gold-deep`.)
- **Gold Ink / accent-on-light** (#6E5703): the gold family darkened until it passes AA as text on paper. Declared and currently unreferenced — it exists so that gold text on a light surface never uses raw gold.
- **Logo Gold / gold** (#F5C21C): the pinned brand yellow; in the build it paints text selection on dark surfaces.

### Neutral — the surface ladder

Five rungs, darkest to brightest. A band declares a rung; it never mixes one.

- **Deep / surface-deep** (#0A0F1B): the cinema rung — homepage hero and the brand statement band.
- **Dark / surface-dark** (#1C2439): the structural rung — the programmes band (`.on-navy`) and the footer plate.
- **Dark Raised / surface-dark-raised** (#242E48): cards and media wells sitting *on* a dark band, never a band itself.
- **Light / surface-light** (#EFF2F7): the archive rung — the "from the archive" band (`.section--alt`).
- **Bright / surface-bright** (#FFFFFF): the default `.section` ground and every light card or control fill.

Homepage rhythm and the separation each step buys:

| Adjacent pair | Rungs | Separation |
|---|---|---|
| hero → latest episodes | deep → bright | 19.1:1 |
| latest episodes → programmes | bright → dark | 15.4:1 |
| programmes → archive | dark → light | 13.8:1 |
| archive → statement | light → deep | 17.1:1 |
| statement → footer | deep → dark | **1.24:1** |

Two structural pairs sit inside bands rather than between them: a raised card on a dark band is 1.15:1, and the two light rungs are 1.12:1 apart — which is why they are never placed adjacent, and why a raised card earns its edge from radius, padding and (on hover) a hairline rather than from tone alone.

### Neutral — text steps

Four steps on dark, three on light. Ratios below are computed against every surface each step is allowed to touch.

| Token | Hex | on deep | on dark | on raised |
|---|---|---|---|---|
| `--on-dark-1` | #FFFFFF | 19.1 | 15.4 | 13.5 |
| `--on-dark-2` | #C3CBDE | 11.8 | 9.5 | 8.3 |
| `--on-dark-3` | #8B96B3 | 6.5 | 5.2 | 4.6 |
| `--on-dark-4` | #828CA8 | 5.7 | 4.6 | **4.0 — fails** |

| Token | Hex | on bright | on light |
|---|---|---|---|
| `--on-light-1` | #131926 | 17.6 | 15.7 |
| `--on-light-2` | #47516A | 7.9 | 7.1 |
| `--on-light-3` | #5F697D | 5.5 | 4.9 |

Roles: **-1** headings, episode and programme names, hover-brightened text. **-2** descriptions, footer column heads, the bold half of a count. **-3** all metadata, quiet links, quiet buttons, the arrow disc at rest. **-4** inactive and utility text (hero meta, filmstrip label and programme line, footer body).

### Borders

**border-dark** (rgba(255,255,255,0.09)) is every 1px rule on a dark surface — section heads, programme rows, footer divisions, the statement/footer seam. **border-light** (#E1E6EF) is its counterpart on paper. The raw-layer `--line`, `--line-2` and `--line-navy` still serve the light chrome (header, filters, search, about).

### Named Rules

**The Semantic-Only Rule.** New components address the semantic layer — `--surface-*`, `--on-dark-*`, `--on-light-*`, `--border-*`, `--accent*`. The raw palette exists to define those tokens and nothing else. The refactored surfaces (hero, latest, programme index, archive, statement, footer, episode cards, section heads) already obey this; the light chrome and the interior page heroes still address the raw palette and should be migrated as they are next touched. Do not add new raw-palette references.

**The Ladder Rule.** Every band declares one rung of the surface ladder, and two adjacent bands may never share a rung. The homepage reads deep → bright → dark → light → deep → dark. Where the ladder alone is too tight — statement → footer at 1.24:1 — the seam must also carry a hairline (`border-block-start: 1px solid var(--border-dark)` on the footer). No gradient ever transitions one band into another.

**The Raised-Surface Floor Rule.** `--on-dark-4` is legal only on the two dark bands (`--surface-deep` 5.7:1, `--surface-dark` 4.6:1). Anything sitting on `--surface-dark-raised` steps up to `--on-dark-3`, because -4 falls to 4.0:1 there. Text is never placed on a surface it was not audited against.

**The Yellow Points Rule.** Gold appears only where attention or action lives: play, CTA, active state, progress, focus. It never fills a band, never sets body text, and never labels a category. One gold action per view region. If a screen reads "gold" at a glance, it is wrong.

## Typography

**Display Font:** Noto Kufi Arabic (with IBM Plex Sans Arabic, "Segoe UI", Tahoma fallbacks) — weights 600/700/800
**Body Font:** IBM Plex Sans Arabic (same fallbacks) — weights 400/500/600/700

**Character:** Kufi's geometric, monumental Arabic forms give titles the authority of a broadcast ident; Plex Sans Arabic keeps every control, label and paragraph neutral and highly legible. One Google Fonts request per page loads the pair.

### Hierarchy

Nine size tokens carry all component type:

- **`--t-display`** (clamp(2.1rem, 5.4vw, 3.5rem), Kufi 800, line-height 1.5, tracking −0.025em): the brand statement band — the one place the brand speaks in its own voice.
- **`--t-h1`** (clamp(1.75rem, 3.7vw, 3rem), Kufi 800, 1.4, −0.02em, `text-wrap: balance`): the hero episode title overlaying the poster.
- **`--t-h2`** (clamp(1.7rem, 3vw, 2.3rem), Kufi 800, −0.015em): every section head.
- **`--t-h3`** (1.6rem, Kufi 800): the programme card title on the programmes page, and the picks lead title.
- **`--t-body-lg`** (1.0625rem): lead paragraphs, long-form prose (line-height 2–2.1, 70–72ch), and the hero CTA's label.
- **`--t-body`** (1rem): episode card titles (700/1.55) and default copy; body base is 16px/1.7.
- **`--t-body-sm`** (0.9375rem): buttons, nav links, programme descriptions, compact pick rows.
- **`--t-meta`** (0.8125rem): dates, durations, counts, section counts, chips, tags, selects, the footer's base size — by count the most-used token in the system.
- **`--t-label`** (0.75rem, 600, tracking ~0.03em): eyebrow labels, the filmstrip label and programme line, duration badges, footer column heads, filter badges.

The programme-index name carries its own clamp (clamp(1.5rem, 2.6vw, 2.1rem), Kufi 800) because it must outrank an `--t-h2` section head inside its own row, and each page-level `h1` (page head, programme hero, search, about, watch) clamps to that page's ceremony.

### Named Rules

**The Kufi Voice Rule.** Noto Kufi Arabic appears only on headings, programme and card titles, big poster numerals and the mobile nav links — always 600–800. Everything else is IBM Plex Sans Arabic. Arabic line-heights stay generous (headings ≥1.35, hero and statement 1.4–1.5); Latin-tight leading clips Arabic ascenders.

**The Scale Rule.** Component type comes from the nine `--t-*` tokens. A literal `font-size` is permitted only for a page-level `h1` clamp or the programme-index name; anything else that needs a size the scale does not have is a sign the scale is being avoided.

**The Tabular Numbers Rule.** Every count, date and duration sets `font-variant-numeric: tabular-nums`. Dates render through `Intl.DateTimeFormat("ar-EG", …)`; standalone numbers convert through `arNum()` to ٠١٢٣٤٥٦٧٨٩. Durations, handles and URLs are LTR islands — `.ltr-num` (`direction: ltr; unicode-bidi: isolate`), `.thumb-dur { direction: ltr }`, contact handles `unicode-bidi: plaintext`.

## Layout

- **Container:** max-width 1240px (`--container`), `padding-inline: 28px` (20px ≤720px), centred.
- **Band rhythm:** `.section` pads `--sp-section` (104px) block, `.section--tight` uses `--sp-section-sm` (72px); both collapse to 58px ≤900px and 48px ≤720px. The statement band is the single deliberate exception at 150px (96px ≤900px, 72px ≤720px) — ceremony buys the extra air.
- **Component rhythm:** `--sp-component` (44px) is the gap between a section head and its content; `--sp-card` (20px) is a card's interior padding; `--sp-text` (8px) is the title→meta gap; `--sp-control` (12px) is the gap between sibling controls.
- **Header:** fixed, 72px (`--hdr`; 62px ≤900px); `:target` compensates with `scroll-margin-block-start: calc(var(--hdr) + 24px)`.
- **Grids** (every grid child is forced to `min-width: 0` by a global rule — extend that selector list when adding a grid):
  - Home hero: `minmax(0,1fr) 272px` (stage + filmstrip) → 256px ≤1080px → single column ≤900px, where the strip becomes a horizontal snap scroller of 240px items.
  - Episode grid: 4 → 3 (≤1080px) → 2 (≤720px) → 1 (≤420px); gaps 28×20px. `.ep-grid--3` for related episodes.
  - Programme index: `3px | minmax(0,1fr) | auto` rows, min-height 132px (108px ≤720px).
  - Programme cards (programmes page): `440px | minmax(0,1fr) | auto` → 320px ≤1080px → single column ≤720px with the side column becoming a horizontal bottom bar.
  - Picks: asymmetric `1.45fr / 1fr` — one lead card plus hairline-separated 148px-thumb rows; stacks ≤900px.
  - Watch: `minmax(0,1fr) / 360px` sticky rail (320px ≤1080px; stacks and unsticks ≤900px).
  - Footer: `1.4fr + 3×1fr` → 3 columns (≤1080px) → 2 columns with a full-width brand block (≤720px).
- **Mobile rails:** ≤720px, `.rail` turns the latest-episodes grid into an edge-bleeding snap scroller (`grid-auto-columns: 78vw`, 84vw ≤420px, `scroll-snap-type: x mandatory`, negative inline margins, scrollbar hidden).
- **Filters:** desktop shows inline `.field` selects in a `.toolbar`; ≤720px they collapse behind `.filter-open-btn` + a bottom sheet — except the search page (`.toolbar--search`), which keeps filters inline at every width.
- **Measures:** descriptions clamp with `-webkit-line-clamp` (2 lines on cards); prose runs 44–72ch by context.
- **Breakpoints:** 1080 / 900 / 720 / 420, max-width queries only.
- **RTL:** logical properties throughout (`inset-inline-start`, `padding-block-end`, `border-start-start-radius`); any transform-origin that must follow the reading edge goes through `var(--tx-origin, right)`; inline SVG that contains text is forced `direction: ltr`.

## Elevation & Depth

Depth comes from the ladder first, hairlines second, shadows last. Dark bands are essentially flat: a card there separates by rung (`--surface-dark-raised` on `--surface-dark`), by radius, and by a `--border-dark` hairline on hover — `.on-navy .ep-thumb` explicitly drops its shadow. Shadows exist on light surfaces and on media.

### Shadow Vocabulary

- **sh-1** (`0 1px 2px rgba(16,22,36,0.05), 0 1px 6px rgba(16,22,36,0.04)`): resting episode thumbs on light; the active segmented pill; contact-card hover.
- **sh-2** (`0 10px 30px -12px rgba(16,22,36,0.22), 0 2px 8px -2px rgba(16,22,36,0.08)`): episode thumb on hover, the picks lead thumb, the toast, the next-episode card's hover lift.
- **sh-navy** (`0 16px 40px -16px rgba(11,16,28,0.55)`): the cinematic shadow — hero stage, episode player, programme hero cover.
- Sanctioned one-offs: the play disc (`0 14px 36px -10px` → `0 18px 44px -10px` on hover), the gold button (`0 6px 18px -8px`), the bottom sheet (`0 -18px 50px`).

### Named Rules

**The Hairline First Rule.** Separation defaults to a 1px rule — `--border-light` on paper, `--border-dark` on dark. A shadow is earned only by media (sh-navy), by a light card at rest (sh-1), or by something floating above the page (toast, sheet, hover lift).

## Shapes

One controlled radius scale, five steps: **xs 4px** (focus ring, nav underline, progress hairline, duration badge, sheet handle), **sm 8px** (small nested media, nav hit areas, scrollbar thumb), **md 12px** (buttons, episode thumbs, filmstrip items, selects, segmented track, icon squares), **lg 16px** (hero stage, player, programme cards and covers, search input, empty states, next-episode card, contact cards), **pill 999px** (header search, chips, tags, toast, filter badge).

The only off-scale radii permitted are `50%` for true circles (play discs, the programme-index arrow, social buttons, the empty-state mark) and `0` for a deliberate reset (the next-episode card's flush thumb). One legacy exception survives: the mobile filter sheet rounds its top corners at 20px (`border-start-start-radius` / `border-start-end-radius`) — fold it into `--r-lg` the next time that component is touched rather than treating it as licence for new off-scale values.

Beyond corners, the form language is: 16:9 media everywhere (16:8.2 for the hero stage, 16:10 for the picks lead — the two sanctioned exceptions), hairline rules instead of boxes, and one masked bleed — the programme index's artwork fades out through a `mask-image: linear-gradient(to left, #000 40%, transparent)` (flipped to `to right` under `[dir="rtl"]`). Gradients exist only as functional scrims over media, that mask, and the single radial tint inside the programme hero.

## Components

Everything is rendered by `app.js` from `data.js` — extend the renderers, don't hand-write markup. Icons come from one inline SVG sprite injected at boot (`#i-play`, `#i-search`, `#i-clock`, `#i-cal`, `#i-copy`, `#i-share`, `#i-check`, `#i-arrow`, `#i-chev`, `#i-chev-d`, `#i-menu`, `#i-close`, `#i-filter`, `#i-grid`, `#i-telegram`, `#i-instagram`, `#i-info`): 24-unit viewBox, `stroke: currentColor`, stroke-width 1.75, round caps; 20px default, 16px `.icon--s`, `.icon--fill` for the play triangle.

### Header

Two contracts driven by `<body data-header>`. **Dark pages** (home, programme, episode, about) start transparent as `.over-dark` — light logo, on-navy nav colours, translucent search pill — then swap past 30px of scroll to `.is-scrolled`: white at 94% with `backdrop-filter: blur(14px)`, a hairline bottom edge, and the dark logo. **Light pages** render `.is-scrolled` from the start. Nav links are `--t-body-sm`/500; the current page adds weight 600 and a 2px gold underline that scales in from the RTL reading edge. ≤900px the nav collapses into a full-screen navy sheet with Kufi links, faint Latin sublabels, a 60ms + 45ms-per-item stagger, gold on the current page, Escape to close and scroll locked while open.

### Buttons

- **Shape:** `--r-md`, padding 13px 26px, `--t-body-sm`/600, inline-flex with a 9px icon gap; hover lifts 1px, `:active` presses 1px, disabled drops to 45%.
- **Gold** (primary): `--accent` fill, navy text, soft navy shadow; hover deepens to the pressed step. `--hero` enlarges it to 16px 34px at `--t-body-lg`.
- **Quiet** (hero secondary): transparent border *and* background, `--on-dark-3` text, `padding-inline: 14px`; hover fills white at 8% and brightens to `--on-dark-1`. This is the shape a secondary action takes next to a gold CTA — it must not read as a second button.
- **Ghost** (elsewhere on dark): white text, hairline border, white 4% fill → 9% and a brighter border on hover.
- **Outline** (on light): paper fill, `--line-2` border → `--navy-500` on hover.
- **Small** `--s`: 10px 18px at `--t-meta`.

### Programme index (signature, homepage)

`.pgm` replaced the old card rows on the homepage: an editorial line-up where the name carries the row.

- **Structure:** a 3px gold rule column, the name block, and a meta group (`count` + circular arrow), inside a 132px-min row bordered top and bottom with `--border-dark`; `overflow: hidden` and `isolation: isolate` contain the artwork.
- **Artwork:** `.pgm-art` is absolutely positioned against the inline-end edge at a **fixed 64% width** (46% ≤720px), `z-index: -1`, opacity 0.36 at rest, masked to nothing before it reaches the text. On hover it goes to 0.62 and `scale(1.06)` over `--t-slow`. The width is fixed on purpose: **the hover animates only `opacity` and `transform`** — animating `width` would run layout on every frame.
- **Rule:** `.pgm-rule` scales from `scaleY(0)` to full height over `--t-med` on hover/focus.
- **Name:** Kufi 800 at its own clamp, `--on-dark-1`, nudging 6px along the reading direction on hover (sign-flipped under `[dir="rtl"]`). `.pgm-tag` sits under it at `--t-meta`/`--on-dark-2`.
- **Meta:** `--on-dark-3`, tabular, `white-space: nowrap`; the count hides ≤720px (it lives on the programme page). `.pgm-go` is a 38px hairline circle (34px ≤720px) that fills `--accent` with a `--surface-deep` glyph on hover.
- Text sits at `z-index: 1` above the bleed so it keeps its own legibility.

### Cards

- **Episode card** (`.ep-card`): 16:9 generated poster (`--r-md`, sh-1 on light), the whole card is one link. Hierarchy is **thumbnail → title → one muted meta line reading "programme · date"** — the old gold programme badge and its diamond bullet were removed as noise; `.ep-program` is now just a 600-weight span inheriting the meta colour. Hover/focus-within: poster scales 1.045 under a 34% navy scrim, a 42px gold play disc rises at the bottom-inline-start, the thumb takes sh-2, the title warms. The duration badge is always visible (bottom-inline-end, navy 72%, `--r-xs`, LTR tabular). Dark variant under `.on-navy`: `--surface-dark-raised` well, no shadow, `--on-dark-1` title, `--on-dark-3` meta.
- **Programme card** (`.prog-card`, programmes page only): the card treatment the homepage no longer uses. `--surface-dark-raised` on a dark band, `--r-lg`, `--sp-card` padding, a transparent 1px border that becomes `--border-dark` on hover as the surface lifts one step brighter (a literal `#2A3452` — tokenise it if a second component ever needs that step) and the card raises 2px. The side column sits behind an inline-start hairline: count in `--on-dark-3` with its number in `--on-dark-2`, and a `.prog-cta` that turns gold and widens its icon gap 7→11px on hover. **Use `.pgm` for an index of programmes; use `.prog-card` when each programme needs its description and cover shown at browsing size.**
- **Picks lead / rows:** the lead is an oversized episode card (16:10, `--r-lg`, sh-2, Kufi 1.6rem title, 2-line description); the rows are compact 148px-thumb cards separated by hairlines, deliberately quieter than the lead.
- **Next-episode card** (watch rail, sticky at `--hdr` + 24px): navy block, flush zero-radius thumb inside an `--r-lg` card, gold episode-number kick, 3px lift with sh-2 on hover.
- **Contact card** (about): paper, hairline border, `--r-lg`, a navy icon square holding a gold icon; hover adds a navy border, a 2px lift and sh-1.

### Hero stage (signature, homepage)

The poster sells the episode and the text lives on top of it. `.stage-media` is a 16:8.2 well with sh-navy; `.stage-scrim` is an intensified bottom-up gradient (92% → 38% at 36% → transparent at 62%) so type stays legible over any motif. `.stage-info` is pinned to the bottom-inline-start and **capped at `min(54%, 560px)`**, and `.stage-play` centres its disc inside a grid with `padding-inline-start: 52%` — so the 84px gold disc always lands in the free half of the frame and never sits beside the title. Actions are one gold CTA plus the quiet button; nothing else. ≤900px the stage restacks: media at 16:9 first, `.stage-info` returns to static flow beneath it, and the disc recentres (`padding-inline-start: 0`).

Inline playback: pressing the disc swaps the poster for the shared player frame, `.hero-stage.is-playing` fades out the info and the scrim and relaxes the well to 16:9. An episode with no linked source shows the authored `.stage-note` instead, for 3.6s.

### Shared player

`.player-frame` is scoped to the class, not to `.player`, because two surfaces mount video into it: the episode page player and the homepage hero stage. It fills its container absolutely over a `--navy-950` ground; `video.player-frame` uses `object-fit: contain` so a non-16:9 source letterboxes instead of cropping. `videoFrameHTML()` emits a YouTube (nocookie), MP4 or Telegram frame; when an episode has no source it returns empty and the calling surface shows its authored note.

### Inputs / Fields

- **Search box:** 66px tall, 1.5px border, `--r-lg`, 1.125rem text, icon absolutely placed at the inline-start; focus turns the border gold and adds a 4px gold ring at 18%.
- **Select fields:** native select with appearance stripped, `--r-md`, chevron placed inline-end, 210px max; `.is-active` (a filter applied) takes a navy border and weight 600.
- **Segmented control:** a `--paper-2` track with 4px padding and a hairline border; the active button is a navy pill at `calc(var(--r-md) - 4px)` with sh-1.
- **Bottom sheet** (mobile filters): 55% navy backdrop, slides from `translateY(105%)`, 44×4px handle, labelled full-width fields, outline "clear" + gold "apply", 82dvh max, safe-area padded, Escape/backdrop close, focus returned to the opener.

### Navigation surfaces

- **Section head** (`.sec-head`): a baseline-aligned hairline row — Kufi `--t-h2` title, tabular count, and a `.sec-more` link at the inline-end whose icon gap widens 7→11px on hover. Its bottom border switches to `--border-dark` inside `.on-navy`.
- **Footer:** the `--surface-dark` plate, opened with a hairline against the statement band above it. Body text is `--on-dark-4`, column heads `--on-dark-2` at `--t-label`, links `--on-dark-3` brightening to `--on-dark-1`; the bottom row carries the brand statement, a separator dot and a tabular copyright. Social buttons are 40px hairline circles that fill gold on hover. Quiet here comes from small type and restrained contrast, never from going darker than the statement above it.

### Poster system (signature)

Every thumbnail and cover is a generated inline SVG (`thumbSVG` / `coverSVG`), class `.pm`:

- **Inline SVG on purpose** — not `<img src="data:">` — so the page webfont shapes the big Arabic-Indic episode numerals.
- **`.pm { direction: ltr }` is load-bearing:** the RTL page would otherwise flip the SVG's internal text layout. `width/height: 100%` plus `preserveAspectRatio="xMidYMid slice"` makes the SVG behave exactly like `object-fit: cover`.
- **Canvas:** episodes 800×450 (hero/player) or 480×270 (cards); programme covers 800×450 or 640×360. All geometry is proportional to W/H so both sizes carry the same density.
- **Tones** keyed by `program.tone`: `deep` {#161D2F, #1B2338, #2A3450}, `night` {#101624, #161D2F, #242E48}, `brand` {#20283F, #26304A, #323E5E}. Gold inside a poster is always #FBC118.
- **Seven motifs** keyed by `program.motif`: `bulletin` (diagonal wedge + gold slash + ticker lines), `network` (seeded node graph, one gold node), `wave` (30-bar soundwave, one gold bar), `halftone` (12×7 dot field + gold frame corners), `lens` (viewfinder rings + white corner brackets + one gold dot), `map` (contour lines + a dashed gold route between two waypoints), `column` (three printed text columns with one gold live line).
- **Seeded variation:** `seed(id)` (polynomial hash mod 997 of the episode id or programme slug) varies line lengths, node positions and which single element goes gold — posters differ per episode without randomness.
- **Gold discipline inside posters:** one gold motif element, plus a 28×28 gold play chip at the top-right of the frame; programme covers add a gold baseline bar (38% width × 6px). Episode posters carry the Arabic-Indic episode numeral at 94% white — anchored to the far side on hero-size posters so the overlaid title never sits on it.
- New programmes declare `motif` + `tone` in `data.js`; a new motif is added to `motifSVG`, never as a raster image.

### Motion

One signature moment; everything else responds to input. Easing is a single curve `cubic-bezier(0.2, 0.7, 0.2, 1)` at three durations: 160ms (colour/border), 300ms (overlays, underlines, lifts, the programme rule and arrow), 520ms (media scale, crossfades, the artwork bleed); the hero poster's idle drift runs 1.2s.

- **Signature — hero filmstrip:** advances every 7s, with a gold hairline scaling linearly from the reading edge under the active item. Hover **and** `focusin` on the hero pause it (`.paused` freezes the hairline via `animation-play-state`; JS clears the timer); leaving or `focusout` resumes. On coarse pointers, where there is no hover to pause, it stops permanently after one full cycle (WCAG 2.2.2). Hidden tabs stop it; manual selection restarts the cadence; **and inline hero playback sets a `playingInline` flag that suppresses auto-advance entirely — a playing video is never yanked off screen.** The swap is a crossfade: outgoing poster to opacity 0 at scale 1.02, info out over 240ms, new stage at 260ms.
- **Reveals:** only `.sec-head` rows carry `.rv` (translateY(16px) + fade), triggered once by IntersectionObserver (threshold 0.08, −8% bottom margin). Cards never stagger in.
- **Hover grammar:** posters scale 1.045–1.06, cards lift 2–3px, play discs scale 1.07, the programme name nudges 6px, "more" links widen their icon gap.
- **Kill switch:** `prefers-reduced-motion` collapses every animation and transition to 0.01ms, forces `.rv` visible, and in JS blocks auto-advance and hides the progress hairlines entirely.

### Browser surfaces

`::selection` is navy with white text on light, gold with navy text inside `.on-navy` and the footer. Caret is pressed gold. Focus is a global `:focus-visible` 2px gold outline at 2px offset with an `--r-xs` radius (−6px offset over the stage play overlay). Scrollbars are thin — `--line-2` thumb with a paper border on light, navy on dark — and hidden inside rails and strips. The **toast** is a bottom-centre navy pill with a gold check, rising 14px on show, auto-dismissed at 2.4s, `role="status"`, its centring translate sign-flipped under `[dir="rtl"]`.

## Do's and Don'ts

### Do:
- **Do** build every new band from a surface-ladder rung, and check the pair above and below it: if two neighbours land within ~1.3:1, the seam also needs a `--border-dark` hairline (the statement→footer pair at 1.24:1 is the worked example).
- **Do** address the semantic layer — `--surface-*`, `--on-dark-*`, `--on-light-*`, `--border-*`, `--accent*` — in every new component, and migrate raw-palette references when you touch old ones.
- **Do** step text up to `--on-dark-3` on anything sitting on `--surface-dark-raised`; `--on-dark-4` belongs to the two dark bands only.
- **Do** take component type from the nine `--t-*` tokens and spacing from the six `--sp-*` tokens.
- **Do** keep hover effects on the compositor: animate `opacity` and `transform` only. The programme index's artwork is deliberately fixed-width for this reason.
- **Do** write CSS with logical properties only, give every grid child `min-width: 0`, and put `direction: ltr` on any inline SVG containing text and on any mm:ss / URL / handle inside the RTL page.
- **Do** render numerals Arabic-Indic (`arNum()` / `ar-EG` dates) with `tabular-nums`, and draw icons from the sprite at stroke 1.75.
- **Do** bump `?v=N` on every CSS/JS reference across all seven pages together on every asset change (currently `?v=26`).
- **Do** start dark-hero pages with `data-header="dark"` and light pages with `data-header="light"`.

### Don't:
- **Don't** place two bands of the same rung next to each other, or fade one band into another with a gradient — the only gradients are media scrims, the programme-index mask, and the programme hero's radial tint.
- **Don't** put text on a surface it was not audited against, and never introduce a fourth muted step to "fit" a contrast problem — restructure the surface instead.
- **Don't** use gold as a surface, as body text, or on more than one action per region; gold text on a light surface steps down to `--accent-on-light`.
- **Don't** give the episode card a programme badge, a coloured chip, or a bullet glyph — thumbnail, title, then one muted "programme · date" line is the whole hierarchy.
- **Don't** let a second element compete with the hero's play disc: `.stage-info` stays capped at ~54% and the disc stays offset into the free half of the frame.
- **Don't** animate `width`, `height`, `top/left` or any layout property on hover; and don't add a second self-moving element — the filmstrip is the only one, and anything new must obey the same pause / coarse-pointer / reduced-motion discipline.
- **Don't** exceed the five-step radius scale; the only off-scale values are `50%` for circles and `0` for a deliberate reset.
- **Don't** introduce raster thumbnails, stock photography or icon fonts — posters are generated SVG, icons are the authored sprite.
- **Don't** hand-write card or page markup in HTML; extend the `app.js` renderers and the `data.js` schema so a CMS swap stays possible.
- **Don't** animate cards in on scroll — reveals belong to section heads only.
