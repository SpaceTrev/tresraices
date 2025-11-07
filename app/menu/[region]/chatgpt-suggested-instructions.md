# GitHub Copilot Project Instructions

## Project Overview
Tres Raíces is a Next.js 15 App Router project built with TypeScript and Tailwind.  
It’s a bilingual boutique meat shop website with two menu routes:
- `/menu/guadalajara` (prices + 15%)
- `/menu/colima` (prices + 20%)
and an `/admin` page to upload distributor PDF price lists.

The stack uses:
- Next.js 15 (App Router)
- Tailwind CSS 3.4+
- Firebase Auth + Storage (+ Firestore for Phase 2)
- Firestore via firebase-admin on the server
- Deployed on Netlify

## Development Goals
- Keep the project **fully static** except for API routes.
- Keep everything in TypeScript and ESM.
- Maintain a clean, minimal design consistent with Tailwind classes defined in `globals.css`.
- Never install extra dependencies unless absolutely necessary.
- Favor clarity over cleverness.

## Code Organization Rules
- Use `/app` for all routes and API endpoints.
- Shared helpers go in `/lib`.
- Keep data stubs and generated JSONs in `/data`.
- Don’t mix admin server logic with UI logic.

## Firebase
- Client uses NEXT_PUBLIC_FIREBASE_* vars.
- Server uses FIREBASE_SERVICE_ACCOUNT_JSON for admin SDK.
- All writes go to `menus/latest` and history docs in `menus_history/`.

## Security
- Admin API routes must verify header `x-admin-key` against `NEXT_PUBLIC_ADMIN_KEY`.
- Never expose service account JSON client-side.
- Only authenticated Firebase users can upload PDFs.

## Preferred Patterns
- Functional components.
- Modern React hooks only.
- `async`/`await` for all server-side IO.
- Always return `Response` objects with explicit `content-type`.
- JSON schemas are simple objects, no runtime validation libraries.

## Copilot Guidance
When generating code or modifying files:
1. Respect the file structure and ESM imports.
2. Match the project’s tone: pragmatic, production-ready, minimal.
3. Generate complete file contents when rewriting files, not partial diffs.
4. Document any new environment variables in README.md.
5. Do not change linting or build config unless specifically asked.