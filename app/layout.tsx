"use client"
import React from 'react'
import './styles/globals.css'
import './styles/markdown.scss'

import { MsalProvider } from '@azure/msal-react'
import { PublicClientApplication } from '@azure/msal-browser'
import msalConfig from '@/config/msalConfig'
import AuthGuard from './components/AuthGuard'

const msalInstance = new PublicClientApplication(msalConfig)

const LocaleLayout = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <html lang="en" className="h-full">
      <body className="h-full">
        <MsalProvider instance={msalInstance}>
          <AuthGuard>
            <div className="overflow-x-auto">
              <div className="w-screen h-screen min-w-[300px]">
                {children}
              </div>
            </div>
          </AuthGuard>
        </MsalProvider>
      </body>
    </html>
  )
}

export default LocaleLayout
