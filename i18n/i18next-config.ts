'use client'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import commonEn from './lang/common.en'
import commonEs from './lang/common.es'
import commonZh from './lang/common.zh'
import commonVi from './lang/common.vi'
import commonJa from './lang/common.ja'
import commonFr from './lang/common.fr'
import appEn from './lang/app.en'
import appEs from './lang/app.es'
import appZh from './lang/app.zh'
import appVi from './lang/app.vi'
import appJa from './lang/app.ja'
import appFr from './lang/app.fr'
import toolsEn from './lang/tools.en'
import toolsZh from './lang/tools.zh'
import toolsVi from './lang/tools.vi'
import toolsJa from './lang/tools.ja'
import toolsFr from './lang/tools.fr'
import authEn from './lang/auth.en'
import authEs from './lang/auth.es'
import authZh from './lang/auth.zh'
import authVi from './lang/auth.vi'
import authJa from './lang/auth.ja'
import authFr from './lang/auth.fr'

import type { Locale } from '.'

const resources = {
  'en': {
    translation: {
      common: commonEn,
      app: appEn,
      tools: toolsEn,
      auth: authEn,
    },
  },
  'es': {
    translation: {
      common: commonEs,
      app: appEs,
      auth: authEs,
    },
  },
  'zh-Hans': {
    translation: {
      common: commonZh,
      app: appZh,
      tools: toolsZh,
      auth: authZh,
    },
  },
  'vi': {
    translation: {
      common: commonVi,
      app: appVi,
      tools: toolsVi,
      auth: authVi,
    },
  },
  'ja': {
    translation: {
      common: commonJa,
      app: appJa,
      tools: toolsJa,
      auth: authJa,
    },
  },
  'fr': {
    translation: {
      common: commonFr,
      app: appFr,
      tools: toolsFr,
      auth: authFr,
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
