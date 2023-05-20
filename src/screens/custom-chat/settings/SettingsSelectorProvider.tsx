import React, {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import { SharedValue, runOnJS, useSharedValue, withTiming } from 'react-native-reanimated'

type SettingsSelectorProviderProps = PropsWithChildren<{}>

type Value = {
  currentIndex: number
  indexAnim: SharedValue<number>
  slideAnim: SharedValue<number>
  handleItemPress: (index: number) => void
  handleBackPress: () => void
}

const SettingsSelectorContext = createContext<Value>(null as unknown as Value)

export function useSettingsSelectorContext() {
  return useContext(SettingsSelectorContext)
}

export function SettingsSelectorProvider(props: SettingsSelectorProviderProps) {
  const { children } = props

  const [currentIndex, setCurrentIndex] = useState(-1)

  const indexAnim = useSharedValue(-1)
  const slideAnim = useSharedValue(0)
  const handleItemPress = useCallback((index: number) => {
    setCurrentIndex(index)
    indexAnim.value = index
    slideAnim.value = withTiming(1)
  }, [])
  const handleBackPress = useCallback(() => {
    slideAnim.value = withTiming(0, undefined, finished => {
      indexAnim.value = -1
      finished && runOnJS(setCurrentIndex)(-1)
    })
  }, [])

  const value = useMemo<Value>(() => {
    return {
      currentIndex,
      indexAnim,
      slideAnim,
      handleItemPress,
      handleBackPress,
    }
  }, [currentIndex, indexAnim, slideAnim, handleItemPress, handleBackPress])

  return (
    <SettingsSelectorContext.Provider value={value}>{children}</SettingsSelectorContext.Provider>
  )
}
