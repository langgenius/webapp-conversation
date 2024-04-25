import type { FC } from 'react'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import type { OnSuggestSend } from '../type'
import Button from '@/app/components/base/button'
import { TryToAskIcon} from '../icon-component'

type TryToAskProps = {
  suggestList: string[]
  OnSuggestSend: OnSuggestSend
}
const TryToAsk: FC<TryToAskProps> = ({
  suggestList,
  OnSuggestSend,
}) => {
  const { t } = useTranslation()

  return (
    <div>
      <div className='flex items-center mb-2.5 py-2'>
        <div className='grow h-[1px]' style={{background: 'linear-gradient(270deg, #F3F4F6 0%, rgba(243, 244, 246, 0) 100%)'}}/>
        <div className='shrink-0 flex items-center px-3 text-gray-500'>
          {TryToAskIcon}
          <span className='text-xs text-gray-500 font-medium ml-1'>{t('app.chat.tryToAsk')}</span>
        </div>
        <div className='grow h-[1px]' style={{background: 'linear-gradient(270deg, rgba(243, 244, 246, 0) 0%, #F3F4F6 100%)'}}/>
      </div>
      <div className='flex flex-wrap justify-center'>
        {
          suggestList.map((suggestQuestion, index) => (
            <Button
              key={index}
              className='mb-2 mr-2 last:mr-0 px-3 py-[5px] bg-white text-primary-600 text-xs font-medium'
              onClick={() => OnSuggestSend(suggestQuestion)}
            >
              {suggestQuestion}
            </Button>
          ))
        }
      </div>
    </div>
  )
}

export default memo(TryToAsk)
