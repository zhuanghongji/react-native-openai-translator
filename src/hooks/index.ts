import { PickModalHandle } from '../components/PickModal'
import { useRef, useState } from 'react'
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
