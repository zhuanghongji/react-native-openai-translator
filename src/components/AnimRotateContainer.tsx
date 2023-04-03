import React, { PropsWithChildren, useEffect } from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated'

export type AnimRotateContainerProps = PropsWithChildren<{
  style?: StyleProp<ViewStyle>
  rotating: boolean
  anticlockwise?: boolean
  duration?: number
}>

export function AnimRotateContainer(props: AnimRotateContainerProps) {
  const {
    style,
    rotating,
    anticlockwise = false,
    duration = 3000,
    children,
  } = props

  const anim = useSharedValue(0)
  const animStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: `${anim.value * 360}deg`,
        },
      ],
    }
  })

  useEffect(() => {
    if (!rotating) {
      if (anim.value !== 0) {
        anim.value = withTiming(0, { easing: Easing.ease })
      } else {
        cancelAnimation(anim)
      }
      return
    }
    anim.value = withRepeat(
      withTiming(anticlockwise ? -1 : 1, {
        duration,
        easing: Easing.linear,
      }),
      -1,
      false
    )
  }, [rotating, anticlockwise, duration])

  return <Animated.View style={[style, animStyle]}>{children}</Animated.View>
}
