import { useThemeScheme } from '../../../themes/hooks'
import { useSettingsSelectorContext } from './SettingsSelectorProvider'
import React, { PropsWithChildren } from 'react'
import { StyleProp, StyleSheet, ViewStyle } from 'react-native'
import Animated, { Extrapolation, interpolate, useAnimatedStyle } from 'react-native-reanimated'
import { useSafeAreaFrame } from 'react-native-safe-area-context'

export type SettingsDetailContainerProps = PropsWithChildren<{
  style?: StyleProp<ViewStyle>
  index: number
}>

export function SettingsDetailContainer(props: SettingsDetailContainerProps) {
  const { style, index, children } = props

  const { currentIndex, indexAnim, slideAnim } = useSettingsSelectorContext()

  const { width: frameWidth } = useSafeAreaFrame()

  const { backgroundModal: backgroundColor } = useThemeScheme()

  const slideAnimStyle = useAnimatedStyle(() => {
    const slideValue = index === indexAnim.value ? slideAnim.value : 0
    return {
      transform: [
        {
          translateX: interpolate(slideValue, [0, 1], [frameWidth, 0], Extrapolation.CLAMP),
        },
      ],
    }
  }, [index, indexAnim, slideAnim])

  return (
    <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor }, slideAnimStyle, style]}>
      {index === currentIndex ? children : null}
    </Animated.View>
  )
}
