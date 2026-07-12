---
name: Nova Silva Portfolio
description: Light Editorial × Modern Green Portfolio
colors:
  primary: "#15803d"
  neutral-bg: "#fafcf5"
  surface: "#f2f6eb"
  surface-2: "#eaf0e2"
  border: "#dae1d3"
  ink: "#262d29"
  ink-muted: "#626f68"
  ink-subtle: "#9aa69d"
  accent-2: "#34d399"
typography:
  display:
    fontFamily: "Archivo, sans-serif"
    fontSize: "clamp(3rem, 7.5vw, 7rem)"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.04em"
  body:
    fontFamily: "Space Grotesk, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
rounded:
  sm: "4px"
  md: "8px"
  lg: "12px"
  full: "100px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "32px"
  xl: "64px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.neutral-bg}"
    rounded: "{rounded.full}"
    padding: "16px 32px"
  button-accent:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.neutral-bg}"
    rounded: "{rounded.full}"
    padding: "16px 32px"
---

# Design System: Nova Silva Portfolio

## 1. Overview

**Creative North Star: "The Modern Green Editorial"**

A light-themed design system characterized by sophisticated typography, high typographic contrast, brutalist layouts, and modern green accents. It rejects typical dark purple templates, generic SaaS cards, and lack of visual character.

**Key Characteristics:**
- Light background with subtle green/neutral tint.
- Forest and mint green accents.
- Archivo display font paired with Space Grotesk body font.
- Floating slide-up back-to-top navigation helper.

## 2. Colors

A premium, highly legible OKLCH-derived palette featuring dark forest hues and clean mint-green accents.

### Primary
- **Deep Forest Green** (#15803d / oklch(0.56 0.19 145)): Used for brand accents, primary green buttons, and visual highlights.

### Secondary
- **Mint Green** (#34d399 / oklch(0.68 0.17 155)): Accent highlight for interactive states and hover glows.

### Neutral
- **Off-white Background** (#fafcf5 / oklch(0.985 0.003 120)): The base viewport color.
- **Tinted Surface** (#f2f6eb / oklch(0.96 0.005 130)): Used for contrasting sections like process and contact.
- **Near-black Ink** (#262d29 / oklch(0.17 0.010 150)): Primary text color.
- **Muted Ink** (#626f68 / oklch(0.44 0.020 150)): Subtitles and metadata.

**The accent rarity rule.** The primary green accent should cover ≤10% of any screen. Its rarity drives emphasis.

## 3. Typography

**Display Font:** Archivo (with sans-serif fallback)
**Body Font:** Space Grotesk (with sans-serif fallback)

**Character:** A bold, structured brutalist Display font paired with a technical, high-legibility geometric sans-serif body font.

### Hierarchy
- **Display** (800, clamp(3rem, 7.5vw, 7rem), 1.1): Used for main page headings.
- **Headline** (700, 2rem, 1.2): Used for section titles.
- **Title** (600, 1.25rem, 1.3): Used for card titles.
- **Body** (400, 1rem, 1.6): General text. Cap line length at 70ch.

## 4. Elevation

The system is flat by default, relying on solid borders and crisp layouts rather than soft shadows. Tonal layers convey depth.

**The state-dependent shadow rule.** Ambient shadows or glows appear only as visual feedback during active hover or focus states.

## 5. Components

### Buttons
- **Shape:** Rounded full pill (100px).
- **Primary:** Background (#262d29), text (#fafcf5), padding (16px 32px).
- **Hover:** Translate Y (-2px), subtle shadow.

### Cards / Containers
- **Corner Style:** Medium corner (8px or 12px).
- **Background:** Base neutral (#fafcf5) or surface (#f2f6eb).
- **Border:** Soft border (1px solid #dae1d3).

## 6. Do's and Don'ts

### Do:
- **Do** maintain a strict 4.5:1 text-to-background contrast ratio using the defined forest green and near-black colors.
- **Do** disable scroll-animations and custom cursors for users preferring reduced motion.

### Don't:
- **Don't** use generic blue/indigo SaaS card layouts or gradient text overlays.
- **Don't** use thick left-side borders as accent decorators on cards.
