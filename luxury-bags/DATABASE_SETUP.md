# 数据库设置说明

## Prisma Schema 已完成 ✅

### 数据模型
- **Product（商品）**: 包含所有必需字段（id, name, description, price, originalPrice, images, category, tags, stock, isFeatured, soldCount）
- **Category（分类）**: 包含 id, name, slug, image
- **Order（订单）**: 包含 id, userId, totalAmount, status, paymentStatus, createdAt, updatedAt
- **OrderItem（订单项）**: 包含 id, orderId, productId, quantity, price
- **Payment（支付记录）**: 包含 id, orderId, method, amount, transactionId, status, paidAt
- **Cart（购物车）**: 包含 id, userId/sessionId, items

### 关键约束 ✅
- 所有金额字段使用 `Decimal` 类型，禁止使用 Float
- Order 和 Payment 建立了索引：`@@index([userId, status])`
- 商品库存变更需要使用事务（在应用层实现）

### SQLite 适配说明
由于使用 SQLite 进行本地开发，以下类型已调整：
- `Json` 类型 → `String` 类型（存储 JSON 字符串）
- `String[]` 数组类型 → `String` 类型（存储 JSON 字符串）
- `Enum` 枚举类型 → `String` 类型（存储字符串值）

## 数据库迁移命令

### 1. 初始化数据库 ✅（已完成）
```bash
cd luxury-bags
npx prisma migrate dev --name init
```

### 2. 生成 Prisma Client ✅（已完成）
```bash
npx prisma generate
```

### 3. 填充示例数据 ✅（已完成）
```bash
npm run db:seed
```

或者使用 Prisma 命令：
```bash
npx prisma db seed
```

## 示例数据

### 分类（3个）
1. **经典款** (classic)
2. **时尚款** (fashion)
3. **限量款** (limited)

### 商品（5个）
1. **小香风菱格链条包** - ¥1,299（原价 ¥1,599）
   - 标签：小香风、菱格、链条、经典
   - 库存：50，销量：128

2. **鳄鱼纹手提包** - ¥1,899（原价 ¥2,299）
   - 标签：鳄鱼纹、手提、大容量、时尚
   - 库存：30，销量：86

3. **法式复古单肩包** - ¥999（原价 ¥1,299）
   - 标签：法式、复古、单肩、职场
   - 库存：45，销量：156

4. **限量版珍珠装饰包** - ¥3,299（原价 ¥3,999）
   - 标签：限量版、珍珠、装饰、奢华
   - 库存：10，销量：23

5. **简约通勤斜挎包** - ¥799（原价 ¥999）
   - 标签：简约、通勤、斜挎、实用
   - 库存：80，销量：234

## 环境变量

已在 `.env` 文件中配置数据库连接：

```env
DATABASE_URL="file:./dev.db"
```

## 注意事项

1. **库存管理**：在应用层使用事务来防止超卖
2. **金额计算**：所有金额字段使用 Decimal 类型，避免浮点数精度问题
3. **索引优化**：userId + status 索引已建立，可提高查询性能
4. **SQLite 限制**：
   - 不支持原生 JSON 类型，使用 String 存储 JSON 字符串
   - 不支持枚举类型，使用 String 存储枚举值
   - 如需生产环境，建议切换到 PostgreSQL

## 数据库操作示例

### 查询所有商品
```typescript
const products = await prisma.product.findMany({
  include: { category: true }
})
```

### 查询推荐商品
```typescript
const featuredProducts = await prisma.product.findMany({
  where: { isFeatured: true },
  include: { category: true }
})
```

### 创建订单（使用事务）
```typescript
const order = await prisma.$transaction(async (tx) => {
  // 创建订单
  const newOrder = await tx.order.create({
    data: {
      userId,
      totalAmount,
      status: 'PENDING',
      paymentStatus: 'PENDING',
    }
  })
  
  // 创建订单项并更新库存
  for (const item of items) {
    await tx.orderItem.create({
      data: {
        orderId: newOrder.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price
      }
    })
    
    await tx.product.update({
      where: { id: item.productId },
      data: { stock: { decrement: item.quantity } }
    })
  }
  
  return newOrder
})
```

### 解析 JSON 字段
```typescript
// 解析商品图片
const product = await prisma.product.findUnique({
  where: { id: productId }
})

const images = JSON.parse(product.images)
const tags = JSON.parse(product.tags)
```

## 状态值说明

### OrderStatus（订单状态）
- `PENDING` - 待处理
- `PAID` - 已支付
- `SHIPPED` - 已发货
- `DELIVERED` - 已送达
- `CANCELLED` - 已取消

### PaymentStatus（支付状态）
- `PENDING` - 待支付
- `COMPLETED` - 已完成
- `FAILED` - 失败
- `REFUNDED` - 已退款

### PaymentMethod（支付方式）
- `STRIPE` - Stripe 支付
- `ALIPAY` - 支付宝
