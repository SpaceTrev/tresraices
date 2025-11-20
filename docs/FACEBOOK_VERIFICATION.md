# Facebook Business Verification Guide
## Tres Raíces Meta Business Suite Setup

### ⚠️ IMPORTANT: Custom Domain Required

**Facebook does NOT accept Netlify subdomains** like `tresraices.netlify.app` for business verification. You must use a **root domain** like `tresraices.com` or `tresraices.mx`.

**Before proceeding**, see [`CUSTOM_DOMAIN_SETUP.md`](./CUSTOM_DOMAIN_SETUP.md) for instructions on purchasing and connecting a custom domain.

### Overview
This guide helps you verify your Tres Raíces business with Meta (Facebook) to enable access to:
- Facebook Business API
- WhatsApp Business API
- Instagram API
- Meta Ads Manager

---

## Prerequisites Completed ✅

The following technical requirements have been implemented on your site:

1. **HTTPS Compliance**: Site is served over HTTPS via Netlify
2. **Open Graph Meta Tags**: Complete OG tags including explicit `og:image`, `og:url`, `og:site_name`
3. **Business Contact Information**: Legal business name, locations, and phone number visible in footer
4. **JSON-LD Structured Data**: Schema.org LocalBusiness markup for crawler verification
5. **Netlify Redirects**: `_redirects` file ensures Facebook crawler can access all pages

---

## Step-by-Step Verification Process

### 1. Test Your Site with Facebook Sharing Debugger

**Before submitting to Meta Business Suite**, verify your site is properly configured:

1. Go to: https://developers.facebook.com/tools/debug/
2. Enter your URL: `https://tresraices.netlify.app`
3. Click **"Debug"** or **"Scrape Again"**
4. **Expected Results**:
   - Response Code: `200`
   - All Open Graph properties should be populated
   - No critical errors (warnings are OK)

**What to check:**
```
og:url: https://tresraices.netlify.app
og:type: website
og:title: Tres Raíces Carnicería — Cortes Premium en Guadalajara y Colima
og:description: Carnicería boutique con cortes selectos y entrega a domicilio. Pedidos por WhatsApp.
og:image: https://tresraices.netlify.app/logo.jpg
og:site_name: Tres Raíces Carnicería
```

If there are errors, click **"Scrape Again"** to clear Facebook's cache.

---

### 2. Add and Verify Your Domain in Meta Business Suite

#### A. Access Domain Verification
1. Go to: https://business.facebook.com
2. Navigate to: **Business Settings** → **Brand Safety** → **Domains**
3. Click **"Add"** button

#### B. Enter Your Domain
- **Domain to add**: `tresraices.netlify.app`
- Do NOT include `https://` or `www.`

#### C. Choose Verification Method

**Option 1: Meta Tag Verification (Recommended - Easiest)**
1. Select **"Meta tag verification"**
2. Copy the meta tag provided by Facebook (looks like):
   ```html
   <meta name="facebook-domain-verification" content="xxxxxxxxxxxxxxxxx" />
   ```
3. Add this tag to `/Users/trevspace/Space/tres-raices-site/app/layout.tsx` in the metadata section
4. Deploy your changes to Netlify
5. Return to Meta Business Suite and click **"Verify"**

**Option 2: DNS Verification**
1. Select **"DNS verification"**
2. Copy the TXT record provided by Facebook
3. Log into your domain registrar (where you manage `netlify.app` DNS)
4. Add the TXT record to your DNS settings
5. Wait for DNS propagation (can take up to 72 hours)
6. Return to Meta Business Suite and click **"Verify"**

**Option 3: HTML File Upload**
1. Select **"HTML file upload"**
2. Download the HTML file provided by Facebook
3. Upload it to `/Users/trevspace/Space/tres-raices-site/public/` directory
4. Deploy your changes to Netlify
5. Verify the file is accessible at `https://tresraices.netlify.app/[filename].html`
6. Return to Meta Business Suite and click **"Verify"**

---

### 3. Verify Your Business Identity

After domain verification, you'll need to verify your business:

1. Go to: **Business Settings** → **Business Info** → **Business Verification**
2. Click **"Start Verification"**
3. Provide the following information:

**Business Details** (must match what's on your website):
- **Legal Business Name**: `Boutique Tres Raíces`
- **Business Type**: Retail / Food & Beverage
- **Business Address**: Your registered business address in Guadalajara or Colima
- **Business Phone**: `+52 33 1512 6548`
- **Business Website**: `https://tresraices.netlify.app`

**Required Documents** (upload one):
- Business license or registration certificate
- Utility bill with business name and address
- Tax filing documents
- Business bank statement

**Important**: The business name and address on your documents MUST match the information displayed on your website footer.

---

### 4. Set Up WhatsApp Business API

Once domain and business are verified:

1. Go to: **Business Settings** → **Accounts** → **WhatsApp Accounts**
2. Click **"Add"** → **"Create a new WhatsApp Business Account"**
3. Enter your business details
4. Add phone number: `+52 33 1512 6548`
5. Verify phone number via SMS or voice call
6. Complete business profile setup

---

### 5. Set Up Instagram Business Account

1. Go to: **Business Settings** → **Accounts** → **Instagram Accounts**
2. Click **"Add"** → Connect your existing Instagram account
3. Ensure Instagram account is set to **Business Account** (not Personal)
4. Link Instagram to your Facebook Business Page

---

## Troubleshooting Common Issues

### Issue: "Website URL is invalid"
**Solution**: 
- Ensure you're entering just the domain: `tresraices.netlify.app`
- Clear Facebook's cache using the Sharing Debugger
- Verify the site loads in an incognito window

### Issue: "Business information doesn't match"
**Solution**:
- Check that your footer displays: `Boutique Tres Raíces`
- Verify phone number is formatted: `+52 33 1512 6548`
- Ensure locations are listed: `Guadalajara, Jalisco, México` and `Colima, Colima, México`

### Issue: "Facebook crawler blocked"
**Solution**:
- The `public/_redirects` file should already handle this
- Check Netlify deployment logs for any 403/404 errors from Facebook's crawler

### Issue: "Domain verification failing"
**Solution**:
- If using meta tag: Verify the tag was added correctly and deployed
- If using DNS: Wait up to 72 hours for propagation
- If using HTML file: Ensure file is in `/public/` and accessible

### Issue: ".netlify.app subdomain not accepted"
**Solution**:
- Consider purchasing a custom domain (e.g., `tresraices.com` or `tresraices.mx`)
- Connect custom domain to your Netlify site
- Re-verify with the custom domain in Meta Business Suite

---

## Custom Domain Setup (Optional but Recommended)

To avoid subdomain limitations and increase trust:

### 1. Purchase a Custom Domain
- Recommended: `tresraices.com` or `tresraices.mx`
- Registrars: Namecheap, GoDaddy, Google Domains, or Cloudflare

### 2. Connect to Netlify
1. In Netlify dashboard: **Domain Settings** → **Add custom domain**
2. Enter your purchased domain
3. Follow DNS configuration instructions
4. Wait for DNS propagation and SSL certificate provisioning

### 3. Update Meta Business Suite
1. Remove old domain: `tresraices.netlify.app`
2. Add new domain: `tresraices.com` (or your chosen domain)
3. Re-verify using one of the three methods above

### 4. Update Code References
Replace all instances of `https://tresraices.netlify.app` with your new domain:
- `/app/layout.tsx` (metadata.metadataBase)
- Any other hardcoded references

---

## Post-Verification Checklist

After successful verification:

- [ ] Test Facebook Sharing Debugger shows all correct OG tags
- [ ] Domain is verified and shows green checkmark in Meta Business Suite
- [ ] Business verification is approved
- [ ] WhatsApp Business API is connected
- [ ] Instagram Business account is linked
- [ ] Test sending a WhatsApp message to `+52 33 1512 6548`
- [ ] Test posting on Facebook Page and verify link preview works
- [ ] Test Instagram link in bio

---

## Support Resources

- **Facebook Sharing Debugger**: https://developers.facebook.com/tools/debug/
- **Meta Business Suite**: https://business.facebook.com
- **Meta Business Help Center**: https://www.facebook.com/business/help
- **WhatsApp Business API Docs**: https://developers.facebook.com/docs/whatsapp
- **Netlify Support**: https://docs.netlify.com

---

## Technical Implementation Summary

### Files Modified
1. `/app/layout.tsx` - Added comprehensive Open Graph tags and JSON-LD structured data
2. `/components/home/Footer.tsx` - Enhanced business contact information
3. `/public/_redirects` - Ensures Facebook crawler access

### Business Information on Site
- **Legal Name**: Boutique Tres Raíces
- **Phone**: +52 33 1512 6548
- **Service Areas**: Guadalajara, Jalisco & Colima, Colima
- **Business Type**: Carnicería Boutique / LocalBusiness

### Meta Tags Implemented
- Open Graph (og:*) tags with explicit image, url, siteName
- Twitter Card tags for social sharing
- JSON-LD LocalBusiness schema with contact information

---

**Last Updated**: November 20, 2025
**Deployment**: Netlify (https://tresraices.netlify.app)
