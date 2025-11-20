# Tres Raíces — MVP Website

Informational site with two auto-priced menus:
- Guadalajara (+20%)
- Colima (+30%)

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

## Phase 2: Firestore Persistence (Implemented)

The admin flow now persists parsed menus to Firestore:

1. Admin uploads PDF → Firebase Storage → calls `/api/parse-menu`
2. API parses PDF, computes base/gdl/col pricing, writes to:
   - `menus/latest` (current active menu)
   - `menus_history/{timestamp}` (historical record)
3. `/api/menu?region={guadalajara|colima}` reads from Firestore first, falls back to local JSON if unavailable

### Required Environment Variables

Add to Netlify/Vercel:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_ADMIN_KEY` | Auth key for admin API routes |
| `NEXT_PUBLIC_FIREBASE_*` | Firebase web config (apiKey, authDomain, etc.) |
| `FIREBASE_SERVICE_ACCOUNT_JSON` | Full Firebase service account JSON from Firebase Console → Project Settings → Service Accounts → Generate New Private Key |

**Security Note**: Never commit `FIREBASE_SERVICE_ACCOUNT_JSON` to git. Only set via hosting platform environment variables.

## Units & Pricing

Our pricing system supports **per-unit pricing** to distinguish between items sold by **kilo** (`kg`) and items sold by **pieza** (piece).

### How It Works

1. **Source of Truth**: Wholesale prices come from **LISTA 2** (our distributor's price list).
2. **Regional Markups**: 
   - Guadalajara: +20% markup on our base (wholesale) price
   - Colima: +30% markup on our base (wholesale) price
3. **Unit Configuration**: The file `data/overrides.units.json` defines which units are available for specific items:
   ```json
   {
     "Cerdo::Manteca": { "units": ["kg"] },
     "Res::Arrachera marinada": { "units": ["kg", "pieza"] }
   }
   ```
4. **Automatic Inference**: If an item is not in the overrides file, the parser uses heuristics:
   - Items with keywords like `pieza`, `entero`, `media`, or `½` are tagged as `["pieza"]`
   - All other items default to `["kg"]`

### Price Validation & Guardrails

The system includes safeguards to prevent absurd prices from being displayed:

- **Minimum**: 10 MXN (items below this are auto-hidden)
- **Maximum**: 2,000 MXN (items above this are auto-hidden)
- When a price is hidden, a note is added to the item's metadata (visible in build logs)
- These thresholds are configurable in `lib/menu/validate.ts`

### User Experience

- **Product Cards**: Display unit chips (e.g., `$189/kg`, `$49/pieza`) for each available unit
- **Unit Filtering**: Users can filter products by unit type (Kilo or Pieza) in the filter panel
- **Cart & WhatsApp**: Unit labels are included in cart summaries and WhatsApp order messages

### Updating Prices

When the distributor updates LISTA 2:

1. **Local Development**:
   ```bash
   pnpm parse:local ./input/LISTA2.pdf
   ```
   This regenerates `data/menu_{guadalajara|colima}_list2.json`

2. **Production (Admin Upload)**:
   - Upload PDF via `/admin` page
   - API route `/api/parse-menu` processes it and writes to Firestore
   - Both methods apply the same unit inference and validation logic

### Customization

To override unit availability for specific items, edit `data/overrides.units.json`:

```json
{
  "Category::Item Name": { "units": ["kg"] },
  "Category::Item Name 2": { "units": ["kg", "pieza"] }
}
```

Keys are case-sensitive and must match the exact category and item name from the PDF.

## Facebook Business Verification

To enable Facebook Business API, WhatsApp Business API, and Instagram API access, you need to verify your business with Meta.

**📖 Complete Guide**: See [`docs/FACEBOOK_VERIFICATION.md`](./docs/FACEBOOK_VERIFICATION.md)

**Quick Summary**:
1. Site is pre-configured with required Open Graph tags and structured data
2. Use [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) to verify your site
3. Add and verify your domain in [Meta Business Suite](https://business.facebook.com)
4. Complete business identity verification
5. Connect WhatsApp and Instagram APIs

**Optional**: Consider purchasing a custom domain (`tresraices.com` or `tresraices.mx`) instead of using `tresraices.netlify.app` for better trust and easier verification.
```