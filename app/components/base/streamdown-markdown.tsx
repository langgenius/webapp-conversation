'use client'
import React, { useState, useEffect, useMemo } from 'react'
import { Streamdown } from 'streamdown'
import type { ThinkBlockStatus } from '@/app/components/chat/think-block'
import { ThinkBlockHeader, ThinkBlockContent } from '@/app/components/chat/think-block'
import 'katex/dist/katex.min.css'

interface StreamdownMarkdownProps {
  content: string
  className?: string
  isStreaming?: boolean
}

// Maximum characters allowed before think/details block
const MAX_CHARS_BEFORE_BLOCK = 10

const extractThinkContent = (
  rawContent: string,
): {
  hasThinkBlock: boolean
  thinkContent: string
  mainContent: string
  thinkClosed: boolean
} => {
  // Support both <think> and <details> tags
  const thinkStartTag = '<think>'
  const thinkEndTag = '</think>'

  // Check for <think> tag
  const thinkStartIndex = rawContent.indexOf(thinkStartTag)
  if (thinkStartIndex !== -1) {
    // Allow limited characters before <think>
    const contentBeforeThink = rawContent.substring(0, thinkStartIndex).trim()
    const isThinkAtEffectiveStart
      = thinkStartIndex === 0
        || contentBeforeThink.length === 0
        || contentBeforeThink.length <= MAX_CHARS_BEFORE_BLOCK

    if (isThinkAtEffectiveStart) {
      const thinkContentStart = thinkStartIndex + thinkStartTag.length
      const endTagIndex = rawContent.indexOf(thinkEndTag, thinkContentStart)

      if (endTagIndex !== -1) {
        const thinkContent = rawContent.substring(thinkContentStart, endTagIndex)
        const mainContent = rawContent.substring(endTagIndex + thinkEndTag.length)
        return {
          hasThinkBlock: true,
          thinkContent,
          mainContent,
          thinkClosed: true,
        }
      }

      // Unclosed <think> tag
      const thinkContent = rawContent.substring(thinkContentStart)
      return {
        hasThinkBlock: true,
        thinkContent,
        mainContent: '',
        thinkClosed: false,
      }
    }
  }

  // Check for <details> tag
  const detailsStartRegex = /<details(?:\s[^>]*)?>/i
  const detailsMatch = rawContent.match(detailsStartRegex)

  if (detailsMatch) {
    const detailsStartIndex = rawContent.indexOf(detailsMatch[0])
    const contentBeforeDetails = rawContent.substring(0, detailsStartIndex).trim()
    const isDetailsAtEffectiveStart
      = detailsStartIndex === 0
        || contentBeforeDetails.length === 0
        || contentBeforeDetails.length <= MAX_CHARS_BEFORE_BLOCK

    if (isDetailsAtEffectiveStart) {
      const detailsStartTag = detailsMatch[0]
      const detailsEndTag = '</details>'
      const detailsContentStart = detailsStartIndex + detailsStartTag.length
      const endTagIndex = rawContent.indexOf(detailsEndTag, detailsContentStart)

      if (endTagIndex !== -1) {
        // Extract content inside <details>, remove <summary> if present
        let detailsContent = rawContent.substring(detailsContentStart, endTagIndex)
        const summaryRegex = /<summary[^>]*>[\s\S]*?<\/summary>/i
        detailsContent = detailsContent.replace(summaryRegex, '').trim()

        const mainContent = rawContent.substring(endTagIndex + detailsEndTag.length)
        return {
          hasThinkBlock: true,
          thinkContent: detailsContent,
          mainContent,
          thinkClosed: true,
        }
      }

      // Unclosed <details> tag
      let detailsContent = rawContent.substring(detailsContentStart)
      const summaryRegex = /<summary[^>]*>[\s\S]*?<\/summary>/i
      detailsContent = detailsContent.replace(summaryRegex, '').trim()

      return {
        hasThinkBlock: true,
        thinkContent: detailsContent,
        mainContent: '',
        thinkClosed: false,
      }
    }
  }

  // No think block found
  return {
    hasThinkBlock: false,
    thinkContent: '',
    mainContent: rawContent,
    thinkClosed: false,
  }
}

export function StreamdownMarkdown({
  content,
  className = '',
  isStreaming = false,
}: StreamdownMarkdownProps) {
  const [isOpen, setIsOpen] = useState(false)

  const { hasThinkBlock, thinkContent, mainContent, thinkClosed } = useMemo(
    () => extractThinkContent(content),
    [content],
  )

  // Determine think block status
  const thinkStatus: ThinkBlockStatus = useMemo(() => {
    if (!hasThinkBlock) { return 'completed' }
    if (isStreaming && !thinkClosed) { return 'thinking' }
    return 'completed'
  }, [hasThinkBlock, isStreaming, thinkClosed])

  // Auto-expand think block when it starts streaming
  useEffect(() => {
    if (hasThinkBlock && thinkStatus === 'thinking' && !isOpen) {
      setIsOpen(true)
    }
  }, [hasThinkBlock, thinkStatus, isOpen])

  const toggleOpen = () => setIsOpen(!isOpen)

  return (
    <div className={`streamdown-markdown ${className}`}>
      {hasThinkBlock && (
        <>
          <ThinkBlockHeader
            status={thinkStatus}
            isOpen={isOpen}
            onToggle={toggleOpen}
          />
          <ThinkBlockContent
            markdownContent={thinkContent}
            isOpen={isOpen}
          />
        </>
      )}

      {mainContent && (
        <div className="main-content">
          <Streamdown>{mainContent}</Streamdown>
        </div>
      )}

      {!hasThinkBlock && !mainContent && (
        <Streamdown>{content}</Streamdown>
      )}
    </div>
  )
}

export default StreamdownMarkdown
