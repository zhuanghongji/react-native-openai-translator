import { PickModalHandle } from '../components/PickModal'
import { useEffect, useRef, useState } from 'react'
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
