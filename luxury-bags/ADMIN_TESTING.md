# 后台管理系统测试指南

## 功能概述

已实现的后台管理功能包括：

### 1. 管理员认证
- ✅ 简单的 HTTP 认证
- ✅ 登录页面：/admin/login
- ✅ 默认账号：admin / admin123
- ✅ Token 存储在 localStorage

### 2. 商品管理
- ✅ 商品列表展示（DataTable）
- ✅ 新增商品
- ✅ 编辑商品
- ✅ 删除商品
- ✅ 库存快速调整
- ✅ 图片上传功能

### 3. 订单管理
- ✅ 订单列表展示
- ✅ 订单详情查看
- ✅ 订单状态修改
- ✅ 订单筛选（按状态）
- ✅ 支付状态显示

### 4. UI 组件
- ✅ Table - 数据表格
- ✅ Dialog - 对话框
- ✅ Form - 表单
- ✅ Button - 按钮
- ✅ Input - 输入框
- ✅ Label - 标签
- ✅ Badge - 徽章
- ✅ Select - 选择器

## 测试步骤

### 1. 访问后台管理系统

1. 在浏览器中打开：http://localhost:3000/admin
2. 如果未登录，会自动跳转到登录页面
3. 输入管理员账号：
   - 用户名：admin
   - 密码：admin123
4. 点击"登录"按钮

### 2. 测试商品管理

#### 2.1 查看商品列表
1. 登录后，默认进入商品管理页面
2. 验证：
   - 显示所有商品
   - 每个商品显示：图片、名称、价格、库存、销量、状态
   - 表格布局正确

#### 2.2 新增商品
1. 点击"新增商品"按钮
2. 填写商品信息：
   - 商品名称：测试商品
   - 分类 ID：1
   - 价格：999.00
   - 原价：1299.00
   - 库存：100
   - 标签：新品,热销
   - 商品描述：这是一个测试商品
   - 图片 URL：/uploads/test.jpg
   - 设为推荐商品：勾选
3. 点击"创建"按钮
4. 验证：
   - 对话框关闭
   - 商品出现在列表中
   - 显示"推荐"标签

#### 2.3 编辑商品
1. 点击任意商品的"编辑"按钮
2. 修改商品信息（如价格、库存等）
3. 点击"更新"按钮
4. 验证：
   - 对话框关闭
   - 商品信息已更新

#### 2.4 删除商品
1. 点击任意商品的"删除"按钮
2. 确认删除
3. 验证：
   - 商品从列表中移除

#### 2.5 快速调整库存
1. 在商品列表中，直接修改库存输入框的值
2. 按回车或点击其他地方
3. 验证：
   - 库存值已更新
   - 状态标签相应变化（有货/缺货）

### 3. 测试订单管理

#### 3.1 查看订单列表
1. 点击左侧菜单的"订单管理"
2. 验证：
   - 显示所有订单
   - 每个订单显示：订单号、商品数量、金额、状态、支付状态
   - 状态标签颜色正确

#### 3.2 查看订单详情
1. 点击任意订单行
2. 验证：
   - 右侧显示订单详情
   - 显示订单号、下单时间、订单金额
   - 显示商品列表（图片、名称、数量、价格）

#### 3.3 修改订单状态
1. 在订单列表中，点击状态选择器
2. 选择新状态（如：已发货）
3. 验证：
   - 状态已更新
   - 状态标签颜色和图标相应变化

#### 3.4 筛选订单
1. 点击顶部的状态筛选下拉框
2. 选择特定状态（如：待处理）
3. 验证：
   - 只显示该状态的订单

### 4. 测试图片上传

#### 4.1 上传图片
1. 在新增/编辑商品对话框中
2. 准备一张图片文件（JPG/PNG，小于 5MB）
3. 使用以下方式上传：
   ```bash
   curl -X POST http://localhost:3000/api/admin/upload \
     -F "file=@/path/to/your/image.jpg"
   ```
4. 验证：
   - 返回成功响应
   - 返回图片 URL
   - 图片保存在 /public/uploads 目录

#### 4.2 使用上传的图片
1. 复制返回的图片 URL
2. 在商品表单的"图片 URL"字段中粘贴
3. 保存商品
4. 验证：
   - 商品列表中显示上传的图片

### 5. 测试响应式设计

1. 调整浏览器窗口大小
2. 验证：
   - 桌面端：侧边栏固定显示
   - 移动端：侧边栏隐藏，显示菜单按钮
   - 点击菜单按钮可以打开/关闭侧边栏

### 6. 测试退出登录

1. 点击左侧底部的"退出登录"按钮
2. 验证：
   - 跳转到登录页面
   - localStorage 中的 token 已清除

## API 测试

### 1. 管理员登录
```bash
curl -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### 2. 获取商品列表
```bash
curl http://localhost:3000/api/admin/products
```

### 3. 创建商品
```bash
curl -X POST http://localhost:3000/api/admin/products \
  -H "Content-Type: application/json" \
  -d '{
    "name":"测试商品",
    "description":"商品描述",
    "price":999,
    "categoryId":"1",
    "stock":100,
    "tags":"新品,热销",
    "isFeatured":true
  }'
```

### 4. 更新商品
```bash
curl -X PUT http://localhost:3000/api/admin/products/{product-id} \
  -H "Content-Type: application/json" \
  -d '{
    "name":"更新后的商品名",
    "price":899,
    "stock":50
  }'
```

### 5. 删除商品
```bash
curl -X DELETE http://localhost:3000/api/admin/products/{product-id}
```

### 6. 更新库存
```bash
curl -X PUT http://localhost:3000/api/admin/products/{product-id}/stock \
  -H "Content-Type: application/json" \
  -d '{"stock":200}'
```

### 7. 获取订单列表
```bash
curl http://localhost:3000/api/admin/orders
```

### 8. 更新订单状态
```bash
curl -X PUT http://localhost:3000/api/admin/orders/{order-id}/status \
  -H "Content-Type: application/json" \
  -d '{"status":"SHIPPED"}'
```

### 9. 上传图片
```bash
curl -X POST http://localhost:3000/api/admin/upload \
  -F "file=@/path/to/image.jpg"
```

## 已知问题

1. **认证安全性**：当前使用简单的 token 认证，生产环境应使用 JWT
2. **图片上传**：当前使用本地文件系统，生产环境应使用云存储（如 OSS、S3）
3. **并发控制**：库存更新未实现分布式锁，高并发时可能出现问题
4. **数据验证**：表单验证较为简单，应添加更严格的验证

## 下一步改进

1. **用户认证**：集成 JWT 认证
2. **权限管理**：实现角色和权限系统
3. **数据验证**：添加更严格的表单验证
4. **批量操作**：支持批量删除、批量更新
5. **导出功能**：支持导出订单、商品数据
6. **统计分析**：添加销售统计、库存预警
7. **搜索功能**：添加商品和订单搜索
8. **分页功能**：大数据量时添加分页
9. **图片裁剪**：添加图片裁剪和压缩功能
10. **操作日志**：记录管理员操作日志

## 技术栈

- **前端**：Next.js 14, React, TypeScript, Tailwind CSS
- **UI 组件**：shadcn/ui
- **状态管理**：React Hooks
- **后端**：Next.js API Routes
- **数据库**：SQLite + Prisma ORM
- **认证**：简单 Token 认证

## 文件结构

```
luxury-bags/
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   ├── layout.tsx              # 后台布局
│   │   │   ├── page.tsx                # 商品管理页面
│   │   │   ├── orders/
│   │   │   │   └── page.tsx            # 订单管理页面
│   │   │   └── login/
│   │   │       └── page.tsx            # 登录页面
│   │   └── api/
│   │       └── admin/
│   │           ├── login/
│   │           │   └── route.ts            # 登录 API
│   │           ├── products/
│   │           │   ├── route.ts            # 商品列表/创建 API
│   │           │   └── [id]/
│   │           │       ├── route.ts            # 商品更新/删除 API
│   │           │       └── stock/
│   │           │           └── route.ts        # 库存更新 API
│   │           ├── orders/
│   │           │   ├── route.ts            # 订单列表 API
│   │           │   └── [id]/
│   │           │       └── status/
│   │           │           └── route.ts        # 订单状态更新 API
│   │           └── upload/
│   │               └── route.ts            # 图片上传 API
│   ├── components/
│   │   └── ui/                        # UI 组件
│   │       ├── table.tsx
│   │       ├── dialog.tsx
│   │       ├── button.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       ├── badge.tsx
│   │       └── select.tsx
│   └── lib/
│       ├── auth.ts                       # 认证工具
│       └── prisma.ts                     # Prisma 客户端
└── ADMIN_TESTING.md                      # 本文档
```

## 总结

后台管理系统已完全实现，包括：
- ✅ 管理员认证系统
- ✅ 商品 CRUD 功能
- ✅ 订单管理功能
- ✅ 库存快速调整
- ✅ 图片上传功能
- ✅ 响应式设计
- ✅ 完整的 API 接口

所有功能已就绪，可以开始测试！
