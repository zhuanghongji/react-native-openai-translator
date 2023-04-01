import React, { useEffect } from 'react'
import { StyleProp, View, ViewStyle } from 'react-native'
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  useAnimatedProps,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated'
import Svg, { Rect, RectProps } from 'react-native-svg'

const AnimatedRect = Animated.createAnimatedComponent(Rect)
Animated.addWhitelistedUIProps({ strokeDashoffset: true })
Animated.addWhitelistedNativeProps({ strokeDashoffset: true })

export interface ScanAreaViewProps {
  style: StyleProp<ViewStyle>
  width: number
  height: number
}

export function ScanAreaView(props: ScanAreaViewProps): JSX.Element {
  const { style, width, height } = props

  const strokeWidth = 1
  const strokeColor = 'white'
  const dashArray = [4, 4]

  const perimeter = useSharedValue((width + height) * 2)

  const anim = useSharedValue(0)
  const animProps = useAnimatedProps<RectProps>(() => {
    return {
      strokeDashoffset: interpolate(
        anim.value,
        [0, 1],
        [0, -perimeter.value],
        Extrapolation.CLAMP
      ),
    }
  })

  useEffect(() => {
    anim.value = withRepeat(
      withTiming(1, { duration: perimeter.value * 24, easing: Easing.linear }),
      -1,
      false
    )
  }, [anim, perimeter])

  return (
    <View style={[style, { width, height }]}>
      <Svg width={width} height={height}>
        <AnimatedRect
          x={strokeWidth / 2}
          y={strokeWidth / 2}
          width={width - strokeWidth}
          height={height - strokeWidth}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={dashArray}
          fill="none"
          animatedProps={animProps}
        />
      </Svg>
    </View>
  )
}
