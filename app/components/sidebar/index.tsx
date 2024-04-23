import React, {useState} from 'react'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import {
  ChatBubbleOvalLeftEllipsisIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/outline'
import { ChatBubbleOvalLeftEllipsisIcon as ChatBubbleOvalLeftEllipsisSolidIcon } from '@heroicons/react/24/solid'
import s from './style.module.css'
import Button from '@/app/components/base/button'
// import Card from './card'
import type { ConversationItem } from '@/types/app'
import Confirm from '@/app/components/base/confirm'


function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}

export type ISidebarProps = {
  copyRight: string
  currentId: string
  onCurrentIdChange: (id: string) => void
  onDeleteConversationItem: (id: string) => void
  list: ConversationItem[]
}

const Sidebar: FC<ISidebarProps> = ({
  copyRight,
  currentId,
  onCurrentIdChange,
  onDeleteConversationItem,
  list,
}) => {
  const [activeId, setActiveId] = useState('')
  const [showConfirmModel, setShowConfirmModel] = useState(false)
  const [deleteId, setdeleteId] = useState('')
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)
  const [open, setOpen] = useState(false)
  const { t } = useTranslation()


  function handleMoreIconClick(id) {
    setActiveId(id)
    setdeleteId(id)
  }


  return (
    <div
      className="shrink-0 flex flex-col overflow-y-auto bg-white pc:w-[244px] tablet:w-[192px] mobile:w-[240px]  border-r border-gray-200 tablet:h-[calc(100vh_-_3rem)] mobile:h-screen"
    >

    <div className="flex flex-shrink-0 p-4 !pb-0">
      <Button
        onClick={() => { onCurrentIdChange('-1') }}
        className="group block w-full flex-shrink-0 !justify-start !h-9 text-primary-600 items-center text-sm">
        <PencilSquareIcon className="mr-2 h-4 w-4" /> {t('app.chat.newChat')}
      </Button>
    </div>

      <nav className="mt-4 flex-1 space-y-1 bg-white p-4 !pt-0">
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
                  ? 'bg-primary-50'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-700',
                'group flex items-center rounded-md px-2 py-2 text-sm font-medium cursor-pointer hover:bg-gray-50 hover:text-default-600',
                s.qNavItem
              )}
              onMouseLeave={() => setActiveId(null)}
            >
              <ItemIcon
                className={classNames(
                  isCurrent
                    ? 'text-primary-600'
                    : 'text-gray-400 group-hover:text-gray-500',
                  'mr-3 h-5 w-5 flex-shrink-0',
                )}
                aria-hidden="true"
              />
              <div className="grow text-primary-600">{item.name}</div>
              {item.id !== '-1' && (<div  className={`${s.moreIcon} h-5 w-5 flex-shrink-0 rounded-md`}
                onClick={(event) => {
                event.stopPropagation()
                handleMoreIconClick(item.id)
              }}></div>)}
              {activeId === item.id && (<div onClick={(event) => { 
                event.stopPropagation()
                setOpen(false)
                setShowConfirmDelete(true)
                }} className={`${s.deleteWrap} flex justify-center items-center rounded-lg px-4 py-2 border-solid border border-gray-200 cursor-pointer bg-white hover:bg-gray-50 hover:shadow-sm hover:border-gray-300`}>
                <div className={`${s.deteleIcon} w-4 h-4 cursor-pointer rounded-md mr-2`}></div>{t('app.chat.delete')}
              </div>)}
            </div>
          )
        })}
      </nav>
      {showConfirmDelete && (
          <Confirm
            title={t('app.chat.confirmDeleteTitle')}
            content={t('app.chat.confirmDeleteContent')}
            isShow={showConfirmDelete}
            onClose={() => setShowConfirmDelete(false)}
            onConfirm={()=> {
              onDeleteConversationItem(deleteId)
              setShowConfirmDelete(false)
            }}
            onCancel={() => setShowConfirmDelete(false)}
          />
        )}

      {/* <a className="flex flex-shrink-0 p-4" href="https://langgenius.ai/" target="_blank">
        <Card><div className="flex flex-row items-center"><ChatBubbleOvalLeftEllipsisSolidIcon className="text-primary-600 h-6 w-6 mr-2" /><span>LangGenius</span></div></Card>
      </a> */}
      <div className="flex flex-shrink-0 pr-4 pb-4 pl-4">
        <div className="text-gray-400 font-normal text-xs">© {copyRight} {(new Date()).getFullYear()}</div>
      </div>
    </div>
  )
}

export default React.memo(Sidebar)
