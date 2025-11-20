# Deployment Checklist - Facebook Verification Update

## Pre-Deployment Checks

- [x] All changes tested locally with `pnpm build`
- [x] No TypeScript errors
- [x] No build errors
- [x] Documentation created

## Deploy to Netlify

```bash
# 1. Stage all changes
git add .

# 2. Commit with descriptive message
git commit -m "Add Facebook Business verification support

- Enhanced Open Graph meta tags with explicit og:image
- Added JSON-LD LocalBusiness structured data
- Enhanced footer with clear business contact info
- Added Netlify _redirects for crawler support
- Created comprehensive verification documentation"

# 3. Push to main branch
git push origin main
```

## Post-Deployment Verification

### 1. Test Deployment
- [ ] Visit https://tresraices.netlify.app
- [ ] Verify site loads correctly
- [ ] Check footer displays business information
- [ ] Inspect page source to verify JSON-LD script tag is present

### 2. Facebook Sharing Debugger
- [ ] Go to https://developers.facebook.com/tools/debug/
- [ ] Enter `https://tresraices.netlify.app`
- [ ] Click "Debug" or "Scrape Again"
- [ ] **Expected**: Response Code 200
- [ ] **Expected**: All Open Graph properties populated
- [ ] **Expected**: `og:image` shows logo.jpg
- [ ] **Expected**: No critical errors (warnings OK)

### 3. Schema.org Validation (Optional)
- [ ] Go to https://validator.schema.org
- [ ] Enter `https://tresraices.netlify.app`
- [ ] **Expected**: LocalBusiness schema validates without errors

### 4. Meta Business Suite Setup
- [ ] Log in to https://business.facebook.com
- [ ] Navigate to Business Settings → Brand Safety → Domains
- [ ] Click "Add" and enter `tresraices.netlify.app`
- [ ] Choose verification method (Meta Tag recommended)
- [ ] Complete verification steps from `/docs/FACEBOOK_VERIFICATION.md`

## Troubleshooting

### If Facebook Sharing Debugger shows cached old data:
1. Click "Scrape Again" button multiple times
2. Wait 5 minutes and try again
3. Clear browser cache and retry

### If domain verification fails:
1. Verify meta tag was added correctly (see `/docs/FACEBOOK_META_TAG.md`)
2. Ensure deployment completed successfully on Netlify
3. Check Netlify deploy logs for errors
4. Try a different verification method (DNS or HTML file)

### If business information doesn't match:
1. Check footer text matches exactly: "Boutique Tres Raíces"
2. Verify phone number format: "+52 33 1512 6548"
3. Ensure locations are listed in footer

## Files Changed This Deployment

1. `app/layout.tsx` - Enhanced metadata
2. `components/home/Footer.tsx` - Added business info
3. `public/_redirects` - Added SPA routing rules
4. `docs/FACEBOOK_VERIFICATION.md` - Complete guide
5. `docs/FACEBOOK_META_TAG.md` - Quick reference
6. `docs/FACEBOOK_VERIFICATION_SUMMARY.md` - Summary
7. `README.md` - Added verification section

## Next Steps After Successful Verification

1. **WhatsApp Business API**
   - Set up in Meta Business Suite
   - Connect phone number: +52 33 1512 6548
   - Configure business profile

2. **Instagram Business**
   - Link Instagram account
   - Ensure account is set to Business Account
   - Connect to Facebook Business Page

3. **Facebook Ads** (if needed)
   - Complete business verification
   - Set up payment method
   - Create first campaign

4. **Custom Domain** (recommended)
   - Purchase `tresraices.com` or `tresraices.mx`
   - Connect to Netlify
   - Update all URLs in code
   - Re-verify domain in Meta Business Suite

---

**Deployment Date**: November 20, 2025
**Status**: Ready to deploy ✅
