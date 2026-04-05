// 简单的管理员认证系统
// 在生产环境中应该使用更安全的认证方式

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'

export function verifyAdmin(username: string, password: string): boolean {
  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD
}

export function createAdminToken(): string {
  // 简单的 token，生产环境应该使用 JWT
  return Buffer.from(`${ADMIN_USERNAME}:${Date.now()}`).toString('base64')
}

export function verifyAdminToken(token: string): boolean {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8')
    const [username] = decoded.split(':')
    return username === ADMIN_USERNAME
  } catch {
    return false
  }
}
