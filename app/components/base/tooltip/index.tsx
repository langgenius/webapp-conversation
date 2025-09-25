'use client'
import classNames from 'classnames'
import type { FC } from 'react'
import React, { useState } from 'react'
import { PortalToFollowElem, PortalToFollowElemContent, PortalToFollowElemTrigger } from '@/app/components/base/portal-to-follow-elem'

interface TooltipProps {
  selector: string
  content?: string
  htmlContent?: React.ReactNode
  className?: string // This should use !impornant to override the default styles eg: '!bg-white'
  position?: 'top' | 'right' | 'bottom' | 'left'
  clickable?: boolean
  children: React.ReactNode
}

const arrow = (
  <svg className="absolute text-white h-2 w-full left-0 top-full" x="0px" y="0px" viewBox="0 0 255 255"><polygon className="fill-current" points="0,0 127.5,127.5 255,0"></polygon></svg>
)

const Tooltip: FC<TooltipProps> = ({
  selector,
  content,
  position = 'top',
  children,
  htmlContent,
  className,
  clickable,
}) => {
  const [open, setOpen] = useState(false)
  const triggerMethod = clickable ? 'click' : 'hover'

  return (
    <PortalToFollowElem
      open={open}
      onOpenChange={setOpen}
      placement={position}
      offset={10}
    >
      <PortalToFollowElemTrigger
        data-selector={selector}
        onClick={() => triggerMethod === 'click' && setOpen(v => !v)}
        onMouseEnter={() => triggerMethod === 'hover' && setOpen(true)}
        onMouseLeave={() => triggerMethod === 'hover' && setOpen(false)}
      >
        {children}
      </PortalToFollowElemTrigger>
      <PortalToFollowElemContent className="z-[999]">
        <div className={classNames('relative px-3 py-2 text-xs font-normal text-gray-700 bg-white rounded-md shadow-lg', className)}>
          {htmlContent ?? content}
          {arrow}
        </div>
      </PortalToFollowElemContent>
    </PortalToFollowElem>
  )
}

export default Tooltip
