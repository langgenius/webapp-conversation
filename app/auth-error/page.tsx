'use client'
import type { FC } from 'react'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { isGitLabAuthEnabled } from '@/config/auth'
import LoginButton from '@/app/components/auth/login-button'
import { getLocaleOnClient } from '@/i18n/client'
import { changeLanguage } from 'i18next'

const AuthErrorPage: FC = () => {
  const { t } = useTranslation()
  useEffect(() => {
    // 从cookie获取语言设置并应用到i18n
    const locale = getLocaleOnClient()
    changeLanguage(locale)
  }, [])
  const searchParams = useSearchParams()
  const { isAuthenticated, isLoading } = useAuth()

  const errorCode = searchParams.get('auth_error')
  const isAuthEnabled = isGitLabAuthEnabled()

  const getErrorMessage = () => {
    const messageKey = `auth.error.${errorCode || 'default'}`
    return t(messageKey)
  }

  const getErrorTitle = () => {
    const titleKey = `auth.error.title.${errorCode || 'default'}`
    return t(titleKey)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {t('auth.loading')}
          </h2>
          <p className="text-gray-600">{t('auth.loadingMessage')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {getErrorTitle()}
          </h2>
          <p className="text-gray-600 mb-6">
            {getErrorMessage()}
          </p>
        </div>

        <div className="space-y-4">
          {errorCode === 'disabled' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <p className="text-yellow-800 text-sm">
                {t('auth.error.disabledHint')}
              </p>
            </div>
          )}

          {errorCode === 'config' && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-red-800 text-sm">
                {t('auth.error.configHint')}
              </p>
            </div>
          )}

          {(errorCode === 'no_code' || errorCode === 'server_error' || !errorCode) && (
            <div className="text-center">
              <p className="text-gray-600 text-sm mb-4">
                {t('auth.error.retryHint')}
              </p>
              {isAuthEnabled && !isAuthenticated && (
                <LoginButton className="w-full" />
              )}
            </div>
          )}

          {isAuthEnabled && isAuthenticated && (
            <div className="text-center">
              <a
                href="/"
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors inline-block"
              >
                {t('auth.error.backToHome')}
              </a>
            </div>
          )}
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            {t('auth.error.contactSupport')}
          </p>
        </div>
      </div>
    </div>
  )
}

export default AuthErrorPage
