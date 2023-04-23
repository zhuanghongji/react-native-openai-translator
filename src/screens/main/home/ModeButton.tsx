import { AnimatedSvgIcon, SvgIconName } from '../../../components/SvgIcon'
import { AnimatedPressable } from '../../../extensions/reanimated'
import { TranslatorMode } from '../../../preferences/options'
import { dimensions } from '../../../res/dimensions'
import { useThemeColor } from '../../../themes/hooks'
import React from 'react'
import { StyleProp, StyleSheet, ViewStyle } from 'react-native'
import {
  Extrapolation,
  SharedValue,
  interpolate,
  interpolateColor,
  useAnimatedProps,
  useAnimatedStyle,
} from 'react-native-reanimated'
import { PathProps } from 'react-native-svg'

export interface SelectButtonProps {
  style?: StyleProp<ViewStyle>
  index: number
  icon: SvgIconName
  mode: TranslatorMode
  pageOffset: SharedValue<number>
  onPress: (index: number, mode: TranslatorMode) => void
}

export function ModeButton(props: SelectButtonProps) {
  const { style, index, icon, mode, pageOffset, onPress } = props

  const tint = useThemeColor('tint')
  const tintSelected = useThemeColor('tintSelected')
  const backdropColor = useThemeColor('backdrop2')
  const backdropSelectedColor = useThemeColor('backdropSelected')

  const backgroundStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        pageOffset.value,
        [index - 1, index, index + 1],
        [backdropColor, backdropSelectedColor, backdropColor]
      ),
    }
  })

  const animatedProps1 = useAnimatedProps<PathProps>(() => {
    return {
      fillOpacity: interpolate(
        pageOffset.value,
        [index - 1, index, index + 1],
        [1, 0, 1],
        Extrapolation.CLAMP
      ),
    }
  })
  const animatedProps2 = useAnimatedProps<PathProps>(() => {
    return {
      fillOpacity: interpolate(
        pageOffset.value,
        [index - 1, index, index + 1],
        [0, 1, 0],
        Extrapolation.CLAMP
      ),
    }
  })

  return (
    <AnimatedPressable
      style={[styles.container, backgroundStyle, style]}
      onPress={() => onPress(index, mode)}>
      <AnimatedSvgIcon
        style={{ position: 'absolute' }}
        size={dimensions.iconSmall}
        color={tint}
        name={icon}
        animatedProps={animatedProps1}
      />
      <AnimatedSvgIcon
        size={dimensions.iconSmall}
        color={tintSelected}
        name={icon}
        animatedProps={animatedProps2}
      />
    </AnimatedPressable>
  )
}

type Styles = {
  container: ViewStyle
}

const styles = StyleSheet.create<Styles>({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 32,
    height: 32,
    borderRadius: 8,
  },
})
