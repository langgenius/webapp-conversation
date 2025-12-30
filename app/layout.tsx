import { getLocaleOnServer } from '@/i18n/server'
import { Cairo } from 'next/font/google'
import './styles/globals.css'
import './styles/markdown.scss'

const cairo = Cairo({ subsets: ['latin', 'arabic'], weight: ['400', '700'] })

const LocaleLayout = async ({
  children,
}: {
  children: React.ReactNode
}) => {
  const locale = await getLocaleOnServer()
  return (
    <html lang={locale ?? 'en'} className={`h-full ${cairo.className}`}>
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
