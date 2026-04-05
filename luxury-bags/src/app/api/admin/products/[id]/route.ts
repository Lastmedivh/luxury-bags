import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// PUT /api/admin/products/[id] - 更新商品
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const {
      name,
      description,
      price,
      originalPrice,
      images,
      categoryId,
      tags,
      stock,
      isFeatured,
    } = body

    // 验证必填字段
    if (!name || !description || !price || !categoryId || stock === undefined) {
      return NextResponse.json(
        { success: false, error: '缺少必填字段' },
        { status: 400 }
      )
    }

    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        name,
        description,
        price: parseFloat(price),
        originalPrice: originalPrice ? parseFloat(originalPrice) : null,
        images: images || '',
        categoryId,
        tags: tags || '',
        stock: parseInt(stock),
        isFeatured: isFeatured || false,
      },
      include: {
        category: true,
      },
    })

    return NextResponse.json({
      success: true,
      product,
    })
  } catch (error) {
    console.error('更新商品失败:', error)
    return NextResponse.json(
      { success: false, error: '更新商品失败' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/products/[id] - 删除商品
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.product.delete({
      where: { id: params.id },
    })

    return NextResponse.json({
      success: true,
    })
  } catch (error) {
    console.error('删除商品失败:', error)
    return NextResponse.json(
      { success: false, error: '删除商品失败' },
      { status: 500 }
    )
  }
}
