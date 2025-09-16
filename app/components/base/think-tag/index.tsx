'use client'

import React from 'react'
import { useTranslation } from 'react-i18next'

interface ThinkTagProps {
  children?: React.ReactNode
  open?: boolean
  className?: string
}

export default function ThinkTag({ children, open, className }: ThinkTagProps) {
  const { t } = useTranslation()

  return (
    <details
      className={`group mt-2 mb-3 rounded border border-gray-200 bg-gray-50 pl-4 pr-3 pt-2 pb-2 ${className ?? ''}`}
      open={open}
    >
      <summary className="cursor-pointer select-none text-sm text-gray-500">
        <span className="group-open:hidden">{t('common.thinkTag.showReasoning')}</span>
        <span className="hidden group-open:inline">{t('common.thinkTag.hideReasoning')}</span>
      </summary>
      <div className="mt-2">
        {children}
      </div>
    </details>
  )
}
