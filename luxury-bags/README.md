# Luxury Bags - 电商平台

基于 Next.js 14 (App Router) 的奢侈品包包电商平台。

## 技术栈

- **Next.js 14** - React 框架，使用 App Router
- **TypeScript** - 类型安全
- **Tailwind CSS** - 样式框架
- **shadcn/ui** - UI 组件库
- **Prisma** - ORM 数据库访问
- **PostgreSQL** - 关系型数据库
- **Zustand** - 状态管理
- **Stripe** - 支付集成

## 项目结构

```
luxury-bags/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (shop)/             # 前台商城路由组
│   │   │   ├── page.tsx        # 首页
│   │   │   ├── products/       # 商品列表
│   │   │   ├── product/[id]/   # 商品详情
│   │   │   ├── cart/           # 购物车
│   │   │   └── checkout/       # 结算页
│   │   ├── api/                # API 路由
│   │   │   ├── products/       # 商品相关 API
│   │   │   ├── orders/         # 订单相关 API
│   │   │   └── payment/        # 支付相关 API
│   │   ├── layout.tsx          # 根布局
│   │   └── globals.css         # 全局样式
│   ├── components/             # React 组件
│   │   ├── ui/                 # shadcn/ui 组件
│   │   └── product/            # 商品相关组件
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
└── tsconfig.json               # TypeScript 配置
```

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.example` 文件为 `.env` 并填写相应的配置：

```bash
cp .env.example .env
```

编辑 `.env` 文件：

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/luxury_bags"

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_xxx"
STRIPE_SECRET_KEY="sk_test_xxx"
STRIPE_WEBHOOK_SECRET="whsec_xxx"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. 初始化数据库

```bash
# 生成 Prisma Client
npx prisma generate

# 运行数据库迁移
npx prisma migrate dev --name init
```

### 4. 初始化 shadcn/ui 组件

```bash
npx shadcn-ui@latest init
```

然后添加需要的组件：

```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add input
# ... 添加更多组件
```

### 5. 启动开发服务器

```bash
npm run dev
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看应用。

## 数据库模型

### User
- `id` - 用户 ID
- `email` - 邮箱
- `name` - 姓名
- `password` - 密码
- `createdAt` - 创建时间
- `updatedAt` - 更新时间

### Product
- `id` - 商品 ID
- `name` - 商品名称
- `description` - 商品描述
- `price` - 价格
- `imageUrl` - 图片 URL
- `stock` - 库存
- `category` - 分类
- `createdAt` - 创建时间
- `updatedAt` - 更新时间

### Order
- `id` - 订单 ID
- `userId` - 用户 ID
- `total` - 总金额
- `status` - 订单状态
- `stripePaymentId` - Stripe 支付 ID
- `createdAt` - 创建时间
- `updatedAt` - 更新时间

### OrderItem
- `id` - 订单项 ID
- `orderId` - 订单 ID
- `productId` - 商品 ID
- `quantity` - 数量
- `price` - 价格

## API 路由

| 路由 | 方法 | 功能 |
|------|------|------|
| `/api/products` | GET | 获取商品列表 |
| `/api/products` | POST | 创建商品 |
| `/api/orders` | GET | 获取订单列表 |
| `/api/orders` | POST | 创建订单 |
| `/api/payment` | POST | 处理支付 |

## Zustand Store

### Cart Store
- `items` - 购物车商品列表
- `addItem` - 添加商品到购物车
- `removeItem` - 从购物车移除商品
- `updateQuantity` - 更新商品数量
- `clearCart` - 清空购物车
- `getTotalPrice` - 获取总价

### Product Store
- `products` - 商品列表
- `loading` - 加载状态
- `fetchProducts` - 获取商品列表
- `getProductById` - 根据 ID 获取商品

### User Store
- `user` - 当前用户
- `setUser` - 设置用户
- `clearUser` - 清除用户

## 脚本命令

| 命令 | 描述 |
|------|------|
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 构建生产版本 |
| `npm start` | 启动生产服务器 |
| `npm run lint` | 运行 ESLint 检查 |

## 许可证

MIT
