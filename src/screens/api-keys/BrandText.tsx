import { colors } from '../../res/colors'
import { texts } from '../../res/texts'
import React, { useMemo } from 'react'
import { StyleProp, StyleSheet, TextStyle, ViewStyle } from 'react-native'
import Animated, {
  Extrapolation,
  SharedValue,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated'

export type BrandTextProps = {
  style?: StyleProp<ViewStyle>
  anim: SharedValue<number>
  index: number
  value: string
  color: string
  nextColor: string
}

export function BrandText(props: BrandTextProps) {
  const { style, anim, index, value, color, nextColor } = props

  const valueWidth = useSharedValue<number | null>(null)
  const containerAnimStyle = useAnimatedStyle(() => {
    return {
      opacity: index <= anim.value && anim.value <= index + 1 ? 1 : 0,
    }
  })

  const inputRange = useMemo(() => {
    return [index, index + 0.5, index + 1]
  }, [index])
  const valueAnimStyle = useAnimatedStyle(() => {
    if (valueWidth.value === null) {
      return {}
    }
    return {
      width: interpolate(anim.value, inputRange, [0, valueWidth.value, 0], Extrapolation.CLAMP),
      color: interpolateColor(anim.value, inputRange, [color, color, nextColor]),
    }
  })
  const cursorAnimStyle = useAnimatedStyle(() => {
    if (valueWidth.value === null) {
      return {}
    }
    return {
      color: interpolateColor(anim.value, inputRange, [color, color, nextColor]),
    }
  })

  return (
    <Animated.View style={[styles.container, containerAnimStyle, style]}>
      <Animated.Text
        style={[styles.text, valueAnimStyle]}
        numberOfLines={1}
        ellipsizeMode="clip"
        onLayout={e => {
          if (valueWidth.value === null) {
            valueWidth.value = e.nativeEvent.layout.width
          }
        }}>
        {value}
      </Animated.Text>
      <Animated.Text style={[styles.textCursor, cursorAnimStyle]}>
        {texts.assistantCursor}
      </Animated.Text>
    </Animated.View>
  )
}

type Styles = {
  container: ViewStyle
  text: TextStyle
  textCursor: TextStyle
}

const styles = StyleSheet.create<Styles>({
  container: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    color: colors.white,
    includeFontPadding: false,
  },
  textCursor: {
    fontSize: 36,
    color: colors.white,
    includeFontPadding: false,
    marginTop: 2,
  },
})
