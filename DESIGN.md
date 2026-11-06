---
name: Mizan
description: A clear, traceable zakat estimate for Lunch Money users.
colors:
  bg: "#f5f5f2"
  card: "#ffffff"
  panel: "#eaeae7"
  ink: "#191919"
  text: "#424242"
  muted: "#62625e"
  line: "#d8d8d3"
  deep: "#191919"
  hover: "#424242"
  on-deep: "#ffffff"
  accent: "#a1793d"
  warn-bg: "#fbf5e7"
  warn-ink: "#795b24"
  bad: "#a33930"
  good: "#3e739c"
  chart-blue: "#4e6c89"
  chart-teal: "#6a8379"
  chart-debt: "#a37d58"
  chart-fill: "rgba(78,108,137,.1)"
  workspace: "#ededeb"
  workspace-ink: "#191919"
  workspace-action: "#1b1d20"
  workspace-light: "#ffffff"
typography:
  display:
    fontFamily: "Mizan, 'Avenir Next', system-ui, sans-serif"
    fontSize: "clamp(50px, 6.8vw, 88px)"
    fontWeight: 800
    lineHeight: 1.02
    letterSpacing: "-.04em"
  body:
    fontFamily: "Mizan, 'Avenir Next', system-ui, sans-serif"
    fontSize: "16px"
    lineHeight: 1.65
  number:
    fontFamily: "'Mizan Mono', ui-monospace, monospace"
    fontSize: "14px"
rounded:
  field: "10px"
  button: "999px"
  card: "20px"
spacing:
  field: "10px 12px"
  button: "10px 20px"
components:
  button-primary:
    backgroundColor: "{colors.deep}"
    textColor: "{colors.on-deep}"
    rounded: "{rounded.button}"
    padding: "10px 20px"
  button-secondary:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.button}"
    padding: "10px 20px"
  field:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.field}"
    padding: "10px 12px"
  workspace:
    backgroundColor: "{colors.workspace}"
    textColor: "{colors.workspace-ink}"
    rounded: "24px"
    padding: "clamp(28px, 4vw, 52px)"
  result:
    backgroundColor: "{colors.workspace-action}"
    textColor: "{colors.workspace-light}"
    rounded: "24px"
    padding: "clamp(28px, 4vw, 48px)"
---

# Design System: Mizan

## Overview

**Creative North Star: “The Calm Ledger”**

Mizan is a quiet, calculation-first workspace for reviewing wealth and understanding a zakat estimate. Neutral surfaces, bold typography, rounded controls and aligned figures make the calculation approachable while keeping its sources, choices and limitations visible.

## Colors

The light theme uses an off-white ground, white cards, soft gray panels and near-black text and actions. Dark mode uses a charcoal ground (#17191d), card (#22252a) and panel (#30343a), with light text (#f7f7f5), muted text (#bcbcb8) and borders (#4c4e50). Semantic actions invert to light on dark. Chart colors distinguish accounts, additions, deductions and net wealth, supported by labels and text.

The fictional workspace keeps its own light gray calculation surface (#ededeb) and charcoal action surface (#1b1d20) in both themes. Its sample button is white with dark text. The estimate result also uses charcoal with white and light gray text.

## Typography

Mizan is the local Nunito Sans face, with Avenir Next and system sans-serif fallbacks. Mizan Mono is the local Red Hat Mono face, used for many amounts, chart figures and small metadata; the example workspace amounts use bold Mizan sans. Body text is 16px at 1.65 line height. The centered opening headline uses bold sans at 50–88px, with a 45–64px mobile override. Flow page titles use bold sans at 38–54px. Notes are generally smaller and muted.

## Layout

The main wrapper is `min(1120px, 100% - 64px)`; narrow content is capped at 760px. The home page is a marketing page in bands that scroll normally (nothing is sticky): a two-column hero (headline, Connect your account and Try the sample actions, trust list) beside the fictional calculation workspace; “Your money is already accounted for” with account tiles flowing into one total; three illustrated steps; a charcoal “Why zakat” band with Quran and hadith quotes; the basics (rate, nisab, hawl) with today's metal prices and a link to the zakat guide; a privacy card; and a closing call to action. “Connect your account” opens a dedicated step 01 screen at `#connect` (token instructions and form, with a sample option in the aside), which leads into 02 Review balances and 03 Your estimate. At 1000px and below the hero, flow illustration and card grids stack. The estimate places the result first, followed by a calculation and method area capped at 850px. Tables can scroll horizontally. Other responsive adjustments occur at 760px and 380px.

## Elevation and shapes

Tonal surfaces, borders and rules provide most separation. The workspace and estimate result have 24px corners, while the workspace uses 18px on mobile. The review aside and history panel have 20px corners. Buttons are pill-shaped and text, password, number and select fields have 10px corners. The shared card shadow is `0 12px 36px rgba(0,0,0,.06)`; the workspace, result and history panel are flat.

## Components

### Buttons and fields

Primary buttons use the semantic action color with contrasting text; secondary buttons use the card surface and a line border. Both have a 44px minimum height. Link buttons are underlined and visually lighter. Fields use a card background and line border; numeric fields align values right in Mizan Mono. A visible outline indicates keyboard focus.

### Navigation

The header pairs the Mizan mark and wordmark with simple text links. The current page has an underline. The calculation flow uses a compact step navigation with the current step filled in the action color.

### Ledger and calculation

The fictional example uses horizontal rules, paired labels and right-aligned amounts beside a sample calculation action. The estimate gives the result a charcoal panel, then exposes a waterfall breakdown, line-item table and method controls. Source tags distinguish imported and locally adjusted amounts. History uses a chart, selectable month, legend and a disclosure with tabular values; partial data is also described in text.

### Disclosures and notices

An expandable section offers the Lunch Money connection. Other expandable sections group optional assets, debts, methods and tables. Warnings use a warning surface and accent border. Missing values and incomplete states are written explicitly rather than relying on color alone.

## Do's and Don'ts

- Keep amounts, source labels and calculation steps easy to trace.
- Preserve visible focus, text labels and table alternatives for charts.
- Use semantic color properties for elements that adapt to light and dark modes.
- Don't present partial or missing data as a complete calculation.
- Don't obscure method choices or calculation limitations behind decorative treatment.
