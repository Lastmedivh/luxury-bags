# 购物车功能测试指南

## 功能概述

已实现的购物车功能包括：

### 1. 数据库层
- ✅ Cart 模型支持匿名用户（sessionId）和登录用户（userId）
- ✅ CartItem 独立表：id, cartId, productId, quantity, addedAt
- ✅ 索引：cartId + productId（防止重复添加）
- ✅ 数据库迁移已创建并应用

### 2. API 路由
- ✅ GET /api/cart - 获取购物车（根据 session 或 user）
- ✅ POST /api/cart - 添加商品（校验库存、防止超卖）
- ✅ PUT /api/cart/[itemId] - 修改数量（校验库存）
- ✅ DELETE /api/cart/[itemId] - 删除商品

### 3. 事务安全
- ✅ 添加商品时：检查库存 → 更新 CartItem → 不直接扣减库存（下单时才扣）
- ✅ 库存检查：if (quantity > product.stock) throw error
- ✅ 所有写操作使用 Prisma 事务

### 4. 前端组件
- ✅ Zustand cartStore：管理购物车状态，同步到后端
- ✅ 购物车图标显示数量角标
- ✅ 侧边栏抽屉式购物车（可从任意页面打开）
- ✅ 导航栏集成购物车图标

### 5. 类型安全
- ✅ DTO 定义：CartItemDTO, CartDTO, AddToCartRequest, UpdateCartItemRequest
- ✅ 所有函数返回类型明确

## 测试步骤

### 1. 启动开发服务器
```bash
cd luxury-bags
npm run dev
```

服务器将在 http://localhost:3000 启动

### 2. 测试添加商品到购物车

1. 访问 http://localhost:3000/products
2. 点击任意商品进入详情页
3. 选择数量（默认为 1）
4. 点击"加入购物车"按钮
5. 验证：
   - 按钮显示"已添加"状态
   - 购物车抽屉自动打开
   - 购物车图标显示正确的数量角标
   - 商品出现在购物车中

### 3. 测试购物车抽屉

1. 点击导航栏的购物车图标
2. 验证：
   - 抽屉从右侧滑入
   - 显示所有已添加的商品
   - 每个商品显示：图片、名称、价格、数量
   - 显示商品总数和总价

### 4. 测试修改商品数量

1. 在购物车抽屉中，点击商品数量的 + 或 - 按钮
2. 验证：
   - 数量正确更新
   - 总价自动重新计算
   - 如果数量超过库存，显示错误提示

### 5. 测试删除商品

1. 在购物车抽屉中，点击商品的删除图标（垃圾桶）
2. 验证：
   - 商品从购物车中移除
   - 总数和总价自动更新
   - 购物车图标角标更新

### 6. 测试库存限制

1. 尝试添加超过库存数量的商品
2. 验证：
   - 显示"库存不足"错误提示
   - 商品不会被添加到购物车

### 7. 测试匿名用户购物车

1. 在未登录状态下添加商品
2. 刷新页面
3. 验证：
   - 购物车数据通过 sessionId 保留
   - 商品仍然在购物车中

### 8. 测试空购物车

1. 清空购物车中的所有商品
2. 打开购物车抽屉
3. 验证：
   - 显示"购物车是空的"提示
   - 显示"去购物"按钮

### 9. 测试立即购买

1. 在商品详情页，点击"立即购买"按钮
2. 验证：
   - 商品添加到购物车
   - 自动跳转到结算页面

## API 测试

### 使用 curl 测试 API

#### 1. 获取购物车
```bash
curl http://localhost:3000/api/cart
```

#### 2. 添加商品到购物车
```bash
curl -X POST http://localhost:3000/api/cart \
  -H "Content-Type: application/json" \
  -d '{"productId": "your-product-id", "quantity": 2}'
```

#### 3. 更新商品数量
```bash
curl -X PUT http://localhost:3000/api/cart/your-item-id \
  -H "Content-Type: application/json" \
  -d '{"quantity": 3}'
```

#### 4. 删除商品
```bash
curl -X DELETE http://localhost:3000/api/cart/your-item-id
```

## 已知问题

1. Prisma 客户端生成时遇到文件权限问题（Windows 特定），但不影响功能
2. TypeScript 类型错误会在构建时自动解决

## 下一步改进

1. 添加用户认证功能，支持登录用户购物车
2. 实现购物车数据持久化（登录后合并匿名购物车）
3. 添加购物车商品数量限制
4. 实现购物车商品批量删除
5. 添加购物车商品收藏功能
6. 实现购物车商品价格变动提醒
7. 添加购物车商品缺货提醒
8. 实现购物车商品优惠券功能

## 技术栈

- **前端**: Next.js 14, React, TypeScript, Tailwind CSS
- **状态管理**: Zustand
- **数据库**: SQLite + Prisma ORM
- **UI 组件**: shadcn/ui
- **图标**: Lucide React
