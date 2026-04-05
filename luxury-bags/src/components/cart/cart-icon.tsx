'use client';

import { useCartStore } from '@/store/cart-store';
import { ShoppingBag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function CartIcon() {
  const { totalItems, openCart } = useCartStore();

  return (
    <button
      onClick={openCart}
      className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
      aria-label="打开购物车"
    >
      <ShoppingBag className="w-6 h-6" />
      {totalItems > 0 && (
        <Badge
          variant="destructive"
          className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
        >
          {totalItems > 99 ? '99+' : totalItems}
        </Badge>
      )}
    </button>
  );
}
