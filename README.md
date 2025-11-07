# Tres Raíces — MVP Website

Informational site with two auto-priced menus:
- Guadalajara (+15%)
- Colima (+20%)

## Stack
- Next.js 15 (App Router) + TypeScript + Tailwind
- Firebase (Auth + Storage). Firestore optional.
- Local JSON fallback (already included).

## Getting Started
```bash
pnpm i
cp .env.example .env
pnpm dev
```

Open http://localhost:5173

## Data
`/data` contains JSON generated from **LISTA 2** (wholesale) with markups applied.

- `menu_guadalajara_list2.json`
- `menu_colima_list2.json`

## Admin Upload (Optional)
1. Create a Firebase project; enable **Email/Password Auth** and **Storage**.
2. Fill `.env` with your Firebase Web config and set `NEXT_PUBLIC_ADMIN_KEY`.
3. Deploy (Vercel/Netlify). Visit `/admin` to login and upload a new distributor PDF.
4. After upload, the page calls `/api/parse-menu` which parses the PDF (requires that the Storage URL is signed/public). In this MVP the API returns counts; extend it to write the generated JSON to Firestore/Storage and update your menus.

> If you prefer automation, use the local script:
```bash
# Put distributor PDF at ./input/LISTA2.pdf
pnpm parse:local
```
This will print JSON to stdout; adapt to save into `/data` if needed.

## Theming
Palette:
- Dark Purple `#0D0221`
- Federal Blue `#0F084B`
- Light Blue `#A6CFD5`
- UCLA Blue `#467599`
- Mint Green `#C2E7D9`
- Cream (background) `#F2E9DF`

## Deploy
- Vercel or Netlify. No DB required; the menus ship as static JSON.
- When ready, you can store versions under Firebase Storage and read via `/api/menu` routed to Firestore/Storage.

## TODO (when you’re ready)
- Persist parsed JSON to Firestore (collection: `menus`, doc: `{latest}` with fields `gdl`, `col`).
- Track versions per upload in `menus_history`.
- Add "last updated" time to UI.
- Add unit labeling (kilo/pieza) via a small override map.
```