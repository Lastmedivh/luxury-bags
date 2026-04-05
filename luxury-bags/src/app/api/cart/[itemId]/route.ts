import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { UpdateCartItemRequest, CartItemResponse, ErrorResponse } from '@/types/cart';

// PUT /api/cart/[itemId] - 更新购物车商品数量
export async function PUT(
  request: NextRequest,
  { params }: { params: { itemId: string } }
) {
  try {
    const { itemId } = params;
    const body: UpdateCartItemRequest = await request.json();
    const { quantity } = body;

    // 验证请求
    if (!quantity || quantity < 1) {
      return NextResponse.json<ErrorResponse>(
        { success: false, error: '数量必须大于 0' },
        { status: 400 }
      );
    }

    // 使用事务确保数据一致性
    const result = await prisma.$transaction(async (tx) => {
      // 获取购物车项目
      const cartItem = await tx.cartItem.findUnique({
        where: { id: itemId },
        include: { product: true },
      });

      if (!cartItem) {
        throw new Error('购物车项目不存在');
      }

      // 检查库存
      if (quantity > cartItem.product.stock) {
        throw new Error(`库存不足，当前库存: ${cartItem.product.stock}`);
      }

      // 更新数量
      const updatedItem = await tx.cartItem.update({
        where: { id: itemId },
        data: { quantity },
        include: { product: true },
      });

      return updatedItem;
    });

    // 转换为 DTO
    const itemDTO = {
      id: result.id,
      productId: result.productId,
      productName: result.product.name,
      productPrice: Number(result.product.price),
      productImage: result.product.images.split(',')[0],
      quantity: result.quantity,
      addedAt: result.addedAt.toISOString(),
    };

    return NextResponse.json<CartItemResponse>({
      success: true,
      data: itemDTO,
    });
  } catch (error: any) {
    console.error('更新购物车项目失败:', error);
    return NextResponse.json<ErrorResponse>(
      {
        success: false,
        error: error.message || '更新购物车项目失败',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 400 }
    );
  }
}

// DELETE /api/cart/[itemId] - 删除购物车商品
export async function DELETE(
  request: NextRequest,
  { params }: { params: { itemId: string } }
) {
  try {
    const { itemId } = params;

    // 检查购物车项目是否存在
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: itemId },
    });

    if (!cartItem) {
      return NextResponse.json<ErrorResponse>(
        { success: false, error: '购物车项目不存在' },
        { status: 404 }
      );
    }

    // 删除购物车项目
    await prisma.cartItem.delete({
      where: { id: itemId },
    });

    return NextResponse.json<{ success: true }>({
      success: true,
    });
  } catch (error: any) {
    console.error('删除购物车项目失败:', error);
    return NextResponse.json<ErrorResponse>(
      {
        success: false,
        error: error.message || '删除购物车项目失败',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
