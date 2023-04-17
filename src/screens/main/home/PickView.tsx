import { SvgIcon } from '../../../components/SvgIcon'
import { TText } from '../../../components/TText'
import { colors } from '../../../res/colors'
import { dimensions } from '../../../res/dimensions'
import { useThemeColor } from '../../../themes/hooks'
import React from 'react'
import { StyleProp, StyleSheet, TextStyle, ViewStyle } from 'react-native'
import Animated, { interpolateColor, useAnimatedStyle } from 'react-native-reanimated'

export interface PickViewProps {
  style?: StyleProp<ViewStyle>
  anim: Animated.SharedValue<number>
  label: string
}

export function PickView(props: PickViewProps) {
  const { style, anim, label } = props

  const iconColor = useThemeColor('tint')
  const borderColor = useThemeColor('border')
  const backgroundColor = useThemeColor('backdrop2')
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
        <SvgIcon size={dimensions.iconMedium} color={iconColor} name="errow-drop-down" />
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
    width: 72,
    height: 32,
    paddingLeft: 6,
    paddingRight: 2,
    borderRadius: 4,
    borderWidth: 0.5,
  },
  text: {
    fontSize: 11,
  },
})
