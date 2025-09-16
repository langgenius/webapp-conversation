'use client'
import { Streamdown } from 'streamdown'

interface ThinkTagProps {
  content: string
}

type Segment
  = | { type: 'text', text: string }
    | { type: 'think', text: string, unclosed: boolean }

export default function ThinkTag({ content }: ThinkTagProps) {
  const segments = splitThinkSegments(content)
  return (
    <>
      {segments.map((seg, idx) => {
        if (seg.type === 'text') {
          return <Streamdown key={`seg-text-${idx}`}>{seg.text}</Streamdown>
        }
        return (
          <details
            key={`seg-think-${idx}`}
            className="group mt-2 mb-3 rounded border border-gray-200 bg-gray-50 pl-4 pr-3 pt-2 pb-2"
            open={seg.unclosed}
          >
            <summary className="cursor-pointer select-none text-sm text-gray-500">
              <span className="group-open:hidden">Show reasoning</span>
              <span className="hidden group-open:inline">Hide reasoning</span>
            </summary>
            <div className="mt-2">
              <Streamdown>{seg.text}</Streamdown>
            </div>
          </details>
        )
      })}
    </>
  )
}

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
