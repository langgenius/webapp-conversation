'use client'
import type { FC } from 'react'
import type { AppInfo, PromptConfig } from '@/types/app'
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import produce, { setAutoFreeze } from 'immer'
import { useBoolean, useGetState } from 'ahooks'
import useConversation from '@/hooks/use-conversation'
import Toast from '@/app/components/base/toast'
import Sidebar from '@/app/components/sidebar'
import ConfigSence from '@/app/components/config-scence'
import Header from '@/app/components/header'
import { fetchAppParams, fetchChatList, fetchConversations, generationConversationName, sendChatMessage, updateFeedback } from '@/service'
import type { ChatItem, ConversationItem, Feedbacktype, VisionFile, VisionSettings } from '@/types/app'
import { Resolution, TransferMethod, WorkflowRunningStatus } from '@/types/app'
import Chat from '@/app/components/chat'
import { setLocaleOnClient } from '@/i18n/client'
import useBreakpoints, { MediaType } from '@/hooks/use-breakpoints'
import Loading from '@/app/components/base/loading'
import { replaceVarWithValues, userInputsFormToPromptVariables } from '@/utils/prompt'
import AppUnavailable from '@/app/components/app-unavailable'
import { API_KEY, APP_ID, APP_INFO, isShowPrompt, promptTemplate } from '@/config'
import type { Annotation as AnnotationType } from '@/types/log'
import { addFileInfos, sortAgentSorts } from '@/utils/tools'
export type IQuestionsProps = {
    conversationName: string
    hasSetInputs: boolean
    isPublicVersion: boolean
    promptConfig: PromptConfig
    onStartChat: (inputs: Record<string, any>) => void
    canEditInputs: boolean
    savedInputs: Record<string, any>
    onInputsChange: (inputs: Record<string, any>) => void
    /** 传递默认值 */
    onDefaultQuery: (input: string) => void
}

const questionCard = [
    {
        title: '政策条例',
        questions: ['南京市智能建造政策有哪些？', '2024年天津市智能建造试点城市推进工作计划是什么？']
    },
    {
        title: '行业标准',
        questions: ['各省市发布的关于智能建造项目的评价规定都有什么？各地之间有什么不同？', '上海市智能建造应用场景目录中，设计阶段的应用场景及评价标准是什么？']
    },
    {
        title: '项目信息',
        questions: ['河南省住建厅发布的第一批智能建造试点项目有什么？列出项目名称及详细信息', '广东省第一批智能建造试点项目名单中，应用了数字设计技术的项目有哪些？']
    }
]

const IQuestions: FC<IQuestionsProps> = ({ conversationName,
    hasSetInputs,
    isPublicVersion,
    promptConfig,
    onStartChat,
    canEditInputs,
    savedInputs,
    onDefaultQuery,
    onInputsChange, }) => {

    const {
        conversationList,
        setConversationList,
        currConversationId,
        getCurrConversationId,
        setCurrConversationId,
        getConversationIdFromStorage,
        isNewConversation,
        currConversationInfo,
        currInputs,
        newConversationInputs,
        resetNewConversationInputs,
        setCurrInputs,
        setNewConversationInfo,
        setExistConversationInfo,
    } = useConversation()
    const [visionConfig, setVisionConfig] = useState<VisionSettings | undefined>({
        enabled: false,
        number_limits: 2,
        detail: Resolution.low,
        transfer_methods: [TransferMethod.local_file],
    })
    const [isResponding, { setTrue: setRespondingTrue, setFalse: setRespondingFalse }] = useBoolean(false)
    const [abortController, setAbortController] = useState<AbortController | null>(null)
    const { notify } = Toast
    const logError = (message: string) => {
        notify({ type: 'error', message })
    }

    // const checkCanSend = () => {
    //     if (currConversationId !== '-1')
    //         return true

    //     if (!currInputs || !promptConfig?.prompt_variables)
    //         return true

    //     const inputLens = Object.values(currInputs).length
    //     const promptVariablesLens = promptConfig.prompt_variables.length

    //     const emptyInput = inputLens < promptVariablesLens || Object.values(currInputs).find(v => !v)
    //     if (emptyInput) {
    //         logError(t('app.errorMessage.valueOfVarRequired'))
    //         return false
    //     }
    //     return true
    // }
    const { t } = useTranslation()
    const [controlFocus, setControlFocus] = useState(0)
    const [openingSuggestedQuestions, setOpeningSuggestedQuestions] = useState<string[]>([])
    const [messageTaskId, setMessageTaskId] = useState('')
    const [hasStopResponded, setHasStopResponded, getHasStopResponded] = useGetState(false)
    const [isRespondingConIsCurrCon, setIsRespondingConCurrCon, getIsRespondingConIsCurrCon] = useGetState(true)
    const [userQuery, setUserQuery] = useState('')
    const [chatList, setChatList, getChatList] = useGetState<ChatItem[]>([])

    const [conversationIdChangeBecauseOfNew, setConversationIdChangeBecauseOfNew, getConversationIdChangeBecauseOfNew] = useGetState(false)
    const [isChatStarted, { setTrue: setChatStarted, setFalse: setChatNotStarted }] = useBoolean(false)



    const updateCurrentQA = ({
        responseItem,
        questionId,
        placeholderAnswerId,
        questionItem,
    }: {
        responseItem: ChatItem
        questionId: string
        placeholderAnswerId: string
        questionItem: ChatItem
    }) => {
        // closesure new list is outdated.
        const newListWithAnswer = produce(
            getChatList().filter(item => item.id !== responseItem.id && item.id !== placeholderAnswerId),
            (draft) => {
                if (!draft.find(item => item.id === questionId))
                    draft.push({ ...questionItem })

                draft.push({ ...responseItem })
            })
        setChatList(newListWithAnswer)
    }

    const handleSend = async (message: string, files?: VisionFile[]) => {
        if (isResponding) {
            notify({ type: 'info', message: t('app.errorMessage.waitForResponse') })
            return
        }
        const data: Record<string, any> = {
            inputs: currInputs,
            query: message,
            conversation_id: isNewConversation ? null : currConversationId,
        }

        if (visionConfig?.enabled && files && files?.length > 0) {
            data.files = files.map((item) => {
                if (item.transfer_method === TransferMethod.local_file) {
                    return {
                        ...item,
                        url: '',
                    }
                }
                return item
            })
        }

        // question
        const questionId = `question-${Date.now()}`
        const questionItem = {
            id: questionId,
            content: message,
            isAnswer: false,
            message_files: files,
        }

        const placeholderAnswerId = `answer-placeholder-${Date.now()}`
        const placeholderAnswerItem = {
            id: placeholderAnswerId,
            content: '',
            isAnswer: true,
        }

        const newList = [...getChatList(), questionItem, placeholderAnswerItem]
        setChatList(newList)

        let isAgentMode = false

        // answer
        const responseItem: ChatItem = {
            id: `${Date.now()}`,
            content: '',
            agent_thoughts: [],
            message_files: [],
            isAnswer: true,
        }
        let hasSetResponseId = false

        const prevTempNewConversationId = getCurrConversationId() || '-1'
        let tempNewConversationId = ''

        setRespondingTrue()
        sendChatMessage(data, {
            getAbortController: (abortController) => {
                setAbortController(abortController)
            },
            onData: (message: string, isFirstMessage: boolean, { conversationId: newConversationId, messageId, taskId }: any) => {
                if (!isAgentMode) {
                    responseItem.content = responseItem.content + message
                }
                else {
                    const lastThought = responseItem.agent_thoughts?.[responseItem.agent_thoughts?.length - 1]
                    if (lastThought)
                        lastThought.thought = lastThought.thought + message // need immer setAutoFreeze
                }
                if (messageId && !hasSetResponseId) {
                    responseItem.id = messageId
                    hasSetResponseId = true
                }

                if (isFirstMessage && newConversationId)
                    tempNewConversationId = newConversationId

                setMessageTaskId(taskId)
                // has switched to other conversation
                if (prevTempNewConversationId !== getCurrConversationId()) {
                    setIsRespondingConCurrCon(false)
                    return
                }
                updateCurrentQA({
                    responseItem,
                    questionId,
                    placeholderAnswerId,
                    questionItem,
                })
            },
            async onCompleted(hasError?: boolean) {
                if (hasError)
                    return

                if (getConversationIdChangeBecauseOfNew()) {
                    const { data: allConversations }: any = await fetchConversations()
                    const newItem: any = await generationConversationName(allConversations[0].id)

                    const newAllConversations = produce(allConversations, (draft: any) => {
                        draft[0].name = newItem.name
                    })
                    setConversationList(newAllConversations as any)
                }
                setConversationIdChangeBecauseOfNew(false)
                resetNewConversationInputs()
                setChatNotStarted()
                setCurrConversationId(tempNewConversationId, APP_ID, true)
                setRespondingFalse()
            },
            onFile(file) {
                const lastThought = responseItem.agent_thoughts?.[responseItem.agent_thoughts?.length - 1]
                if (lastThought)
                    lastThought.message_files = [...(lastThought as any).message_files, { ...file }]

                updateCurrentQA({
                    responseItem,
                    questionId,
                    placeholderAnswerId,
                    questionItem,
                })
            },
            onThought(thought) {
                isAgentMode = true
                const response = responseItem as any
                if (thought.message_id && !hasSetResponseId) {
                    response.id = thought.message_id
                    hasSetResponseId = true
                }
                // responseItem.id = thought.message_id;
                if (response.agent_thoughts.length === 0) {
                    response.agent_thoughts.push(thought)
                }
                else {
                    const lastThought = response.agent_thoughts[response.agent_thoughts.length - 1]
                    // thought changed but still the same thought, so update.
                    if (lastThought.id === thought.id) {
                        thought.thought = lastThought.thought
                        thought.message_files = lastThought.message_files
                        responseItem.agent_thoughts![response.agent_thoughts.length - 1] = thought
                    }
                    else {
                        responseItem.agent_thoughts!.push(thought)
                    }
                }
                // has switched to other conversation
                if (prevTempNewConversationId !== getCurrConversationId()) {
                    setIsRespondingConCurrCon(false)
                    return false
                }

                updateCurrentQA({
                    responseItem,
                    questionId,
                    placeholderAnswerId,
                    questionItem,
                })
            },
            onMessageEnd: (messageEnd) => {
                if (messageEnd.metadata?.annotation_reply) {
                    responseItem.id = messageEnd.id
                    responseItem.annotation = ({
                        id: messageEnd.metadata.annotation_reply.id,
                        authorName: messageEnd.metadata.annotation_reply.account.name,
                    } as AnnotationType)
                    const newListWithAnswer = produce(
                        getChatList().filter(item => item.id !== responseItem.id && item.id !== placeholderAnswerId),
                        (draft) => {
                            if (!draft.find(item => item.id === questionId))
                                draft.push({ ...questionItem })

                            draft.push({
                                ...responseItem,
                            })
                        })
                    setChatList(newListWithAnswer)
                    return
                }
                // not support show citation
                // responseItem.citation = messageEnd.retriever_resources
                const newListWithAnswer = produce(
                    getChatList().filter(item => item.id !== responseItem.id && item.id !== placeholderAnswerId),
                    (draft) => {
                        if (!draft.find(item => item.id === questionId))
                            draft.push({ ...questionItem })

                        draft.push({ ...responseItem })
                    })
                setChatList(newListWithAnswer)
            },
            onMessageReplace: (messageReplace) => {
                setChatList(produce(
                    getChatList(),
                    (draft) => {
                        const current = draft.find(item => item.id === messageReplace.id)

                        if (current)
                            current.content = messageReplace.answer
                    },
                ))
            },
            onError() {
                setRespondingFalse()
                // role back placeholder answer
                setChatList(produce(getChatList(), (draft) => {
                    draft.splice(draft.findIndex(item => item.id === placeholderAnswerId), 1)
                }))
            },
            onWorkflowStarted: ({ workflow_run_id, task_id }) => {
                // taskIdRef.current = task_id
                responseItem.workflow_run_id = workflow_run_id
                responseItem.workflowProcess = {
                    status: WorkflowRunningStatus.Running,
                    tracing: [],
                }
                setChatList(produce(getChatList(), (draft) => {
                    const currentIndex = draft.findIndex(item => item.id === responseItem.id)
                    draft[currentIndex] = {
                        ...draft[currentIndex],
                        ...responseItem,
                    }
                }))
            },
            onWorkflowFinished: ({ data }) => {
                responseItem.workflowProcess!.status = data.status as WorkflowRunningStatus
                setChatList(produce(getChatList(), (draft) => {
                    const currentIndex = draft.findIndex(item => item.id === responseItem.id)
                    draft[currentIndex] = {
                        ...draft[currentIndex],
                        ...responseItem,
                    }
                }))
            },
            onNodeStarted: ({ data }) => {
                responseItem.workflowProcess!.tracing!.push(data as any)
                setChatList(produce(getChatList(), (draft) => {
                    const currentIndex = draft.findIndex(item => item.id === responseItem.id)
                    draft[currentIndex] = {
                        ...draft[currentIndex],
                        ...responseItem,
                    }
                }))
            },
            onNodeFinished: ({ data }) => {
                const currentIndex = responseItem.workflowProcess!.tracing!.findIndex(item => item.node_id === data.node_id)
                responseItem.workflowProcess!.tracing[currentIndex] = data as any
                setChatList(produce(getChatList(), (draft) => {
                    const currentIndex = draft.findIndex(item => item.id === responseItem.id)
                    draft[currentIndex] = {
                        ...draft[currentIndex],
                        ...responseItem,
                    }
                }))
            },
        })
    }

    const [inputs, setInputs] = useState<Record<string, any>>((() => {
        if (hasSetInputs)
            return savedInputs

        const res: Record<string, any> = {}
        if (promptConfig) {
            promptConfig.prompt_variables.forEach((item) => {
                res[item.key] = ''
            })
        }
        return res
    })())
    const handleClick = (val: any) => {
        /** 传递默认值 */
        onDefaultQuery(val)
        setInputs(val)
        onStartChat(inputs)
        // handleSend(val)

    }
    return (
        <div>
            {
                !hasSetInputs && (
                    <div className='mx-auto pc:w-[1000px] max-w-full mobile:w-full px-3.5'>
                        <p>你可以尝试下面的示例...</p>
                        <div className='flex mt-10 gap-6 mb-10 justify-between items-stretch'>
                            {
                                questionCard.map((item, index) => (
                                    <div key={index} className='flex-1  ring-2 ring-gray-900/5 hover:ring-blue-600  py-2 shadow-md sm:rounded-md h-70'>
                                        <h2 className='font-bold border-b text-lg p-2 text-center' >{item.title}</h2>
                                        {item.questions.map((que) => (
                                            <p className='hover:bg-gray-200 min-h-24 flex items-center rounded-sm bg-gray-100 cursor-pointer p-2 m-2' onClick={() => handleClick(que)}>{que}</p>
                                        ))}
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                )

            }

        </div>

    )
}
export default React.memo(IQuestions)
