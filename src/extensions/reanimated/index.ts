import { Pressable, PressableProps } from 'react-native'
import Animated from 'react-native-reanimated'
import { Path, PathProps, Svg, SvgProps } from 'react-native-svg'

// MARK: react-native

export const AnimatedPressable = Animated.createAnimatedComponent<PressableProps>(Pressable)

// MARK: react-native-svg

Animated.addWhitelistedUIProps({ fill: true })
Animated.addWhitelistedNativeProps({ fill: true })
export const AnimatedSvg = Animated.createAnimatedComponent<SvgProps>(Svg)
export const AnimatedPath = Animated.createAnimatedComponent<PathProps>(Path)

// MARK: funcs

export function workletClamp(value: number, min: number, max: number) {
  'worklet'
  if (value < min) {
    return min
  }
  if (value > max) {
    return max
  }
  return value
}
