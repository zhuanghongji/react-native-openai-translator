import React, { PropsWithChildren } from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import { useReanimatedKeyboardAnimation } from 'react-native-keyboard-controller'
import Animated, { useAnimatedStyle } from 'react-native-reanimated'

export type AvoidKeyboardViewProps = PropsWithChildren<{
  style?: StyleProp<ViewStyle>
  factor?: number
}>

export function AvoidKeyboardView(props: AvoidKeyboardViewProps) {
  const { style, factor = 1, children } = props

  const { height } = useReanimatedKeyboardAnimation()
  const containerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: height.value * factor }],
    }
  })

  return <Animated.View style={[containerStyle, style]}>{children}</Animated.View>
}
