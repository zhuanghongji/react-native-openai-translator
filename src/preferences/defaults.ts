import {
  ApiModel,
  LanguageKey,
  LanguageMode,
  ServiceProvider,
  ThemeMode,
  TranslatorMode,
} from './options'

export const DEFAULTS: {
  serviceProvider: ServiceProvider
  apiKey: string
  apiModel: ApiModel
  apiUrl: string
  apiUrlPath: string
  apiTemperature: number
  defaultTranslatorMode: TranslatorMode
  defaultTargetLanguage: LanguageKey
  themeMode: ThemeMode
  languageMode: LanguageMode
  enableClipboardDetect: boolean
  showChatAvatar: boolean
  colouredContextMessage: boolean
  avatar: string
  contextMessagesNum: number
  fontSize: number
} = {
  serviceProvider: 'OpenAI',
  apiKey: '',
  apiModel: 'gpt-3.5-turbo',
  apiUrl: 'https://api.openai.com',
  apiUrlPath: '/v1/chat/completions',
  apiTemperature: 1.0,
  defaultTranslatorMode: 'translate',
  defaultTargetLanguage: 'zh-Hans',
  themeMode: 'system',
  languageMode: 'en',
  enableClipboardDetect: true,
  showChatAvatar: true,
  colouredContextMessage: true,
  avatar: '😀',
  contextMessagesNum: 4,
  fontSize: 16,
}
