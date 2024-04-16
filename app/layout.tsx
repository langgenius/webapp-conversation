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

export const metadata = {
  viewport: 'width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no',
  themeColor: '#3B9FDD',
}
export default LocaleLayout
