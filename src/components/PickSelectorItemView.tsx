import { colors } from '../res/colors'
import { dimensions } from '../res/dimensions'
import { useThemeColor } from '../themes/hooks'
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

  const textColor = useThemeColor('text')
  const contentColor = useThemeColor('text2')
  const backdropColor = useThemeColor('backdrop2')

  return (
    <Pressable
      style={[
        {
          backgroundColor: isSelected ? backdropColor : colors.transparent,
        },
        style,
      ]}
      onPress={onPress}>
      <Text
        style={[
          styles.text,
          { color: isSelected ? textColor : contentColor },
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
