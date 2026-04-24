import { NextResponse } from 'next/server'
import { getGitLabAuthConfig } from '@/config/auth'
import type { AuthResponse } from '@/types/auth'
import { verifyUserData } from '@/app/api/utils/common'

export async function GET(request: Request) {
  const config = getGitLabAuthConfig()

  // 检查认证是否启用
  if (!config.enabled) {
    const response: AuthResponse = {
      success: false,
      error: 'GitLab authentication is not enabled',
    }
    return NextResponse.json(response, { status: 403 })
  }

  // 从cookie中获取用户信息
  const cookieHeader = request.headers.get('cookie')
  if (!cookieHeader) {
    const response: AuthResponse = {
      success: false,
      error: 'No authentication found',
    }
    return NextResponse.json(response, { status: 401 })
  }

  const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
    const [name, value] = cookie.trim().split('=')
    if (name && value) {
      acc[name] = decodeURIComponent(value)
    }
    return acc
  }, {} as Record<string, string>)

  const userCookie = cookies.gitlab_user
  if (!userCookie) {
    const response: AuthResponse = {
      success: false,
      error: 'User not authenticated',
    }
    return NextResponse.json(response, { status: 401 })
  }

  try {
    const user = verifyUserData(userCookie)
    if (user) {
      const response: AuthResponse = {
        success: true,
        user,
      }
      return NextResponse.json(response)
    } else {
      const response: AuthResponse = {
        success: false,
        error: 'Invalid user signature',
      }
      return NextResponse.json(response, { status: 401 })
    }
  } catch (error) {
    const response: AuthResponse = {
      success: false,
      error: 'Invalid user data',
    }
    return NextResponse.json(response, { status: 400 })
  }
}
