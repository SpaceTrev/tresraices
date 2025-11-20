---
mode: agent
---

# Copilot Prompt — Homepage Polish: Spacing + Mobile Top Bar

**Goal:** Improve small-screen ergonomics on the home page by:

1. Adding comfortable, consistent padding around the **header** and **footer**
2. Implementing a responsive **mobile top bar** with a hamburger menu and accessible slide-over

---

## Context

- Next.js 15 (App Router), TypeScript, Tailwind CSS
- Brand palette already implemented
- Current routes:
  - `/` — homepage
  - `/menu/[region]` — menus for Guadalajara (+20%) and Colima (+30%)
  - `/admin` — internal, hidden from nav
- No new dependencies

---

## Deliverables

### 1. `components/layout/NavBar.tsx`

Create or refactor to include:

- **Desktop view:**
  - Inline nav links: `Inicio`, `Menú Guadalajara`, `Menú Colima`, `WhatsApp`
- **Mobile view:**
  - Left: logo or brand text
  - Right: hamburger button (`aria-controls`, `aria-expanded`)
  - Slide-over menu:
    - `fixed inset-y-0 right-0 w-[85%] max-w-sm`
    - Backdrop: `bg-black/40`
    - Focus management: moves focus to first link on open, closes on ESC or backdrop click
  - Sticky bar: `sticky top-0 z-40 bg-cream/90 backdrop-blur`
  - Height: `h-16`
    0 - Safe padding: `pt-safe` or `pt-4 sm:pt-6`

---

### 2. `app/layout.tsx`

- Wrap main content with a **max-width container**:
  `mx-auto max-w-7xl px-4 sm:px-6 lg:px-8`
- Ensure `<NavBar />` is rendered at the top
- Define global top/bottom spacing tokens if necessary

---

### 3. `components/layout/Footer.tsx`

- Comfortable spacing: `px-4 sm:px-6 lg:px-8 py-8 sm:py-10`
- Layout: simple grid (brand, regions, WhatsApp link, socials)
- Divider above footer on mobile: `border-t border-black/10`
- Maintain high contrast with brand palette

---

### 4. `styles/globals.css`

Add small utility helpers:

```css
.container-pad {
  @apply px-4 sm:px-6 lg:px-8;
}
.section-pad {
  @apply py-10 sm:py-14;
}
.tap-target {
  @apply min-h-10 min-w-10;
}
```

---

### 5. Update home sections (for spacing consistency)

- Each section uses `.container-pad` + `.section-pad`
- Hero: wrap inner content in `max-w-3xl` and apply `gap-4 sm:gap-6`
- Value props and category cards: `gap-6 sm:gap-8`, consistent `rounded-2xl`

---

## Behavior & UX Rules

- Hamburger menu locks body scroll (`overflow-hidden` on `<html>` or `<body>`)
- Touch targets ≥ 44px (e.g., `min-h-[44px] min-w-[44px]`)
- Header/footer maintain ≥ `px-4` padding on the smallest breakpoints
- Desktop layout remains visually consistent (no regressions)

---

## Accessibility

- Hamburger button:
  - `aria-label="Abrir menú"`
  - toggles `aria-expanded`
- Slide-over:
  - `role="dialog"`
  - `aria-modal="true"`
- ESC and backdrop click close the menu
- Focus trap implemented without external libraries

---

## Acceptance Criteria

1. On screens ≤ 640px:
   - Header and footer have adequate horizontal padding
   - Content doesn’t touch edges
2. Hamburger menu:
   - Opens/closes smoothly
   - Links: Inicio `/`, Menú GDL `/menu/guadalajara`, Menú Colima `/menu/colima`, WhatsApp link
   - ESC and backdrop click close it
3. Header remains sticky with readable text and backdrop blur
4. Sections across home page have even vertical spacing
5. No new dependencies; TypeScript + `pnpm build` pass
6. Lighthouse “tap targets” audit passes for mobile usability

---

**Implement all of the above with complete file contents where required, preserving the brand palette and Tailwind design language.**
