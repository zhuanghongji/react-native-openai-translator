import React, { PropsWithChildren, useEffect, useImperativeHandle } from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated'

export type ShakeContainerProps = PropsWithChildren<{
  style?: StyleProp<ViewStyle>
  autoShakeAfterMounted?: boolean
}>
export type ShakeContainerHandle = {
  shake: () => void
}

export const ShakeContainer = React.forwardRef<ShakeContainerHandle, ShakeContainerProps>(
  (props, ref) => {
    const { style, autoShakeAfterMounted = false, children } = props

    const anim = useSharedValue(0)
    const animStyle = useAnimatedStyle(() => {
      const value = interpolate(
        anim.value,
        [0.0, 0.2, 0.4, 0.6, 0.8, 1.0],
        [0.0, -6, -8, 6, 8, 0.0],
        Extrapolation.CLAMP
      )
      return {
        transform: [
          {
            translateX: value,
          },
        ],
      }
    })

    useImperativeHandle(ref, () => ({
      shake: () => {
        anim.value = 0
        anim.value = withSpring(1)
      },
    }))

    useEffect(() => {
      if (autoShakeAfterMounted) {
        return
      }
      anim.value = 0
      anim.value = withSpring(1)
    }, [])

    return <Animated.View style={[animStyle, style]}>{children}</Animated.View>
  }
)
