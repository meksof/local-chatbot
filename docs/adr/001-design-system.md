# ADR 001 — Adopt Ollama-Inspired Design System

**Status:** Accepted  
**Date:** 2026-10-28  
**Deciders:** Product / Engineering

---

## Context

The app shipped with a generic Tailwind theme: a dark `gray-900` sidebar, `blue-600` as the universal primary action colour, `gray-50` chat backgrounds, and no typographic personality. This "default Tailwind look" works but conflicts with the Ollama brand aesthetic that users see on ollama.com and in the Ollama CLI — a minimal, documentation-first, paper-white canvas with pure-black pill CTAs.

The design system was captured and formalised in `docs/design/DESIGN.md` (version: alpha, name: `Ollama-design-analysis`). The task was to bring the chat app's visual language in line with that system.

---

## Decision

Apply the Ollama-inspired design system to the entire Angular app, following these concrete decisions:

### 1. Token-first: extend Tailwind config

All design system values are codified as custom Tailwind theme extensions in `tailwind.config.js` rather than being hand-mapped per component. This gives every component author access to semantic utility classes (`bg-canvas`, `text-ink`, `bg-surface-dark`, `font-display`, etc.) and makes future token changes a single-file operation.

**Tokens added:** colors (22), border-radius aliases (ds-sm / ds-md / ds-lg), spacing scale (xxs → section), font families (display / sans / mono), and the full typography scale (display-xl → button-md).

### 2. Colour palette: black-on-white with a single dark inversion

The previous multi-colour scheme (blue CTAs, yellow warnings, red/green/blue toasts) is replaced by the design system's two-surface model:

| Surface | Token | Hex | Usage |
|---|---|---|---|
| Canvas | `canvas` | `#ffffff` | Page, chat area, input bar, bottom nav |
| Ink | `ink` | `#000000` | All primary CTAs, headings, active icons |
| Surface Soft | `surface-soft` | `#fafafa` | Disabled inputs, secondary chips, assistant message bubbles |
| Surface Dark | `surface-dark` | `#171717` | Sidebar (persistent), toast notifications |
| Hairline | `hairline` | `#e5e5e5` | All borders and dividers |

No gradients, no drop shadows, no blue or green in the UI chrome.

### 3. Sidebar stays dark (`surface-dark`)

The design system's `surface-dark` surface is documented as a single "look here" inversion. For a marketing page, this means one pricing tier. For a chat app, the persistent sidebar serves the same role — it anchors the navigation column and creates the necessary contrast between "where you are" (sidebar) and "what you are doing" (chat area). Using `surface-dark` here is semantically consistent with the design system's intent.

### 4. Pill geometry everywhere interactive

Every button, text input, select, and icon button uses `rounded-full` (9999 px). Cards and container surfaces use `rounded-ds-lg` (12 px). Nothing interactive has a sharp corner. This is a hard rule from the design system ("Don't soften pills or sharpen cards").

#### Message bubbles in the conversation area

Message bubbles are the one place in the UI where corner radius and horizontal padding are intentionally **not** hardcoded to a fixed Tailwind token. Instead, they are driven by two CSS custom properties injected into `:root` via a Tailwind plugin in `tailwind.config.js`:

| CSS variable | Value | Computed | Role |
|---|---|---|---|
| `--user-message-rounded` | `calc(.25rem * 5.5)` | `22px` | Border radius for all message bubbles |
| `--user-message-spacing` | `calc(.25rem * 4)` | `16px` | Horizontal padding inside all message bubbles |

These are consumed in the chat template using Tailwind's arbitrary-value syntax:

```html
<div class="rounded-[var(--user-message-rounded)] px-[var(--user-message-spacing)] …">
```

Both the user bubble (`bg-ink text-on-primary`) and the assistant bubble (`bg-surface-soft text-ink`) share the same corner and spacing variables — only the surface and text colour differ.

**Why CSS variables instead of a static token?**  
The `22px` radius sits between the design system's two defined card values (`ds-sm` 6px, `ds-md` 8px, `ds-lg` 12px) and the pill extreme (`rounded-full`). Message bubbles need a softer, chat-native corner that feels conversational without collapsing to a full pill. Exposing this as a CSS variable rather than a one-off arbitrary value means the radius can be tuned globally (e.g. at a breakpoint or via a theme switch) without touching every template. To adjust the bubble shape across the entire app, update `--user-message-rounded` in `tailwind.config.js`'s `addBase` plugin block.

### 5. Typography: Nunito + system-ui + ui-monospace

SF Pro Rounded (the design system's heading face) is Apple-licensed and unavailable on Linux/Windows. **Nunito** (Google Fonts, weights 500 and 600) is the closest open-source equivalent — same rounded geometric terminals, identical weight range. It is loaded via a `<link>` in `index.html` as the first entry in the `font-display` family stack, with `SF Pro Rounded` and `system-ui` as fallbacks.

Body text stays `ui-sans-serif` (OS default) and code stays `ui-monospace`, matching the design system exactly.

### 6. Toasts: unified `surface-dark` card, icon colour signals severity

The previous toasts used five different background colours (red, yellow, green, blue, gray) to communicate severity. This violates the "no semantic colour palette" principle of the design system.

New approach: every toast uses a `surface-dark` card (consistent with the dark-on-light inversion pattern). Severity is communicated exclusively through the icon colour, using the system's terminal traffic-light palette:

| Severity | Icon colour | Token |
|---|---|---|
| error | red | `terminal-red` (#ff5f56) |
| warning | yellow | `terminal-yellow` (#ffbd2e) |
| success | green | `terminal-green` (#27c93f) |
| info / default | muted white | `on-dark-mute` |

### 7. Message bubbles: black pill (user) / soft card (assistant)

User messages become black rounded-full pills (`bg-ink text-on-primary rounded-full`) — consistent with how the design system treats all primary/action surfaces.

Assistant messages become `surface-soft` cards (`bg-surface-soft rounded-ds-lg`) — quiet, readable, visually subordinate.

The typing indicator uses a `surface-soft` card with a `hairline` border and three `mute`-coloured animated dots.

### 8. Empty states: flat, no coloured icon circles

The previous "blue circle with chat icon" empty state pattern is removed. Empty states now show a flat `mute`-coloured stroke icon above a minimal heading + body copy, optionally with a black pill CTA. No coloured containers.

### 9. Model selector: pill select element

The `<select>` for model switching is styled with `rounded-full` and `border-hairline` to match the design system's `text-input` spec. The "locked" hint is reduced to a single `text-mute` word ("locked") rather than a parenthetical phrase, keeping the toolbar uncluttered.

### 10. App shell: `bg-canvas` root, hairline sidebar border

The root wrapper changes from `bg-gray-100` to `bg-canvas`. The desktop sidebar separator becomes a 1 px `border-hairline` line (not a background colour change). The mobile sidebar overlay uses `bg-black/40` for a subtle scrim.

---

## Consequences

**Good:**
- Visual language is consistent with the Ollama product family.
- Semantic token classes make future design changes a single-file (`tailwind.config.js`) operation.
- Accessibility: all interactive elements remain at or above 36 px touch target height; focus rings use `focus-ring` (translucent blue) consistent with the design spec; ARIA roles and labels are unchanged.
- All existing Playwright e2e tests continue to pass unchanged because they rely on semantic selectors (`role`, text content), not CSS classes.

**Trade-offs:**
- Nunito will render slightly differently from SF Pro Rounded on macOS. This is explicitly accepted upstream by Ollama themselves for non-Apple platforms.
- Pill-shaped user message bubbles (`rounded-full`) may clip unusually long single-word tokens. Accepted — the design system does not define a word-wrap exception for pills.
- The single-dark-inversion constraint means the sidebar cannot be re-styled to a light variant without revisiting this ADR.

---

## Alternatives Considered

| Option | Rejected because |
|---|---|
| Keep generic blue/gray Tailwind theme | Conflicts with Ollama brand; roadmap item explicitly calls for design system alignment |
| Manual class mapping without Tailwind token extension (plan option 3b) | Harder to maintain; future designers cannot use semantic names in templates |
| Light sidebar (`surface-soft`) | Reduces contrast between navigation and content; `surface-dark` is the design system's defined inversion surface and suits a persistent nav panel |
| Per-toast-type coloured backgrounds | Violates design system "no semantic colour palette in chrome" rule; terminal traffic-light icons achieve the same differentiation with less visual noise |
