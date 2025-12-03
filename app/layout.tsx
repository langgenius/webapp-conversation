import { getLocaleOnServer } from '@/i18n/server'

import './styles/globals.css'
import './styles/markdown.scss'

export const runtime = 'edge'; // Cloudflare用

const LocaleLayout = async ({
  children,
}: {
  children: React.ReactNode
}) => {
  const locale = await getLocaleOnServer()
  return (
    <html lang={locale ?? 'ja'} className="h-full">
      <body className="h-full">
        {children}
      </body>
    </html>
  )
}

export default LocaleLayout
