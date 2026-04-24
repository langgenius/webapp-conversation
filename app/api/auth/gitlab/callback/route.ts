import { NextResponse } from 'next/server'
import { getGitLabAuthConfig, validateGitLabConfig } from '@/config/auth'
import type { GitLabUser } from '@/types/auth'
import { signUserData } from '@/app/api/utils/common'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')

  const config = getGitLabAuthConfig()

  // 检查认证是否启用
  if (!config.enabled) {
    return NextResponse.redirect(new URL('/auth-error?auth_error=disabled', request.url))
  }

  // 验证配置
  if (!validateGitLabConfig(config)) {
    return NextResponse.redirect(new URL('/auth-error?auth_error=config', request.url))
  }

  // 处理错误
  if (error) {
    return NextResponse.redirect(new URL(`/auth-error?auth_error=${error}`, request.url))
  }

  if (!code) {
    return NextResponse.redirect(new URL('/auth-error?auth_error=no_code', request.url))
  }

  try {
    // 使用授权码获取access token
    const tokenResponse = await fetch(`${config.baseUrl}/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: config.clientId,
        client_secret: config.clientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: config.redirectUri,
      }),
    })

    if (!tokenResponse.ok) {
      throw new Error('Failed to get access token')
    }

    const tokenData = await tokenResponse.json()
    const accessToken = tokenData.access_token

    // 获取用户信息
    const userResponse = await fetch(`${config.baseUrl}/api/v4/user`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!userResponse.ok) {
      throw new Error('Failed to get user info')
    }

    const userData = await userResponse.json()
    const user: GitLabUser = {
      id: userData.id,
      username: userData.username,
      name: userData.name,
      email: userData.email,
      avatar_url: userData.avatar_url,
    }

    // 创建响应并设置cookie（使用HMAC签名）
    const response = NextResponse.redirect(new URL('/', request.url))

    const signedUserData = signUserData(user)
    response.cookies.set('gitlab_user', signedUserData, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response
  } catch (error) {
    console.error('GitLab authentication error:', error)
    return NextResponse.redirect(new URL('/auth-error?auth_error=server_error', request.url))
  }
}
