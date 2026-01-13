import type { GitLabUser } from '@/types/auth'

const AUTH_TOKEN_KEY = 'gitlab_auth_token'
const USER_INFO_KEY = 'gitlab_user_info'

export const setAuthToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(AUTH_TOKEN_KEY, token)
  }
}

export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(AUTH_TOKEN_KEY)
  }
  return null
}

export const removeAuthToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUTH_TOKEN_KEY)
  }
}

export const setUserInfo = (user: GitLabUser): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(USER_INFO_KEY, JSON.stringify(user))
  }
}

export const getUserInfo = (): GitLabUser | null => {
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem(USER_INFO_KEY)
    return userStr ? JSON.parse(userStr) : null
  }
  return null
}

export const removeUserInfo = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(USER_INFO_KEY)
  }
}

export const isAuthenticated = (): boolean => {
  return !!(getAuthToken() && getUserInfo())
}

export const logout = (): void => {
  removeAuthToken()
  removeUserInfo()
}
