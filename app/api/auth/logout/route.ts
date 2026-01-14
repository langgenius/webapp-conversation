import { NextResponse } from 'next/server'
import { getGitLabAuthConfig } from '@/config/auth'

export async function POST(request: Request) {
  const config = getGitLabAuthConfig()

  // 检查认证是否启用
  if (!config.enabled) {
    return NextResponse.json(
      { success: false, error: 'GitLab authentication is not enabled' },
      { status: 403 },
    )
  }

  // 创建响应并清除cookie
  const response = NextResponse.json({ success: true })

  // 清除认证相关的cookie
  response.cookies.set('gitlab_access_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0, // 立即过期
  })

  response.cookies.set('gitlab_user', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0, // 立即过期
  })

  return response
}
