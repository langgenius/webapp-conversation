'use client'
import { Streamdown } from '@mixtint/streamdown'
import 'katex/dist/katex.min.css'
import React, { useMemo, useState } from 'react'
import Button from '@/app/components/base/button'

interface StreamdownMarkdownProps {
  content: string
  className?: string
}

// Rehype plugin to convert <think> tags to <summary>
const rehypeThinkToSummary = () => (tree: unknown) => {
  const visitNode = (node: unknown): void => {
    if (typeof node !== 'object' || node === null) { return }
    const record = node as Record<string, unknown>

    const typeValue = record.type
    const tagNameValue = record.tagName

    if (
      typeValue === 'element'
      && typeof tagNameValue === 'string'
      && tagNameValue.toLowerCase() === 'think'
    ) {
      record.tagName = 'summary'
    }

    const children = record.children
    if (Array.isArray(children)) {
      for (const child of children) { visitNode(child) }
    }
  }

  visitNode(tree)
}

export function StreamdownMarkdown({ content, className = '' }: StreamdownMarkdownProps) {
  const [showReasoning, setShowReasoning] = useState(false)
  const hasReasoning = useMemo(() => {
    if (!content) { return false }
    const lower = content.toLowerCase()
    return lower.includes('<think') || lower.includes('<summary')
  }, [content])

  return (
    <div className={`streamdown-markdown ${className}`} data-reasoning-visible={showReasoning ? '1' : '0'}>
      {hasReasoning && (
        <div className='mb-2'>
          <Button
            type='link'
            className='!h-7 !px-2 !py-1 !text-xs'
            onClick={() => setShowReasoning(v => !v)}
          >
            {showReasoning ? 'Hide reasoning' : 'Show reasoning'}
          </Button>
        </div>
      )}
      <Streamdown
        rehypePlugins={[
          rehypeThinkToSummary,
        ]}
      >
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
