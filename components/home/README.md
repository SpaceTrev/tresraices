# Home Page Components

This directory contains the modular components for the homepage redesign (November 2025).

## Components

### Hero.tsx
- Full-width hero section with gradient background overlay
- Headline: "Carnes selectas, directo a tu mesa"
- Primary CTA to menu, secondary CTA to WhatsApp
- Min height 80vh, responsive typography
- Background image placeholder: `/public/img/hero-bg.jpg`

### About.tsx
- Two-column layout (text + image)
- Heading: "De la granja a tu mesa"
- Value highlights: 100% local, Entrega 24h
- Image placeholder: `/public/img/about-section.jpg`

### CategoryShowcase.tsx
- Grid of 4 category cards
- Categories: Res, Cerdo, Aves, Especialidades
- Links to `/menu/guadalajara?cat=<category>`
- Hover effects: scale, shadow, translate

### ValueProps.tsx
- 3-column icon grid
- Props: Cortes Premium (🐄), Entrega Rápida (🚚), Hecho en México (🇲🇽)
- Cream background with white cards

### CTASection.tsx
- Full-width dark purple banner
- Centered headline and button
- CTA to `/menu/guadalajara`

### Footer.tsx
- Three-column layout: Brand, Regiones, Contacto
- Brand info with logo
- Links to menu pages
- WhatsApp contact
- Copyright notice

## Layout Integration

The homepage (`app/page.tsx`) composes all six components in sequence.

The root layout (`app/layout.tsx`) was updated to:
- Remove the old footer (now using Footer component)
- Remove container padding from `<main>` (components handle their own spacing)
- Update metadata to match SEO requirements

## Styling

All components use:
- Tailwind CSS with brand colors from `tailwind.config.ts`
- Responsive utilities (mobile-first)
- Utility classes from `globals.css` (`.btn`, `.btn-primary`, `.card`)
- Consistent spacing scales (`py-16 sm:py-20 md:py-24`)
- Soft shadows, rounded corners (`rounded-2xl`)
- Hover transitions

## Image Placeholders

Required images (to be added to `/public/img/`):
- `hero-bg.jpg` — Hero background (1920×1080 recommended)
- `about-section.jpg` — About section image (800×400 recommended)

Components gracefully handle missing images (gradient fallback in Hero, placeholder alt text).
