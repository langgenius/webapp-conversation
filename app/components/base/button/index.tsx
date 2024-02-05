import type { FC, MouseEventHandler } from 'react'
import React from 'react'
import Spinner from '@/app/components/base/spinner'

export type IButtonProps = {
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
    case 'primary':
      style = (disabled || loading) ? 'bg-[#101A3C] cursor-not-allowed text-white' : 'bg-[#101A3C] hover:bg-[#101A3C] hover:shadow-md cursor-pointer text-white hover:shadow-sm'
      break
    default:
      style = disabled ? 'border-solid border border-[#444654] bg-gray-200 cursor-not-allowed text-gray-800' : 'border-solid border border-[#444654] cursor-pointer text-gray-500 hover:bg-[#414C6F] hover:shadow-sm'
      break
  }

  return (
    <div
      className={`flex justify-center items-center content-center leading-5 rounded-lg px-4 py-2 text-white ${style} ${className && className}`}
      onClick={disabled ? undefined : onClick}
    >
      {children}
      {/* Spinner is hidden when loading is false */}
      <Spinner loading={loading} className='!text-white !h-3 !w-3 !border-2 !ml-1' />
    </div>
  )
}

export default React.memo(Button)
