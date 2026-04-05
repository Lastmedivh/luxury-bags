// 购物车相关类型定义

export interface CartItemDTO {
  id: string;
  productId: string;
  productName: string;
  productPrice: number;
  productImage: string;
  quantity: number;
  addedAt: string;
}

export interface CartDTO {
  id: string;
  userId: string | null;
  sessionId: string | null;
  items: CartItemDTO[];
  totalItems: number;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
}

export interface AddToCartRequest {
  productId: string;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

export interface CartResponse {
  success: boolean;
  data?: CartDTO;
  error?: string;
}

export interface CartItemResponse {
  success: boolean;
  data?: CartItemDTO;
  error?: string;
}

export interface ErrorResponse {
  success: false;
  error: string;
  details?: string;
}
