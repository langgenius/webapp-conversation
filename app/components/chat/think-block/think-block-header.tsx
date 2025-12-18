'use client'

import React from 'react'
import { ChevronRightIcon } from '@heroicons/react/24/outline'
import { useTranslation } from 'react-i18next'

export type ThinkBlockStatus = 'thinking' | 'completed' | 'stopped'

interface ThinkBlockHeaderProps {
  status: ThinkBlockStatus
  isOpen: boolean
  onToggle: () => void
}

export const ThinkBlockHeader: React.FC<ThinkBlockHeaderProps> = ({
  status,
  isOpen,
  onToggle,
}) => {
  const { t } = useTranslation()
  const isThinking = status === 'thinking'

  const getStatusText = () => {
    switch (status) {
      case 'thinking':
        return t('common.operation.thinking') || 'Thinking...'
      case 'stopped':
        return t('common.operation.stopped') || 'Stopped'
      case 'completed':
      default:
        return t('common.operation.completed') || 'Thought for'
    }
  }

  const statusText = getStatusText()

  return (
    <button
      className={`
        flex items-center justify-between gap-2 w-fit
        mb-1 cursor-pointer rounded-md border px-3 py-1.5 text-sm
        transition-all duration-200 focus:outline-none
        ${isThinking
      ? 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100'
      : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
    }
      `}
      onClick={onToggle}
      aria-expanded={isOpen}
      aria-controls="think-block-content"
      aria-label={`${statusText} - ${isOpen ? 'Collapse' : 'Expand'} think block`}
    >
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <ChevronRightIcon
          className={`h-4 w-4 flex-shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-90' : 'rotate-0'
          }`}
        />
        <span className="min-w-0 flex-1 truncate font-medium">
          {statusText}
        </span>
      </div>

      <div className="h-4 w-4 flex-shrink-0">
        {isThinking && (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />
        )}
      </div>
    </button>
  )
}
