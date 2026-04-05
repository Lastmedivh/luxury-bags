import { create } from 'zustand';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  stock: number;
  category: string;
}

interface ProductStore {
  products: Product[];
  loading: boolean;
  fetchProducts: () => Promise<void>;
  getProductById: (id: string) => Product | undefined;
}

export const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  loading: false,
  fetchProducts: async () => {
    set({ loading: true });
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      set({ products: data.products, loading: false });
    } catch (error) {
      console.error('Failed to fetch products:', error);
      set({ loading: false });
    }
  },
  getProductById: (id) => {
    return get().products.find((product) => product.id === id);
  },
}));
