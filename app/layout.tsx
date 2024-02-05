import { getLocaleOnServer } from '@/i18n/server'
import { Montserrat } from 'next/font/google'

import './styles/globals.css'
import './styles/markdown.scss'


const montserrat = Montserrat({
  weight: ['400', '500', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
})

const LocaleLayout = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const locale = getLocaleOnServer()
  return (
    <html lang={locale ?? 'en'} className={`h-full ${montserrat.className}`}>
      <body className="h-full">
        <div className="overflow-x-auto">
          <div className="w-screen h-screen min-w-[300px]">
            {children}
          </div>
        </div>
      </body>
    </html >
  )
}

export default LocaleLayout
