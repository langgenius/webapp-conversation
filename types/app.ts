import type { Annotation } from './log'
import type { Locale } from '@/i18n'
import type { ThoughtItem } from '@/app/components/chat/type'

export interface PromptVariable {
  key: string
  name: string
  type: string
  default?: string | number
  options?: string[]
  max_length?: number
  required: boolean
  allowed_file_extensions?: string[]
  allowed_file_types?: string[]
  allowed_file_upload_methods?: TransferMethod[]
}

export interface PromptConfig {
  prompt_template: string
  prompt_variables: PromptVariable[]
}

export interface TextTypeFormItem {
  label: string
  variable: string
  required: boolean
  max_length: number
}

export interface SelectTypeFormItem {
  label: string
  variable: string
  required: boolean
  options: string[]
}
/**
 * User Input Form Item
 */
export type UserInputFormItem = {
  'text-input': TextTypeFormItem
} | {
  select: SelectTypeFormItem
} | {
  paragraph: TextTypeFormItem
}

export const MessageRatings = ['like', 'dislike', null] as const
export type MessageRating = typeof MessageRatings[number]

export interface Feedbacktype {
  rating: MessageRating
  content?: string | null
}

export interface MessageMore {
  time: string
  tokens: number
  latency: number | string
}

export interface IChatItem {
  id: string
  content: string
  /**
   * Specific message type
   */
  isAnswer: boolean
  /**
   * The user feedback result of this message
   */
  feedback?: Feedbacktype
  /**
   * The admin feedback result of this message
   */
  adminFeedback?: Feedbacktype
  /**
   * Whether to hide the feedback area
   */
  feedbackDisabled?: boolean
  /**
   * More information about this message
   */
  more?: MessageMore
  annotation?: Annotation
  useCurrentUserAvatar?: boolean
  isOpeningStatement?: boolean
  suggestedQuestions?: string[]
  log?: { role: string, text: string }[]
  agent_thoughts?: ThoughtItem[]
  message_files?: VisionFile[]
}

export type ChatItem = IChatItem & {
  isError?: boolean
  workflow_run_id?: string
  workflowProcess?: WorkflowProcess
}

export interface ResponseHolder {}

export interface ConversationItem {
  id: string
  name: string
  inputs: Record<string, any> | null
  introduction: string
  suggested_questions?: string[]
}

export interface AppInfo {
  title: string
  description: string
  default_language: Locale
  copyright?: string
  privacy_policy?: string
  disable_session_same_site?: boolean
}

export enum Resolution {
  low = 'low',
  high = 'high',
}

export enum TransferMethod {
  all = 'all',
  local_file = 'local_file',
  remote_url = 'remote_url',
}

export interface VisionSettings {
  enabled: boolean
  number_limits: number
  detail: Resolution
  transfer_methods: TransferMethod[]
  image_file_size_limit?: number | string
}

export interface ImageFile {
  type: TransferMethod
  _id: string
  fileId: string
  file?: File
  progress: number
  url: string
  base64Url?: string
  deleted?: boolean
}

export interface VisionFile {
  id?: string
  type: string
  transfer_method: TransferMethod
  url: string
  upload_file_id: string
  belongs_to?: string
}

export enum BlockEnum {
  Start = 'start',
  End = 'end',
  Answer = 'answer',
  LLM = 'llm',
  KnowledgeRetrieval = 'knowledge-retrieval',
  QuestionClassifier = 'question-classifier',
  IfElse = 'if-else',
  Code = 'code',
  TemplateTransform = 'template-transform',
  HttpRequest = 'http-request',
  VariableAssigner = 'variable-assigner',
  Tool = 'tool',
}

export interface NodeTracing {
  id: string
  index: number
  predecessor_node_id: string
  node_id: string
  node_type: BlockEnum
  title: string
  inputs: any
  process_data: any
  outputs?: any
  status: string
  error?: string
  elapsed_time: number
  execution_metadata: {
    total_tokens: number
    total_price: number
    currency: string
  }
  created_at: number
  created_by: {
    id: string
    name: string
    email: string
  }
  finished_at: number
  extras?: any
  expand?: boolean // for UI
}

export enum NodeRunningStatus {
  NotStart = 'not-start',
  Waiting = 'waiting',
  Running = 'running',
  Succeeded = 'succeeded',
  Failed = 'failed',
}

export enum WorkflowRunningStatus {
  Waiting = 'waiting',
  Running = 'running',
  Succeeded = 'succeeded',
  Failed = 'failed',
  Stopped = 'stopped',
}

export interface WorkflowProcess {
  status: WorkflowRunningStatus
  tracing: NodeTracing[]
  expand?: boolean // for UI
}

export enum CodeLanguage {
  python3 = 'python3',
  javascript = 'javascript',
  json = 'json',
}
