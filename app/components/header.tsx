import type { FC } from 'react'
import React from 'react'
import {
  Bars3Icon,
  PencilSquareIcon,
} from '@heroicons/react/24/solid'
import AppIcon from '@/app/components/base/app-icon'
export interface IHeaderProps {
  title: string
  isMobile?: boolean
  onShowSideBar?: () => void
  onCreateNewChat?: () => void
}
const Header: FC<IHeaderProps> = ({
  title,
  isMobile,
  onShowSideBar,
  onCreateNewChat,
}) => {
  const [hasLogo, setHasLogo] = React.useState(false)

  React.useEffect(() => {
    const img = new Image()
    img.src = '/logo-header.png'
    img.onload = () => setHasLogo(true)
    img.onerror = () => setHasLogo(false)
  }, [])

  return (
    <div className="shrink-0 flex items-center justify-between h-14 px-4 bg-white border-b border-gray-200">
      <div className='flex items-center space-x-3'>
        {isMobile && (
          <div
            className='flex items-center justify-center h-8 w-8 cursor-pointer hover:bg-gray-100 rounded-lg transition-colors'
            onClick={() => onShowSideBar?.()}
          >
            <Bars3Icon className="h-5 w-5 text-gray-600" />
          </div>
        )}
        <div className='flex items-center space-x-2'>
          {hasLogo ? (
            <img src="/logo-header.png" alt={title} className="h-10" />
          ) : (
            <div className="text-xl text-gray-900 font-semibold">{title}</div>
          )}
        </div>
      </div>
      {isMobile && (
        <div className='flex items-center justify-center h-8 w-8 cursor-pointer hover:bg-gray-100 rounded-lg transition-colors' onClick={() => onCreateNewChat?.()} >
          <PencilSquareIcon className="h-5 w-5 text-gray-600" />
        </div>
      )}
    </div>
  )
}

export default React.memo(Header)
