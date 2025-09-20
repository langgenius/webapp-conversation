'use client'
import { Streamdown } from '@mixtint/streamdown'
import 'katex/dist/katex.min.css'
import React, { useMemo, useState } from 'react'
import Button from '@/app/components/base/button'

interface StreamdownMarkdownProps {
  content: string
  className?: string
}

export function StreamdownMarkdown({ content, className = '' }: StreamdownMarkdownProps) {
  const [showReasoning, setShowReasoning] = useState(false)

  const { hasReasoning, shouldShowReasoning } = useMemo(() => {
    if (!content) { return { hasReasoning: false, shouldShowReasoning: false } }

    const lower = content.toLowerCase()
    const hasReasoningContent = lower.includes('<think')

    // Check if we have complete reasoning blocks (with closing tags)
    const hasCompleteThink = lower.includes('<think') && lower.includes('</think>')

    // Show reasoning by default if we don't have complete closing tags yet (streaming in progress)
    const shouldAutoShow = hasReasoningContent && !hasCompleteThink

    return {
      hasReasoning: hasReasoningContent,
      shouldShowReasoning: shouldAutoShow,
    }
  }, [content])

  // Auto-show reasoning when streaming and no closing tags found
  const effectiveShowReasoning = showReasoning || shouldShowReasoning

  return (
    <div className={`streamdown-markdown ${className}`} data-reasoning-visible={effectiveShowReasoning ? '1' : '0'}>
      {hasReasoning && (
        <div className='mb-2'>
          <Button
            type='link'
            className='!h-7 !px-2 !py-1 !text-xs'
            onClick={() => setShowReasoning(v => !v)}
          >
            {effectiveShowReasoning ? 'Hide reasoning' : 'Show reasoning'}
          </Button>
        </div>
      )}
      <Streamdown>
        {content}
      </Streamdown>
      <style jsx global>{`
        .streamdown-markdown[data-reasoning-visible="0"] summary { display: none; }
        .streamdown-markdown summary {
          display: block;
          padding-left: 1rem;
          margin-bottom: 0.5rem;
          cursor: pointer;
        }
      `}</style>
    </div>
  )
}

export default StreamdownMarkdown
