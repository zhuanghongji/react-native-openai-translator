import { useTranslation } from 'react-i18next'

type UnionFromTuple<T extends readonly unknown[]> = T[number]

// MARK: support languages

export const SUPPORT_LANGUAGES = {
  en: 'English',
  'zh-Hans': '简体中文',
  'zh-Hant': '繁體中文',
  yue: '粤语',
  wyw: '古文',
  ja: '日本語',
  ko: '한국어',
  fr: 'Français',
  de: 'Deutsch',
  es: 'Español',
  it: 'Italiano',
  ru: 'Русский',
  pt: 'Português',
  nl: 'Nederlands',
  pl: 'Polski',
  ar: 'العربية',
  af: 'Afrikaans',
  am: 'አማርኛ',
  az: 'Azərbaycan',
  be: 'Беларуская',
  bg: 'Български',
  bn: 'বাংলা',
  bs: 'Bosanski',
  ca: 'Català',
  ceb: 'Cebuano',
  co: 'Corsu',
  cs: 'Čeština',
  cy: 'Cymraeg',
  da: 'Dansk',
  el: 'Ελληνικά',
  eo: 'Esperanto',
  et: 'Eesti',
  eu: 'Euskara',
  fa: 'فارسی',
  fi: 'Suomi',
  fj: 'Fijian',
  fy: 'Frysk',
  ga: 'Gaeilge',
  gd: 'Gàidhlig',
  gl: 'Galego',
  gu: 'ગુજરાતી',
  ha: 'Hausa',
  haw: 'Hawaiʻi',
  he: 'עברית',
  hi: 'हिन्दी',
  hmn: 'Hmong',
  hr: 'Hrvatski',
  ht: 'Kreyòl Ayisyen',
  hu: 'Magyar',
  hy: 'Հայերեն',
  id: 'Bahasa Indonesia',
  ig: 'Igbo',
  is: 'Íslenska',
  jw: 'Jawa',
  ka: 'ქართული',
  kk: 'Қазақ',
  mn: 'Монгол хэл',
  tr: 'Türkçe',
  ug: 'ئۇيغۇر تىلى',
  ur: 'اردو',
  vi: 'Tiếng Việt',
  th: 'ไทย',
}

export type LanguageKey = keyof typeof SUPPORT_LANGUAGES

export const LANGUAGE_KEYS = Object.keys(SUPPORT_LANGUAGES) as LanguageKey[]

export function languageLabelByKey(key: LanguageKey | null): string {
  if (key === null) {
    return 'AUTO'
  }
  return SUPPORT_LANGUAGES[key]
}

// MARK: service providers

export const SERVICE_PROVIDERS = ['OpenAI', 'Azure'] as const

export type ServiceProvider = UnionFromTuple<typeof SERVICE_PROVIDERS>

// MARK: api modals

export const API_MODELS = [
  'gpt-3.5-turbo',
  'gpt-3.5-turbo-0301',
  'gpt-4',
  'gpt-4-0314',
  'gpt-4-32k',
  'gpt-4-32k-0314',
] as const

export type ApiModel = UnionFromTuple<typeof API_MODELS>

// MARK: translate modes

export const TRANSLATOR_MODES = [
  'translate',
  'polishing',
  'summarize',
  'analyze',
  'bubble',
] as const

export type TranslatorMode = UnionFromTuple<typeof TRANSLATOR_MODES>

export function useTranslatorModeLabelFn(): (mode: TranslatorMode) => string {
  const { t } = useTranslation()
  return (mode: TranslatorMode) => {
    switch (mode) {
      case 'translate':
        return t('Translate')
      case 'polishing':
        return t('Polishing')
      case 'summarize':
        return t('Summarize')
      case 'analyze':
        return t('Analyze')
      case 'bubble':
        return t('Bubble')
    }
  }
}

// MARK: theme modes

export const THEME_MODES = ['system', 'dark', 'light'] as const

export type ThemeMode = UnionFromTuple<typeof THEME_MODES>

export function useThemeModeLabelFn(): (mode: ThemeMode) => string {
  const { t } = useTranslation()
  return (mode: ThemeMode) => {
    switch (mode) {
      case 'system':
        return t('Follow System')
      case 'dark':
        return t('Dark')
      case 'light':
        return t('Light')
    }
  }
}

// MARK: language modes

export const LANGUAGE_MODES = ['en', 'zh-Hans'] satisfies LanguageKey[]

export type LanguageMode = UnionFromTuple<typeof LANGUAGE_MODES>
