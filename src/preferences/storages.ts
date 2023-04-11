import { StorageKey } from '../mmkv/keys'
import { storage } from '../mmkv/storages'
import { DEFAULTS } from './defaults'
import {
  ApiModel,
  LanguageKey,
  LanguageMode,
  ServiceProvider,
  ThemeMode,
  TranslatorMode,
} from './options'
import { useMMKVBoolean, useMMKVString } from 'react-native-mmkv'

// MARK: getter、setter

export function getLastDetectedText() {
  return storage.getString(StorageKey.lastDetectedText)
}

export function setLastDetectedText(text: string) {
  return storage.set(StorageKey.lastDetectedText, text)
}

export function getDefaultFromLanguage() {
  return (storage.getString(StorageKey.defaultFromLanguage) ??
    DEFAULTS.defaultFromLanguage) as LanguageKey
}

export function getDefaultTargetLanguage() {
  return (storage.getString(StorageKey.defaultTargetLanguage) ??
    DEFAULTS.defaultTargetLanguage) as LanguageKey
}

export function getDefaultTranslatorMode() {
  return (storage.getString(StorageKey.defaultTranslatorMode) ??
    DEFAULTS.defaultTranslatorMode) as TranslatorMode
}

// MARK: hooks

type SetValue<T> = (value: string | ((current: T | undefined) => T | undefined) | undefined) => void

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
  return useStorageString<LanguageKey>(StorageKey.defaultFromLanguage, DEFAULTS.defaultFromLanguage)
}

export function useDefaultTargetLanguagePref() {
  return useStorageString<LanguageKey>(
    StorageKey.defaultTargetLanguage,
    DEFAULTS.defaultTargetLanguage
  )
}

export function useServiceProviderPref() {
  return useStorageString<ServiceProvider>(StorageKey.serviceProvider, DEFAULTS.serviceProvider)
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

export function useDefaultTranslatorModePref() {
  return useStorageString<TranslatorMode>(
    StorageKey.defaultTranslatorMode,
    DEFAULTS.defaultTranslatorMode
  )
}

export function useLanguageModePref() {
  return useStorageString<LanguageMode>(StorageKey.languageMode, DEFAULTS.languageMode)
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
  return useStorageBoolean(StorageKey.restorePreviousPosition, DEFAULTS.restorePreviousPosition)
}
