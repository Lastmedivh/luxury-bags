import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // 创建分类
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: '经典款',
        slug: 'classic',
        image: '/images/categories/classic.jpg',
      },
    }),
    prisma.category.create({
      data: {
        name: '时尚款',
        slug: 'fashion',
        image: '/images/categories/fashion.jpg',
      },
    }),
    prisma.category.create({
      data: {
        name: '限量款',
        slug: 'limited',
        image: '/images/categories/limited.jpg',
      },
    }),
  ])

  console.log('✅ 创建了 3 个分类')

  // 创建商品
  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: '小香风菱格链条包',
        description: '经典小香风设计，精致菱格纹路，搭配优雅链条，尽显高贵气质。采用优质PU皮材质，手感柔软，耐用性强。',
        price: 1299.00,
        originalPrice: 1599.00,
        images: JSON.stringify([
          '/images/products/bag1-1.jpg',
          '/images/products/bag1-2.jpg',
          '/images/products/bag1-3.jpg',
        ]),
        categoryId: categories[0].id,
        tags: JSON.stringify(['小香风', '菱格', '链条', '经典']),
        stock: 50,
        isFeatured: true,
        soldCount: 128,
      },
    }),
    prisma.product.create({
      data: {
        name: '鳄鱼纹手提包',
        description: '奢华鳄鱼纹设计，立体纹理清晰可见，彰显独特品味。大容量设计，满足日常出行需求，手提肩背两用。',
        price: 1899.00,
        originalPrice: 2299.00,
        images: JSON.stringify([
          '/images/products/bag2-1.jpg',
          '/images/products/bag2-2.jpg',
          '/images/products/bag2-3.jpg',
        ]),
        categoryId: categories[1].id,
        tags: JSON.stringify(['鳄鱼纹', '手提', '大容量', '时尚']),
        stock: 30,
        isFeatured: true,
        soldCount: 86,
      },
    }),
    prisma.product.create({
      data: {
        name: '法式复古单肩包',
        description: '法式浪漫风格，复古优雅设计，简约而不失格调。精选优质面料，做工精细，是职场女性的理想选择。',
        price: 999.00,
        originalPrice: 1299.00,
        images: JSON.stringify([
          '/images/products/bag3-1.jpg',
          '/images/products/bag3-2.jpg',
          '/images/products/bag3-3.jpg',
        ]),
        categoryId: categories[0].id,
        tags: JSON.stringify(['法式', '复古', '单肩', '职场']),
        stock: 45,
        isFeatured: false,
        soldCount: 156,
      },
    }),
    prisma.product.create({
      data: {
        name: '限量版珍珠装饰包',
        description: '限量发售，珍珠装饰点缀，奢华而不张扬。每一颗珍珠都经过精心挑选，手工缝制，独一无二的艺术品。',
        price: 3299.00,
        originalPrice: 3999.00,
        images: JSON.stringify([
          '/images/products/bag4-1.jpg',
          '/images/products/bag4-2.jpg',
          '/images/products/bag4-3.jpg',
        ]),
        categoryId: categories[2].id,
        tags: JSON.stringify(['限量版', '珍珠', '装饰', '奢华']),
        stock: 10,
        isFeatured: true,
        soldCount: 23,
      },
    }),
    prisma.product.create({
      data: {
        name: '简约通勤斜挎包',
        description: '简约设计，实用主义，专为都市女性打造。多层隔袋设计，分类收纳，让生活更有条理。',
        price: 799.00,
        originalPrice: 999.00,
        images: JSON.stringify([
          '/images/products/bag5-1.jpg',
          '/images/products/bag5-2.jpg',
          '/images/products/bag5-3.jpg',
        ]),
        categoryId: categories[1].id,
        tags: JSON.stringify(['简约', '通勤', '斜挎', '实用']),
        stock: 80,
        isFeatured: false,
        soldCount: 234,
      },
    }),
  ])

  console.log('✅ 创建了 5 个商品')
  console.log('✅ 数据库初始化完成！')
}

main()
  .catch((e) => {
    console.error('❌ 数据库初始化失败:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
