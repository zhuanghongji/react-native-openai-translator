import {
  ApiModel,
  LanguageKey,
  LanguageMode,
  ServiceProvider,
  ThemeMode,
  TranslateMode,
} from './options'

export const DEFAULTS: {
  defaultFromLanguage: LanguageKey
  defaultTargetLanguage: LanguageKey
  serviceProvider: ServiceProvider
  apiKey: string
  apiModel: ApiModel
  apiUrl: string
  apiUrlPath: string
  defaultTranslateMode: TranslateMode
  languageMode: LanguageMode
  themeMode: ThemeMode
  alwaysShowIcons: boolean
  autoTranslate: boolean
  restorePreviousPosition: boolean
} = {
  defaultFromLanguage: 'en',
  defaultTargetLanguage: 'zh-Hans',
  serviceProvider: 'OpenAI',
  apiKey: '',
  apiModel: 'gpt-3.5-turbo',
  apiUrl: 'https://api.openai.com',
  apiUrlPath: '/v1/chat/completions',
  defaultTranslateMode: 'translate',
  languageMode: 'en',
  themeMode: 'system',
  alwaysShowIcons: true,
  autoTranslate: false,
  restorePreviousPosition: false,
}
