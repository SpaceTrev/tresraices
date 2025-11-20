# Quick Reference: Add Facebook Domain Verification Meta Tag

## When Facebook Provides Your Verification Code

After you add your domain in Meta Business Suite, Facebook will give you a meta tag like this:

```html
<meta name="facebook-domain-verification" content="xxxxxxxxxxxxxxxxx" />
```

## Where to Add It

Add it to `/app/layout.tsx` in the metadata section:

```typescript
export const metadata: Metadata = {
  metadataBase: new URL("https://tresraices.netlify.app"),
  title: "Tres Raíces Carnicería — Cortes Premium en Guadalajara y Colima",
  description: "Carnicería boutique con cortes selectos y entrega a domicilio. Pedidos por WhatsApp.",
  
  // Add Facebook verification here:
  other: {
    'facebook-domain-verification': 'YOUR_VERIFICATION_CODE_HERE'
  },
  
  icons: {
    icon: [
      { url: "/favicon/favicon.ico", type: "image/x-icon" },
      // ... rest of icons
    ],
  },
  // ... rest of metadata
};
```

## After Adding the Meta Tag

1. Deploy your changes to Netlify:
   ```bash
   git add .
   git commit -m "Add Facebook domain verification"
   git push
   ```

2. Wait for Netlify deployment to complete

3. Go back to Meta Business Suite and click "Verify"

4. Facebook will crawl your site and verify the meta tag

---

**Note**: The verification code is unique to your business and will be provided by Facebook when you start the domain verification process.
