'use client'
import { Streamdown } from 'streamdown'
import 'katex/dist/katex.min.css'
import rehypeRaw from 'rehype-raw'

interface StreamdownMarkdownProps {
  content: string
  className?: string
}

export function StreamdownMarkdown({ content, className = '' }: StreamdownMarkdownProps) {
  return (
    <div className={`streamdown-markdown ${className}`}>
      <Streamdown rehypePlugins={[rehypeRaw]}>{content}</Streamdown>
    </div>
  )
}

export default StreamdownMarkdown
