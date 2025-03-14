import { getLocaleOnServer } from '@/i18n/server'

import './styles/globals.css'
import './styles/markdown.scss'

const LocaleLayout = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const locale = getLocaleOnServer()
  return (
    <html lang={locale ?? 'en'} className="h-full">
      <head>
        {/* 引入 CDN Web 字体 */}
        <link
          href="https://cdn.jsdelivr.net/npm/@chinese-fonts/lxgwwenkaibright@1.0.2/dist/LXGWBright-Medium/result.css"
          rel="stylesheet"
        />
      </head>
      <body className="h-full">
        <div className="overflow-x-auto">
          <div className="w-screen h-screen min-w-[300px]">
            {children}
          </div>
        </div>
      </body>
    </html>
  )
}

export default LocaleLayout
