'use client'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import commonEn from './lang/common.en'
import commonZh from './lang/common.zh'
import commonZhHant from './lang/common.zh-hant'
import appEn from './lang/app.en'
import appZh from './lang/app.zh'
import appZhHant from './lang/app.zh-hant'
import toolsEn from './lang/tools.en'
import toolsZh from './lang/tools.zh'
import toolsZhHant from './lang/tools.zh-hant'
import type { Locale } from '.'

const resources = {
  'en': {
    translation: {
      common: commonEn,
      app: appEn,
      // tools
      tools: toolsEn,
    },
  },
  'zh-Hans': {
    translation: {
      common: commonZh,
      app: appZh,
      // tools
      tools: toolsZh,
    },
  },
  'zh-Hant': {
    translation: {
      common: commonZhHant,
      app: appZhHant,
      // tools
      tools: toolsZhHant,
    },
  },
}

i18n.use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    lng: 'en',
    fallbackLng: 'en',
    // debug: true,
    resources,
  })

export const changeLanguage = (lan: Locale) => {
  i18n.changeLanguage(lan)
}
export default i18n
