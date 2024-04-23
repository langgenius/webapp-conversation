'use client'
import type { FC } from 'react'
import React, { useCallback } from 'react'
import Expand04 from '@/app/components/base/icons/solid/expand-04'
import Collapse04 from '@/app/components/base/icons/line/arrows/collapse-04'

type Props = {
  isExpand: boolean
  onExpandChange: (isExpand: boolean) => void
}

const ExpandBtn: FC<Props> = ({
  isExpand,
  onExpandChange,
}) => {
  const handleToggle = useCallback(() => {
    onExpandChange(!isExpand)
  }, [isExpand])

  const Icon = isExpand ? Collapse04 : Expand04
  return (
    <Icon className='w-3.5 h-3.5 text-gray-500 cursor-pointer' onClick={handleToggle} />
  )
}
export default React.memo(ExpandBtn)
