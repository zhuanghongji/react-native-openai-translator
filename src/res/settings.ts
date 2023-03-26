export const SERVICE_PROVIDERS = ['OpenAI', 'Azure'] as const

export const API_MODALS = [
  'gpt-3.5-turbo',
  'gpt-3.5-turbo-0301',
  'gpt-4',
  'gpt-4-0314',
  'gpt-4-32k',
  'gpt-4-32k-0314',
] as const

export const TRANSLATE_MODES = [
  'translate',
  'polishing',
  'summarize',
  'analyze',
  'explain-code',
] as const

export const LANGUAGE_MODES = [
  'en',
  'zh-Hants',
  'zh-Hantt',
  'ja',
  'th',
] as const

export const THEME_MODES = ['system', 'dark', 'light'] as const

type UnionFromTuple<T extends readonly unknown[]> = T[number]

export type ServiceProvider = UnionFromTuple<typeof SERVICE_PROVIDERS>

export type ApiModal = UnionFromTuple<typeof API_MODALS>

export type TranslateMode = UnionFromTuple<typeof TRANSLATE_MODES>

export type ThemeMode = UnionFromTuple<typeof THEME_MODES>

export type LanguageMode = UnionFromTuple<typeof LANGUAGE_MODES>
