'use client'
import { Streamdown } from 'streamdown'
import 'katex/dist/katex.min.css'

interface StreamdownMarkdownProps {
  content: string
  className?: string
}

export function StreamdownMarkdown({ content, className = '' }: StreamdownMarkdownProps) {
  return (
    <div className={`streamdown-markdown ${className}`}>
      <Streamdown>{content}</Streamdown>
    </div>
  )
}

export default StreamdownMarkdown
