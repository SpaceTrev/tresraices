# Product Images - UI Integration Guide

## Overview

All products now have an `image` field pointing to placeholder images in `/public/product-placeholders/`.

## Usage in React Components

### Basic Image Display

```tsx
import Image from 'next/image';

interface Product {
  id: string;
  name: string;
  category: string;
  image: string;
  // ... other fields
}

function ProductCard({ product }: { product: Product }) {
  return (
    <div className="product-card">
      <Image
        src={product.image}
        alt={product.name}
        width={300}
        height={300}
        className="product-image"
      />
      <h3>{product.name}</h3>
      <p>{product.category}</p>
    </div>
  );
}
```

### With Fallback

```tsx
function ProductImage({ product }: { product: Product }) {
  const [imgSrc, setImgSrc] = useState(product.image);
  
  const handleError = () => {
    // Fallback to generic image if specific one fails
    setImgSrc('/product-placeholders/res.png');
  };
  
  return (
    <Image
      src={imgSrc}
      alt={product.name}
      width={300}
      height={300}
      onError={handleError}
    />
  );
}
```

### Optimized with Next.js Image

```tsx
function OptimizedProductImage({ product }: { product: Product }) {
  return (
    <div className="relative aspect-square">
      <Image
        src={product.image}
        alt={`${product.name} - ${product.category}`}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover rounded-lg"
        priority={false}
      />
    </div>
  );
}
```

## Current File Structure

```
public/
  product-placeholders/
    avestruz.png         # Ostrich
    birria.png          # Birria specialty
    buffalo.png         # Buffalo
    cabrito.png         # Young goat
    cabrito2.png        # Whole goat (Canal)
    carnemolida.png     # Ground meat (all species)
    cerdo.png           # Pork
    chistorra.png       # Chistorra sausage
    chorizo.png         # Chorizo sausage
    ciervorojo.png      # Red deer
    conejo.png          # Rabbit
    cordero.png         # Lamb
    cordoniz.png        # Quail
    fajitas.png         # Fajitas
    hamburger.png       # All hamburgers
    jabali.png          # Wild boar
    lechon.png          # Suckling pig
    manteca.png         # Lard
    pato.png            # Duck
    pavo.png            # Turkey
    pollo.png           # Chicken
    queso.png           # Cheese
    res.png             # Beef
    ternura.png         # Veal
```

## Image Dimensions

All placeholder images should ideally be:
- **Format:** PNG with transparency
- **Dimensions:** Square (recommended 512x512 or 1024x1024)
- **Size:** Optimized for web (< 100KB per image)

## Styling Examples

### CSS Grid Layout

```css
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}

.product-card {
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.product-image {
  width: 100%;
  height: auto;
  aspect-ratio: 1;
  object-fit: cover;
}
```

### Tailwind Classes

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <div className="rounded-lg overflow-hidden shadow-md">
    <img 
      src={product.image} 
      alt={product.name}
      className="w-full aspect-square object-cover"
    />
    <div className="p-4">
      <h3 className="font-bold text-lg">{product.name}</h3>
      <p className="text-gray-600">{product.category}</p>
    </div>
  </div>
</div>
```

## Menu Integration Example

```tsx
// app/menu/[region]/page.tsx
import { getMenuByRegion } from '@/lib/menu/utils';
import ProductGrid from '@/components/menu/ProductGrid';

export default async function MenuPage({ 
  params 
}: { 
  params: { region: string } 
}) {
  const products = await getMenuByRegion(params.region);
  
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        Menú {params.region}
      </h1>
      <ProductGrid products={products} />
    </main>
  );
}
```

```tsx
// components/menu/ProductGrid.tsx
'use client';

import Image from 'next/image';
import type { MenuItem } from '@/lib/menu/types';

export default function ProductGrid({ 
  products 
}: { 
  products: MenuItem[] 
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <div 
          key={product.id} 
          className="card hover:shadow-lg transition-shadow"
        >
          <div className="relative aspect-square bg-gray-100">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 25vw"
            />
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-1">
              {product.name}
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              {product.category}
            </p>
            <p className="text-xl font-bold text-primary">
              ${product.price[params.region]}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
```

## Accessibility

Always include proper alt text:

```tsx
// Good ✅
<Image 
  src={product.image}
  alt={`${product.name} - ${product.category}`}
/>

// Bad ❌
<Image 
  src={product.image}
  alt="product"
/>
```

## Performance Optimization

### Lazy Loading

```tsx
<Image
  src={product.image}
  alt={product.name}
  loading="lazy"  // Lazy load images below the fold
  width={300}
  height={300}
/>
```

### Priority Loading (Above the Fold)

```tsx
<Image
  src={featuredProduct.image}
  alt={featuredProduct.name}
  priority  // Load immediately for hero images
  width={600}
  height={600}
/>
```

## Future Enhancements

1. **Real Product Photography**
   - Replace placeholders with actual product photos
   - Maintain same path structure: `/product-placeholders/{id}.png`
   - Use product ID or SKU for unique images

2. **Multiple Images Per Product**
   ```tsx
   interface Product {
     images: string[];  // Array of image paths
     primaryImage: string;  // Main display image
   }
   ```

3. **Image Optimization**
   - Convert to WebP format for better compression
   - Generate multiple sizes for responsive images
   - Use Next.js Image Optimization API

4. **CDN Integration**
   - Move images to CDN for faster loading
   - Update paths to CDN URLs
   - Implement image transformations at CDN level

## Troubleshooting

### Image Not Displaying

1. Check file exists: `public/product-placeholders/{filename}.png`
2. Verify path is correct: `/product-placeholders/{filename}.png` (no `public/`)
3. Check file permissions
4. Clear Next.js cache: `rm -rf .next`

### Image Quality Issues

1. Ensure source images are high resolution (512x512 minimum)
2. Use PNG format for images with transparency
3. Check Next.js image optimization settings in `next.config.mjs`

### Performance Issues

1. Implement lazy loading for images below the fold
2. Use appropriate `sizes` prop for responsive images
3. Consider using blur placeholders during loading
4. Optimize source images before deployment
