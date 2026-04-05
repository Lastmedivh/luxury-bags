'use client';

import { useEffect } from 'react';
import { useCartStore } from '@/store/cart-store';
import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function CartDrawer() {
  const {
    items,
    totalItems,
    totalPrice,
    isOpen,
    isLoading,
    error,
    closeCart,
    fetchCart,
    updateQuantity,
    removeItem,
  } = useCartStore();

  // 组件挂载时获取购物车数据
  useEffect(() => {
    if (isOpen && items.length === 0) {
      fetchCart();
    }
  }, [isOpen, items.length, fetchCart]);

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    try {
      await updateQuantity(itemId, newQuantity);
    } catch (error) {
      console.error('更新数量失败:', error);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      await removeItem(itemId);
    } catch (error) {
      console.error('删除商品失败:', error);
    }
  };

  return (
    <>
      {/* 遮罩层 */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 transition-opacity"
          onClick={closeCart}
        />
      )}

      {/* 抽屉 */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* 头部 */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <ShoppingBag className="w-6 h-6" />
              购物车
              {totalItems > 0 && (
                <span className="text-sm font-normal text-gray-500">
                  ({totalItems} 件商品)
                </span>
              )}
            </h2>
            <button
              onClick={closeCart}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* 内容区域 */}
          <div className="flex-1 overflow-y-auto p-6">
            {isLoading && items.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <p className="text-red-500 mb-4">{error}</p>
                <button
                  onClick={fetchCart}
                  className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  重试
                </button>
              </div>
            ) : items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
                <p className="text-gray-500 mb-4">购物车是空的</p>
                <Link
                  href="/products"
                  onClick={closeCart}
                  className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  去购物
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-4 bg-gray-50 rounded-lg"
                  >
                    {/* 商品图片 */}
                    <div className="relative w-24 h-24 flex-shrink-0">
                      <Image
                        src={item.productImage}
                        alt={item.productName}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>

                    {/* 商品信息 */}
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/product/${item.productId}`}
                        onClick={closeCart}
                        className="font-medium text-gray-900 hover:text-gray-700 line-clamp-2"
                      >
                        {item.productName}
                      </Link>
                      <p className="text-sm text-gray-500 mt-1">
                        ¥{item.productPrice.toFixed(2)}
                      </p>

                      {/* 数量控制 */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              handleQuantityChange(item.id, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                            className="w-8 h-8 flex items-center justify-center border rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleQuantityChange(item.id, item.quantity + 1)
                            }
                            className="w-8 h-8 flex items-center justify-center border rounded-md hover:bg-gray-100 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        {/* 删除按钮 */}
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                          title="删除商品"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 底部 */}
          {items.length > 0 && (
            <div className="border-t p-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">商品总数</span>
                <span className="font-medium">{totalItems} 件</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">总计</span>
                <span className="text-2xl font-bold text-gray-900">
                  ¥{totalPrice.toFixed(2)}
                </span>
              </div>
              <Link
                href="/checkout"
                onClick={closeCart}
                className="block w-full py-4 bg-gray-900 text-white text-center font-medium rounded-lg hover:bg-gray-800 transition-colors"
              >
                去结算
              </Link>
              <button
                onClick={closeCart}
                className="block w-full py-3 border border-gray-300 text-gray-700 text-center font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                继续购物
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
