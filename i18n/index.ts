export const i18n = {
  defaultLocale: 'zh-Hans',
  locales: ['en', 'es', 'zh-Hans'],
} as const

export type Locale = typeof i18n['locales'][number]
