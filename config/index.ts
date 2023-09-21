import type { AppInfo } from '@/types/app'
export const APP_ID = `d75e8efa-a445-4e32-a383-0d24a460aaa9`
export const API_KEY = `app-47Eqo5Bwx1LiCsgHK0xxPP4m`
export const API_URL = `${process.env.NEXT_PUBLIC_API_URL}`
export const APP_INFO: AppInfo = {
  title: 'Chat APP',
  description: '',
  copyright: '',
  privacy_policy: '',
  default_language: 'zh-Hans',
}

export const isShowPrompt = false
export const promptTemplate = 'I want you to act as a javascript console.'

export const API_PREFIX = '/api'

export const LOCALE_COOKIE_NAME = 'locale'

export const DEFAULT_VALUE_MAX_LEN = 48
