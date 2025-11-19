'use client'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import StreamdownMarkdown from '@/app/components/base/streamdown-markdown'
import LoadingAnim from '../loading-anim'

export interface ThinkBlockProps {
  content: string
  isStreaming?: boolean
}

const ThinkBlock = ({ content, isStreaming }: ThinkBlockProps) => {
  const { t } = useTranslation()
  const [isCollapsed, setIsCollapsed] = useState(false)

  // Auto-expand when streaming starts, but allow user to collapse
  // If content is empty (just started), keep it expanded
  // Logic: If streaming and not manually collapsed, show it.
  // But for simplicity, let's default to expanded.

  return (
    <div className="my-2 border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
      <div
        className="flex items-center justify-between px-3 py-2 cursor-pointer bg-gray-100 hover:bg-gray-200 transition-colors"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-center gap-2 text-xs font-medium text-gray-600 uppercase tracking-wider">
          {isStreaming && <LoadingAnim type="text" />}
          <span>Thinking Process</span>
        </div>
        <div className="text-gray-500">
          {isCollapsed ? <ChevronRightIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />}
        </div>
      </div>

      {!isCollapsed && (
        <div className="p-3 text-gray-600 text-sm bg-gray-50/50">
          <StreamdownMarkdown content={content} />
        </div>
      )}
    </div>
  )
}

export default ThinkBlock
