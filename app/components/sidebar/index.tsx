import React from 'react'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import {
  ChatBubbleOvalLeftEllipsisIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/outline'
import { ChatBubbleOvalLeftEllipsisIcon as ChatBubbleOvalLeftEllipsisSolidIcon } from '@heroicons/react/24/solid'
import Button from '@/app/components/base/button'
// import Card from './card'
import type { ConversationItem } from '@/types/app'

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}

const MAX_CONVERSATION_LENTH = 20

export interface ISidebarProps {
  copyRight: string
  currentId: string
  onCurrentIdChange: (id: string) => void
  list: ConversationItem[]
}

const Sidebar: FC<ISidebarProps> = ({
  copyRight,
  currentId,
  onCurrentIdChange,
  list,
}) => {
  const { t } = useTranslation()
  return (
    <div
      // ▼ ここを変更：背景を白(bg-white)から、WhiTechグラデーション(bg-whitech-gradient)に変更
      className="shrink-0 flex flex-col overflow-y-auto bg-whitech-gradient pc:w-[244px] tablet:w-[192px] mobile:w-[240px] border-r border-gray-200/20 tablet:h-[calc(100vh_-_3rem)] mobile:h-screen"
    >
      {list.length < MAX_CONVERSATION_LENTH && (
        <div className="flex flex-shrink-0 p-4 !pb-0">
          <Button
            onClick={() => { onCurrentIdChange('-1') }}
            // ▼ ここを変更：文字色を白(text-white)に変更
            className="group block w-full flex-shrink-0 !justify-start !h-9 text-white/90 hover:text-white items-center text-sm bg-white/10 hover:bg-white/20 border-transparent"
          >
            <PencilSquareIcon className="mr-2 h-4 w-4" /> {t('app.chat.newChat')}
          </Button>
        </div>
      )}

      <nav className="mt-4 flex-1 space-y-1 p-4 !pt-0">
        {list.map((item) => {
          const isCurrent = item.id === currentId
          const ItemIcon
            = isCurrent ? ChatBubbleOvalLeftEllipsisSolidIcon : ChatBubbleOvalLeftEllipsisIcon
          return (
            <div
              onClick={() => onCurrentIdChange(item.id)}
              key={item.id}
              className={classNames(
                isCurrent
                  ? 'bg-white/20 text-white shadow-sm' // 選択中のデザイン
                  : 'text-white/70 hover:bg-white/10 hover:text-white', // 未選択のデザイン
                'group flex items-center rounded-md px-2 py-2 text-sm font-medium cursor-pointer transition-colors duration-200',
              )}
            >
              <ItemIcon
                className={classNames(
                  isCurrent
                    ? 'text-white'
                    : 'text-white/70 group-hover:text-white',
                  'mr-3 h-5 w-5 flex-shrink-0',
                )}
                aria-hidden="true"
              />
              <span className="truncate">{item.name}</span>
            </div>
          )
        })}
      </nav>
      {/* Powered by Dify (LangGenius) の表示エリアを完全に削除しました 
      */}
      <div className="flex flex-shrink-0 pr-4 pb-4 pl-4">
        {/* コピーライトも白文字に変更 */}
        <div className="text-white/60 font-normal text-xs">© {copyRight} {(new Date()).getFullYear()}</div>
      </div>
    </div>
  )
}

export default React.memo(Sidebar)