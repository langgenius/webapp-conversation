'use client'
import { Streamdown } from 'streamdown'
import ThinkTag from '@/app/components/base/think-tag'

interface StreamdownMarkdownProps {
  content: string
  className?: string
}

export function StreamdownMarkdown({ content, className = '' }: StreamdownMarkdownProps) {
  const segments = splitThinkSegments(content)
  return (
    <div className={`streamdown-markdown ${className}`}>
      {segments.map((seg, idx) => {
        if (seg.type === 'text') {
          return (
            <Streamdown key={`seg-text-${idx}`}>
              {seg.text}
            </Streamdown>
          )
        }
        return (
          <ThinkTag key={`seg-think-${idx}`} open={seg.unclosed}>
            <Streamdown>
              {seg.text}
            </Streamdown>
          </ThinkTag>
        )
      })}
    </div>
  )
}

export default StreamdownMarkdown

type Segment
  = | { type: 'text', text: string }
    | { type: 'think', text: string, unclosed: boolean }

function splitThinkSegments(input: string): Segment[] {
  const segments: Segment[] = []
  const openRe = /<think\b[^>]*>/gi
  const closeRe = /<\/think\b[^>]*>/gi

  let cursor = 0
  while (cursor < input.length) {
    openRe.lastIndex = cursor
    const openMatch = openRe.exec(input)
    if (!openMatch) {
      const remainder = input.slice(cursor)
      if (remainder) { segments.push({ type: 'text', text: remainder }) }
      break
    }

    const openIdx = openMatch.index
    const openEnd = openIdx + openMatch[0].length
    if (openIdx > cursor) {
      segments.push({ type: 'text', text: input.slice(cursor, openIdx) })
    }

    closeRe.lastIndex = openEnd
    const closeMatch = closeRe.exec(input)
    if (!closeMatch) {
      const inner = input.slice(openEnd)
      segments.push({ type: 'think', text: inner, unclosed: true })
      break
    }

    const closeIdx = closeMatch.index
    const closeEnd = closeIdx + closeMatch[0].length
    const inner = input.slice(openEnd, closeIdx)
    segments.push({ type: 'think', text: inner, unclosed: false })
    cursor = closeEnd
  }

  return segments
}
