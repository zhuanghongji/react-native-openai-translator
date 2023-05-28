import { colors } from '../res/colors'
import { dimensions } from '../res/dimensions'
import { useThemeScheme, useThemeSelector } from '../themes/hooks'
import { SvgIcon } from './SvgIcon'
import React from 'react'
import { Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native'
import Animated, {
  Extrapolation,
  SharedValue,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated'

const BOTTOM = 48
const MAX_OFFSET = 100
const OPACITY_OFFSET = 60

export type TopButtonProps = {
  style?: StyleProp<ViewStyle>
  scrollY: SharedValue<number>
  onPress: () => void
}

export function TopButton(props: TopButtonProps) {
  const { style, scrollY, onPress } = props

  const { tint } = useThemeScheme()
  const backgroundColor = useThemeSelector(colors.black, colors.white)
  const shadowColor = useThemeSelector(colors.white, colors.black)

  const containerAnimStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        scrollY.value,
        [OPACITY_OFFSET, MAX_OFFSET],
        [0, 1],
        Extrapolation.CLAMP
      ),
      transform: [
        {
          translateY: interpolate(
            scrollY.value,
            [0, MAX_OFFSET],
            [MAX_OFFSET, 0],
            Extrapolation.CLAMP
          ),
        },
      ],
    }
  })

  return (
    <Animated.View
      style={[
        styles.container,
        styles.shadow,
        { backgroundColor, shadowColor },
        containerAnimStyle,
        style,
      ]}>
      <Pressable style={styles.touchable} onPress={onPress}>
        <SvgIcon size={dimensions.iconMedium} color={tint} name="align-top" />
      </Pressable>
    </Animated.View>
  )
}

type Styles = {
  container: ViewStyle
  touchable: ViewStyle
  shadow: ViewStyle
}

const styles = StyleSheet.create<Styles>({
  container: {
    position: 'absolute',
    right: dimensions.edge,
    bottom: BOTTOM,
    borderRadius: dimensions.borderRadius,
    margin: 4,
  },
  touchable: {
    width: dimensions.barHeight,
    height: dimensions.barHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shadow: {
    // https://ethercreative.github.io/react-native-shadow-generator/
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
})
