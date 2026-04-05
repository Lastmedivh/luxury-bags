import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const sort = searchParams.get('sort') || 'default'

    // 构建查询条件
    const where: any = {}
    
    if (category && category !== 'all') {
      where.category = {
        slug: category
      }
    }
    
    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) where.price.gte = parseFloat(minPrice)
      if (maxPrice) where.price.lte = parseFloat(maxPrice)
    }

    // 构建排序条件
    let orderBy: any = {}
    switch (sort) {
      case 'price-asc':
        orderBy = { price: 'asc' }
        break
      case 'price-desc':
        orderBy = { price: 'desc' }
        break
      case 'sales':
        orderBy = { soldCount: 'desc' }
        break
      case 'newest':
        orderBy = { createdAt: 'desc' }
        break
      default:
        orderBy = { isFeatured: 'desc' }
    }

    const products = await prisma.product.findMany({
      where,
      orderBy,
      include: {
        category: true
      }
    })

    // 转换数据格式
    const formattedProducts = products.map(product => ({
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
    }))

    return NextResponse.json({ products: formattedProducts })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

export async function POST() {
  return NextResponse.json({ message: 'Product created' }, { status: 201 })
}
