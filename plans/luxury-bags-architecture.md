# Luxury Bags 电商项目架构设计

## 项目概述

基于 Next.js 14 (App Router) 的奢侈品包包电商平台，使用 TypeScript、Tailwind CSS、shadcn/ui、Prisma + PostgreSQL 和 Zustand 构建。

## 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Next.js | 14.2.15 | React 框架，使用 App Router |
| TypeScript | 5.x | 类型安全 |
| Tailwind CSS | 3.4.1 | 样式框架 |
| shadcn/ui | latest | UI 组件库 |
| Prisma | 5.20.0 | ORM 数据库访问 |
| PostgreSQL | latest | 关系型数据库 |
| Zustand | 5.0.1 | 状态管理 |
| Stripe | 17.2.0 | 支付集成 |

## 项目目录结构

```
luxury-bags/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (shop)/             # 前台商城路由组
│   │   │   ├── page.tsx        # 首页
│   │   │   ├── products/       # 商品列表
│   │   │   │   └── page.tsx
│   │   │   ├── product/        # 商品详情
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   ├── cart/           # 购物车
│   │   │   │   └── page.tsx
│   │   │   └── checkout/       # 结算页
│   │   │       └── page.tsx
│   │   ├── api/                # API 路由
│   │   │   ├── products/       # 商品相关 API
│   │   │   │   └── route.ts
│   │   │   ├── orders/         # 订单相关 API
│   │   │   │   └── route.ts
│   │   │   └── payment/        # 支付相关 API
│   │   │       └── route.ts
│   │   ├── layout.tsx          # 根布局
│   │   └── globals.css         # 全局样式
│   ├── components/             # React 组件
│   │   ├── ui/                 # shadcn/ui 组件
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── form.tsx
│   │   │   ├── label.tsx
│   │   │   ├── select.tsx
│   │   │   ├── sheet.tsx
│   │   │   ├── table.tsx
│   │   │   ├── toast.tsx
│   │   │   └── ...
│   │   └── product/            # 商品相关组件
│   │       ├── product-card.tsx
│   │       ├── product-grid.tsx
│   │       └── product-image.tsx
│   ├── lib/                    # 工具函数
│   │   ├── utils.ts            # 通用工具函数
│   │   ├── prisma.ts           # Prisma 客户端
│   │   └── stripe.ts           # Stripe 配置
│   ├── prisma/                 # 数据库 Schema
│   │   └── schema.prisma       # Prisma 数据模型
│   └── store/                  # Zustand 状态管理
│       ├── cart-store.ts       # 购物车状态
│       ├── product-store.ts    # 商品状态
│       └── user-store.ts       # 用户状态
├── prisma/                     # Prisma 迁移文件
│   └── migrations/
├── public/                     # 静态资源
│   └── images/
├── .env.example                # 环境变量模板
├── .gitignore                  # Git 忽略文件
├── components.json             # shadcn/ui 配置
├── next.config.js              # Next.js 配置
├── package.json                # 项目依赖
├── postcss.config.js           # PostCSS 配置
├── tailwind.config.ts          # Tailwind CSS 配置
├── tsconfig.json               # TypeScript 配置
└── README.md                   # 项目说明文档
```

## 数据库模型设计

### Prisma Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  orders    Order[]
}

model Product {
  id          String   @id @default(cuid())
  name        String
  description String
  price       Decimal  @db.Decimal(10, 2)
  imageUrl    String
  stock       Int      @default(0)
  category    String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  orderItems  OrderItem[]
}

model Order {
  id              String      @id @default(cuid())
  userId          String
  user            User        @relation(fields: [userId], references: [id])
  total           Decimal     @db.Decimal(10, 2)
  status          String      @default("pending")
  stripePaymentId String?     @unique
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
  orderItems      OrderItem[]
}

model OrderItem {
  id        String   @id @default(cuid())
  orderId   String
  order     Order    @relation(fields: [orderId], references: [id])
  productId String
  product   Product  @relation(fields: [productId], references: [id])
  quantity  Int
  price     Decimal  @db.Decimal(10, 2)
}
```

## 环境变量配置

```env
# .env.example

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/luxury_bags"

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_xxx"
STRIPE_SECRET_KEY="sk_test_xxx"
STRIPE_WEBHOOK_SECRET="whsec_xxx"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## 初始化命令

```bash
# 创建 Next.js 项目
npx create-next-app@latest luxury-bags --typescript --tailwind --app

# 初始化 shadcn/ui
npx shadcn-ui@latest init

# 安装依赖
npm install @prisma/client zustand stripe @stripe/stripe-js

# 安装开发依赖
npm install -D prisma

# 初始化 Prisma
npx prisma init

# 生成 Prisma Client
npx prisma generate

# 运行数据库迁移
npx prisma migrate dev --name init
```

## shadcn/ui 组件列表

需要初始化的组件：
- button
- card
- input
- dialog
- dropdown-menu
- form
- label
- select
- sheet
- table
- toast
- separator
- badge
- avatar
- skeleton

## Zustand Store 设计

### Cart Store
```typescript
interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  quantity: number
  imageUrl: string
}

interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getTotalPrice: () => number
}
```

### Product Store
```typescript
interface ProductStore {
  products: Product[]
  loading: boolean
  fetchProducts: () => Promise<void>
  getProductById: (id: string) => Product | undefined
}
```

## API 路由设计

| 路由 | 方法 | 功能 |
|------|------|------|
| `/api/products` | GET | 获取商品列表 |
| `/api/products/[id]` | GET | 获取单个商品详情 |
| `/api/orders` | POST | 创建订单 |
| `/api/orders/[id]` | GET | 获取订单详情 |
| `/api/payment/create-checkout` | POST | 创建 Stripe Checkout Session |
| `/api/payment/webhook` | POST | Stripe Webhook 处理 |

## 页面路由设计

| 路由 | 功能 |
|------|------|
| `/` | 首页 - 展示精选商品 |
| `/products` | 商品列表页 - 支持筛选和搜索 |
| `/product/[id]` | 商品详情页 |
| `/cart` | 购物车页面 |
| `/checkout` | 结算页面 |

## 下一步行动

1. 切换到 Code 模式执行以下操作：
   - 创建所有配置文件
   - 创建项目目录结构
   - 初始化 shadcn/ui 组件
   - 设置 Prisma schema
   - 创建环境变量模板
   - 编写 README.md 文档
