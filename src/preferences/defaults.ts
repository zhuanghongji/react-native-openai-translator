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
  defaultTranslatorMode: TranslatorMode
  defaultTargetLanguage: LanguageKey
  themeMode: ThemeMode
  languageMode: LanguageMode
  enableClipboardDetect: boolean
  hideChatAvatar: boolean
} = {
  serviceProvider: 'OpenAI',
  apiKey: '',
  apiModel: 'gpt-3.5-turbo',
  apiUrl: 'https://api.openai.com',
  apiUrlPath: '/v1/chat/completions',
  defaultTranslatorMode: 'translate',
  defaultTargetLanguage: 'zh-Hans',
  themeMode: 'system',
  languageMode: 'en',
  enableClipboardDetect: true,
  hideChatAvatar: false,
}
