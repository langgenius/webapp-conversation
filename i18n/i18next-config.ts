'use client'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import commonEn from './lang/common.en'
import commonZh from './lang/common.zh'
import appEn from './lang/app.en'
import appZh from './lang/app.zh'
import type { Locale } from '.'

const resources = {
  'en': {
    translation: {
      common: commonEn,
      app: appEn,
    },
  },
  'zh-Hans': {
    translation: {
      common: commonZh,
      app: appZh,
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
