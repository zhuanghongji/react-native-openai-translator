import { PickModalHandle } from '../components/PickModal'
import { useFocusEffect } from '@react-navigation/native'
import { useCallback, useEffect, useRef, useState } from 'react'
import { AppState, AppStateStatus } from 'react-native'
import { useSharedValue } from 'react-native-reanimated'

export function usePickModalState<T>(initialValue: T) {
  const [value, setValue] = useState<T>(initialValue)
  const animatedIndex = useSharedValue(-1)
  const pickModalRef = useRef<PickModalHandle>(null)
  return [value, setValue, animatedIndex, pickModalRef] as const
}

export function usePickModal() {
  const animatedIndex = useSharedValue(-1)
  const pickModalRef = useRef<PickModalHandle>(null)
  return [animatedIndex, pickModalRef] as const
}

export const useIsForeground = (): boolean => {
  const [isForeground, setIsForeground] = useState(true)

  useEffect(() => {
    const onChange = (state: AppStateStatus): void => {
      setIsForeground(state === 'active')
    }
    const listener = AppState.addEventListener('change', onChange)
    return () => listener.remove()
  }, [setIsForeground])

  return isForeground
}

export function useOnRefresh<T>(refresh: () => Promise<T>) {
  const [refreshing, setRefreshing] = useState(false)
  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true)
      await refresh()
    } catch (e) {
      // do nothing
    } finally {
      setRefreshing(false)
    }
  }, [refresh])
  return { refreshing, setRefreshing, onRefresh }
}

export function useRefetchFocusEffect<T>(refetch: () => Promise<T>) {
  const firstTimeRef = useRef(true)
  useFocusEffect(
    useCallback(() => {
      if (firstTimeRef.current) {
        firstTimeRef.current = false
        return
      }
      refetch()
    }, [refetch])
  )
}
