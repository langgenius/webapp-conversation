import type { AppInfo } from '@/types/app'
export const APP_ID = `${process.env.APP_ID}`
export const API_KEY = `${process.env.APP_KEY}`
export const API_URL = `${process.env.API_URL}`
export const SA_API_URL = `${process.env.SA_API_URL || 'https://speedyagency.demo2.mixmedia.com/api'}`
export const SA_API_TOKEN = `${process.env.SA_API_TOKEN}`
export const ENABLE_AUTH = `${process.env.ENABLE_AUTH}` || false;
export const SECRET_KEY = `${process.env.SECRET_KEY || 'IEboqt3vmYau9ic6zye78sX2l4JfVHFw'}`
export const SHOW_MOBILE = `${process.env.SHOW_MOBILE}` || false;
export const APP_INFO: AppInfo = {
  title: 'ZoEasy',
  description: '',
  copyright: '',
  privacy_policy: '',
  default_language: 'zh-Hant',
}

export const isShowPrompt = false
export const promptTemplate = 'I want you to act as a javascript console.'

export const API_PREFIX = '/api'

export const LOCALE_COOKIE_NAME = 'locale'

export const DEFAULT_VALUE_MAX_LEN = 48
