import { useEffect, useRef, useState } from 'react'

export const useScrollToBottom = <T>(dependency: T) => {
  const listRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isAutoScroll, setIsAutoScroll] = useState(true)
  const isScrolledByCode = useRef(false)

  const handleScroll = (e: any) => {
    if (isScrolledByCode.current) {
      return
    }
    const { scrollTop, scrollHeight, clientHeight } = e.target
    const isBottom = scrollHeight - scrollTop - clientHeight < 50
    setIsAutoScroll(isBottom)
  }

  const scrollToBottom = () => {
    setIsAutoScroll(true)
    isScrolledByCode.current = true
    if (listRef.current) {
      listRef.current.scrollIntoView({
        behavior: 'auto',
        block: 'end',
      })
    }
    setTimeout(() => {
      isScrolledByCode.current = false
    }, 100)
  }

  useEffect(() => {
    if (listRef.current && isAutoScroll) {
      isScrolledByCode.current = true
      const timeoutId = setTimeout(() => {
        if (listRef.current) {
          listRef.current.scrollIntoView({
            behavior: 'auto',
            block: 'end',
          })
        }
        // Reset the flag after scroll animation is likely finished
        setTimeout(() => {
          isScrolledByCode.current = false
        }, 100)
      }, 50)
      return () => clearTimeout(timeoutId)
    }
  }, [dependency, isAutoScroll])

  return {
    scrollRef,
    listRef,
    handleScroll,
    scrollToBottom,
    isAutoScroll,
    setIsAutoScroll,
  }
}
