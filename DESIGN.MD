# Mi Rutina — Design System
> A quiet, editorial interface for tracking daily rhythms. The visual language borrows from a private journal: warm paper, generous typography, and a single accent that earns its color through restraint.

**Theme:** Light.

The aesthetic is *refined editorial*: a warm off-white canvas (#faf7f2) where oversized serif headlines (56–80px, weight 500–600, optical sizing off) sit next to compact sans-serif body text. The signature move is **alignment to a vertical grid** — numerals, dates and percentages share a strict baseline so the eye can scan a month at a glance. Color is deliberately muted: warm greys for structure, a single saturated accent (mandarina quemada `#e85a1a`) for *today* and primary actions, a desaturated sage `#6b8e6f` for *done*. The conic-gradient rainbow border is reserved for the floating action button — one moment of warmth per viewport. Everything else is paper, ink, and quiet rhythm.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Paper | `#faf7f2` | `--color-paper` | Page background — warm off-white, the default canvas. Never pure white. |
| Linen | `#f1ead9` | `--color-linen` | Card surfaces, elevated sections, slightly warmer than paper. |
| Parchment | `#ebe3d0` | `--color-parchment` | Subtle band backgrounds, used like a margin in a journal. |
| Ink | `#1a1310` | `--color-ink` | Primary text, headlines, filled buttons. Warm near-black with brown undertone (not cool). |
| Charcoal | `#3d3530` | `--color-charcoal` | Body text, secondary structural elements. |
| Smoke | `#756c63` | `--color-smoke` | Tertiary text, captions, meta labels. |
| Mist | `#a89e91` | `--color-mist` | Disabled text, placeholder. |
| Stone | `#d6cebd` | `--color-stone` | Default border (1px), hairlines. |
| Sand | `#e3dccb` | `--color-sand` | Soft border for less prominent dividers. |
| Accent | `#e85a1a` | `--color-accent` | Primary accent — today, primary CTAs, focus state. Saturated mandarina on warm paper. |
| Accent Soft | `#fbece0` | `#fbece0` | Accent backgrounds (chips, hover). |
| Sage | `#6b8e6f` | `--color-sage` | Done state, success, completed progress. |
| Sage Soft | `#e8f0e6` | `--color-sage-soft` | Sage backgrounds, "done" badges. |
| Indigo | `#3a4a6b` | `--color-indigo` | Info, links, secondary accents. Cool counterpoint to warm accent. |
| Indigo Soft | `#e7ebf2` | `--color-indigo-soft` | Indigo backgrounds. |
| Rainbow Conic | `conic-gradient(from 90deg, #e85a1a 0%, #d4a017 14%, #6b8e6f 28%, #3a4a6b 42%, #6b4d8e 56%, #a85a7a 70%, #e85a1a 84%, #fbece0 100%)` | `--gradient-conic-warm` | Warm conic gradient — orange, gold, sage, indigo, plum. Used ONLY on the FAB and one hero element per view. |
| Ink Fade | `linear-gradient(180deg, rgba(26,19,16,0.04) 0%, rgba(26,19,16,0) 50%)` | `--gradient-ink-fade` | Subtle ink-fade at top of dark elements. |

## Tokens — Typography

### Newsreader — Display typeface for headlines, big numerals, dates.
> A contemporary serif by Production Type / Google Fonts. Optical sizing for screens, slight contrast in the strokes, warm personality at large sizes. Weight 500–600 keeps it elegant (not bold-heavy); for stats you'll go in 600 with negative tracking to feel confident.
- **Weights:** 400, 500, 600
- **Sizes:** 13, 28, 40, 56, 72, 96
- **Line height:** 1.05–1.20
- **Letter spacing:** -0.035em at 96/72px, -0.025em at 56/40px, normal at body
- **Substitute:** Source Serif 4
- **Role:** Display headlines, big numerals (rango, %), dates. The serif gives the app a *journal* personality instead of a dashboard one.

### Geist — Workhorse for buttons, body, labels, micro-copy.
> Geometric humanist sans by Vercel. Clean, neutral, designed for screens. Used everywhere except display headlines.
- **Weights:** 400, 500, 600, 700
- **Sizes:** 11, 12, 13, 14, 15, 17
- **Line height:** 1.40–1.55
- **Letter spacing:** normal at body, -0.005em at large sizes
- **Role:** Body copy, button labels (13px/700), inputs, small labels (10px tracking 0.06em uppercase).

### JetBrains Mono — Micro labels, timestamps, tabular numbers.
> Mono with a technical personality but warm proportions. Used for timestamps (e.g. "5:30 am"), uppercase meta labels (10–11px, +0.06em tracking), and tabular numerals in stats.
- **Weights:** 400, 500
- **Sizes:** 10, 11, 12, 13
- **Line height:** 1.30
- **Role:** Timestamps in tasks, tabular numbers in stats, mono labels.

### Type Scale

| Role | Family | Weight | Size | Line Height | Letter Spacing | Token |
|------|--------|--------|------|-------------|----------------|-------|
| mono-label | JetBrains Mono | 500 | 11px | 1.30 | 0.06em uppercase | `--text-mono-label` |
| micro | Geist | 500 | 11px | 1.40 | normal | `--text-micro` |
| body-sm | Geist | 400 | 13px | 1.50 | -0.005em | `--text-body-sm` |
| body | Geist | 400 | 15px | 1.55 | -0.005em | `--text-body` |
| subhead | Geist | 600 | 17px | 1.40 | -0.01em | `--text-subhead` |
| title | Newsreader | 600 | 28px | 1.15 | -0.02em | `--text-title` |
| headline | Newsreader | 500 | 40px | 1.10 | -0.03em | `--text-headline` |
| display | Newsreader | 500 | 56px | 1.05 | -0.035em | `--text-display` |
| numeral | Newsreader | 500 | 72–96px | 1.00 | -0.04em | `--text-numeral` |

## Tokens — Spacing & Shapes

**Base unit:** 4px. Compact density with editorial breathing room — sections separate by 64–80px, internal elements by 8–12px.

### Spacing

| Name | Value | Token |
|------|-------|-------|
| 1 | 4px | `--space-1` |
| 2 | 8px | `--space-2` |
| 3 | 12px | `--space-3` |
| 4 | 16px | `--space-4` |
| 5 | 24px | `--space-5` |
| 6 | 32px | `--space-6` |
| 7 | 48px | `--space-7` |
| 8 | 64px | `--space-8` |

### Border Radius

| Element | Value |
|---------|-------|
| chips | 100px (pill) |
| cards | 14px |
| inputs | 10px |
| buttons | 12px (NOT pill — rounded rectangle, calmer) |
| numerals | 0 (asymmetric — large numbers have no rounding; cards around them have 14px) |
| large cards | 20px |

### Shadows (used sparingly)

| Name | Value | Role |
|------|-------|------|
| lift | `0 1px 0 rgba(26,19,16,0.04), 0 4px 16px -8px rgba(26,19,16,0.08)` | FAB, modals only. |
| inset-paper | `inset 0 0 0 1px rgba(214,206,189,0.6)` | Subtle inset border instead of shadows. |

The system has flat shadow culture by default. Cards are defined by background shift (paper → linen) and 1px stone borders, not by drop shadows. Only the FAB and modal bottom-sheets use shadows.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Paper | `#faf7f2` | Page background. Default canvas. |
| 2 | Linen | `#f1ead9` | Elevated card surface, modals, FAB resting state. |
| 3 | Parchment | `#ebe3d0` | Section bands, used like a journal page background. |

## Layout

- **Page max-width:** 560px (mobile-first, intentionally narrow for editorial rhythm; on tablet the tabbar centers)
- **Section gap:** 64–80px
- **Card padding:** 20px
- **Element gap:** 8–12px
- **Vertical grid baseline:** 8px — all numbers and labels share an 8px baseline so the eye can scan a month at a glance

## Components

### Ink Button (Primary)
**Role:** Primary action — the most important button on any view.

Background `--color-ink` (#1a1310), text `--color-paper` (#faf7f2) at 13px Geist weight 700, border-radius **12px** (not pill — softer editorial), padding 12px 20px. Subtle 1px inner lighter edge using box-shadow `inset 0 0 0 1px rgba(214,206,189,0.15)`.

### Quiet Button (Secondary)
**Role:** Secondary action or alternative path.

Background transparent, 1px border `--color-stone`, text `--color-ink`, border-radius 12px, padding 11px 19px.

### Accent Pill (CTA emphasis)
**Role:** A pill-shaped primary call when you want the accent color. NOT the default button shape.

Background `--color-accent` (#e85a1a), text paper, border-radius 100px (pill), padding 10px 18px, 13px Geist weight 700. Used for "today" markers, focused actions, and one prominent CTA per view.

### Date Card (Today)
**Role:** The hero on the HOY view.

No background fill, no shadow. A massive date numeral in Newsreader 72–96px (left-aligned), day name and month in small mono uppercase above. Subtle horizontal rule beneath in `--color-stone`. Border-radius 0. The date is the headline — let the typography do the work.

### Task Row
**Role:** One task in the checklist.

Background paper, 1px bottom border `--color-sand` (no left/right/top borders — feels like ruled paper), padding 14px 0. Three columns: **checkbox circle** (24px) — **task label + meta** (flex) — **time** (mono, right-aligned). No card border-radius — items are flat rows that align vertically to an 8px baseline.

### Task Checkbox
**Role:** Toggle state.

24px diameter, 1.5px border `--color-stone` (idle) → filled `--color-sage` with white checkmark (done). No animation beyond a 150ms background swap. Border-radius 100px (full pill — a small geometric exception to make the check stand out against the squared rows).

### Tag Chip (Category)
**Role:** Category label on tasks.

Background `--color-accent-soft` for accent categories, `--color-sage-soft` for sage, `--color-indigo-soft` for indigo, etc. Text in saturated category color. Border-radius 100px. Padding 3px 9px. 11px Geist weight 600. No border.

### Stat Card
**Role:** Numerical KPI in Stats view.

Background linen, no border, padding 20px. Numeral in Newsreader 40–56px weight 500. Label in mono uppercase 11px tracking 0.06em above the numeral. No shadow.

### Day Cell (Calendar)
**Role:** One day in the monthly calendar.

Square aspect-ratio, no background fill, text charcoal. Day number in Newsreader 16px weight 500 centered. Optional small dot (3px) below in sage if any task was done. Today: background `--color-ink` (deep ink) with paper text. Future: text `--color-mist`. No borders on individual cells.

### Tab Bar (Mobile)
**Role:** Bottom navigation.

Background paper with 1px top border stone. Three tabs evenly spaced. Active tab: ink color, label 11px uppercase tracking 0.06em, ink icon. Inactive: smoke color. Icon stroke 1.6px. Total height 64px + safe-area-inset-bottom.

### FAB with Warm Conic Border
**Role:** Floating action button (Stats).

Background linen, 56px diameter, paper-color icon. **The one element with a conic gradient border** — warm orange → gold → sage → indigo → plum cycling at 6s linear infinite, 2px stroke. Sits at bottom-right above the tab bar.

### Progress Track
**Role:** Daily progress bar on HOY.

A thin (3px) horizontal rule across the page, `--color-stone`. Fill in `--color-sage` from left up to the % width. Border-radius 100px. No card, no padding — just a line. Above the line, two mono labels: left = "12 / 23", right = "52%".

### Section Label
**Role:** Small section header (Mañana / Tarde / Noche in HOY, or category names in Settings).

All caps, JetBrains Mono 11px weight 500, tracking 0.06em, color `--color-smoke`. Subtle 1px horizontal line `--color-sand` beneath it extending full width.

### Modal Sheet
**Role:** Bottom sheet for day detail from calendar.

Background linen, border-radius 20px top corners. Slides in 450ms cubic-bezier(0.33, 1, 0.68, 1). Internal padding 24px. A small horizontal "handle" 36×4px in stone, centered above the title.

### Month Nav Header
**Role:** "Septiembre 2026" with ‹ › in calendar.

Title in Newsreader 28px weight 500. Chevrons are 32×32px circular buttons with stone border.

## Do's and Don'ts

### Do
- Let the **Newsreader serif** carry the visual weight in headlines and numerals — don't dilute it with sans-serif numerals
- Use the **vertical 8px baseline grid** for numbers and dates — align % and totals vertically so they read as a column
- Use `--color-accent` (mandarina) **only** for: today's cell, the FAB, the active focus state, and one CTA per view
- Use `--color-sage` (verde salvia) **only** for: done states and completion
- Use 1px `--color-stone` borders as the structural baseline — never use shadows on cards
- Reserve the **conic gradient border** for ONE element per view (the FAB or one prominent CTA) — it earns attention by scarcity
- Keep numerals at minimum 40px — small numbers feel like dashboard widgets, big numbers feel like a printed page

### Don't
- Don't use pure white (`#fff`) anywhere — `--color-paper` (#faf7f2) is always warmer and softer
- Don't use pure black (`#000`) — `--color-ink` (#1a1310) is warm near-black
- Don't use pill shape for primary buttons — use 12px rounded rectangle; pills are reserved for chips and accent CTAs
- Don't use more than 3 surface levels on one view — flat-first, like a printed page
- Don't use the accent color for borders or large fills — only for small CTAs, today markers, and focus
- Don't use emojis in IDs, labels, or content
- Don't drop shadows on cards — use background shifts (paper → linen) and 1px borders
- Don't center everything — left-align dates, numerals, and stats for that journal rhythm

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Paper | `#faf7f2` | Page background. Default canvas. |
| 2 | Linen | `#f1ead9` | Elevated card surface, modals, FAB resting state. |
| 3 | Parchment | `#ebe3d0` | Section bands, used like a journal page background. |

## Elevation

The system treats elevation as background shift rather than shadow. Linen (`#f1ead9`) on Paper (`#faf7f2`) is the equivalent of an inset shadow — cards are recognized by tone, not depth. The single exception is the FAB and modal bottom-sheet, which use a subtle lift shadow because they float above scrolling content. No card uses shadow.

## Imagery

The interface is typography-dominant. No photographs, no illustrations, no decorative graphics. The visual interest comes from:
- **Typography hierarchy** — Newsreader display vs body sans creates rhythm
- **The 8px vertical grid** — numbers and labels align across rows like a printed ledger
- **Tone contrast** — paper / linen / parchment as the only "depth"
- **The conic-gradient border** — one moment of warmth per viewport

Icons are line-based (1.6px stroke), monochrome, in `--color-ink` or `--color-smoke`. No filled icons, no two-tone.

## Layout

Mobile-first. Single column. Max-width 560px centered on tablet, with the tabbar floating and centered at the bottom. Hero on HOY is a massive left-aligned date numeral (72–96px Newsreader) with a day name and month above in mono uppercase. Below the date, a 1px stone rule, then a thin progress line with mono labels. Then tasks below. The view scrolls vertically; no sidebars, no grids above the calendar.

Stats is a similar single-column: a big numeral for the streak, a thin rule, then 2-column KPI cards, then week bars, then calendar. Settings is a list of day sections.

## Motion Philosophy

Motion is restrained. The dominant duration is **450ms** with cubic-bezier(0.33, 1, 0.68, 1) — a slow ease-out that feels like a page settling into place. Secondary is **200ms** for state changes. The conic gradient on the FAB rotates at **6s linear infinite** — slow enough to be ambient, not distracting. Hover transitions are **120ms** for instant feedback. The principle: one slow continuous motion per viewport (the FAB), everything else settles quietly.

## CSS Custom Properties

```css
:root {
  /* Colors */
  --color-paper: #faf7f2;
  --color-linen: #f1ead9;
  --color-parchment: #ebe3d0;
  --color-ink: #1a1310;
  --color-charcoal: #3d3530;
  --color-smoke: #756c63;
  --color-mist: #a89e91;
  --color-stone: #d6cebd;
  --color-sand: #e3dccb;
  --color-accent: #e85a1a;
  --color-accent-soft: #fbece0;
  --color-sage: #6b8e6f;
  --color-sage-soft: #e8f0e6;
  --color-indigo: #3a4a6b;
  --color-indigo-soft: #e7ebf2;

  --gradient-conic-warm: conic-gradient(
    from 90deg,
    #e85a1a 0%,
    #d4a017 14%,
    #6b8e6f 28%,
    #3a4a6b 42%,
    #6b4d8e 56%,
    #a85a7a 70%,
    #e85a1a 84%,
    #fbece0 100%
  );

  /* Fonts */
  --font-display: 'Newsreader', 'Source Serif 4', ui-serif, Georgia, serif;
  --font-body: 'Geist', ui-sans-serif, system-ui, -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace;

  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 24px;
  --space-6: 32px;
  --space-7: 48px;
  --space-8: 64px;

  /* Radius */
  --radius-chip: 100px;
  --radius-card: 14px;
  --radius-input: 10px;
  --radius-button: 12px;
  --radius-modal: 20px;

  /* Surfaces */
  --surface-paper: #faf7f2;
  --surface-linen: #f1ead9;
  --surface-parchment: #ebe3d0;

  /* Layout */
  --page-max: 560px;
  --baseline: 8px;

  /* Motion */
  --ease-soft: cubic-bezier(0.33, 1, 0.68, 1);
  --dur-fast: 120ms;
  --dur-base: 200ms;
  --dur-slow: 450ms;

  /* Theme color (PWA) */
  --theme-color: #faf7f2;
}
```

## Quick Start — Example Component Prompts

1. **Date Card (Hoy hero):** "A massive date numeral in Newsreader 72–96px weight 500, left-aligned, color `--color-ink`. Above it, a mono uppercase label `LUNES · OCTUBRE` in 11px JetBrains Mono tracking 0.06em, color `--color-smoke`. Below it, a 1px stone rule. No background, no shadow, no card. The typography IS the card."

2. **Ink Button:** "Background `--color-ink` (#1a1310), text paper at 13px Geist weight 700, border-radius **12px** (not pill), padding 12px 20px. Subtle inner edge using `box-shadow: inset 0 0 0 1px rgba(214,206,189,0.15)`. Used for primary actions."

3. **Task Row:** "A flat row with no card. Background paper, padding 14px 0, 1px bottom border `--color-sand`. Three columns: 24px circular checkbox — task label in 15px Geist — time in mono 12px right-aligned. Border-radius 0. Items align vertically to an 8px baseline grid."

## 3 Example Component Prompts (for agents)

1. **Date Card (Hoy hero):** "A massive date numeral in Newsreader 72–96px weight 500, left-aligned, color `--color-ink`. Above it, a mono uppercase label `LUNES · OCTUBRE` in 11px JetBrains Mono tracking 0.06em, color `--color-smoke`. Below it, a 1px stone rule. No background, no shadow, no card. The typography IS the card."

2. **Ink Button:** "Background `--color-ink` (#1a1310), text paper at 13px Geist weight 700, border-radius **12px** (not pill), padding 12px 20px. Subtle inner edge using `box-shadow: inset 0 0 0 1px rgba(214,206,189,0.15)`. Primary CTA. No pill shape."

3. **Task Row:** "A flat row with no card. Background paper, padding 14px 0, 1px bottom border `--color-sand`. Three columns: 24px circular checkbox (1.5px stone border, sage fill when done with white check) — task label 15px Geist weight 500 — time in mono 12px right-aligned. Border-radius 0. Items align to an 8px baseline grid."