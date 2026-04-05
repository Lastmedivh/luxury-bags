# 快速启动指南

## 启动开发服务器

### 方法 1：使用 npm
```bash
cd luxury-bags
npm run dev
```

### 方法 2：使用 pnpm（如果已安装）
```bash
cd luxury-bags
pnpm dev
```

### 方法 3：使用 yarn（如果已安装）
```bash
cd luxury-bags
yarn dev
```

## 访问应用

服务器启动后，在浏览器中打开：
- **主页**: http://localhost:3000
- **商品列表**: http://localhost:3000/products
- **购物车**: http://localhost:3000/cart

## 如果无法访问

### 检查端口占用
```bash
# Windows
netstat -ano | findstr :3000

# 如果端口被占用，可以终止进程
taskkill /PID <进程ID> /F
```

### 更改端口
在 `package.json` 中修改 dev 脚本：
```json
"scripts": {
  "dev": "next dev -p 3001"
}
```

### 清除缓存
```bash
cd luxury-bags
rm -rf .next
npm run dev
```

## 常见问题

### 1. TypeScript 错误
```bash
# 重新生成 Prisma 客户端
npx prisma generate

# 重新安装依赖
rm -rf node_modules package-lock.json
npm install
```

### 2. 数据库连接错误
```bash
# 检查 .env 文件
cat .env

# 重新运行迁移
npx prisma migrate dev
```

### 3. 端口被占用
```bash
# 使用不同端口启动
npm run dev -- -p 3001
```

## 测试购物车功能

1. 访问 http://localhost:3000/products
2. 点击任意商品进入详情页
3. 点击"加入购物车"按钮
4. 购物车抽屉会自动打开
5. 可以修改数量或删除商品

## API 测试

### 获取购物车
```bash
curl http://localhost:3000/api/cart
```

### 添加商品
```bash
curl -X POST http://localhost:3000/api/cart \
  -H "Content-Type: application/json" \
  -d '{"productId": "your-product-id", "quantity": 1}'
```

## 开发工具

- **VS Code**: 推荐使用 VS Code 进行开发
- **浏览器**: Chrome 或 Firefox
- **API 测试**: Postman 或 curl

## 下一步

- 查看 [CART_TESTING.md](./CART_TESTING.md) 了解详细测试步骤
- 查看 [CART_IMPLEMENTATION_SUMMARY.md](./CART_IMPLEMENTATION_SUMMARY.md) 了解实现细节
- 开始添加新功能或修复问题
