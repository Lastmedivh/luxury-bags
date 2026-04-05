import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { CartDTO, CartItemDTO, AddToCartRequest, CartResponse, ErrorResponse } from '@/types/cart';
import { cookies } from 'next/headers';

// 获取或创建购物车
async function getOrCreateCart(userId?: string, sessionId?: string) {
  let cart;

  if (userId) {
    cart = await prisma.cart.findFirst({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  } else if (sessionId) {
    cart = await prisma.cart.findFirst({
      where: { sessionId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  if (!cart) {
    cart = await prisma.cart.create({
      data: {
        userId: userId || null,
        sessionId: sessionId || null,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  return cart;
}

// 转换为 DTO
function toCartDTO(cart: any): CartDTO {
  const items: CartItemDTO[] = cart.items.map((item: any) => ({
    id: item.id,
    productId: item.productId,
    productName: item.product.name,
    productPrice: Number(item.product.price),
    productImage: item.product.images.split(',')[0],
    quantity: item.quantity,
    addedAt: item.addedAt.toISOString(),
  }));

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.productPrice * item.quantity, 0);

  return {
    id: cart.id,
    userId: cart.userId,
    sessionId: cart.sessionId,
    items,
    totalItems,
    totalPrice,
    createdAt: cart.createdAt.toISOString(),
    updatedAt: cart.updatedAt.toISOString(),
  };
}

// GET /api/cart - 获取购物车
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('sessionId')?.value;
    const userId = request.headers.get('x-user-id'); // 假设从认证中间件获取

    if (!userId && !sessionId) {
      return NextResponse.json<ErrorResponse>(
        { success: false, error: '未找到用户会话' },
        { status: 401 }
      );
    }

    const cart = await getOrCreateCart(userId || undefined, sessionId);
    const cartDTO = toCartDTO(cart);

    return NextResponse.json<CartResponse>({
      success: true,
      data: cartDTO,
    });
  } catch (error) {
    console.error('获取购物车失败:', error);
    return NextResponse.json<ErrorResponse>(
      { success: false, error: '获取购物车失败' },
      { status: 500 }
    );
  }
}

// POST /api/cart - 添加商品到购物车
export async function POST(request: NextRequest) {
  try {
    const body: AddToCartRequest = await request.json();
    const { productId, quantity } = body;

    // 验证请求
    if (!productId || !quantity || quantity < 1) {
      return NextResponse.json<ErrorResponse>(
        { success: false, error: '无效的请求数据' },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    let sessionId = cookieStore.get('sessionId')?.value;
    const userId = request.headers.get('x-user-id');

    // 如果没有 sessionId，创建一个
    if (!sessionId && !userId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      cookieStore.set('sessionId', sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, // 30 天
      });
    }

    // 使用事务确保数据一致性
    const result = await prisma.$transaction(async (tx) => {
      // 检查商品是否存在且有足够库存
      const product = await tx.product.findUnique({
        where: { id: productId },
      });

      if (!product) {
        throw new Error('商品不存在');
      }

      if (product.stock < quantity) {
        throw new Error(`库存不足，当前库存: ${product.stock}`);
      }

      // 获取或创建购物车
      const cart = await getOrCreateCart(userId || undefined, sessionId);

      // 检查商品是否已在购物车中
      const existingItem = cart.items.find((item: any) => item.productId === productId);

      if (existingItem) {
        // 更新数量
        const newQuantity = existingItem.quantity + quantity;

        if (newQuantity > product.stock) {
          throw new Error(`库存不足，当前库存: ${product.stock}`);
        }

        const updatedItem = await tx.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: newQuantity },
          include: { product: true },
        });

        return { cart, item: updatedItem, isNew: false };
      } else {
        // 添加新商品
        const newItem = await tx.cartItem.create({
          data: {
            cartId: cart.id,
            productId,
            quantity,
          },
          include: { product: true },
        });

        return { cart, item: newItem, isNew: true };
      }
    });

    // 重新获取完整的购物车数据
    const updatedCart = await prisma.cart.findUnique({
      where: { id: result.cart.id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!updatedCart) {
      throw new Error('购物车更新失败');
    }

    const cartDTO = toCartDTO(updatedCart);

    return NextResponse.json<CartResponse>({
      success: true,
      data: cartDTO,
    });
  } catch (error: any) {
    console.error('添加到购物车失败:', error);
    return NextResponse.json<ErrorResponse>(
      {
        success: false,
        error: error.message || '添加到购物车失败',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 400 }
    );
  }
}
