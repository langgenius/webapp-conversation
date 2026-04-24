import type { FC } from 'react'
import React from 'react'
import { Bars3Icon, PencilSquareIcon } from '@heroicons/react/24/solid'
import AppIcon from '@/app/components/base/app-icon'
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'

export interface IHeaderProps {
  title: string
  isMobile?: boolean
  onShowSideBar?: () => void
  onCreateNewChat?: () => void
}

const Header: FC<IHeaderProps> = ({ title, isMobile, onShowSideBar, onCreateNewChat }) => {
  return (
    <div className="shrink-0 flex items-center justify-between h-14 px-3 pc:px-5 w-full relative z-50"
      style={{ backgroundColor: '#1C1C1C', borderBottom: '1px solid rgba(255,255,255,0.055)' }}
    >
      {/* Left: hamburger on mobile */}
      <div className="flex items-center justify-start w-10 pc:w-28 shrink-0">
        {isMobile && (
          <button
            className="flex items-center justify-center h-9 w-9 rounded-xl cursor-pointer transition-colors hover:bg-white/5"
            onClick={() => onShowSideBar?.()}
            aria-label="القائمة"
          >
            <Bars3Icon className="h-5 w-5" style={{ color: '#9A9A9A' }} />
          </button>
        )}
        {/* Desktop: subtle brand mark */}
        {!isMobile && (
          <span className="text-[11px] font-medium tracking-widest uppercase"
            style={{ color: '#C5A059', letterSpacing: '0.15em', opacity: 0.7 }}>
            Wealthy Mind
          </span>
        )}
      </div>

      {/* Center: app icon + title + badge */}
      <div className="flex items-center justify-center gap-2 flex-1 overflow-hidden">
        <div className="shrink-0">
          <AppIcon size="small" />
        </div>
        <span
          className="text-sm pc:text-[15px] font-semibold truncate"
          style={{ color: '#E8E8E8', letterSpacing: '0.01em' }}
        >
          {title}
        </span>
        <span
          className="shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded-full"
          style={{
            color: '#C5A059',
            backgroundColor: 'rgba(197,160,89,0.12)',
            border: '1px solid rgba(197,160,89,0.25)',
            letterSpacing: '0.06em',
          }}
        >
          BETA
        </span>
      </div>

      {/* Right: new chat (mobile) + auth */}
      <div className="flex items-center justify-end gap-2 w-10 pc:w-28 shrink-0">
        {isMobile && (
          <button
            className="flex items-center justify-center h-9 w-9 rounded-xl cursor-pointer transition-colors hover:bg-white/5"
            onClick={() => onCreateNewChat?.()}
            aria-label="محادثة جديدة"
          >
            <PencilSquareIcon className="h-5 w-5" style={{ color: '#9A9A9A' }} />
          </button>
        )}

        <SignedOut>
          <SignInButton mode="modal">
            <button className="login-btn cursor-pointer">دخول</button>
          </SignInButton>
        </SignedOut>

        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </div>
  )
}

export default React.memo(Header)
