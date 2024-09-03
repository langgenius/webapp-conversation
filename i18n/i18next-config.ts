'use client'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import commonEn from './lang/common.en'
import commonEs from './lang/common.es'
import commonZh from './lang/common.zh'
import commonVi from './lang/common.vi'
import commonJa from './lang/common.ja'
import appEn from './lang/app.en'
import appEs from './lang/app.es'
import appZh from './lang/app.zh'
import appVi from './lang/app.vi'
import appJa from './lang/app.ja'
import toolsEn from './lang/tools.en'
import toolsZh from './lang/tools.zh'
import toolsVi from './lang/tools.vi'
import toolsJa from './lang/tools.ja'

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
  'es': {
    translation: {
      common: commonEs,
      app: appEs,
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
  'vi': {
    translation: {
      common: commonVi,
      app: appVi,
      // tools
      tools: toolsVi,
    },
  },
  'ja': {
    translation: {
      common: commonJa,
      app: appJa,
      // tools
      tools: toolsJa,
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
