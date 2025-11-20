# Custom Domain Setup Guide for Facebook Verification

## Problem
Facebook **does not accept** subdomain URLs like `tresraices.netlify.app` for business verification. You must use a **root domain** like `tresraices.com`.

## Solution: Purchase and Connect a Custom Domain

---

## Step 1: Purchase a Domain

### Recommended Domain Options
1. **`tresraices.com`** - International, professional (~$10-15/year)
2. **`tresraices.mx`** - Mexican TLD, builds trust with local customers (~$20-30/year)
3. **`tresraices.shop`** - E-commerce focused (~$3-5/year)

### Where to Buy
- **Namecheap** (easiest for beginners): https://www.namecheap.com
- **Cloudflare Registrar** (cheapest): https://www.cloudflare.com/products/registrar/
- **Google Domains/Squarespace** (user-friendly): https://domains.google.com
- **GoDaddy** (popular but more expensive): https://www.godaddy.com

### What to Buy
- Search for: `tresraices.com` or `tresraices.mx`
- **Duration**: 1 year minimum
- **Privacy Protection**: Yes (hides your personal info from WHOIS)
- **Auto-renewal**: Your choice

---

## Step 2: Connect Domain to Netlify

### A. In Netlify Dashboard

1. Log into https://app.netlify.com
2. Select your site: `tres-raices-site`
3. Go to: **Domain Management** → **Add custom domain**
4. Enter your purchased domain (e.g., `tresraices.com`)
5. Click **Verify** and **Add domain**

### B. Configure DNS

Netlify will give you two options:

#### Option A: Use Netlify DNS (Recommended - Easiest)
1. Netlify will provide nameservers (e.g., `dns1.p01.nsone.net`)
2. Log into your domain registrar
3. Find **DNS Settings** or **Nameservers**
4. Replace default nameservers with Netlify's nameservers
5. Save changes
6. **Wait**: DNS propagation can take 24-48 hours

#### Option B: Use External DNS (Keep your registrar's DNS)
1. In your registrar's DNS settings, add an **A record**:
   - **Type**: A
   - **Name**: `@` (or leave blank)
   - **Value**: `75.2.60.5` (Netlify's load balancer IP)
   - **TTL**: 3600 or Auto

2. Add a **CNAME record** for www subdomain:
   - **Type**: CNAME
   - **Name**: `www`
   - **Value**: `tres-raices-site.netlify.app`
   - **TTL**: 3600 or Auto

3. Save changes

### C. Enable HTTPS
1. Netlify automatically provisions SSL certificate
2. **Wait**: 1-2 hours for certificate to be issued
3. Verify HTTPS works: `https://tresraices.com`
4. In Netlify: **Domain Management** → **HTTPS** → Enable **Force HTTPS**

---

## Step 3: Update Your Code for New Domain

Once your custom domain is live, update these files:

### File 1: `/app/layout.tsx`

**Find this line:**
```typescript
metadataBase: new URL("https://tresraices.netlify.app"),
```

**Replace with:**
```typescript
metadataBase: new URL("https://tresraices.com"), // or .mx
```

**Also update in the same file:**
```typescript
url: "https://tresraices.com",
```

**And in the JSON-LD structured data:**
```typescript
"@id": "https://tresraices.com",
"url": "https://tresraices.com",
"image": "https://tresraices.com/logo.jpg",
"logo": "https://tresraices.com/logo.jpg",
```

### File 2: `/netlify.toml` (if it exists)

Add or update:
```toml
[[redirects]]
  from = "https://tresraices.netlify.app/*"
  to = "https://tresraices.com/:splat"
  status = 301
  force = true
```

This redirects old subdomain to new domain permanently.

### Deploy Changes
```bash
git add .
git commit -m "Update domain to tresraices.com"
git push
```

---

## Step 4: Re-Verify with Facebook

### A. Clear Facebook Cache
1. Go to: https://developers.facebook.com/tools/debug/
2. Enter your **new domain**: `https://tresraices.com`
3. Click **"Scrape Again"** multiple times
4. Verify all OG tags show correctly

### B. Add Domain in Meta Business Suite
1. Go to: https://business.facebook.com
2. **Business Settings** → **Brand Safety** → **Domains**
3. Click **"+ Add"**
4. Enter: `tresraices.com` (no https://, no www)
5. Click **"Add"**

### C. Verify Domain
Choose one verification method:

**Meta Tag (Easiest)**
1. Copy the meta tag Facebook provides
2. Add to `/app/layout.tsx`:
   ```typescript
   export const metadata: Metadata = {
     metadataBase: new URL("https://tresraices.com"),
     // ... other metadata
     other: {
       'facebook-domain-verification': 'YOUR_CODE_HERE'
     },
   };
   ```
3. Deploy and click **"Verify"** in Facebook

**DNS TXT Record**
1. Copy the TXT record Facebook provides
2. Add to your domain registrar's DNS:
   - **Type**: TXT
   - **Name**: `@`
   - **Value**: `facebook-domain-verification=xxxxxxxxx`
3. Wait for DNS propagation (up to 48 hours)
4. Click **"Verify"** in Facebook

---

## Step 5: Complete Business Verification

After domain is verified, complete business verification:
1. **Business Settings** → **Business Info** → **Start Verification**
2. Provide business documents (must match "Boutique Tres Raíces")
3. Wait for approval (1-3 business days)

---

## Timeline

| Task | Duration |
|------|----------|
| Purchase domain | 5-10 minutes |
| DNS propagation | 24-48 hours |
| SSL certificate | 1-2 hours |
| Update code & deploy | 10 minutes |
| Facebook domain verification | 5 minutes |
| Business verification approval | 1-3 business days |

**Total**: ~2-3 days

---

## Cost Summary

| Item | Cost |
|------|------|
| Domain (.com) | $10-15/year |
| Domain (.mx) | $20-30/year |
| Domain (.shop) | $3-5/year |
| Netlify hosting | **FREE** |
| SSL certificate | **FREE** (auto via Let's Encrypt) |

**Recommendation**: Start with `.com` for $10-15/year.

---

## Troubleshooting

### "Domain already registered"
- Try variations: `tresraices.mx`, `tresraicesmx.com`, `boutiquetresraices.com`

### "DNS not propagating"
- Use DNS checker: https://dnschecker.org
- Enter your domain and check if A record shows Netlify's IP

### "SSL certificate failed"
- Ensure DNS is fully propagated first
- Try: Netlify Dashboard → **Domain Management** → **HTTPS** → **Renew certificate**

### "Facebook still won't verify"
- Clear cache in Sharing Debugger
- Ensure domain loads at `https://yourdomain.com` (not http)
- Check that meta tag or DNS TXT record is correct

---

## Alternative: Free Subdomain Services (Not Recommended)

If you absolutely cannot purchase a domain, you could try free DNS services that provide root domains:
- **Freenom** (.tk, .ml, .ga domains) - **Not recommended**: Unreliable, poor reputation
- **InfinityFree** (free hosting with subdomain) - **Not recommended**: Limited control

**These are NOT recommended** because:
- Facebook may still reject them
- Poor SEO and trust
- Unreliable service
- Can be shut down anytime

---

## Next Steps

1. **Purchase domain** (recommended: `tresraices.com` or `tresraices.mx`)
2. **Connect to Netlify** (follow Step 2 above)
3. **Wait for DNS + SSL** (~24-48 hours)
4. **Update code** (replace all `tresraices.netlify.app` references)
5. **Deploy changes**
6. **Re-verify with Facebook** (follow Step 4 above)

---

**Questions?** Refer to:
- Netlify Custom Domains: https://docs.netlify.com/domains-https/custom-domains/
- Meta Business Help: https://www.facebook.com/business/help
