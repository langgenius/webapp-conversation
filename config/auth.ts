import type { GitLabAuthConfig } from '@/types/auth'

export const getGitLabAuthConfig = (): GitLabAuthConfig => {
  const enabled = process.env.NEXT_PUBLIC_GITLAB_AUTH_ENABLED === 'true'
  return {
    enabled,
    clientId: process.env.GITLAB_CLIENT_ID || '',
    clientSecret: process.env.GITLAB_CLIENT_SECRET || '',
    baseUrl: process.env.GITLAB_BASE_URL || 'https://gitlab.com',
    redirectUri: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/auth/gitlab/callback`,
  }
}

export const isGitLabAuthEnabled = (): boolean => {
  return getGitLabAuthConfig().enabled
}

export const validateGitLabConfig = (config: GitLabAuthConfig): boolean => {
  if (!config.enabled) {
    return true
  }

  return !!(config.clientId && config.clientSecret && config.baseUrl)
}
