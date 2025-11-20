# Action Plan: Get Facebook Business Verification

## The Core Issue
❌ Facebook **rejects** `tresraices.netlify.app` because it's a subdomain, not a root domain
✅ Facebook **requires** a root domain like `tresraices.com` or `tresraices.mx`

---

## Quick Action Checklist

### Step 1: Purchase Custom Domain (15 minutes)
- [ ] Go to domain registrar (recommended: [Namecheap](https://www.namecheap.com))
- [ ] Search for: `tresraices.com` or `tresraices.mx`
- [ ] Purchase for 1 year (~$10-15 USD for .com, ~$20-30 for .mx)
- [ ] Enable privacy protection
- [ ] Complete checkout

**Recommended domains in order:**
1. `tresraices.com` ($10-15/year) - Best for international reach
2. `tresraices.mx` ($20-30/year) - Best for Mexican market trust
3. `tresraices.shop` ($3-5/year) - Budget option

---

### Step 2: Connect Domain to Netlify (30 minutes + wait time)
- [ ] Log into [Netlify Dashboard](https://app.netlify.com)
- [ ] Select site: `tres-raices-site`
- [ ] Click **Domain Management** → **Add custom domain**
- [ ] Enter your new domain (e.g., `tresraices.com`)
- [ ] Follow Netlify's DNS instructions
- [ ] **Wait 24-48 hours** for DNS propagation
- [ ] Verify HTTPS certificate is active

📖 **Detailed guide**: `docs/CUSTOM_DOMAIN_SETUP.md`

---

### Step 3: Update Code with New Domain (5 minutes)
```bash
# Option A: Use automated script
./scripts/update-domain.sh tresraices.com

# Option B: Manual update
# Edit app/layout.tsx and replace all instances of:
# "https://tresraices.netlify.app" → "https://tresraices.com"
```

- [ ] Run update script or manually edit files
- [ ] Review changes: `git diff`
- [ ] Commit: `git add . && git commit -m "Update to custom domain"`
- [ ] Deploy: `git push`
- [ ] Verify site loads at `https://tresraices.com`

---

### Step 4: Verify with Facebook (10 minutes)
- [ ] Go to [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [ ] Enter: `https://tresraices.com` (your new domain)
- [ ] Click **"Scrape Again"**
- [ ] Verify all OG tags show correctly

- [ ] Go to [Meta Business Suite](https://business.facebook.com)
- [ ] Navigate: **Business Settings** → **Brand Safety** → **Domains**
- [ ] Click **"+ Add"**
- [ ] Enter: `tresraices.com` (no https://, no www)
- [ ] This time it should work! ✅

---

### Step 5: Complete Domain Verification (5-10 minutes)
Choose **Meta Tag** method (easiest):

- [ ] Facebook provides a meta tag: `<meta name="facebook-domain-verification" content="xxx" />`
- [ ] Add to `app/layout.tsx`:
  ```typescript
  export const metadata: Metadata = {
    // ... existing metadata
    other: {
      'facebook-domain-verification': 'YOUR_CODE_HERE'
    },
  };
  ```
- [ ] Commit and deploy
- [ ] Return to Facebook and click **"Verify"**
- [ ] ✅ Domain verified!

📖 **Quick reference**: `docs/FACEBOOK_META_TAG.md`

---

### Step 6: Complete Business Verification (1-3 business days)
- [ ] In Meta Business Suite: **Business Info** → **Start Verification**
- [ ] Enter business details (must match website):
  - Legal Name: `Boutique Tres Raíces`
  - Phone: `+52 33 1512 6548`
  - Address: Your registered business address
  - Website: `https://tresraices.com`
- [ ] Upload business documents (license, tax filing, utility bill, etc.)
- [ ] Submit for review
- [ ] Wait 1-3 business days for approval

---

### Step 7: Connect APIs
Once verified:

- [ ] **WhatsApp Business API**
  - Business Settings → WhatsApp Accounts → Add
  - Connect: +52 33 1512 6548
  
- [ ] **Instagram Business**
  - Business Settings → Instagram Accounts → Add
  - Link existing Instagram account
  
- [ ] **Facebook Business API**
  - Automatically available after verification

---

## Timeline

| Task | Time |
|------|------|
| Purchase domain | 15 min |
| Connect to Netlify | 30 min |
| **DNS propagation** | **24-48 hours** ⏰ |
| SSL certificate | 1-2 hours (automatic) |
| Update code & deploy | 5 min |
| Facebook domain verification | 10 min |
| **Business verification** | **1-3 business days** ⏰ |

**Total active time**: ~1 hour
**Total wait time**: 2-4 days

---

## Costs

| Item | Annual Cost |
|------|------------|
| Domain (.com) | $10-15 USD |
| Domain (.mx) | $20-30 USD |
| Domain (.shop) | $3-5 USD |
| **Everything else** | **$0** (FREE) |

---

## Key Documents

1. **`docs/CUSTOM_DOMAIN_SETUP.md`** - Step-by-step domain purchase & setup
2. **`docs/FACEBOOK_VERIFICATION.md`** - Complete Facebook verification guide
3. **`docs/FACEBOOK_META_TAG.md`** - Quick reference for verification tag
4. **`scripts/update-domain.sh`** - Automated domain replacement script

---

## FAQs

**Q: Can I skip buying a domain?**
A: No. Facebook requires a root domain. Netlify subdomains are not accepted.

**Q: Which domain should I buy?**
A: Start with `tresraices.com` ($10-15/year). It's affordable and professional.

**Q: How long until my domain works?**
A: DNS takes 24-48 hours to propagate globally. Be patient.

**Q: What if my domain is already taken?**
A: Try variations: `tresraices.mx`, `boutiquetresraices.com`, `tresraicesmx.com`

**Q: Can I change domains later?**
A: Yes, but you'll need to re-verify with Facebook using the new domain.

---

## Support

- **Namecheap Support**: https://www.namecheap.com/support/
- **Netlify Docs**: https://docs.netlify.com/domains-https/custom-domains/
- **Meta Business Help**: https://www.facebook.com/business/help

---

**Status**: ⏳ Waiting for custom domain purchase
**Next Action**: Purchase `tresraices.com` or `tresraices.mx`
