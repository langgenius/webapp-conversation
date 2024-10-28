import type { AppInfo } from '@/types/app'
import { PromptTemplate } from '../app/components/welcome/massive-component';
export const APP_ID = `${process.env.NEXT_PUBLIC_APP_ID}`
export const API_KEY = `${process.env.NEXT_PUBLIC_APP_KEY}`
export const API_URL = `${process.env.NEXT_PUBLIC_API_URL}`
export const APP_INFO: AppInfo = {
  title: 'Aibos Epanet',
  description: 'This is the knowledge base for the Epanet Project ',
  copyright: 'Aibos Inc',
  privacy_policy: '',
  default_language: 'en',
}

export const isShowPrompt = true
export const promptTemplate = ''
export const API_PREFIX = '/api'

export const LOCALE_COOKIE_NAME = 'locale'

export const DEFAULT_VALUE_MAX_LEN = 48
