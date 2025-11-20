---
mode: agent
---
# Copilot Admin Firestore Prompt

## Goal
Finish admin functionality for **Tres Raíces** MVP.

## Context
- Next.js 15 App Router (TypeScript), Tailwind.
- Firebase client (Auth + Storage) already used in `/admin`.
- `/app/api/parse-menu/route.ts` currently parses a PDF and returns counts only.
- `/app/api/menu/route.ts` serves local JSON from `/data`.
- We want: upload PDF → parse → compute markups (+20% GDL, +30% Colima) → **save to Firestore** as `menus/latest` and a historical doc → `/api/menu` should read Firestore first, fallback to bundled JSON.
- Security: route requires header `x-admin-key` matching `NEXT_PUBLIC_ADMIN_KEY` (already set in Netlify).
- We will provide a service account via env var: `FIREBASE_SERVICE_ACCOUNT_JSON`.

## Deliverables

1. **Create `lib/firebaseAdmin.ts`**
   - Initializes `firebase-admin` from `FIREBASE_SERVICE_ACCOUNT_JSON`.

2. **Update `/app/api/parse-menu/route.ts`**
   - Authorize via `x-admin-key`.
   - Accept `{storageUrl}` (public/signed Firebase Storage URL).
   - Download PDF, parse text (reuse existing parser), compute grouped JSON objects:
     - `gdl` (prices with +20%)
     - `col` (prices with +30%)
     - `base` (unmarked base prices)
   - Write to Firestore:
     - `menus/latest` → `{ gdl, col, base, updatedAt: serverTimestamp() }`
     - `menus_history/{timestamp}` → same payload plus `sourceUrl`
   - Return `{ status: "ok", parsedCount, categoriesCount, wroteLatest: true }`

3. **Update `/app/api/menu/route.ts`**
   - Try Firestore first:
     - If Firestore available and `menus/latest` exists, return `gdl` or `col` based on `region` query.
     - Else fallback to local JSON files in `/data`.
   - Keep everything ESM and typed.
   - Add minimal error handling and clear 401/400/500 responses.

4. **Do not change the admin UI** — it already uploads to Storage and calls `/api/parse-menu`.

5. **Add a quick note to `README.md`** under “Phase 2” describing the new env var and Firestore behavior.

## Environment Variables

Already in Netlify or to be added:

| Variable | Description |
|-----------|--------------|
| `NEXT_PUBLIC_ADMIN_KEY` | Auth key used by admin routes |
| `NEXT_PUBLIC_FIREBASE_*` | Existing Firebase web config vars |
| `FIREBASE_SERVICE_ACCOUNT_JSON` | 🔸 New — paste full JSON from Firebase → Service accounts |

## Code Constraints
- Use `admin.firestore().collection('menus')` (Native mode).
- Avoid new dependencies beyond what’s already in `package.json`.
- Keep the existing regex-based parser logic.
- Must compile on Next.js 15.

---

## 🧩 Files to Add / Modify

### `lib/firebaseAdmin.ts`
```ts
import admin from "firebase-admin";

let app: admin.app.App | undefined;

export function getAdminApp() {
  if (app) return app;
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON not set");
  const creds = JSON.parse(raw);
  app = admin.initializeApp({
    credential: admin.credential.cert(creds),
  });
  return app;
}

export function getDb() {
  return getAdminApp().firestore();
}
```

### `app/api/parse-menu/route.ts`
(Replace with full implementation)

- Authorize via header.
- Fetch PDF from Firebase Storage.
- Parse text to extract items/prices.
- Compute `base`, `gdl`, `col` grouped JSON.
- Save both to Firestore (`menus/latest`, `menus_history/{timestamp}`).
- Return `{ status: "ok", parsedCount, categoriesCount, wroteLatest: true }`.

### `app/api/menu/route.ts`
(Modify to read from Firestore first, fallback to local JSON)

- Query Firestore for `menus/latest`.
- Return `gdl` or `col` dataset depending on query param.
- Fallback to `/data/menu_guadalajara_list2.json` or `/data/menu_colima_list2.json`.

---

## Example Usage Flow

1. Admin logs in at `/admin` (Firebase Auth Email/Password).  
2. Uploads distributor PDF → Firebase Storage.  
3. `/api/parse-menu` parses it → saves structured JSON to Firestore.  
4. `/api/menu` serves menus directly from Firestore to `/menu/[region]` pages.  
5. If Firestore is unavailable, pages use local JSON fallback.

---

### ✅ After Copilot Implements This
1. Add `FIREBASE_SERVICE_ACCOUNT_JSON` to Netlify env vars.  
2. Commit and push generated changes.  
3. Redeploy on Netlify.  
4. Test PDF upload → verify `menus/latest` and `menus_history` in Firestore.  
5. Hit `/api/menu?region=guadalajara` → should return data from Firestore.
