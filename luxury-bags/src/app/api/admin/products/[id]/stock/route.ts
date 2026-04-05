import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// PUT /api/admin/products/[id]/stock - 更新库存
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { stock } = body

    if (stock === undefined || stock < 0) {
      return NextResponse.json(
        { success: false, error: '库存不能为负数' },
        { status: 400 }
      )
    }

    const product = await prisma.product.update({
      where: { id: params.id },
      data: { stock: parseInt(stock) },
    })

    return NextResponse.json({
      success: true,
      product,
    })
  } catch (error) {
    console.error('更新库存失败:', error)
    return NextResponse.json(
      { success: false, error: '更新库存失败' },
      { status: 500 }
    )
  }
}
