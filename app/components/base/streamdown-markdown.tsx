'use client'
import { Streamdown } from 'streamdown'
import 'katex/dist/katex.min.css'

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
  return (
    <div className={`streamdown-markdown ${className}`}>
      <Streamdown
        rehypePlugins={[
          rehypeThinkToSummary,
        ]}
      >
        {content}
      </Streamdown>
    </div>
  )
}

export default StreamdownMarkdown
