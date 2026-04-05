import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        category: true
      }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // 获取同分类的其他商品
    const relatedProducts = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: product.id }
      },
      take: 4,
      include: {
        category: true
      }
    })

    // 转换数据格式
    const formattedProduct = {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      originalPrice: product.originalPrice?.toString(),
      images: JSON.parse(product.images),
      category: {
        id: product.category.id,
        name: product.category.name,
        slug: product.category.slug
      },
      tags: JSON.parse(product.tags),
      stock: product.stock,
      isFeatured: product.isFeatured,
      soldCount: product.soldCount
    }

    const formattedRelatedProducts = relatedProducts.map(p => ({
      id: p.id,
      name: p.name,
      description: p.description,
      price: p.price.toString(),
      originalPrice: p.originalPrice?.toString(),
      images: JSON.parse(p.images),
      category: {
        id: p.category.id,
        name: p.category.name,
        slug: p.category.slug
      },
      tags: JSON.parse(p.tags),
      stock: p.stock,
      isFeatured: p.isFeatured,
      soldCount: p.soldCount
    }))

    return NextResponse.json({
      product: formattedProduct,
      relatedProducts: formattedRelatedProducts
    })
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}
