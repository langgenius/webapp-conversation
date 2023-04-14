'use client'
import type { FC } from 'react'
import React from 'react'
import { useTranslation } from 'react-i18next'

type IAppUnavailableProps = {
  isUnknwonReason: boolean
  errMessage?: string
}

const AppUnavailable: FC<IAppUnavailableProps> = ({
  isUnknwonReason,
  errMessage,
}) => {
  const { t } = useTranslation()
  let message = errMessage
  if (!errMessage) {
    message = (isUnknwonReason ? t('app.common.appUnkonwError') : t('app.common.appUnavailable')) as string
  }

  return (
    <div className='flex items-center justify-center w-screen h-screen'>
      <h1 className='mr-5 h-[50px] leading-[50px] pr-5 text-[24px] font-medium'
        style={{
          borderRight: '1px solid rgba(0,0,0,.3)',
        }}>{(errMessage || isUnknwonReason) ? 500 : 404}</h1>
      <div className='text-sm'>{message}</div>
    </div>
  )
}
export default React.memo(AppUnavailable)
