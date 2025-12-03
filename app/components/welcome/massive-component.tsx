'use client'
import type { FC } from 'react'
import React from 'react'
import cn from 'classnames'
import { useTranslation } from 'react-i18next'
import {
  PencilIcon,
} from '@heroicons/react/24/solid'
import s from './style.module.css'
import type { AppInfo } from '@/types/app'
import Button from '@/app/components/base/button'

export const AppInfoComp: FC<{ siteInfo: AppInfo }> = ({ siteInfo }) => {
  const { t } = useTranslation()
  return (
    <div className='space-y-1'>
      <div className='flex items-center space-x-2 text-xl font-light text-gray-800'>
        <span>{t('app.common.welcome')}</span>
        <span className='font-bold text-gray-900'>{siteInfo.title}</span>
        <span>{t('app.common.welcomeSuffix')}</span>
        <span className='text-4xl'>👋</span>
      </div>
      {siteInfo.description && (
        <p className='text-base text-gray-600 max-w-2xl leading-relaxed'>{siteInfo.description}</p>
      )}
    </div>
  )
}

export const PromptTemplate: FC<{ html: string }> = ({ html }) => {
  return (
    <div
      className={' box-border text-sm text-gray-700'}
      dangerouslySetInnerHTML={{ __html: html }}
    ></div>
  )
}

export const StarIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2.75 1C2.75 0.723858 2.52614 0.5 2.25 0.5C1.97386 0.5 1.75 0.723858 1.75 1V1.75H1C0.723858 1.75 0.5 1.97386 0.5 2.25C0.5 2.52614 0.723858 2.75 1 2.75H1.75V3.5C1.75 3.77614 1.97386 4 2.25 4C2.52614 4 2.75 3.77614 2.75 3.5V2.75H3.5C3.77614 2.75 4 2.52614 4 2.25C4 1.97386 3.77614 1.75 3.5 1.75H2.75V1Z" fill="#444CE7" />
    <path d="M2.75 8.5C2.75 8.22386 2.52614 8 2.25 8C1.97386 8 1.75 8.22386 1.75 8.5V9.25H1C0.723858 9.25 0.5 9.47386 0.5 9.75C0.5 10.0261 0.723858 10.25 1 10.25H1.75V11C1.75 11.2761 1.97386 11.5 2.25 11.5C2.52614 11.5 2.75 11.2761 2.75 11V10.25H3.5C3.77614 10.25 4 10.0261 4 9.75C4 9.47386 3.77614 9.25 3.5 9.25H2.75V8.5Z" fill="#444CE7" />
    <path d="M6.96667 1.32051C6.8924 1.12741 6.70689 1 6.5 1C6.29311 1 6.10759 1.12741 6.03333 1.32051L5.16624 3.57494C5.01604 3.96546 4.96884 4.078 4.90428 4.1688C4.8395 4.2599 4.7599 4.3395 4.6688 4.40428C4.578 4.46884 4.46546 4.51604 4.07494 4.66624L1.82051 5.53333C1.62741 5.60759 1.5 5.79311 1.5 6C1.5 6.20689 1.62741 6.39241 1.82051 6.46667L4.07494 7.33376C4.46546 7.48396 4.578 7.53116 4.6688 7.59572C4.7599 7.6605 4.8395 7.7401 4.90428 7.8312C4.96884 7.922 5.01604 8.03454 5.16624 8.42506L6.03333 10.6795C6.1076 10.8726 6.29311 11 6.5 11C6.70689 11 6.89241 10.8726 6.96667 10.6795L7.83376 8.42506C7.98396 8.03454 8.03116 7.922 8.09572 7.8312C8.1605 7.7401 8.2401 7.6605 8.3312 7.59572C8.422 7.53116 8.53454 7.48396 8.92506 7.33376L11.1795 6.46667C11.3726 6.39241 11.5 6.20689 11.5 6C11.5 5.79311 11.3726 5.60759 11.1795 5.53333L8.92506 4.66624C8.53454 4.51604 8.422 4.46884 8.3312 4.40428C8.2401 4.3395 8.1605 4.2599 8.09572 4.1688C8.03116 4.078 7.98396 3.96546 7.83376 3.57494L6.96667 1.32051Z" fill="#444CE7" />
  </svg>
)

export const ChatBtn: FC<{ onClick: () => void, className?: string }> = ({
  className,
  onClick,
}) => {
  const { t } = useTranslation()
  return (
    <button
      className={cn(
        className,
        'group px-8 py-4 bg-gradient-to-r from-[#E4DFFF] to-[#E1FFF5]',
        'text-gray-900 font-medium text-base rounded-full',
        'hover:shadow-lg hover:scale-105 transition-all duration-200',
        'flex items-center space-x-3'
      )}
      onClick={onClick}
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M18 10C18 13.866 14.418 17 10 17C8.58005 17.006 7.17955 16.6698 5.917 16.02L2 17L3.338 13.877C2.493 12.767 2 11.434 2 10C2 6.134 5.582 3 10 3C14.418 3 18 6.134 18 10ZM7 9H5V11H7V9ZM15 9H13V11H15V9ZM9 9H11V11H9V9Z" fill="currentColor" />
      </svg>
      <span>{t('app.chat.startChat')}</span>
    </button>
  )
}

export const EditBtn = ({ className, onClick }: { className?: string, onClick: () => void }) => {
  const { t } = useTranslation()

  return (
    <button
      className={cn(
        'px-4 py-2 flex space-x-2 items-center rounded-full',
        'text-gray-700 text-sm font-medium',
        'hover:bg-gray-100 transition-colors duration-200',
        'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      <PencilIcon className='w-4 h-4' />
      <span>{t('common.operation.edit')}</span>
    </button>
  )
}

export const FootLogo = () => (
  <div className={s.logo} />
)
