'use client'

import React from 'react'
import { Streamdown } from 'streamdown'

interface ThinkBlockContentProps {
  markdownContent: string
  isOpen: boolean
}

export const ThinkBlockContent: React.FC<ThinkBlockContentProps> = ({
  markdownContent,
  isOpen,
}) => {
  return (
    <div
      id="think-block-content"
      className={`
        think-block-content overflow-hidden transition-all duration-300 ease-in-out
        ${isOpen
      ? 'max-h-[2000px] opacity-100 transform scale-100'
      : 'max-h-0 opacity-0 transform scale-95'
    }
      `}
    >
      <div className="rounded-md border bg-gray-50 border-gray-200 p-4 mb-2 text-sm text-gray-700">
        <Streamdown className="think-content">{markdownContent}</Streamdown>
      </div>
    </div>
  )
}
