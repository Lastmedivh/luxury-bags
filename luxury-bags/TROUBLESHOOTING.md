# 后台管理系统故障排除指南

## 问题：无法打开 http://localhost:3000/admin

### 可能的原因和解决方案

#### 1. 浏览器缓存问题
**症状**：页面无法加载或显示旧版本

**解决方案**：
1. 清除浏览器缓存
   - Chrome: Ctrl + Shift + Delete
   - Firefox: Ctrl + Shift + Delete
   - Edge: Ctrl + Shift + Delete

2. 使用无痕模式打开
   - Chrome: Ctrl + Shift + N
   - Firefox: Ctrl + Shift + P

3. 强制刷新页面
   - Windows: Ctrl + F5
   - Mac: Cmd + Shift + R

#### 2. TypeScript 错误
**症状**：VS Code 显示 17 个错误

**解决方案**：

##### 2.1 重新生成 Prisma 客户端
```bash
cd luxury-bags
npx prisma generate
```

##### 2.2 清除 Next.js 缓存
```bash
cd luxury-bags
rm -rf .next
npm run dev
```

##### 2.3 重新安装依赖
```bash
cd luxury-bags
rm -rf node_modules package-lock.json
npm install
```

#### 3. 端口被占用
**症状**：无法访问 localhost:3000

**解决方案**：

##### 3.1 检查端口占用
```bash
# Windows
netstat -ano | findstr :3000

# 如果端口被占用，终止进程
taskkill /PID <进程ID> /F
```

##### 3.2 使用不同端口
修改 `package.json` 中的 dev 脚本：
```json
"scripts": {
  "dev": "next dev -p 3001"
}
```

#### 4. 认证问题
**症状**：自动跳转到登录页面或无法登录

**解决方案**：

##### 4.1 清除 localStorage
1. 打开浏览器开发者工具（F12）
2. 进入 Console 标签
3. 输入以下命令：
   ```javascript
   localStorage.clear()
   ```
4. 刷新页面

##### 4.2 检查 Token
1. 打开浏览器开发者工具
2. 进入 Application 标签
3. 展开 Local Storage
4. 检查是否有 `adminToken` 键
5. 如果有，删除它

#### 5. 测试后台路由
**解决方案**：访问测试页面

访问：http://localhost:3000/admin/test

如果能看到测试页面，说明后台路由正常工作。

## 常见 TypeScript 错误及解决方案

### 错误 1：找不到模块
```
找不到模块"@radix-ui/react-xxx"或其相应的类型声明
```

**解决方案**：
```bash
cd luxury-bags
npm install @radix-ui/react-dialog @radix-ui/react-label @radix-ui/react-toast @radix-ui/react-slot
```

### 错误 2：Prisma 类型错误
```
类型"PrismaClient"上不存在属性"xxx"
```

**解决方案**：
```bash
cd luxury-bags
npx prisma generate
```

### 错误 3：导入路径错误
```
找不到模块"@/components/ui/xxx"
```

**解决方案**：
1. 检查 `tsconfig.json` 中的路径配置
2. 确保文件存在于正确位置
3. 重启 TypeScript 服务器（VS Code 中按 Ctrl + Shift + P）

## 完整的重置步骤

如果以上方法都不行，尝试完整重置：

### 步骤 1：停止开发服务器
在终端中按 `Ctrl + C` 停止服务器

### 步骤 2：清除缓存和构建文件
```bash
cd luxury-bags
rm -rf .next
rm -rf node_modules/.cache
```

### 步骤 3：重新生成 Prisma 客户端
```bash
npx prisma generate
```

### 步骤 4：重新启动开发服务器
```bash
npm run dev
```

### 步骤 5：清除浏览器缓存
1. 打开浏览器
2. 按 `Ctrl + Shift + Delete` 清除缓存
3. 关闭浏览器
4. 重新打开浏览器

## 验证步骤

### 1. 检查开发服务器状态
在终端中应该看到：
```
✓ Compiled /admin in XXXms
GET /admin 200 in XXXms
```

### 2. 访问测试页面
打开：http://localhost:3000/admin/test

应该看到：绿色的"后台路由正常"提示

### 3. 访问登录页面
打开：http://localhost:3000/admin/login

应该看到：登录表单

### 4. 测试登录
使用以下凭据登录：
- 用户名：admin
- 密码：admin123

### 5. 访问后台首页
登录后应该自动跳转到：http://localhost:3000/admin

应该看到：商品管理页面

## 如果问题仍然存在

### 1. 检查环境变量
确保 `.env` 文件存在且包含正确的配置：
```env
DATABASE_URL="file:./dev.db"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="admin123"
```

### 2. 检查数据库
确保数据库文件存在：
```bash
cd luxury-bags
ls -la prisma/dev.db
```

### 3. 查看完整错误日志
在终端中查看完整的错误信息，或检查浏览器控制台。

### 4. 尝试不同的浏览器
- Chrome
- Firefox
- Edge
- Safari

### 5. 检查网络连接
确保：
- 开发服务器正在运行
- 端口 3000 未被防火墙阻止
- 可以访问 localhost

## 联系支持

如果以上所有方法都无法解决问题，请提供以下信息：

1. 完整的错误信息（终端输出）
2. VS Code 中的具体错误
3. 浏览器控制台中的错误
4. 操作系统版本
5. Node.js 版本（`node -v`）
6. npm 版本（`npm -v`）

## 快速修复命令

```bash
# 一键修复所有常见问题
cd luxury-bags && \
rm -rf .next && \
npx prisma generate && \
npm run dev
```

## 总结

大多数问题都可以通过以下步骤解决：
1. 清除浏览器缓存
2. 重新生成 Prisma 客户端
3. 清除 .next 缓存
4. 重启开发服务器

如果问题仍然存在，请查看具体的错误信息并参考相应的解决方案。
