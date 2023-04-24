import { SvgIcon } from '../../components/SvgIcon'
import { colors } from '../../res/colors'
import { dimensions } from '../../res/dimensions'
import { TText } from '../../themes/TText'
import { useThemeScheme } from '../../themes/hooks'
import React from 'react'
import { StyleProp, StyleSheet, TextStyle, ViewStyle } from 'react-native'
import Animated, { interpolateColor, useAnimatedStyle } from 'react-native-reanimated'

export interface PickViewProps {
  style?: StyleProp<ViewStyle>
  label: string
  anim: Animated.SharedValue<number>
}

export function PickView(props: PickViewProps) {
  const { style, label, anim } = props

  const { tint: iconColor, border: borderColor, backdrop2: backgroundColor } = useThemeScheme()

  const borderStyle = useAnimatedStyle(() => {
    return {
      borderColor: interpolateColor(
        anim.value,
        [0, 1],
        [colors.transparent, borderColor as string]
      ),
    }
  })
  const transfromStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: `${anim.value * 90}deg`,
        },
      ],
    }
  })

  return (
    <Animated.View style={[styles.container, { backgroundColor }, borderStyle, style]}>
      <TText style={styles.text} typo="text">
        {label}
      </TText>
      <Animated.View style={transfromStyle}>
        <SvgIcon size={dimensions.iconLarge} color={iconColor} name="errow-drop-down" />
      </Animated.View>
    </Animated.View>
  )
}

type Styles = {
  container: ViewStyle
  text: TextStyle
}

const styles = StyleSheet.create<Styles>({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: 42,
    paddingLeft: dimensions.edge,
    paddingRight: dimensions.edge - 6,
    borderRadius: 4,
    borderWidth: 0.5,
  },
  text: {
    fontSize: 14,
  },
})
