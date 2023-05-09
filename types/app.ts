import { Locale } from '@/i18n'

export type PromptVariable = {
  key: string,
  name: string,
  type: "string" | "number" | "select",
  default?: string | number,
  options?: string[]
  max_length?: number
  required: boolean
}

export type PromptConfig = {
  prompt_template: string,
  prompt_variables: PromptVariable[],
}

export type TextTypeFormItem = {
  label: string,
  variable: string,
  required: boolean
  max_length: number
}

export type SelectTypeFormItem = {
  label: string,
  variable: string,
  required: boolean,
  options: string[]
}
/**
 * User Input Form Item
 */
export type UserInputFormItem = {
  'text-input': TextTypeFormItem
} | {
  'select': SelectTypeFormItem
}

export const MessageRatings = ['like', 'dislike', null] as const
export type MessageRating = typeof MessageRatings[number]

export type Feedbacktype = {
  rating: MessageRating
  content?: string | null
}

export type MessageMore = {
  time: string
  tokens: number
  latency: number | string
}

export type IChatItem = {
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
  isIntroduction?: boolean
  useCurrentUserAvatar?: boolean
  isOpeningStatement?: boolean
}


export type ResponseHolder = {}

export type ConversationItem = {
  id: string
  name: string
  inputs: Record<string, any> | null
  introduction: string,
}

export type AppInfo = {
  title: string
  description: string
  default_language: Locale
  copyright?: string
  privacy_policy?: string
}