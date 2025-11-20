---
mode: agent
---

# Copilot Prompt — Redesign the Home Page (Tres Raíces Carnicería)

**Goal:** Redesign the `/` (home) page to look elegant, trustworthy, and brand-aligned — visually matching a premium artisanal butcher or farm-to-table food brand. Emphasize craftsmanship, product quality, and regional authenticity, while guiding users toward viewing the menu and contacting via WhatsApp.

---

## Context
- Stack: Next.js 15 (App Router) + TypeScript + Tailwind CSS 3.4+
- Brand palette already defined in `tailwind.config.ts` (darkPurple, federalBlue, cream, mintGreen, etc.)
- Typography should feel modern and confident — use Tailwind utilities for weights/sizes.
- Images and brand graphics will be added later; use placeholder assets in `/public/img/`.
- Existing routes:
  - `/menu/[region]` — menus for Guadalajara (+20%) and Colima (+30%)
  - `/admin` — internal, hidden from main navigation.
- Favicon already set via `/public/favicon/*` and `metadata.icons` in `app/layout.tsx`.

---

## Deliverables

### 1) `app/page.tsx` (rewrite fully)
Implement a polished landing page composed of these sections:

**Hero section**
- Full-width background image or gradient overlay using brand colors.
- Headline (e.g. *“Carnes selectas, directo a tu mesa”*).
- Subtext (one-line value proposition: *“Cortes premium de productores locales, entrega directa en Guadalajara y Colima.”*).
- Primary CTA: “Ver menú” → `/menu/guadalajara`.
- Secondary CTA: “Contactar por WhatsApp” → `https://wa.me/523315126548`.
- Responsive height: `min-h-[80vh]`, centered content, readable over image (overlay/blur as needed).

**About / Filosofía**
- Two-column layout (text + image).
- Heading: “De la granja a tu mesa”
- 2–3 sentence paragraph about autenticidad, trazabilidad y frescura.
- Optional highlights (e.g. “100 % local”, “Entrega en 24 h”).

**Category Showcase / Destacados**
- Grid (3 or 4 cards). Each card:
  - Category name, short tagline, emoji/icon.
  - “Ver productos” button linking to `/menu/[region]?cat=<category>`.
- Subtle hover (scale/translate, shadow).

**Por qué elegirnos / Value Props**
- 3 icon blocks (e.g. 🐄 Cortes premium | 🚚 Entrega rápida | 🇲🇽 Hecho en México).
- Neutral background (`bg-cream`) and soft shadows.
- Consistent icon size/alignment.

**CTA Strip / Banner**
- Full-width colored bar (`bg-darkPurple text-cream`) with centered copy:
  *“Descubre el sabor de la calidad Tres Raíces.”*
- Button → “Ver menú”.

**Footer**
- Simple and elegant: brand name/logo, regions served, WhatsApp link, minimal socials (placeholders).
- Background `bg-federalBlue text-cream`.

### 2) Optional components (create if helpful)
- `components/home/Hero.tsx`
- `components/home/About.tsx`
- `components/home/CategoryShowcase.tsx`
- `components/home/ValueProps.tsx`
- `components/home/CTASection.tsx`
- `components/home/Footer.tsx`

**Guidelines**
- Responsive (mobile-first). Use padding scales like `px-4 sm:px-8 md:px-16`.
- `rounded-2xl`, soft shadows, tasteful gradients.
- Tailwind transitions for hover states; minimal motion.

### 3) Styling & tone
- Copy in **Spanish**.
- Tone: elegante, artesanal, seguro.
- Use brand colors thoughtfully: cream backgrounds, dark text, mint accents.
- Avoid clutter; leverage whitespace and large type for hierarchy.

### 4) Metadata (ensure present in `app/layout.tsx`)
```ts
export const metadata = {
  title: "Tres Raíces Carnicería — Cortes Premium en Guadalajara y Colima",
  description: "Carnicería boutique con cortes selectos y entrega a domicilio. Pedidos por WhatsApp.",
};
```

### 5) Accessibility & performance
- Headings structured (`h1` once; subsequent `h2/h3`).
- Sufficient contrast (AA+). Use `outline` focus states on interactive elements.
- Lighthouse Performance ≥ 90 on production build (optimize images with next/image where placeholders are used).

---

## Acceptance Criteria
1. New homepage compiles cleanly; **no new dependencies**.
2. Desktop & mobile layouts feel premium and consistent with the brand palette.
3. Clear above-the-fold CTAs to `/menu/guadalajara` and WhatsApp.
4. Section structure matches the Deliverables; hero through footer present.
5. Favicon continues to display in browser tab.
6. All content in Spanish with succinct, persuasive copy.

---

## Implementation Notes
- Use `/public/img/` placeholder images with descriptive alt text.
- Keep components self-contained with minimal props; wire static content directly for now.
- Ensure layout works regardless of whether images are available (graceful fallbacks).
