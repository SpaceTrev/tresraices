# Testing Guide — Firestore Admin Persistence

This guide covers how to test the newly implemented Firestore persistence functionality.

## Prerequisites

1. **Firebase Project Setup**
   - Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
   - Enable **Authentication** → Email/Password
   - Enable **Firestore Database** (Native mode)
   - Enable **Storage**
   - Create an admin user via Firebase Console → Authentication → Add user

2. **Service Account Setup**
   - Go to Firebase Console → Project Settings → Service Accounts
   - Click "Generate New Private Key"
   - Save the JSON file securely (do NOT commit to git)

3. **Environment Variables**
   ```bash
   cp .env.example .env
   ```
   
   Fill in your `.env`:
   - `NEXT_PUBLIC_FIREBASE_*` — from Firebase Console → Project Settings → General → Your apps
   - `NEXT_PUBLIC_ADMIN_KEY` — choose a secure random string
   - `FIREBASE_SERVICE_ACCOUNT_JSON` — paste the entire service account JSON as a single line

## Test Scenarios

### 1. Test Firestore Write (Parse & Persist)

**Setup:**
```bash
# Start dev server
pnpm dev
```

**Steps:**
1. Navigate to http://localhost:5173/admin
2. Login with your Firebase admin user credentials
3. Upload a test PDF (use `./input/LISTA2.pdf` if available)
4. Observe the upload progress and parse result message

**Expected Results:**
- Upload completes (100%)
- Message shows: `Parse resultado: ok`
- Check Firebase Console → Firestore Database:
  - Collection `menus` → Document `latest` should exist with:
    - `base` (object with categories)
    - `gdl` (object with categories + 15% markup)
    - `col` (object with categories + 20% markup)
    - `updatedAt` (timestamp)
    - `sourceUrl` (Firebase Storage URL)
  - Collection `menus_history` → Document `{timestamp}` with same structure

**Debug:**
```bash
# Check server logs for errors
# Terminal running `pnpm dev` will show console output
```

---

### 2. Test Firestore Read (Menu API)

**Direct API Test:**
```bash
# Test Guadalajara menu
curl http://localhost:5173/api/menu?region=guadalajara | jq '.' | head -50

# Test Colima menu
curl http://localhost:5173/api/menu?region=colima | jq '.' | head -50
```

**Expected Results:**
- Returns JSON with categories as keys
- Each category contains array of items with `item`, `base_price`, and `price` fields
- Prices should reflect correct markup:
  - Guadalajara: `price = base_price * 1.15`
  - Colima: `price = base_price * 1.20`

**Verify Data Source:**
Check server logs — if Firestore is working, you won't see:
```
Firestore unavailable, using local JSON fallback
```

---

### 3. Test Fallback to Local JSON

**Simulate Firestore Unavailable:**

Option A — Remove service account temporarily:
```bash
# Rename env var in .env
# FIREBASE_SERVICE_ACCOUNT_JSON → FIREBASE_SERVICE_ACCOUNT_JSON_DISABLED

# Restart dev server
pnpm dev
```

Option B — Firestore rules (production):
Set Firestore rules to deny all temporarily:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

**Test:**
```bash
curl http://localhost:5173/api/menu?region=guadalajara | jq '.' | head -20
```

**Expected Results:**
- Server logs show: `Firestore unavailable, using local JSON fallback`
- API still returns menu data from `/data/menu_guadalajara_list2.json`
- No 500 errors

---

### 4. Test Parse API Authorization

**Test without key:**
```bash
curl -X POST http://localhost:5173/api/parse-menu \
  -H "Content-Type: application/json" \
  -d '{"storageUrl":"https://example.com/test.pdf"}'
```

**Expected:** 401 Unauthorized
```json
{"error":"unauthorized"}
```

**Test with wrong key:**
```bash
curl -X POST http://localhost:5173/api/parse-menu \
  -H "Content-Type: application/json" \
  -H "x-admin-key: wrong-key" \
  -d '{"storageUrl":"https://example.com/test.pdf"}'
```

**Expected:** 401 Unauthorized

**Test with correct key:**
```bash
# Get your admin key from .env
curl -X POST http://localhost:5173/api/parse-menu \
  -H "Content-Type: application/json" \
  -H "x-admin-key: YOUR_ADMIN_KEY_HERE" \
  -d '{"storageUrl":"https://firebasestorage.googleapis.com/..."}'
```

**Expected:** 200 OK (if PDF URL is valid and accessible)

---

### 5. Test Menu Pages (End-to-End)

**Browser Test:**
1. Navigate to http://localhost:5173/menu/guadalajara
2. Navigate to http://localhost:5173/menu/colima

**Expected Results:**
- Pages load without errors
- Menu items display with correct prices
- Items grouped by category (Avestruz, Búfalo, Cerdo, etc.)

**Verify Data Source:**
- If Firestore is available → data comes from `menus/latest`
- If Firestore unavailable → data comes from local JSON

---

### 6. Test Error Handling

**Invalid Region:**
```bash
curl http://localhost:5173/api/menu?region=invalid
```
**Expected:** 400 Bad Request
```json
{"error":"region must be guadalajara|colima"}
```

**Missing storageUrl:**
```bash
curl -X POST http://localhost:5173/api/parse-menu \
  -H "Content-Type: application/json" \
  -H "x-admin-key: YOUR_ADMIN_KEY" \
  -d '{}'
```
**Expected:** 400 Bad Request
```json
{"error":"storageUrl required"}
```

**Invalid PDF URL:**
```bash
curl -X POST http://localhost:5173/api/parse-menu \
  -H "Content-Type: application/json" \
  -H "x-admin-key: YOUR_ADMIN_KEY" \
  -d '{"storageUrl":"https://example.com/notfound.pdf"}'
```
**Expected:** 400 Bad Request
```json
{"error":"failed to fetch pdf"}
```

---

## Production Testing (Netlify/Vercel)

### Deploy Steps

1. **Set Environment Variables** in hosting platform:
   - All `NEXT_PUBLIC_FIREBASE_*` vars
   - `NEXT_PUBLIC_ADMIN_KEY`
   - `FIREBASE_SERVICE_ACCOUNT_JSON` (paste full JSON, minified)

2. **Deploy:**
   ```bash
   git add .
   git commit -m "Add Firestore persistence"
   git push
   ```

3. **Verify Deployment:**
   ```bash
   # Check menu API
   curl https://your-site.netlify.app/api/menu?region=guadalajara | jq '.' | head -20
   
   # Visit admin page
   open https://your-site.netlify.app/admin
   ```

4. **Test Upload Flow:**
   - Login at `/admin`
   - Upload PDF
   - Check Firestore Console for new data
   - Verify menus update on `/menu/guadalajara` and `/menu/colima`

---

## Debugging Tips

### Check Firestore Connection
```typescript
// Add to any API route temporarily
console.log('Firebase Project ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
console.log('Service Account Set:', !!process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
```

### View Firestore Data
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Use Firestore emulator UI (optional)
firebase emulators:start --only firestore
```

### Check Build Logs
```bash
pnpm build
# Look for any compile errors in lib/firebaseAdmin.ts or API routes
```

### Monitor Production Logs
- **Netlify:** Functions → Edge Functions → Logs
- **Vercel:** Deployments → [your deployment] → Functions

---

## Expected Firestore Structure

```
menus (collection)
└── latest (document)
    ├── base: { "Avestruz": [...], "Búfalo": [...], ... }
    ├── gdl: { "Avestruz": [...], "Búfalo": [...], ... }
    ├── col: { "Avestruz": [...], "Búfalo": [...], ... }
    ├── updatedAt: Timestamp
    └── sourceUrl: "https://firebasestorage.googleapis.com/..."

menus_history (collection)
├── 1699380123456 (document - timestamp)
│   ├── base: { ... }
│   ├── gdl: { ... }
│   ├── col: { ... }
│   ├── updatedAt: Timestamp
│   └── sourceUrl: "..."
└── 1699380234567 (document)
    └── ...
```

Each item in category arrays:
```json
{
  "item": "Pierna Entera",
  "base_price": 150.00,
  "price": 172.50
}
```

---

## Common Issues

**Issue:** `FIREBASE_SERVICE_ACCOUNT_JSON not set`  
**Fix:** Ensure env var is set correctly and restart dev server

**Issue:** `Permission denied` in Firestore  
**Fix:** Check Firestore rules allow writes from server (service account has admin access by default)

**Issue:** `Cannot find module '../../lib/firebaseAdmin'`  
**Fix:** Already fixed — uses correct relative path `../../../lib/firebaseAdmin`

**Issue:** Admin page shows "Firestore unavailable" but PDF uploads  
**Fix:** Storage upload works independently; check server logs for Firestore connection issues

**Issue:** Menu shows old data after upload  
**Fix:** Hard refresh browser (Cmd+Shift+R) or clear Next.js cache: `rm -rf .next && pnpm dev`

---

## Success Criteria

✅ PDF uploads to Firebase Storage  
✅ Parse API extracts items and prices correctly  
✅ Firestore `menus/latest` updates with new data  
✅ Historical record saved to `menus_history/{timestamp}`  
✅ Menu API returns Firestore data when available  
✅ Menu API falls back to local JSON gracefully  
✅ Both `/menu/guadalajara` and `/menu/colima` pages work  
✅ Prices reflect correct markups (15% / 20%)  
✅ Unauthorized requests return 401  
✅ Invalid requests return appropriate error messages
