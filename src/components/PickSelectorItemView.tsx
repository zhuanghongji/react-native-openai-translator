import { colors } from '../res/colors'
import { dimensions } from '../res/dimensions'
import { useThemeScheme, useThemeSelector } from '../themes/hooks'
import React from 'react'
import { Pressable, StyleProp, StyleSheet, Text, TextStyle, ViewStyle } from 'react-native'

export type PickSelectorItemViewProps = {
  style?: StyleProp<ViewStyle>
  labelStyle?: StyleProp<TextStyle>
  label: string
  isSelected: boolean
  onPress: () => void
}

export const PickSelectorItemView = React.memo((props: PickSelectorItemViewProps) => {
  const { style, labelStyle, label, isSelected, onPress } = props

  const selectedBackdropColor = useThemeSelector(colors.c29, colors.cEE)
  const { text: selectedTextColor, text2: unselectedTextColor } = useThemeScheme()

  return (
    <Pressable
      style={[
        {
          backgroundColor: isSelected ? selectedBackdropColor : colors.transparent,
        },
        style,
      ]}
      onPress={onPress}>
      <Text
        style={[
          styles.text,
          { color: isSelected ? selectedTextColor : unselectedTextColor },
          { fontWeight: isSelected ? 'bold' : 'normal' },
          labelStyle,
        ]}>
        {label}
      </Text>
    </Pressable>
  )
})

type Styles = {
  text: TextStyle
}

const styles = StyleSheet.create<Styles>({
  text: {
    fontSize: 14,
    padding: 0,
    marginHorizontal: dimensions.edge,
  },
})
