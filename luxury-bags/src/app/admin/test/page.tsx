export default function AdminTestPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">后台测试页面</h1>
      <p className="text-gray-600">如果你能看到这个页面，说明后台路由正常工作！</p>
      <div className="mt-4 p-4 bg-green-100 border border-green-300 rounded-lg">
        <p className="text-green-800 font-medium">✅ 后台路由正常</p>
      </div>
      <div className="mt-4 space-y-2">
        <a href="/admin/login" className="block text-blue-600 hover:underline">
          → 前往登录页面
        </a>
        <a href="/" className="block text-blue-600 hover:underline">
          → 返回首页
        </a>
      </div>
    </div>
  )
}
