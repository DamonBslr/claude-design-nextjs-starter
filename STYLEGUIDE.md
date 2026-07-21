# Sezaba style guide

This starter enforces the Sezaba CI across all apps in the monorepo. Use it so every project looks identical.

**Theme implementation:** [`packages/ui/src/styles/globals.css`](packages/ui/src/styles/globals.css)

---

## Color palette

| Name | Hex | Tailwind utility | Usage |
|------|-----|------------------|--------|
| Black | `#000000` | `brand-black` | Body text, icons, default buttons (light mode) |
| White | `#FFFFFF` | `brand-white` | Main page background |
| Beige | `#F3F3EB` | `brand-beige` | Alternate sections, cards, sidebars, muted areas |
| Pink | `#FEC6E9` | `brand-pink` | Soft highlight backgrounds, secondary chart accent |
| Red | `#D20001` | `brand-red` | **Primary accent** — links emphasis, charts, alerts, brand highlights |
| Blue | `#0212EE` | `brand-blue` | Secondary accent — multi-series charts, decorative blocks |

### Roles at a glance

```
Light backgrounds  →  white, beige, pink
Text & default UI  →  black (light) / white (dark)
Primary accent     →  red
Extra accents      →  blue, pink (charts, illustrations)
```

---

## Semantic tokens (recommended)

Components should use **semantic** classes. They map to brand colors and support dark mode automatically.

| Token | Light | Purpose |
|-------|-------|---------|
| `background` | White | Page / app shell |
| `foreground` | Black | Body text |
| `primary` | Black | Default button fill |
| `primary-foreground` | White | Text on primary button |
| `secondary` | Beige | Secondary buttons, panels |
| `muted` | Beige | Subtle backgrounds |
| `muted-foreground` | Black @ 55% | Captions, hints |
| `accent` | Pink | Highlight strips, active nav |
| `destructive` | Red | Errors, delete actions |
| `border` / `ring` | Black @ 15–25% | Borders, focus rings |

### Examples

```tsx
// Page shell
<main className="bg-background text-foreground">

// Default CTA (black button in light mode)
<Button>Get started</Button>

// Beige section
<section className="bg-secondary text-secondary-foreground">

// Pink highlight band
<div className="bg-accent text-accent-foreground">

// Brand red callout
<span className="text-destructive font-medium">New</span>

// Direct brand color when needed
<div className="bg-brand-beige border border-brand-black/15">
```

---

## Charts and data visualization

Chart CSS variables follow accent priority:

| Variable | Color |
|----------|--------|
| `--chart-1` | Red (default series) |
| `--chart-2` | Blue |
| `--chart-3` | Pink |
| `--chart-4` | Black (light) / White (dark) |
| `--chart-5` | Beige |

```tsx
// Recharts / chart component config
const chartConfig = {
  revenue: { color: "var(--chart-1)" },
  traffic: { color: "var(--chart-2)" },
  growth: { color: "var(--chart-3)" },
}
```

Use **red first**, then blue and pink for additional series. Avoid non-brand colors.

---

## Dark mode

Toggle with the `.dark` class on a parent (e.g. `<html class="dark">`).

- **Black ↔ white** invert for background, text, and primary buttons.
- **Red, blue, pink, beige** stay unchanged for accents.
- Prefer semantic tokens (`bg-background`, `text-foreground`) instead of hardcoded hex.

---

## Borders, hover, and disabled states

Opacity on black or white is allowed for UI chrome:

```tsx
className="border-border"           // subtle border
className="ring-ring/50"            // focus ring
className="hover:bg-primary/80"     // button hover
className="text-muted-foreground"   // secondary text
className="disabled:opacity-50"     // disabled controls
```

Do not add new grays (e.g. `gray-200`). Use `color-mix` tokens from the theme or Tailwind opacity modifiers on brand/semantic colors.

---

## What not to do

- Hardcode hex in components (`style={{ color: "#D20001" }}`)
- Use Tailwind default palettes (`bg-blue-500`, `text-zinc-600`)
- Add colors outside the six brand tokens without design sign-off
- Use blue as the default link or button color (red is the standard accent)

---

## For AI agents

Cursor rule: [`.cursor/rules/brand-styling.mdc`](.cursor/rules/brand-styling.mdc)  
Component library rule: workspace `component-library` rule — compose UI from `@workspace/ui`, never one-off primitives.

---

## Figma reference

Design file: [sezaba-Seite-Final](https://www.figma.com/design/1lOXUYu20ORMQyPSDOrPX9/sezaba-Seite-Final)

When implementing new screens, map Figma fills to the tokens above before writing Tailwind classes.
