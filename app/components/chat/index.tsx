'use client'
import type { FC } from 'react'
import React, { useEffect, useRef } from 'react'
import cn from 'classnames'
import { useTranslation } from 'react-i18next'
import Textarea from 'rc-textarea'
import s from './style.module.css'
import Answer from './answer'
import Question from './question'
import type { FeedbackFunc } from './type'
import type { ChatItem, VisionFile, VisionSettings } from '@/types/app'
import { TransferMethod } from '@/types/app'
import Tooltip from '@/app/components/base/tooltip'
import Toast from '@/app/components/base/toast'
import ChatImageUploader from '@/app/components/base/image-uploader/chat-image-uploader'
import ImageList from '@/app/components/base/image-uploader/image-list'
import { useImageFiles } from '@/app/components/base/image-uploader/hooks'
import FileUploaderInAttachmentWrapper from '@/app/components/base/file-uploader-in-attachment'
import type { FileEntity, FileUpload } from '@/app/components/base/file-uploader-in-attachment/types'
import { getProcessedFiles } from '@/app/components/base/file-uploader-in-attachment/utils'

export interface IChatProps {
  chatList: ChatItem[]
  feedbackDisabled?: boolean
  isHideSendInput?: boolean
  onFeedback?: FeedbackFunc
  checkCanSend?: () => boolean
  onSend?: (message: string, files: VisionFile[]) => void
  useCurrentUserAvatar?: boolean
  isResponding?: boolean
  controlClearQuery?: number
  visionConfig?: VisionSettings
  fileConfig?: FileUpload
}

const Chat: FC<IChatProps> = ({
  chatList,
  feedbackDisabled = false,
  isHideSendInput = false,
  onFeedback,
  checkCanSend,
  onSend = () => {},
  useCurrentUserAvatar,
  isResponding,
  controlClearQuery,
  visionConfig,
  fileConfig,
}) => {
  const { t } = useTranslation()
  const { notify } = Toast
  const isUseInputMethod = useRef(false)

  const [query, setQuery] = React.useState('')
  const queryRef = useRef('')

  const handleContentChange = (e: any) => {
    const value = e.target.value
    setQuery(value)
    queryRef.current = value
  }

  const logError = (message: string) => {
    notify({ type: 'error', message, duration: 3000 })
  }

  const valid = () => {
    if (!queryRef.current || queryRef.current.trim() === '') {
      logError(t('app.errorMessage.valueOfVarRequired'))
      return false
    }
    return true
  }

  useEffect(() => {
    if (controlClearQuery) {
      setQuery('')
      queryRef.current = ''
    }
  }, [controlClearQuery])

  const {
    files,
    onUpload,
    onRemove,
    onReUpload,
    onImageLinkLoadError,
    onImageLinkLoadSuccess,
    onClear,
  } = useImageFiles()

  const [attachmentFiles, setAttachmentFiles] = React.useState<FileEntity[]>([])

  const handleSend = () => {
    if (!valid() || (checkCanSend && !checkCanSend())) return
    const imageFiles: VisionFile[] = files
      .filter(f => f.progress !== -1)
      .map(f => ({
        type: 'image',
        transfer_method: f.type,
        url: f.url,
        upload_file_id: f.fileId,
      }))
    const docAndOtherFiles: VisionFile[] = getProcessedFiles(attachmentFiles)
    onSend(queryRef.current, [...imageFiles, ...docAndOtherFiles])
    if (!files.find(f => f.type === TransferMethod.local_file && !f.fileId)) {
      if (files.length) onClear()
      if (!isResponding) {
        setQuery('')
        queryRef.current = ''
      }
    }
    if (!attachmentFiles.find(f => f.transferMethod === TransferMethod.local_file && !f.uploadedId))
      setAttachmentFiles([])
  }

  const handleKeyUp = (e: any) => {
    if (e.code === 'Enter') {
      e.preventDefault()
      if (!e.shiftKey && !isUseInputMethod.current) handleSend()
    }
  }

  const handleKeyDown = (e: any) => {
    isUseInputMethod.current = e.nativeEvent.isComposing
    if (e.code === 'Enter' && !e.shiftKey) {
      setQuery(q => q.replace(/\n$/, ''))
      queryRef.current = queryRef.current.replace(/\n$/, '')
      e.preventDefault()
    }
  }

  const suggestionClick = (suggestion: string) => {
    setQuery(suggestion)
    queryRef.current = suggestion
    handleSend()
  }

  const canSend = query.trim().length > 0 && !isResponding

  return (
    <div className={cn(!feedbackDisabled && 'px-3.5', 'h-full')}>
      {/* Chat Message List */}
      <div className="h-full space-y-[30px]">
        {chatList.map((item) => {
          if (item.isAnswer) {
            const isLast = item.id === chatList[chatList.length - 1].id
            return (
              <Answer
                key={item.id}
                item={item}
                feedbackDisabled={feedbackDisabled}
                onFeedback={onFeedback}
                isResponding={isResponding && isLast}
                suggestionClick={suggestionClick}
              />
            )
          }
          return (
            <Question
              key={item.id}
              id={item.id}
              content={item.content}
              useCurrentUserAvatar={useCurrentUserAvatar}
              imgSrcs={
                item.message_files && item.message_files.length > 0
                  ? item.message_files.map(f => f.url)
                  : []
              }
            />
          )
        })}
      </div>

      {/* Input Area */}
      {!isHideSendInput && (
        <div className="fixed z-10 bottom-6 left-1/2 -translate-x-1/2 pc:ml-[122px] tablet:ml-[96px] mobile:ml-0 pc:w-[740px] tablet:w-[640px] max-w-full mobile:w-full px-3">

          {/* Input Box */}
          <div
            className="relative rounded-2xl overflow-hidden transition-all duration-200"
            style={{
              backgroundColor: '#252525',
              border: '1px solid rgba(255,255,255,0.10)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            }}
            onFocusCapture={e => {
              const el = e.currentTarget as HTMLDivElement
              el.style.borderColor = 'rgba(197,160,89,0.35)'
              el.style.boxShadow = '0 8px 32px rgba(0,0,0,0.4), 0 0 0 2px rgba(197,160,89,0.15)'
            }}
            onBlurCapture={e => {
              const el = e.currentTarget as HTMLDivElement
              el.style.borderColor = 'rgba(255,255,255,0.10)'
              el.style.boxShadow = '0 8px 32px rgba(0,0,0,0.4)'
            }}
          >
            {/* Image uploader */}
            {visionConfig?.enabled && (
              <>
                <div className="absolute bottom-2 left-2 flex items-center">
                  <ChatImageUploader
                    settings={visionConfig}
                    onUpload={onUpload}
                    disabled={files.length >= visionConfig.number_limits}
                  />
                  <div className="mx-1 w-px h-4" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }} />
                </div>
                <div className="pl-[52px]">
                  <ImageList
                    list={files}
                    onRemove={onRemove}
                    onReUpload={onReUpload}
                    onImageLinkLoadSuccess={onImageLinkLoadSuccess}
                    onImageLinkLoadError={onImageLinkLoadError}
                  />
                </div>
              </>
            )}

            {/* File uploader */}
            {fileConfig?.enabled && (
              <div className={`${visionConfig?.enabled ? 'pl-[52px]' : ''} px-3 pt-2`}>
                <FileUploaderInAttachmentWrapper
                  fileConfig={fileConfig}
                  value={attachmentFiles}
                  onChange={setAttachmentFiles}
                />
              </div>
            )}

            {/* Textarea */}
            <Textarea
              className={cn(
                'block w-full px-4 py-3 pr-14 leading-relaxed text-sm outline-none appearance-none resize-none bg-transparent',
                visionConfig?.enabled && 'pl-14',
              )}
              style={{ color: '#E8E8E8', minHeight: '52px', maxHeight: '160px' }}
              placeholder="اكتب سؤالك هنا..."
              value={query}
              onChange={handleContentChange}
              onKeyUp={handleKeyUp}
              onKeyDown={handleKeyDown}
              autoSize
            />

            {/* Send Button */}
            <div className="absolute bottom-2 right-2">
              <button
                onClick={handleSend}
                disabled={!canSend}
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-150 cursor-pointer"
                style={{
                  backgroundColor: canSend ? '#C5A059' : 'rgba(197,160,89,0.20)',
                  boxShadow: canSend ? '0 2px 8px rgba(197,160,89,0.30)' : 'none',
                  cursor: canSend ? 'pointer' : 'default',
                }}
                onMouseEnter={e => {
                  if (canSend)
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#D4B574'
                }}
                onMouseLeave={e => {
                  if (canSend)
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#C5A059'
                }}
                aria-label="إرسال"
              >
                {isResponding
                  ? (
                    /* Stop icon while responding */
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="#1A1200">
                      <rect x="4" y="4" width="16" height="16" rx="2" />
                    </svg>
                  )
                  : (
                    /* Up-arrow send icon */
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1A1200" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="19" x2="12" y2="5" />
                      <polyline points="5 12 12 5 19 12" />
                    </svg>
                  )}
              </button>
            </div>
          </div>

          {/* Hint */}
          <p className="text-center mt-2 text-[11px]" style={{ color: '#3A3A3A' }}>
            اضغط <kbd className="px-1 py-0.5 rounded text-[10px]" style={{ backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', color: '#5A5A5A' }}>Enter</kbd> للإرسال · <kbd className="px-1 py-0.5 rounded text-[10px]" style={{ backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', color: '#5A5A5A' }}>Shift+Enter</kbd> لسطر جديد
          </p>
        </div>
      )}
    </div>
  )
}

export default React.memo(Chat)
