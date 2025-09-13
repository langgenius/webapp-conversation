import type { VisionFile } from '@/types/app'

export interface LogAnnotation {
  content: string
  account: {
    id: string
    name: string
    email: string
  }
  created_at: number
}

export interface Annotation {
  id: string
  authorName: string
  logAnnotation?: LogAnnotation
  created_at?: number
}

export const MessageRatings = ['like', 'dislike', null] as const
export type MessageRating = typeof MessageRatings[number]

export interface MessageMore {
  time: string
  tokens: number
  latency: number | string
}

export interface Feedbacktype {
  rating: MessageRating
  content?: string | null
}

export type FeedbackFunc = (messageId: string, feedback: Feedbacktype) => Promise<any>
export type SubmitAnnotationFunc = (messageId: string, content: string) => Promise<any>

export type DisplayScene = 'web' | 'console'

export interface ToolInfoInThought {
  name: string
  input: string
  output: string
  isFinished: boolean
}

export interface ThoughtItem {
  id: string
  tool: string // plugin or dataset. May has multi.
  thought: string
  tool_input: string
  message_id: string
  observation: string
  position: number
  files?: string[]
  message_files?: VisionFile[]
}

export interface CitationItem {
  content: string
  data_source_type: string
  dataset_name: string
  dataset_id: string
  document_id: string
  document_name: string
  hit_count: number
  index_node_hash: string
  segment_id: string
  segment_position: number
  score: number
  word_count: number
}

export interface IChatItem {
  id: string
  content: string
  citation?: CitationItem[]
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

export interface MessageEnd {
  id: string
  metadata: {
    retriever_resources?: CitationItem[]
    annotation_reply: {
      id: string
      account: {
        id: string
        name: string
      }
    }
  }
}

export interface MessageReplace {
  id: string
  task_id: string
  answer: string
  conversation_id: string
}

export interface AnnotationReply {
  id: string
  task_id: string
  answer: string
  conversation_id: string
  annotation_id: string
  annotation_author_name: string
}
