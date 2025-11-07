# Tres Raíces Site — AI Agent Instructions

## Project Overview
Next.js 15 (App Router) bilingual boutique meat shop with two region-specific menus (Guadalajara +15%, Colima +20%) derived from wholesale pricing PDFs. Uses Firebase Auth + Storage for optional admin uploads but defaults to static JSON in `/data`. Deployed on Netlify.

**Stack**: Next.js 15, TypeScript, Tailwind CSS 3.4+, Firebase (Auth + Storage + Firestore), `firebase-admin` for server-side operations.

## Development Philosophy
- Keep the project **fully static** except for API routes
- Everything in TypeScript and ESM
- Minimal dependencies—only add when absolutely necessary
- Favor clarity over cleverness
- Clean design consistent with Tailwind classes in `globals.css`
- Functional components with modern React hooks only
- `async`/`await` for all server-side I/O

## Architecture & Data Flow

**Static Menu Generation**: Wholesale PDF → `parse-pdf-local.mjs` → `/data/menu_{region}_list2.json` → Static pages via `app/menu/[region]/page.tsx`

- **Menu Display**: `page.tsx` reads JSON at build time (`force-static`), groups items by category (Avestruz, Búfalo, Cerdo, etc.)
- **API Fallback**: `/api/menu` returns region JSON; `/api/parse-menu` parses uploaded PDFs (requires `x-admin-key` header)
- **Admin Upload**: `/admin` page uses Firebase Auth + Storage to upload PDFs, then calls `/api/parse-menu` to regenerate menus (not yet persisted to Firestore)

## Code Organization
- **`/app`**: All routes and API endpoints (App Router structure)
- **`/lib`**: Shared helpers and utilities
- **`/data`**: Static JSON files and data stubs
- **`/scripts`**: Build-time tools (e.g., `parse-pdf-local.mjs`)
- **`/styles`**: Global CSS with Tailwind utilities

**Rule**: Don't mix admin server logic with UI logic.

## Key Conventions

### Pricing Regions
Only two valid regions: `guadalajara` (1.15× markup) | `colima` (1.20× markup). Hardcoded in `generateStaticParams()` and `prettyRegion` map.

### PDF Parsing Pattern
- Category detection: Regex matching `["Avestruz","Búfalo","Cabrito","Cerdo","Ciervo rojo","Codorniz","Conejo","Cordero","Jabalí","Pato","Pavo","Pollo","Queso","Res","Ternera"]`
- Price extraction: `\$\s*([0-9]{1,3}(?:[.,][0-9]{3})*[.,][0-9]{2}|[0-9]{1,4}(?:[.,][0-9]{2}))`
- Normalization: `toFloat()` handles comma/dot separators in Mexican currency format
- Output: `{ category, name, base_price }` → grouped by category with region-specific `price` field

### Styling
- **Tailwind**: Custom colors defined in `tailwind.config.ts` (darkPurple, federalBlue, cream, mintGreen, etc.)
- **Utility classes**: `.container`, `.card`, `.btn`, `.btn-primary` defined in `globals.css`
- WhatsApp CTA: `https://wa.me/523315126548` (hardcoded in multiple places)

## Firebase Configuration
- **Client**: Uses `NEXT_PUBLIC_FIREBASE_*` vars for Auth + Storage
- **Server**: Uses `FIREBASE_SERVICE_ACCOUNT_JSON` for `firebase-admin` SDK
- **Data model** (future): `menus/latest` doc + `menus_history/` collection
- **Security**: Only authenticated Firebase users can upload PDFs; all admin API routes verify `x-admin-key` header

**Critical**: Never expose service account JSON client-side. Admin page initializes Firebase lazily on mount (`useEffect`) to avoid SSR hydration issues.

## Development Workflow

```bash
# Dev server (port 5173)
pnpm dev

# Local PDF parsing (outputs to /data)
pnpm parse:local ./input/LISTA2.pdf

# Build for production
pnpm build
```

## Critical Files

- **`scripts/parse-pdf-local.mjs`**: Source of truth for parsing logic; mirrors `/api/parse-menu/route.ts`
- **`app/menu/[region]/page.tsx`**: Menu display; reads local JSON, must match `/data` filenames exactly
- **`data/*.json`**: Manual regeneration required via `pnpm parse:local` when wholesale prices update

## Deployment
- Netlify via `@netlify/plugin-nextjs` (see `netlify.toml`)
- No database required; menus ship as static JSON
- Environment vars: Firebase config (`NEXT_PUBLIC_FIREBASE_*`) + `NEXT_PUBLIC_ADMIN_KEY` for parser auth

## TODO References (from README)
- Persist parsed JSON to Firestore (`menus` collection)
- Track upload history (`menus_history`)
- Add "last updated" timestamp to UI
- Unit labeling (kilo/pieza) via override map

## Common Patterns

**Adding new regions**: Update `generateStaticParams()`, `prettyRegion` map, create new JSON in `/data`, adjust pricing multiplier in parser

**Modifying categories**: Update `cats` array in both `parse-pdf-local.mjs` and `/api/parse-menu/route.ts` (keep synchronized)

**Client-side Firebase**: Admin page lazily initializes Firebase on mount (`useEffect`) to avoid SSR hydration issues

## Copilot Guidance
When generating code or modifying files:
1. Respect the file structure and ESM imports
2. Match the project's tone: pragmatic, production-ready, minimal
3. Generate complete file contents when rewriting files, not partial diffs
4. Always return `Response` objects with explicit `content-type` in API routes
5. Document any new environment variables in README.md
6. Do not change linting or build config unless specifically asked
