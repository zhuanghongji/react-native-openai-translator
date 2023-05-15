import { colors } from '../res/colors'
import { dimensions } from '../res/dimensions'
import { useThemeScheme } from '../themes/hooks'
import React from 'react'
import { Pressable, StyleProp, StyleSheet, Text, TextStyle, ViewStyle } from 'react-native'

export type EmojiAvatarProps = {
  style?: StyleProp<ViewStyle>
  containerSize?: number
  emojiSize?: number
  disabled?: boolean
  value: string
  onPress?: () => void
}

export function EmojiAvatar(props: EmojiAvatarProps) {
  const { style, containerSize = 48, emojiSize = 32, disabled = false, value, onPress } = props

  const { tint3: borderColor } = useThemeScheme()

  return (
    <Pressable
      style={[styles.container, { width: containerSize, borderColor }, style]}
      disabled={disabled}
      onPress={onPress}>
      <Text style={[styles.text, { fontSize: emojiSize }]}>{value}</Text>
    </Pressable>
  )
}

type Styles = {
  container: ViewStyle
  text: TextStyle
}

const styles = StyleSheet.create<Styles>({
  container: {
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: dimensions.borderRadius,
    borderWidth: StyleSheet.hairlineWidth,
  },
  text: {
    color: colors.black,
  },
})
