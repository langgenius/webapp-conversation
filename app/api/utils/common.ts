import type { NextRequest } from 'next/server'
import { ChatClient } from 'dify-client'
import { v4 } from 'uuid'
import { createHmac } from 'crypto'
import { API_KEY, API_URL, APP_ID, APP_INFO } from '@/config'
import { getGitLabAuthConfig } from '@/config/auth'
import type { GitLabUser } from '@/types/auth'

const userPrefix = `user_${APP_ID}:`
const HMAC_SECRET = API_KEY // 使用 Dify API Key 作为 HMAC 密钥

// HMAC 签名验证工具函数
export const signUserData = (userData: GitLabUser): string => {
  const data = JSON.stringify(userData)
  const signature = createHmac('sha256', HMAC_SECRET)
    .update(data)
    .digest('hex')
  return JSON.stringify({ data: userData, signature })
}

export const verifyUserData = (signedData: string): GitLabUser | null => {
  try {
    const { data, signature } = JSON.parse(signedData)
    if (!data || !signature) { return null }

    const expectedSignature = createHmac('sha256', HMAC_SECRET)
      .update(JSON.stringify(data))
      .digest('hex')

    return signature === expectedSignature ? data : null
  } catch (error) {
    return null
  }
}

export const getInfo = (request: NextRequest) => {
  const config = getGitLabAuthConfig()

  // 检查是否有GitLab认证用户（使用HMAC签名验证）
  const gitlabUserCookie = request.cookies.get('gitlab_user')?.value

  if (config.enabled && gitlabUserCookie) {
    const gitlabUser = verifyUserData(gitlabUserCookie)
    if (gitlabUser) {
      // 使用GitLab用户ID作为用户标识
      const user = `${userPrefix}gitlab_${gitlabUser.id}_${gitlabUser.username}`
      return {
        sessionId: `gitlab_${gitlabUser.id}`,
        user,
      }
    } else {
      console.error('Failed to verify GitLab user cookie signature')
      // 回退到匿名用户
    }
  }

  // 匿名用户（原有逻辑）
  const sessionId = request.cookies.get('session_id')?.value || v4()
  const user = userPrefix + sessionId
  return {
    sessionId,
    user,
  }
}

export const setSession = (sessionId: string) => {
  if (APP_INFO.disable_session_same_site) {
    return { 'Set-Cookie': `session_id=${sessionId}; SameSite=None; Secure` }
  }

  return { 'Set-Cookie': `session_id=${sessionId}` }
}

export const client = new ChatClient(API_KEY, API_URL || undefined)
