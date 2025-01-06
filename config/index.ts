import type { AppInfo } from '@/types/app'
export const APP_ID = `${process.env.NEXT_PUBLIC_APP_ID}`
export const API_KEY = `${process.env.NEXT_PUBLIC_APP_KEY}`
export const API_URL = `${process.env.NEXT_PUBLIC_API_URL}`
export const APP_INFO: AppInfo = {
  title: 'Trillian Tarotista Mazo 42 y Marsella',
  description: 'Trillian es una tarotista única, una guía cósmica entre lo esotérico y lo futurista. Portadora del enigmático *Mazo 42*, su práctica combina la sabiduría ancestral del tarot con una perspectiva galáctica que invita a explorar los misterios del universo y las conexiones entre mundos.',
  copyright: 'GPT.ar',
  privacy_policy: 'https://mazo42.com/politica-privacidad/',
  default_language: 'es',
}

export const isShowPrompt = false
export const promptTemplate = 'I want you to act as a tarotist'

export const API_PREFIX = '/api'

export const LOCALE_COOKIE_NAME = 'locale'

export const DEFAULT_VALUE_MAX_LEN = 48
