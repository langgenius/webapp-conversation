'use client'

import type { FC } from 'react'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/hooks/use-auth'
import { isGitLabAuthEnabled } from '@/config/auth'

interface LoginButtonProps {
  className?: string
}

const LoginButton: FC<LoginButtonProps> = ({ className = '' }) => {
  const { t } = useTranslation()
  const { isAuthenticated, isLoading, login, logout, user } = useAuth()
  const [showLogout, setShowLogout] = useState(false)
  // 如果认证未启用，不显示任何内容
  if (!isGitLabAuthEnabled()) {
    return null
  }

  const handleLogin = async () => {
    try {
      await login()
    } catch (error) {
      console.error('Login failed:', error)
      // 在实际应用中可以显示错误提示
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  // 如果已认证，显示用户信息和登出按钮

  if (isAuthenticated && user) {
    return (
      <div className="flex items-center space-x-3 relative">
        <div
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => setShowLogout(!showLogout)}
        >
          {user.avatar_url && (
            <img
              src={user.avatar_url}
              alt={user.name}
              className="w-8 h-8 rounded-full"
            />
          )}
          <div className="text-sm">
            <div className="font-medium text-gray-900">{user.name}</div>
            <div className="text-gray-500">@{user.username}</div>
          </div>
        </div>
        {showLogout && (
          <button
            onClick={handleLogout}
            disabled={isLoading}
            className={`
                            absolute top-full right-0 mt-2 px-3 py-1 bg-gray-200 text-gray-700 rounded-md
                            hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed
                            transition-colors text-sm z-10 shadow-md
                            ${className}
                        `}
          >
            {t('auth.loginButton.logOut')}
          </button>
        )}
      </div>
    )
  }

  // 如果未认证，显示登录按钮
  return (
    <button
      onClick={handleLogin}
      disabled={isLoading}
      className={`
                px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700
                disabled:opacity-50 disabled:cursor-not-allowed transition-colors
                ${className}
            `}
    >
      {isLoading ? t('auth.loginButton.loggingIn') : t('auth.loginButton.loginWithGitLab')}
    </button>
  )
}

export default LoginButton
