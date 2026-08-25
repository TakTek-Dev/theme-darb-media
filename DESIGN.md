---
name: Darb Media
description: Premium Arabic RTL broadcast archive — deep navy cinematic bands, editorial paper, gold only where action lives.
colors:
  navy-950: "#0B101C"
  navy-900: "#101624"
  navy-850: "#141B2C"
  navy-800: "#161D2F"
  navy-750: "#1B2338"
  navy-700: "#20283F"
  navy-600: "#2A3450"
  navy-500: "#3A4666"
  gold: "#F5C21C"
  gold-strong: "#FBC118"
  gold-deep: "#D9A404"
  gold-ink: "#6E5703"
  paper: "#FFFFFF"
  paper-2: "#F4F6F9"
  paper-3: "#EBEEF4"
  line: "#E2E6EE"
  line-2: "#D3D9E4"
  line-navy: "rgba(255, 255, 255, 0.11)"
  ink: "#1B2233"
  ink-2: "#525C72"
  ink-3: "#656F87"
  on-navy: "#FFFFFF"
  on-navy-2: "#A9B3CD"
  on-navy-3: "#8A94B2"
typography:
  display:
    fontFamily: "'Noto Kufi Arabic', 'IBM Plex Sans Arabic', 'Segoe UI', Tahoma, sans-serif"
    fontSize: "clamp(1.7rem, 4.5vw, 3rem)"
    fontWeight: 800
    lineHeight: 1.6
  headline:
    fontFamily: "'Noto Kufi Arabic', 'IBM Plex Sans Arabic', 'Segoe UI', Tahoma, sans-serif"
    fontSize: "clamp(1.8rem, 4vw, 2.6rem)"
    fontWeight: 800
    lineHeight: 1.35
  title:
    fontFamily: "'Noto Kufi Arabic', 'IBM Plex Sans Arabic', 'Segoe UI', Tahoma, sans-serif"
    fontSize: "clamp(1.45rem, 2.6vw, 1.9rem)"
    fontWeight: 700
    lineHeight: 1.35
  body:
    fontFamily: "'IBM Plex Sans Arabic', 'Segoe UI', Tahoma, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.7
  label:
    fontFamily: "'IBM Plex Sans Arabic', 'Segoe UI', Tahoma, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1
rounded:
  sm: "7px"
  md: "10px"
  lg: "14px"
components:
  button-gold:
    backgroundColor: "{colors.gold-strong}"
    textColor: "{colors.navy-900}"
    rounded: "{rounded.md}"
    padding: "13px 26px"
  button-gold-hover:
    backgroundColor: "{colors.gold-deep}"
  button-navy:
    backgroundColor: "{colors.navy-700}"
    textColor: "{colors.on-navy}"
    rounded: "{rounded.md}"
    padding: "13px 26px"
  button-navy-hover:
    backgroundColor: "{colors.navy-600}"
  button-outline:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "13px 26px"
  button-small:
    padding: "10px 18px"
  chip-hint:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink-2}"
    rounded: "999px"
    padding: "6px 14px"
  field-select:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "10px 16px"
  segmented-active:
    backgroundColor: "{colors.navy-700}"
    textColor: "{colors.on-navy}"
    rounded: "6px"
    padding: "8px 18px"
  tag:
    backgroundColor: "{colors.paper-2}"
    textColor: "{colors.ink-2}"
    rounded: "999px"
    padding: "5px 13px"
---

# Design System: Darb Media

Recorded from the built code (`assets/css/main.css?v=5`, `assets/js/app.js?v=5`, the six pages). Product truth — audience, archive purpose, brand commitments — lives in `PRODUCT.md`; this file is strictly visual. The site is Arabic RTL (`<html lang="ar" dir="rtl">`) on every page.

## Overview

**Creative North Star: "The Broadcaster's Vault"**

A permanent Arabic archive that feels like a premium broadcaster's vault, not a news portal. Deep navy cinematic bands (where video lives) alternate with off-white editorial paper (where reading lives), and one gold voice points at everything playable. The newest episode is staged center-screen like a broadcast; the rest of the archive sits one search away behind hairlines, tabular numerals, and calm grids. The stated motto in the stylesheet header is the whole doctrine: **"Navy speaks, yellow points."**

Density is editorial: generous section rhythm (76px bands), 16:9 media everywhere, thin 1px rules instead of boxes, moderate radii, restrained shadows. Every thumbnail is an authored geometric SVG poster generated per program — the site never shows a stock image or an empty gray placeholder. Confirmed rejections (pinned in PRODUCT.md and honored by the build): no SaaS genericity, no heavy gradients or glassmorphism, no childish cards, no extreme rounding, no colorful multi-hue UI.

**Key Characteristics:**
- Navy/paper band alternation with gold reserved for action, active state, and progress.
- Noto Kufi Arabic display voice over IBM Plex Sans Arabic body — both loaded from Google Fonts.
- Authored per-program SVG poster system (5 motifs, seeded variation, Arabic-Indic numerals).
- One signature animation (hero filmstrip auto-advance); everything else responds to input.
- RTL-first: logical properties only, LTR islands only where content demands it.
- Fully data-driven: header, footer, cards, and pages render from `assets/js/data.js`; icons from an inline SVG sprite in `app.js`.

## Colors

One gold accent over a deep navy world and a paper/ink editorial ground; nothing else is allowed a hue.

### Primary
- **Action Gold / gold-strong** (#FBC118): sampled from the logo. Fills play discs, primary CTAs, the filmstrip progress hairline, active-nav underline, filter badges, focus rings, poster play chips. The only saturated accent in the system.
- **Pressed Gold / gold-deep** (#D9A404): hover state on gold fills; also the input caret color.
- **Logo Gold / gold** (#F5C21C): the pinned brand yellow; in the build it paints text selection on navy surfaces.
- **Gold Ink / gold-ink** (#6E5703): the gold family darkened to AA text — used for the program label above episode titles on light surfaces, where real gold would fail contrast.

### Secondary
The navy scale is the brand's voice — surfaces, not accents. Deepest carries the most weight:
- **navy-950** (#0B101C): footer only.
- **navy-900** (#101624): hero, statement band, watch hero, about hero, mobile nav sheet, toast.
- **navy-850** (#141B2C): media placeholders behind posters and players.
- **navy-800** (#161D2F): cinematic page sections (`.on-navy`), program hero, next-episode card.
- **navy-750** (#1B2338): program row cards at rest.
- **navy-700** (#20283F): the brand navy — navy buttons, segmented active pill, light-surface text selection, contact icon squares; program cards resolve to it on hover.
- **navy-600** (#2A3450): navy button hover, toast border, active filter border.
- **navy-500** (#3A4666): outline/chip hover borders, dark scrollbar thumb, the radial tint inside navy heroes.

### Neutral
- **Paper / paper** (#FFFFFF): page ground and card/control fills on light.
- **Paper 2 / paper-2** (#F4F6F9): secondary surfaces — page heads, search head, segmented track, empty states, tags.
- **Paper 3 / paper-3** (#EBEEF4): light media placeholder.
- **Hairline / line** (#E2E6EE) and **Hairline strong / line-2** (#D3D9E4): 1px rules, borders, scrollbar thumbs on light.
- **Navy hairline / line-navy** (rgba(255,255,255,0.11)): every 1px rule on navy surfaces.
- **Ink / ink** (#1B2233), **Ink 2 / ink-2** (#525C72), **Ink 3 / ink-3** (#656F87): text hierarchy on light — headings/body, muted, faint meta (ink-3 is the AA floor).
- **On-navy / on-navy** (#FFFFFF), **on-navy-2** (#A9B3CD), **on-navy-3** (#8A94B2): the same three-step hierarchy on navy (on-navy-3 is AA on the deep navies).

### Named Rules
**The Yellow Points Rule.** Gold appears only where attention or action lives: play, CTA, active state, progress, focus. It never fills a surface, a background band, or body text. If a screen reads "gold" at a glance, it is wrong.

**The Band Alternation Rule.** Pages are built from full-width bands: navy for cinematic/media moments, paper for editorial/browsing moments, always separated cleanly — never gradients between them. The footer is always navy-950; the deepest navy carries the most ceremonial content.

**The Three-Step Text Rule.** Text on any surface uses exactly three tones (ink/ink-2/ink-3 on light; on-navy/on-navy-2/on-navy-3 on navy). New muted tones are not invented.

## Typography

**Display Font:** Noto Kufi Arabic (with IBM Plex Sans Arabic, "Segoe UI", Tahoma fallbacks) — loaded weights 600/700/800
**Body Font:** IBM Plex Sans Arabic (same fallbacks) — loaded weights 400/500/600/700

**Character:** Kufi's geometric, monumental Arabic forms give titles the authority of a broadcast ident; Plex Sans Arabic keeps UI and body text neutral and highly legible. The pairing is loaded via one Google Fonts request on every page.

### Hierarchy
- **Display** (800, clamp(1.7rem, 4.5vw, 3rem), 1.6): statement band and about hero — the brand speaking, always with the gold `.dot` span on "..".
- **Headline** (800, clamp(1.8rem, 4vw, 2.6rem)): page-head h1; program hero goes larger (clamp(2rem, 5vw, 3.1rem)), hero stage title slightly smaller (clamp(1.6rem, 3.4vw, 2.5rem), line-height 1.4, `text-wrap: balance`), watch title smaller still (clamp(1.4rem, 3vw, 2rem)).
- **Title** (700, clamp(1.45rem, 2.6vw, 1.9rem)): section heads (`.sec-head h2`); card-level Kufi titles run 1.35–1.4rem fixed.
- **Body** (400, 16px, 1.7): default; long-form prose upsizes to 1.0625rem with line-height 2–2.1 and a 70–72ch measure.
- **Label** (600, 0.875rem): buttons, nav links, filters, section-more links; meta drops to 0.8125rem in ink-3/on-navy-3; micro-labels (program kick, duration badge) run 0.75–0.78rem at 600–700.

### Named Rules
**The Kufi Voice Rule.** Noto Kufi Arabic appears only on headings, card titles, big numerals, and the mobile nav links — always weight 600–800. Every control, label, paragraph, and meta line is IBM Plex Sans Arabic. Arabic line-heights stay generous (headings ≥1.35, hero/watch titles 1.4–1.5) — tight Latin-style leading clips Arabic ascenders.

**The Tabular Numbers Rule.** Every count, date, and duration sets `font-variant-numeric: tabular-nums`. Dates render through `Intl.DateTimeFormat("ar-EG", …)` (Arabic month names, Arabic-Indic digits); standalone numbers (episode counts, years, copyright, poster numerals, episode numbers) convert through `arNum()` to ٠١٢٣٤٥٦٧٨٩. Durations ("mm:ss") and Latin handles/URLs are LTR islands: `.thumb-dur { direction: ltr }`, contact handles `direction: ltr; unicode-bidi: plaintext`.

## Layout

- **Container:** max-width 1240px (`--container`), `padding-inline: 28px` (20px ≤720px), centered with `margin-inline: auto`.
- **Band rhythm:** `.section` pads 76px block (58px ≤900px, 48px ≤720px); `.section--tight` 56px; statement band 96px (72px ≤720px). Section heads close with an 18px-padded hairline and 34px margin below (24px ≤720px).
- **Header:** fixed, 72px (`--hdr`; 62px ≤900px); `:target` scroll-margin compensates (hdr + 24px).
- **Grids** (all with `min-width: 0` forced on children — a global rule in the stylesheet):
  - Home hero: `minmax(0,1fr) 300px` (stage + filmstrip); 264px ≤1080px; single column ≤900px where the strip becomes a horizontal snap scroller (240px items).
  - Episode grid: 4 columns → 3 (≤1080px) → 2 (≤720px) → 1 (≤420px); gaps 26×22px. `.ep-grid--3` variant for related episodes.
  - Picks: asymmetric `1.25fr / 1fr` — one lead card + hairline-separated rows (168px thumbs); stacks ≤900px.
  - Program rows: `340px cover / body / auto side` (280px ≤1080px); stacks ≤720px with the side column becoming a horizontal bottom bar.
  - Watch: `1fr / 360px` sticky rail (320px ≤1080px; stacks ≤900px, rail unsticks).
  - Footer: `1.4fr + 3×1fr` → 3 cols (≤1080px) → 2 cols with full-width brand (≤720px).
- **Mobile rail:** ≤720px, `.rail` converts the latest-episodes grid into an edge-bleeding horizontal snap scroller (`grid-auto-columns: 78vw`, 84vw ≤420px, `scroll-snap-type: x mandatory`, negative inline margins to bleed to screen edge, scrollbar hidden).
- **Filters:** desktop shows inline `.field` selects in a `.toolbar`; ≤720px they hide behind a `.filter-open-btn` + bottom sheet — **except** the search page (`.toolbar--search`), which keeps its filters inline at all widths.
- **Measures:** descriptions clamp with `-webkit-line-clamp` (2–3 lines); prose max 52–72ch depending on context.
- **Breakpoints:** 1080 / 900 / 720 / 420 (max-width media queries only).

## Elevation & Depth

Hairlines carry the structure; shadows are reserved for media and floating surfaces. Navy sections are essentially flat — depth there comes from the navy scale itself (750 card on 800 band, 850 media wells) plus 1px `line-navy` rules.

### Shadow Vocabulary
- **sh-1** (`0 1px 2px rgba(16,22,36,0.05), 0 1px 6px rgba(16,22,36,0.04)`): resting card thumbs on light; segmented active pill.
- **sh-2** (`0 10px 30px -12px rgba(16,22,36,0.22), 0 2px 8px -2px rgba(16,22,36,0.08)`): pick-lead thumb, toast, hover lift on next-card.
- **sh-navy** (`0 16px 40px -16px rgba(11,16,28,0.55)`): the cinematic shadow — hero stage, player, program-hero cover on navy.
- One-off deepenings exist for the play disc (`0 14px 36px -10px` → `0 18px 44px -10px` on hover), gold button (`0 6px 18px -8px`), and bottom sheet (`0 -18px 50px`).

### Named Rules
**The Hairline First Rule.** Separation defaults to a 1px rule (line on paper, line-navy on navy) — section heads, pick rows, footer bottom, program-card side column, strip label. A shadow is only earned by media (sh-navy) or by something floating above the page (toast, sheet, hover lift).

## Shapes

Moderate, tiered radii — never extreme: **lg 14px** for hero media, players, program cards/covers, page-level containers, search input, empty states; **md 10px** for episode thumbs, buttons, selects, strip items; **sm 7px** for small nested media and nav-link hit areas. Pills (999px) are reserved for the header search, chips, tags, and the toast; perfect circles for play discs and social buttons. The bottom sheet rounds only its top corners (20px, logical `border-start-start-radius`). Scrims are flat linear gradients from rgba(11,16,28,…) — the only gradients allowed are these functional scrims plus the two radial navy tints inside hero/statement bands and the faint gold radial glow (7% opacity) behind the statement.

A recurring brand glyph: the **gold diamond** — a 5×5px square rotated 45° (1px radius) — bullets every program label on light cards. The gold ".." dot after the brand statement is its typographic sibling.

## Components

All components are rendered by `app.js` from `data.js` (header, footer, cards, pages) — new surfaces should extend the renderers, not hand-write markup. Icons come from the inline sprite (`#i-play`, `#i-search`, `#i-clock`, `#i-cal`, `#i-copy`, `#i-share`, `#i-check`, `#i-arrow`, `#i-chev`, `#i-chev-d`, `#i-menu`, `#i-close`, `#i-filter`, `#i-grid`, `#i-telegram`, `#i-instagram`, `#i-info`): 24-unit viewBox, `stroke: currentColor`, stroke-width 1.75, round caps/joins; 20px default, 16px `.icon--s`, filled variant `.icon--fill` for the play triangle.

### Header
- Fixed bar, two contracts driven by `<body data-header>`: **dark pages** (`home`, `program`, `episode`, `about`) start transparent `.over-dark` — light logo (`logo-dark.png`), on-navy nav colors, translucent search pill — then swap at 30px scroll to `.is-scrolled`: white at 94% + `backdrop-filter: blur(14px)`, hairline bottom, dark logo (`logo.png`). **Light pages** render `.is-scrolled` from the start.
- Nav links: 0.9375rem/500 in ink-2; hover→ink; current page 600 + gold 2px underline that scales in from `transform-origin: var(--tx-origin, right)` (the RTL reading edge).
- ≤900px the nav collapses to a menu button opening the **nav sheet**: full-screen navy-900, Kufi links (clamp(1.6rem, 6.5vw, 2.1rem)) with faint Latin sublabels, staggered entrance (translateY(14px)→0, delays 60ms + 45ms per item), gold on the current page, social circles at the foot, Escape closes, scroll locked while open.

### Buttons
- **Shape:** md radius (10px), padding 13px 26px, 0.9375rem/600, inline-flex with 9px icon gap; `:active` presses down 1px; disabled 45% opacity.
- **Gold** (primary): gold-strong fill, navy-900 text, soft navy shadow; hover deepens to gold-deep. One gold button per view region.
- **Navy** (secondary on light): navy-700 → navy-600 hover.
- **Ghost** (on navy): white text, line-navy border, white 4% fill → 9% + brighter border on hover.
- **Outline** (on light): paper fill, line-2 border → navy-500 border on hover.
- **Small** `--s`: 10px 18px, 0.875rem.

### Chips / Tags
- **Hint chips** (search): paper pill, line border, ink-2 text; hover navy-500 border. **Tags** (watch page): paper-2 pill linking into search. **chip-clear**: borderless text-button that gains paper-2 fill on hover. **Filter badge**: gold circle with navy Arabic-Indic count.

### Cards
- **Episode card** (`.ep-card`): 16:9 poster (md radius, sh-1 on light), whole card is one link. Hover/focus-within: poster scales 1.045 under a navy 34% scrim, a 42px gold play disc rises from below (bottom-inline-start), the title nudges `translateX(-3px)` (with the reading direction in RTL). Duration badge always visible (bottom-inline-end, navy 72% pill, LTR tabular). Body: gold-diamond program label (gold-ink 0.78rem/700), 2-line clamped title (1rem/600), meta row with calendar icon + ar-EG date. **Dark variant** under `.on-navy`: thumb bg navy-850, no shadow, program label gold-strong, title white.
- **Program card** (`.prog-card`): navy row card (navy-750, line-navy border, lg radius, 18px padding). Hover: border warms to gold at 40%, surface lifts to navy-700, card raises 2px, cover scales 1.05. Side column behind an inline-start hairline: episode count with a Kufi 2rem Arabic-Indic numeral + a small gold button.
- **Pick lead / pick rows:** the lead is an oversized episode card (16:10, lg radius, sh-2, Kufi 1.4rem title, 3-line description); rows are compact 168px-thumb episode cards separated by hairlines.
- **Next-episode card** (watch rail, sticky at hdr+24px): navy-800 block, zero-radius thumb inside lg-radius card, gold episode-number kick; hover raises 3px with sh-2.
- **Contact card** (about): paper, line border, lg radius; navy-700 icon square (12px radius) holding a gold icon; hover navy-500 border + 2px lift + sh-1.

### Inputs / Fields
- **Search box:** 66px tall, 1.5px line-2 border, lg radius, 1.125rem text, icon absolute at inline-start; focus = gold border + 4px gold ring at 18% (`rgba(251,193,24,0.18)`).
- **Select fields:** native select, appearance stripped, md radius, chevron icon absolutely placed inline-end, 210px max; `.is-active` (a filter applied) = navy-600 border + weight 600.
- **Segmented control** (program sort): paper-2 track with 4px padding, line border; active button is a navy-700 white pill (radius = md − 4px) with sh-1.
- **Bottom sheet** (mobile filters): navy 55% backdrop, sheet slides from `translateY(105%)`, top corners 20px, 44×4px handle, labeled full-width fields, outline "clear" + gold "apply" actions, 82dvh max, safe-area padded, Escape/backdrop close, focus returned to the opener.

### Navigation surfaces
- **Section head** (`.sec-head`): baseline-aligned hairline row — Kufi title, tabular faint count, `.sec-more` link at inline-end whose icon gap widens 7px→11px on hover.
- **Crumbs** (program/watch heroes): on-navy-3 with arrow icons; hover white.
- **Footer:** navy-950; light logo 58px, three link columns with white 0.9375rem heads, links hover to gold; hairline bottom row carries the brand statement, a separator dot, and tabular copyright; social buttons are 40px hairline circles that fill gold (navy text) on hover.

### Poster system (signature)
Every thumbnail and cover on the site is a generated inline SVG (`thumbSVG` / `coverSVG` in app.js), class `.pm`:
- **Inline SVG on purpose** — not `<img src="data:">` — so the page webfont (Noto Kufi Arabic) shapes the big Arabic-Indic episode numerals.
- **`.pm { direction: ltr }` is load-bearing:** the RTL page would otherwise flip SVG text layout. `width/height: 100%`, `preserveAspectRatio="xMidYMid slice"` makes the SVG behave exactly like `object-fit: cover`.
- **Canvas:** episodes 800×450 (featured/player) or 480×270 (cards); program covers 800×450 or 640×360. Geometry is proportional to W/H so both sizes carry the same density.
- **Tones** (poster-only palette, keyed by `program.tone`): `deep` {bg #161D2F, bg2 #1B2338, line #2A3450}, `night` {bg #101624, bg2 #161D2F, line #242E48}, `brand` {bg #20283F, bg2 #26304A, line #323E5E}; gold inside posters is always #FBC118.
- **Five motifs**, keyed by `program.motif`: `bulletin` (diagonal wedge + gold slash + seeded ticker lines — إيجاز), `cell` (seeded node network, one gold node — قصة خلية), `wave` (30-bar sinusoid soundwave, one gold bar — على الدرب), `halftone` (12×7 seeded dot field + gold frame corners — ذاكرة), `lens` (viewfinder rings + white corner brackets + one gold dot — عدسة درب).
- **Seeded variation:** `seed(id)` (polynomial hash mod 997 of the episode id / program slug) varies line lengths, node positions, and which single element goes gold — posters differ per episode without randomness.
- **Gold discipline inside posters:** one gold motif element per poster, plus the 28×28 (7px radius) gold play chip at the top-start corner of episode posters, plus a gold baseline bar (38% width × 6px) on program covers. Episode posters carry the Arabic-Indic episode numeral (weight 800, white at 94%, 210px on big / 138px on small canvases) anchored bottom-inline-start.
- New programs must declare `motif` + `tone` in data.js; a new motif is added to `motifSVG`, never as a raster image.

### Motion
The system has **one signature moment** and otherwise moves only in response to input. Easing is a single curve `cubic-bezier(0.2, 0.7, 0.2, 1)` (`--ease`) at three durations: 160ms (`--t-fast`, color/border), 300ms (`--t-med`, overlays/underlines/lifts), 520ms (`--t-slow`, media scale/crossfades); the hero poster's idle drift runs 1.2s.

- **Signature — hero filmstrip:** advances every 7s (`--strip-secs` feeds a CSS `stripbar` animation: a gold hairline scaling linearly from the RTL reading edge under the active item). Hover **and** `focusin` on the hero pause it (`.paused` freezes the hairline via `animation-play-state`, JS stops the timer); leaving/`focusout` resumes. On coarse pointers (no hover to pause) it stops permanently after one full cycle — WCAG 2.2.2. Hidden tabs stop it; manual selection restarts the cadence. The swap is a crossfade: outgoing poster fades to 0 at scale 1.02 (`.is-swapping`), info fades 240ms, new stage renders at 260ms.
- **Reveals:** only `.sec-head` rows carry `.rv` (translateY(16px) + fade, t-slow, optional `--d` delay), triggered once by IntersectionObserver (threshold 0.08, −8% bottom rootMargin). Cards do not stagger in — grids appear instantly.
- **Hover grammar:** posters scale 1.045–1.05; cards lift −2/−3px; play discs scale 1.07; titles nudge −3px inline; gaps widen on "more" links. Buttons press +1px on `:active`.
- **Kill switch:** `prefers-reduced-motion` collapses all animation/transition durations to 0.01ms, forces `.rv` visible, and in JS prevents auto-advance and hides the progress hairlines entirely.

### Browser surfaces
- `::selection`: navy-700 with white text on light; gold with navy-900 text inside `.on-navy` and the footer.
- Inputs caret: gold-deep. Focus: global `:focus-visible` 2px gold-strong outline, 2px offset, 4px radius (−6px offset on the stage play overlay).
- Scrollbars: thin everywhere; line-2 thumb with paper border on light, navy-500 on navy; rails/strips hide theirs.
- **Toast:** bottom-center fixed pill (navy-900, navy-600 border, gold check icon), rises 14px on show, auto-dismisses at 2.4s, `role="status"`; its centering translate flips sign under `[dir="rtl"]`.

## Do's and Don'ts

### Do:
- **Do** keep every media surface 16:9 (picks lead 16:10 is the one sanctioned exception) with a navy-850/paper-3 well behind it.
- **Do** write CSS with logical properties only (`inset-inline-start`, `margin-block-end`, `border-start-start-radius`, `padding-inline`) — the entire stylesheet contains no physical left/right property, and any transform-origin that must track the reading edge goes through `var(--tx-origin, right)`.
- **Do** give every grid child `min-width: 0` (the global rule already covers the known grids — extend it when adding a grid) and wrap wide content in its own scroller.
- **Do** put `direction: ltr` on any inline SVG containing text and on any mm:ss/URL/handle string inside the RTL page.
- **Do** render all numerals Arabic-Indic (`arNum()` / `ar-EG` dates) with `tabular-nums`, and all icons from the sprite at stroke 1.75.
- **Do** bump `?v=N` on **all** CSS/JS references together on every asset change (currently `?v=5` across all seven pages).
- **Do** start dark-hero pages with `data-header="dark"` and light pages with `data-header="light"` so the header contract resolves correctly.

### Don't:
- **Don't** use gold as a surface, a text color for paragraphs, or on more than one primary action per region — and never lighten it for large fills; on light backgrounds gold text must step down to gold-ink.
- **Don't** introduce raster thumbnails, stock photography, or icon fonts; posters are generated SVG, icons are the authored sprite.
- **Don't** add decorative gradients, glassmorphism, or hard offset shadows — the only sanctioned gradients are scrims and the three faint radial tints; blur exists only on the scrolled header.
- **Don't** exceed the radius tiers (7/10/14px + pill/circle) or round the bottom sheet's lower corners.
- **Don't** add a second auto-playing animation; the filmstrip is the only self-moving element, and anything new must obey the same pause/reduced-motion/coarse-pointer discipline.
- **Don't** hand-write card or page markup in HTML — extend the `app.js` renderers and `data.js` schema so a future CMS swap stays possible.
- **Don't** animate cards in on scroll — reveals belong to section heads only.
