import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testDatabase() {
  console.log('🔍 开始测试数据库...\n')

  try {
    // 测试 1: 查询所有分类
    console.log('📂 测试 1: 查询所有分类')
    const categories = await prisma.category.findMany()
    console.log(`✅ 找到 ${categories.length} 个分类:`)
    categories.forEach(cat => {
      console.log(`   - ${cat.name} (${cat.slug})`)
    })
    console.log()

    // 测试 2: 查询所有商品
    console.log('🛍️  测试 2: 查询所有商品')
    const products = await prisma.product.findMany({
      include: { category: true }
    })
    console.log(`✅ 找到 ${products.length} 个商品:`)
    products.forEach(prod => {
      const images = JSON.parse(prod.images)
      const tags = JSON.parse(prod.tags)
      console.log(`   - ${prod.name}`)
      console.log(`     价格: ¥${prod.price} (原价: ¥${prod.originalPrice || 'N/A'})`)
      console.log(`     分类: ${prod.category.name}`)
      console.log(`     标签: ${tags.join(', ')}`)
      console.log(`     库存: ${prod.stock}, 销量: ${prod.soldCount}`)
      console.log(`     图片数量: ${images.length}`)
      console.log(`     是否推荐: ${prod.isFeatured ? '是' : '否'}`)
      console.log()
    })

    // 测试 3: 查询推荐商品
    console.log('⭐ 测试 3: 查询推荐商品')
    const featuredProducts = await prisma.product.findMany({
      where: { isFeatured: true },
      include: { category: true }
    })
    console.log(`✅ 找到 ${featuredProducts.length} 个推荐商品:`)
    featuredProducts.forEach(prod => {
      console.log(`   - ${prod.name} (¥${prod.price})`)
    })
    console.log()

    // 测试 4: 按分类查询商品
    console.log('📊 测试 4: 按分类查询商品')
    const classicCategory = await prisma.category.findUnique({
      where: { slug: 'classic' },
      include: { products: true }
    })
    if (classicCategory) {
      console.log(`✅ ${classicCategory.name} 分类下的商品:`)
      classicCategory.products.forEach(prod => {
        console.log(`   - ${prod.name} (¥${prod.price})`)
      })
    }
    console.log()

    // 测试 5: 测试 Decimal 类型
    console.log('💰 测试 5: 测试 Decimal 类型')
    const expensiveProduct = await prisma.product.findFirst({
      where: {
        price: { gte: 3000 }
      }
    })
    if (expensiveProduct) {
      console.log(`✅ 找到高价商品: ${expensiveProduct.name}`)
      console.log(`   价格: ¥${expensiveProduct.price} (类型: ${typeof expensiveProduct.price})`)
    } else {
      console.log('ℹ️  没有找到价格超过 ¥3000 的商品')
    }
    console.log()

    // 测试 6: 统计数据
    console.log('📈 测试 6: 统计数据')
    const totalStock = await prisma.product.aggregate({
      _sum: { stock: true, soldCount: true }
    })
    console.log(`✅ 总库存: ${totalStock._sum.stock}`)
    console.log(`✅ 总销量: ${totalStock._sum.soldCount}`)
    console.log()

    console.log('🎉 所有测试通过！数据库工作正常！')

  } catch (error) {
    console.error('❌ 测试失败:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

testDatabase()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
