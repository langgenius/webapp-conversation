import { NextResponse } from 'next/server'
import { getGitLabAuthConfig, validateGitLabConfig } from '@/config/auth'

export async function GET() {
  const config = getGitLabAuthConfig()

  // 检查认证是否启用
  if (!config.enabled) {
    return NextResponse.json(
      { error: 'GitLab authentication is not enabled' },
      { status: 403 },
    )
  }

  // 验证配置
  if (!validateGitLabConfig(config)) {
    return NextResponse.json(
      { error: 'GitLab authentication configuration is invalid' },
      { status: 500 },
    )
  }

  // 生成OAuth认证URL
  const authUrl = new URL(`${config.baseUrl}/oauth/authorize`)
  authUrl.searchParams.append('client_id', config.clientId)
  authUrl.searchParams.append('redirect_uri', config.redirectUri)
  authUrl.searchParams.append('response_type', 'code')
  authUrl.searchParams.append('scope', 'read_user')
  authUrl.searchParams.append('state', Math.random().toString(36).substring(2))

  return NextResponse.json({
    url: authUrl.toString(),
  })
}
