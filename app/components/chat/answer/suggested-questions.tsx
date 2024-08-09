import type { FC } from 'react'
import React from 'react'
type SuggestedQuestionsProps = {
  suggestedQuestions: string[]
  onHandleSend: (message: string) => void
}
const SuggestedQuestions: FC<SuggestedQuestionsProps> = ({
  suggestedQuestions,
  onHandleSend,
}) => {
  return (
    <div className="flex flex-wrap">
      {suggestedQuestions
        .filter((q) => !!q && q.trim())
        .map((question, index) => (
          <div
            key={index}
            className="mt-1 mr-1 max-w-full last:mr-0 shrink-0 py-[5px] leading-[18px] items-center px-4 rounded-lg border border-gray-200 shadow-xs bg-white text-xs font-medium text-primary-600 cursor-pointer"
            onClick={() => onHandleSend(question)}
          >
            {question}
          </div>
        ))}
    </div>
  )
}

export default React.memo(SuggestedQuestions)
