'use client';

import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import CartIcon from '@/components/cart/cart-icon';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-40 bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <ShoppingBag className="w-8 h-8 text-gray-900" />
            <span className="text-xl font-bold text-gray-900">Luxury Bags</span>
          </Link>

          {/* 导航链接 */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              首页
            </Link>
            <Link
              href="/products"
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              商品
            </Link>
            <Link
              href="/cart"
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              购物车
            </Link>
          </div>

          {/* 购物车图标 */}
          <div className="flex items-center gap-4">
            <CartIcon />
          </div>
        </div>
      </div>
    </nav>
  );
}
