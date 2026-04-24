'use client'
import type { FC, ReactNode } from 'react'
import React from 'react'
import cn from 'classnames'
import { useTranslation } from 'react-i18next'
import { StarIcon } from '@/app/components//welcome/massive-component'
import Button from '@/app/components/base/button'

export interface ITemplateVarPanelProps {
  className?: string
  header: ReactNode
  children?: ReactNode | null
  isFold: boolean
}

const TemplateVarPanel: FC<ITemplateVarPanelProps> = ({
  className,
  header,
  children,
  isFold,
}) => {
  return (
    <div
      className={cn(className, 'rounded-2xl overflow-hidden')}
      style={{
        backgroundColor: '#1E1E1E',
        border: '1px solid rgba(197,160,89,0.15)',
        boxShadow: isFold ? 'none' : '0 16px 48px rgba(0,0,0,0.45), 0 0 0 1px rgba(197,160,89,0.10)',
      }}
    >
      {/* Header */}
      <div
        className={cn(isFold && 'rounded-b-2xl', 'rounded-t-2xl px-6 py-5')}
        style={{ backgroundColor: 'rgba(197,160,89,0.04)' }}
      >
        {header}
      </div>

      {/* Body */}
      {!isFold && children && (
        <div className="px-6 pb-6 pt-4">
          {children}
        </div>
      )}
    </div>
  )
}

export const PanelTitle: FC<{ title: string; className?: string }> = ({ title, className }) => {
  return (
    <div className={cn(className, 'flex items-center space-x-1.5')} style={{ color: '#C5A059' }}>
      <StarIcon />
      <span className="text-xs font-medium">{title}</span>
    </div>
  )
}

export const VarOpBtnGroup: FC<{
  className?: string
  onConfirm: () => void
  onCancel: () => void
}> = ({ className, onConfirm, onCancel }) => {
  const { t } = useTranslation()

  return (
    <div className={cn(className, 'flex mt-4 gap-2 mobile:ml-0 tablet:ml-[128px]')}>
      <button
        onClick={onConfirm}
        className="px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150 cursor-pointer"
        style={{ backgroundColor: '#C5A059', color: '#1A1200' }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#D4B574' }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#C5A059' }}
      >
        {t('common.operation.save')}
      </button>
      <button
        onClick={onCancel}
        className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer"
        style={{
          backgroundColor: 'rgba(255,255,255,0.05)',
          color: '#9A9A9A',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(255,255,255,0.08)' }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(255,255,255,0.05)' }}
      >
        {t('common.operation.cancel')}
      </button>
    </div>
  )
}

export default React.memo(TemplateVarPanel)
