import { StorageKey } from './keys'
import { storage } from './storages'

export function getMMKVString<
  T extends string | undefined,
  R = T extends undefined ? string | undefined : string
>(key: StorageKey, defaultValue?: T): R {
  return (storage.getString(key) ?? defaultValue) as R
}

export function setMMKVString(key: StorageKey, value: string) {
  return storage.set(key, value)
}
