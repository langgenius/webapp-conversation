'use client'
import ThinkTag from '@/app/components/base/think-tag'

interface StreamdownMarkdownProps {
  content: string
  className?: string
}

export function StreamdownMarkdown({ content, className = '' }: StreamdownMarkdownProps) {
  return (
    <div className={`streamdown-markdown ${className}`}>
      <ThinkTag content={content} />
    </div>
  )
}

export default StreamdownMarkdown

// Keep Streamdown import usage to retain markdown rendering for non-think content if needed elsewhere
