import { create } from 'zustand';
import { CartItemDTO, CartDTO, AddToCartRequest } from '@/types/cart';

interface CartStore {
  items: CartItemDTO[];
  totalItems: number;
  totalPrice: number;
  isLoading: boolean;
  error: string | null;
  isOpen: boolean;

  // Actions
  fetchCart: () => Promise<void>;
  addItem: (productId: string, quantity: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  setError: (error: string | null) => void;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  totalItems: 0,
  totalPrice: 0,
  isLoading: false,
  error: null,
  isOpen: false,

  fetchCart: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/cart');
      const data = await response.json();

      if (data.success && data.data) {
        const cart: CartDTO = data.data;
        set({
          items: cart.items,
          totalItems: cart.totalItems,
          totalPrice: cart.totalPrice,
          isLoading: false,
        });
      } else {
        throw new Error(data.error || '获取购物车失败');
      }
    } catch (error: any) {
      set({
        error: error.message || '获取购物车失败',
        isLoading: false,
      });
    }
  },

  addItem: async (productId: string, quantity: number) => {
    set({ isLoading: true, error: null });
    try {
      const request: AddToCartRequest = { productId, quantity };
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      const data = await response.json();

      if (data.success && data.data) {
        const cart: CartDTO = data.data;
        set({
          items: cart.items,
          totalItems: cart.totalItems,
          totalPrice: cart.totalPrice,
          isLoading: false,
          isOpen: true, // 打开购物车抽屉
        });
      } else {
        throw new Error(data.error || '添加到购物车失败');
      }
    } catch (error: any) {
      set({
        error: error.message || '添加到购物车失败',
        isLoading: false,
      });
      throw error; // 重新抛出错误以便在组件中处理
    }
  },

  updateQuantity: async (itemId: string, quantity: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/cart/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity }),
      });

      const data = await response.json();

      if (data.success && data.data) {
        // 更新本地状态
        const updatedItem = data.data as CartItemDTO;
        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId ? updatedItem : item
          ),
          totalItems: state.items.reduce((sum, item) =>
            item.id === itemId ? sum + quantity : sum + item.quantity, 0
          ),
          totalPrice: state.items.reduce((sum, item) =>
            item.id === itemId ? sum + updatedItem.productPrice * quantity : sum + item.productPrice * item.quantity, 0
          ),
          isLoading: false,
        }));
      } else {
        throw new Error(data.error || '更新数量失败');
      }
    } catch (error: any) {
      set({
        error: error.message || '更新数量失败',
        isLoading: false,
      });
      throw error;
    }
  },

  removeItem: async (itemId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/cart/${itemId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        // 更新本地状态
        set((state) => {
          const removedItem = state.items.find((item) => item.id === itemId);
          const newItems = state.items.filter((item) => item.id !== itemId);
          return {
            items: newItems,
            totalItems: newItems.reduce((sum, item) => sum + item.quantity, 0),
            totalPrice: newItems.reduce((sum, item) => sum + item.productPrice * item.quantity, 0),
            isLoading: false,
          };
        });
      } else {
        throw new Error(data.error || '删除商品失败');
      }
    } catch (error: any) {
      set({
        error: error.message || '删除商品失败',
        isLoading: false,
      });
      throw error;
    }
  },

  clearCart: () => {
    set({
      items: [],
      totalItems: 0,
      totalPrice: 0,
      error: null,
    });
  },

  toggleCart: () => {
    set((state) => ({ isOpen: !state.isOpen }));
  },

  openCart: () => {
    set({ isOpen: true });
  },

  closeCart: () => {
    set({ isOpen: false });
  },

  setError: (error: string | null) => {
    set({ error });
  },
}));
