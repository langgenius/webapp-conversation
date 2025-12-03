import type { FC, MouseEventHandler } from 'react'
import React from 'react'
import Spinner from '@/app/components/base/spinner'

export interface IButtonProps {
  type?: string
  className?: string
  disabled?: boolean
  loading?: boolean
  children: React.ReactNode
  onClick?: MouseEventHandler<HTMLDivElement>
}

const Button: FC<IButtonProps> = ({
  type,
  disabled,
  children,
  className,
  onClick,
  loading = false,
}) => {
  let style = 'cursor-pointer'
  switch (type) {
    case 'link':
      style = disabled ? 'border border-gray-300 bg-gray-100 cursor-not-allowed text-gray-500' : 'border border-gray-300 cursor-pointer text-blue-600 bg-white hover:bg-gray-50 hover:border-gray-400 transition-all'
      break
    case 'primary':
      style = (disabled || loading) ? 'bg-gradient-to-r from-accent-purple to-accent-mint opacity-100 cursor-not-allowed text-gray-900' : 'bg-gradient-to-r from-accent-purple to-accent-mint hover:shadow-lg hover:scale-105 cursor-pointer text-gray-900 transition-all duration-200'
      break
    default:
      style = disabled ? 'border border-gray-300 bg-gray-100 cursor-not-allowed text-gray-500' : 'border border-gray-300 cursor-pointer text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all'
      break
  }

  return (
    <div
      className={`flex justify-center items-center content-center h-10 leading-5 rounded-full px-6 py-2.5 text-base font-medium ${style} ${className && className}`}
      onClick={disabled ? undefined : onClick}
    >
      {children}
      {/* Spinner is hidden when loading is false */}
      <Spinner loading={loading} className='!text-white !h-3 !w-3 !border-2 !ml-1' />
    </div>
  )
}

export default React.memo(Button)
