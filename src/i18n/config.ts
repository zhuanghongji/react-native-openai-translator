import { getMMKVString, setMMKVString } from '../mmkv/func'
import { StorageKey } from '../mmkv/keys'
import enTranslation from './en/translation.json'
import zhHansTranslation from './zh-Hans/translation.json'
import i18next, { LanguageDetectorModule } from 'i18next'
import { initReactI18next } from 'react-i18next'

const languageDetector: LanguageDetectorModule = {
  type: 'languageDetector',
  detect: () => getMMKVString(StorageKey.languageMode, 'en'),
  cacheUserLanguage: lng => setMMKVString(StorageKey.languageMode, lng),
}

export const resources = {
  en: {
    translation: enTranslation,
  },
  ['zh-Hans']: {
    translation: zhHansTranslation,
  },
} as const

i18next.use(languageDetector).use(initReactI18next).init({
  compatibilityJSON: 'v3',
  fallbackLng: 'en',
  debug: __DEV__,
  resources,
})
