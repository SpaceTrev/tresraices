---
mode: agent
---
# Copilot Prompt — Add Favicon and Metadata Support

**Goal:** Integrate the Tres Raíces favicon and metadata correctly across the Next.js 15 App Router site so the logo appears in the browser tab and on mobile devices.

**Current state**
- Favicon assets exist under:
  - `/public/favicon/` — includes `favicon.ico`, `favicon-16x16.png`, `favicon-32x32.png`, `apple-touch-icon.png`, and optionally `site.webmanifest`.
  - `/app/favicon/` — temporary duplicate; should not be served directly.
- Project uses App Router with `app/layout.tsx` as the root layout.

---

## Deliverables

1. **Update `app/layout.tsx`:**
   - Add proper metadata configuration:
     ```ts
     export const metadata = {
       title: "Tres Raíces Carnicería",
       description: "Carnicería boutique – pedidos en línea por WhatsApp.",
       icons: {
         icon: [
           { url: "/favicon/favicon.ico", type: "image/x-icon" },
           { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
           { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
         ],
         apple: "/favicon/apple-touch-icon.png",
       },
       manifest: "/favicon/site.webmanifest",
     };
     ```
   - Ensure `<html lang="es">` is present in the layout component.

2. **Remove unused `/app/favicon/` folder:**
   - Delete any `favicon.ico` or icon files inside `/app/favicon/`.
   - Keep only the `/public/favicon` version as the canonical static directory.

3. **Confirm favicon accessibility:**
   - After build, visiting `/favicon/favicon.ico` or `/favicon/apple-touch-icon.png` should return a valid image.

4. **Optional — enhance SEO metadata:**
   - Add `<meta name="theme-color" content="#ffffff" />` and Open Graph defaults (title, description, image) in `metadata` or via `app/head.tsx` if it exists.

5. **Testing steps (automate in README if possible):**
   - Run `pnpm build && pnpm start`
   - Open `http://localhost:3000`
   - Verify favicon appears in browser tab.
   - Check `manifest.json` via Chrome → Application → Manifest tab.

---

## Acceptance Criteria
- All favicon routes resolve (`/favicon/favicon.ico`, `/favicon/favicon-32x32.png`, `/favicon/apple-touch-icon.png`).
- Browser tab and mobile Safari display the logo.
- No broken references or duplicate assets under `/app`.
- No dependency changes required.

**Implement all steps and commit changes.**