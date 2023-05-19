import { colors } from '../res/colors'
import { dimensions } from '../res/dimensions'
import { useThemeDark } from '../themes/hooks'
import React, { useMemo } from 'react'
import { Pressable, StyleProp, StyleSheet, Text, TextStyle, ViewStyle } from 'react-native'

export type ButtonProps = {
  style?: StyleProp<ViewStyle>
  textStyle?: StyleProp<ViewStyle>
  text: string
  plain?: boolean
  disabled?: boolean
  onPress?: () => void
}

export function Button(props: ButtonProps) {
  const { style, textStyle, text, plain = false, disabled = false, onPress } = props

  const dark = useThemeDark()
  const backgroundColor = useMemo(() => {
    if (plain) {
      return colors.transparent
    }
    if (disabled) {
      return dark ? colors.white : colors.cCC
    }
    return dark ? colors.white : colors.black
  }, [plain, disabled, dark])
  const color = useMemo(() => {
    if (plain) {
      if (disabled) {
        return dark ? colors.white : colors.cCC
      }
      return dark ? colors.white : colors.black
    }
    if (disabled) {
      return dark ? colors.cCC : colors.white
    }
    return dark ? colors.black : colors.white
  }, [plain, disabled, dark])

  return (
    <Pressable
      style={[styles.container, { backgroundColor }, style]}
      disabled={disabled}
      onPress={onPress}>
      <Text style={[styles.text, textStyle, { color }]}>{text}</Text>
    </Pressable>
  )
}

type Styles = {
  container: ViewStyle
  text: TextStyle
}

const styles = StyleSheet.create<Styles>({
  container: {
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: dimensions.borderRadius,
  },
  text: {
    fontSize: 14,
  },
})
