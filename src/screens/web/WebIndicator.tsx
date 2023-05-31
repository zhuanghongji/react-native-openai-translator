import { useThemeScheme } from '../../themes/hooks'
import React, { useEffect, useImperativeHandle, useRef } from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { useSafeAreaFrame } from 'react-native-safe-area-context'

export type WebIndicatorProps = {
  style?: StyleProp<ViewStyle>
  indicatorStyle?: StyleProp<ViewStyle>
}

export type WebIndicatorHandle = {
  updatePropgress: (progress: number) => void
}

export const WebIndicator = React.forwardRef<WebIndicatorHandle, WebIndicatorProps>(
  (props, ref) => {
    const { style, indicatorStyle } = props

    const { backgroundIndicator: backgroundColor } = useThemeScheme()
    const { width: frameWidth } = useSafeAreaFrame()

    const indicatorProgress = useSharedValue(0)
    const indicatorAnimStyle = useAnimatedStyle(() => {
      return {
        opacity: 1 - indicatorProgress.value,
        width: interpolate(indicatorProgress.value, [0, 1], [0, frameWidth], Extrapolation.CLAMP),
      }
    })

    const currentPropgress = useRef(0)
    const updatePropgress = (progress: number) => {
      if (currentPropgress.current >= 1) {
        return
      }
      currentPropgress.current = progress
      indicatorProgress.value = withTiming(progress, { duration: 600, easing: Easing.ease })
    }

    useImperativeHandle(ref, () => ({ updatePropgress }))

    useEffect(() => {
      indicatorProgress.value = withTiming(0.01, { duration: 600, easing: Easing.ease })
    }, [])

    return (
      <View style={[styles.container, style]}>
        {
          <Animated.View
            style={[styles.indicator, { backgroundColor }, indicatorAnimStyle, indicatorStyle]}
          />
        }
      </View>
    )
  }
)

type Styles = {
  container: ViewStyle
  indicator: ViewStyle
}

const styles = StyleSheet.create<Styles>({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
  },
  indicator: {
    height: 2,
    borderTopRightRadius: 1,
    borderBottomRightRadius: 1,
  },
})
