/**
 * CartWrapper — Client-side cart UI wrapper
 */

"use client";

import { useState } from "react";
import CartButton from "@/components/cart/CartButton";
import CartDrawer from "@/components/cart/CartDrawer";

interface CartWrapperProps {
  region: string;
}

export default function CartWrapper({ region }: CartWrapperProps) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  return (
    <>
      <CartButton onOpen={() => setIsCartOpen(true)} />
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        region={region}
      />
    </>
  );
}
