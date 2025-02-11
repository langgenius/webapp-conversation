import type { Metadata } from 'next'
import { APP_INFO } from '@/config'
import { getLocaleOnServer } from '@/i18n/server'
import Link from 'next/link'

import './styles/globals.css'
import './styles/markdown.scss'

export const metadata: Metadata = {
  title: APP_INFO.title,
  description: '基于人工智能的未来变量观测系统',
}

const LocaleLayout = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const locale = getLocaleOnServer()
  return (
    <html lang={locale ?? 'en'} className="h-full">
      <body className="h-full">
        <div className="overflow-x-auto">
          <div className="w-screen min-h-screen min-w-[300px] flex flex-col">
            <nav className="flex items-center justify-between p-4 border-b">
              <Link href="/" className="text-xl font-bold">
                未来变量观测局
              </Link>
              <div className="flex gap-4">
                <Link 
                  href="/prediction" 
                  className="px-4 py-2 rounded-md hover:bg-gray-100"
                >
                  开始预测
                </Link>
              </div>
            </nav>
            
            <main className="flex-grow">
              {children}
            </main>

            <footer className="text-center py-4 text-sm text-gray-500 border-t">
              <p>© {new Date().getFullYear()} 未来变量观测局</p>
              <p className="mt-1">由 荔福路绅士 倾情奉献</p>
              <p className="mt-1">
                <a 
                  href="https://creativecommons.org/licenses/by-nc-sa/4.0/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-gray-700"
                >
                  CC BY-NC-SA 4.0
                </a>
              </p>
            </footer>
          </div>
        </div>
      </body>
    </html>
  )
}

export default LocaleLayout
