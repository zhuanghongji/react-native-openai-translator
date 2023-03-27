import { DEFAULTS } from './defaults'
import {
  ApiModel,
  LanguageKey,
  LanguageMode,
  ServiceProvider,
  ThemeMode,
  TranslateMode,
} from './options'
import { MMKV, useMMKVBoolean, useMMKVString } from 'react-native-mmkv'

const storage = new MMKV()

const enum StorageKey {
  fromLanguage = 'from_language',
  defaultTargetLanguage = 'default_target_language',
  serviceProvider = 'service_provider',
  apiKey = 'api_key',
  apiModel = 'api_model',
  apiUrl = 'api_url',
  apiUrlPath = 'api_url_path',
  defaultTranslateMode = 'default_translate_mode',
  languageMode = 'language_mode',
  themeMode = 'theme_mode',
  alwaysShowIcons = 'always_show_icons',
  autoTranslate = 'auto_translate',
  restorePreviousPosition = 'restore_previous_position',
}

// MARK: getter

export function getDefaultTargetLanguage() {
  return (storage.getString(StorageKey.defaultTargetLanguage) ??
    DEFAULTS.defaultTargetLanguage) as LanguageKey
}

export function getDefaultTranslateMode() {
  return (storage.getString(StorageKey.defaultTranslateMode) ??
    DEFAULTS.defaultTranslateMode) as TranslateMode
}

// MARK: hooks

type SetValue<T> = (
  value: string | ((current: T | undefined) => T | undefined) | undefined
) => void

function useStorageString<T extends string, U = SetValue<T>>(
  key: StorageKey,
  defaultValue: T
): [T, U] {
  const [value, setValue] = useMMKVString(key)
  return [(value as T | undefined) ?? defaultValue, setValue as U]
}

function useStorageBoolean<T extends boolean, U = SetValue<T>>(
  key: StorageKey,
  defaultValue: T
): [T, U] {
  const [value, setValue] = useMMKVBoolean(key)
  return [(value as T | undefined) ?? defaultValue, setValue as U]
}

export function useFromLanguagePref() {
  return useStorageString<LanguageKey>(
    StorageKey.fromLanguage,
    DEFAULTS.fromLanguage
  )
}

export function useDefaultTargetLanguagePref() {
  return useStorageString<LanguageKey>(
    StorageKey.defaultTargetLanguage,
    DEFAULTS.defaultTargetLanguage
  )
}

export function useServiceProviderPref() {
  return useStorageString<ServiceProvider>(
    StorageKey.serviceProvider,
    DEFAULTS.serviceProvider
  )
}

export function useApiKeyPref() {
  return useStorageString<string>(StorageKey.apiKey, DEFAULTS.apiKey)
}

export function useApiModelPref() {
  return useStorageString<ApiModel>(StorageKey.apiModel, DEFAULTS.apiModel)
}

export function useApiUrlPref() {
  return useStorageString<string>(StorageKey.apiUrl, DEFAULTS.apiUrl)
}

export function useApiUrlPathPref() {
  return useStorageString<string>(StorageKey.apiUrlPath, DEFAULTS.apiUrlPath)
}

export function useDefaultTranslateModePref() {
  return useStorageString<TranslateMode>(
    StorageKey.defaultTranslateMode,
    DEFAULTS.defaultTranslateMode
  )
}

export function useLanguageModePref() {
  return useStorageString<LanguageMode>(
    StorageKey.languageMode,
    DEFAULTS.languageMode
  )
}

export function useThemeModePref() {
  return useStorageString<ThemeMode>(StorageKey.themeMode, DEFAULTS.themeMode)
}

export function useAlwaysShowIconsPref() {
  return useStorageBoolean(StorageKey.alwaysShowIcons, DEFAULTS.alwaysShowIcons)
}

export function useAutoTranslatePref() {
  return useStorageBoolean(StorageKey.autoTranslate, DEFAULTS.autoTranslate)
}

export function useRestorePreviousPositionPref() {
  return useStorageBoolean(
    StorageKey.restorePreviousPosition,
    DEFAULTS.restorePreviousPosition
  )
}
