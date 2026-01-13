'use client'

import { useState, useEffect, useCallback } from 'react'
import { isGitLabAuthEnabled } from '@/config/auth'
import type { AuthState } from '@/types/auth'

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: true,
  })

  // 检查认证状态
  const checkAuthStatus = useCallback(async () => {
    if (!isGitLabAuthEnabled()) {
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
      })
      return
    }

    try {
      const response = await fetch('/api/auth/user')
      if (response.ok) {
        const data = await response.json()
        if (data.success && data.user) {
          setAuthState({
            isAuthenticated: true,
            user: data.user,
            isLoading: false,
          })
        } else {
          setAuthState({
            isAuthenticated: false,
            user: null,
            isLoading: false,
          })
        }
      } else {
        setAuthState({
          isAuthenticated: false,
          user: null,
          isLoading: false,
        })
      }
    } catch (error) {
      console.error('Failed to check auth status:', error)
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
      })
    }
  }, [])

  // 登录
  const login = useCallback(async () => {
    if (!isGitLabAuthEnabled()) {
      console.warn('GitLab authentication is not enabled')
      return
    }

    try {
      const response = await fetch('/api/auth/gitlab/login')
      if (response.ok) {
        const data = await response.json()
        window.location.href = data.url
      } else {
        throw new Error('Failed to get login URL')
      }
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }, [])

  // 登出
  const logout = useCallback(async () => {
    if (!isGitLabAuthEnabled()) {
      console.warn('GitLab authentication is not enabled')
      return
    }

    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
      })
      // 重载页面以清除所有状态
      window.location.reload()
    } catch (error) {
      console.error('Logout failed:', error)
      throw error
    }
  }, [])

  // 初始化时检查认证状态
  useEffect(() => {
    checkAuthStatus()
  }, [checkAuthStatus])

  return {
    ...authState,
    login,
    logout,
    refetch: checkAuthStatus,
  }
}
