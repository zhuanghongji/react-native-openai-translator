import { queryStorage } from '../mmkv/storages'
import NetInfo from '@react-native-community/netinfo'
import { QueryClient, focusManager, onlineManager } from '@tanstack/react-query'
import {
  PersistedClient,
  Persister,
  persistQueryClient,
} from '@tanstack/react-query-persist-client'
import { throttle } from 'lodash'
import { useEffect } from 'react'
import { AppState, AppStateStatus } from 'react-native'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
})

export function useHttpQueryAppOnlineManager() {
  useEffect(() => {
    onlineManager.setEventListener(setOnline => {
      return NetInfo.addEventListener(state => {
        // setOnline: (online?: boolean | undefined) => void
        // isConnected: boolean | null
        const { isConnected } = state
        setOnline(isConnected === null ? undefined : isConnected)
      })
    })
  }, [])
}

export function useHttpQueryAppFocusManager() {
  useEffect(() => {
    const listener = (state: AppStateStatus) => {
      focusManager.setFocused(state === 'active')
    }
    const subscription = AppState.addEventListener('change', listener)
    return () => subscription.remove()
  }, [])
}

export const createMMKVStoragePersister = ({
  key = 'react-query',
  throttleTime = 1000,
}): Persister => {
  return {
    persistClient: throttle(
      persistedClient => {
        return queryStorage.set(key, JSON.stringify(persistedClient))
      },
      throttleTime,
      { leading: true, trailing: false }
    ),
    restoreClient: () => {
      const cacheString = queryStorage.getString(key)
      if (!cacheString) {
        return
      }
      return JSON.parse(cacheString) as PersistedClient
    },
    removeClient: () => queryStorage.delete(key),
  }
}

const asyncStoragePersister = createMMKVStoragePersister({})
persistQueryClient({
  queryClient,
  persister: asyncStoragePersister,
  maxAge: 1000 * 60 * 5,
})
