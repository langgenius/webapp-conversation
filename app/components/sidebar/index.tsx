import React from 'react'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import {
  ChatBubbleOvalLeftEllipsisIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/outline'
import { ChatBubbleOvalLeftEllipsisIcon as ChatBubbleOvalLeftEllipsisSolidIcon } from '@heroicons/react/24/solid'
import Button from '@/app/components/base/button'
import type { ConversationItem } from '@/types/app'

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}

const MAX_CONVERSATION_LENTH = 20

export interface ISidebarProps {
  copyRight: string
  currentId: string
  onCurrentIdChange: (id: string) => void
  list: ConversationItem[]
}

/* ── SVG Icons ── */
const TelegramIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248-1.97 9.289c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L6.88 14.07l-2.948-.924c-.64-.203-.654-.64.136-.953l11.57-4.461c.537-.194 1.006.131.924.516z"/>
  </svg>
)

const PhoneIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.01 1.18 2 2 0 012 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14.92z"/>
  </svg>
)

const CalendarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
)

const Sidebar: FC<ISidebarProps> = ({
  copyRight,
  currentId,
  onCurrentIdChange,
  list,
}) => {
  const { t } = useTranslation()

  return (
    <div
      className="shrink-0 flex flex-col overflow-y-auto pc:w-[244px] tablet:w-[192px] mobile:w-[240px] tablet:h-[calc(100vh_-_3rem)] mobile:h-[calc(100vh_-_3rem)]"
      style={{ backgroundColor: '#161616', borderRight: '1px solid rgba(255,255,255,0.055)' }}
    >
      {/* ── New Chat Button ── */}
      {list.length < MAX_CONVERSATION_LENTH && (
        <div className="p-3 pb-2">
          <button
            onClick={() => onCurrentIdChange('-1')}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer group"
            style={{
              color: '#C5A059',
              backgroundColor: 'rgba(197,160,89,0.08)',
              border: '1px solid rgba(197,160,89,0.18)',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(197,160,89,0.14)'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(197,160,89,0.08)'
            }}
          >
            <PencilSquareIcon className="h-4 w-4 shrink-0" />
            <span>{t('app.chat.newChat')}</span>
          </button>
        </div>
      )}

      {/* ── Section label ── */}
      {list.length > 0 && (
        <div className="px-4 pt-2 pb-1">
          <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#5A5A5A', letterSpacing: '0.12em' }}>
            المحادثات
          </span>
        </div>
      )}

      {/* ── Conversation List ── */}
      <nav className="flex-1 px-3 pb-2 space-y-0.5 overflow-y-auto overflow-x-hidden">
        {list.map((item, index) => {
          const isCurrent = item.id === currentId
          const ItemIcon = isCurrent
            ? ChatBubbleOvalLeftEllipsisSolidIcon
            : ChatBubbleOvalLeftEllipsisIcon

          return (
            <div
              key={item.id}
              onClick={() => onCurrentIdChange(item.id)}
              className="group flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-sm cursor-pointer transition-all duration-150"
              style={{
                backgroundColor: isCurrent ? 'rgba(197,160,89,0.10)' : 'transparent',
                borderLeft: isCurrent ? '2px solid #C5A059' : '2px solid transparent',
                color: isCurrent ? '#C5A059' : '#9A9A9A',
              }}
              onMouseEnter={e => {
                if (!isCurrent)
                  (e.currentTarget as HTMLDivElement).style.backgroundColor = 'rgba(255,255,255,0.04)'
              }}
              onMouseLeave={e => {
                if (!isCurrent)
                  (e.currentTarget as HTMLDivElement).style.backgroundColor = 'transparent'
              }}
            >
              <ItemIcon className="h-4 w-4 shrink-0 opacity-70" />
              <span className="truncate font-medium leading-snug" dir="auto">
                {item.name && item.name.trim() !== '' && item.name !== 'New chat'
                  ? item.name
                  : `محادثة ${list.length - index}`}
              </span>
            </div>
          )
        })}

        {list.length === 0 && (
          <div className="py-8 text-center" style={{ color: '#5A5A5A' }}>
            <ChatBubbleOvalLeftEllipsisIcon className="h-8 w-8 mx-auto mb-2 opacity-30" />
            <p className="text-xs">لا توجد محادثات بعد</p>
          </div>
        )}
      </nav>

      {/* ── CTA Section ── */}
      <div className="px-3 pt-3 pb-2" style={{ borderTop: '1px solid rgba(255,255,255,0.055)' }}>
        <p className="text-[10px] font-semibold uppercase tracking-widest mb-2.5 px-1"
          style={{ color: '#5A5A5A', letterSpacing: '0.12em' }}>
          تواصل معنا
        </p>

        <div className="space-y-1.5">
          {/* Challenge */}
          <a
            href="https://wealthymindme.com/Challenge-bt"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group"
            style={{
              color: '#C5A059',
              backgroundColor: 'rgba(197,160,89,0.06)',
              border: '1px solid rgba(197,160,89,0.15)',
              textDecoration: 'none',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.backgroundColor = 'rgba(197,160,89,0.13)'
              el.style.borderColor = 'rgba(197,160,89,0.30)'
              el.style.transform = 'translateY(-1px)'
              el.style.boxShadow = '0 4px 12px rgba(197,160,89,0.15)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.backgroundColor = 'rgba(197,160,89,0.06)'
              el.style.borderColor = 'rgba(197,160,89,0.15)'
              el.style.transform = 'translateY(0)'
              el.style.boxShadow = 'none'
            }}
          >
            <CalendarIcon />
            <span dir="rtl">انضم في التحدي القادم</span>
          </a>

          {/* Free Call */}
          <a
            href="https://wealthymindme.com/call"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
            style={{
              color: '#C5A059',
              backgroundColor: 'rgba(197,160,89,0.06)',
              border: '1px solid rgba(197,160,89,0.15)',
              textDecoration: 'none',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.backgroundColor = 'rgba(197,160,89,0.13)'
              el.style.borderColor = 'rgba(197,160,89,0.30)'
              el.style.transform = 'translateY(-1px)'
              el.style.boxShadow = '0 4px 12px rgba(197,160,89,0.15)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.backgroundColor = 'rgba(197,160,89,0.06)'
              el.style.borderColor = 'rgba(197,160,89,0.15)'
              el.style.transform = 'translateY(0)'
              el.style.boxShadow = 'none'
            }}
          >
            <PhoneIcon />
            <span dir="rtl">استشارة استكشافية مجانية</span>
          </a>

          {/* Telegram */}
          <a
            href="https://t.me/wealthvibrations"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
            style={{
              color: '#C5A059',
              backgroundColor: 'rgba(197,160,89,0.06)',
              border: '1px solid rgba(197,160,89,0.15)',
              textDecoration: 'none',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.backgroundColor = 'rgba(197,160,89,0.13)'
              el.style.borderColor = 'rgba(197,160,89,0.30)'
              el.style.transform = 'translateY(-1px)'
              el.style.boxShadow = '0 4px 12px rgba(197,160,89,0.15)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.backgroundColor = 'rgba(197,160,89,0.06)'
              el.style.borderColor = 'rgba(197,160,89,0.15)'
              el.style.transform = 'translateY(0)'
              el.style.boxShadow = 'none'
            }}
          >
            <TelegramIcon />
            <span dir="rtl">قناة التلغرام</span>
          </a>
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="px-4 py-3 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <p className="text-[11px]" style={{ color: '#3A3A3A' }}>
          © Wealthy Mind {new Date().getFullYear()}
        </p>
      </div>
    </div>
  )
}

export default React.memo(Sidebar)
