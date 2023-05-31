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

function useStorageBoolean<T extends boolean, U = (value: T) => void>(
  key: StorageKey,
  defaultValue: T
): [T, U] {
  const [value, setValue] = useMMKVBoolean(key)
  return [(value as T | undefined) ?? defaultValue, setValue as U]
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

export function useEnableClipboardDetectPref() {
  return useStorageBoolean(StorageKey.enableClipboardDetect, DEFAULTS.enableClipboardDetect)
}

export function useShowChatAvatarPref() {
  return useStorageBoolean(StorageKey.showChatAvatar, DEFAULTS.showChatAvatar)
}
