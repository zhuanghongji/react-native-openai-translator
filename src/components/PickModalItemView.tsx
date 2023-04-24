import { colors } from '../res/colors'
import { useThemeScheme } from '../themes/hooks'
import React from 'react'
import { Pressable, StyleProp, StyleSheet, Text, TextStyle, ViewStyle } from 'react-native'

export type PickModalItemViewProps = {
  style?: StyleProp<ViewStyle>
  label: string
  isSelected: boolean
  onPress: () => void
}

export const PickModalItemView = React.memo((props: PickModalItemViewProps) => {
  const { style, label, isSelected, onPress } = props

  const { text: textColor, text2: contentColor, backdrop2: backdropColor } = useThemeScheme()

  return (
    <Pressable
      style={[
        style,
        {
          backgroundColor: isSelected ? backdropColor : colors.transparent,
        },
      ]}
      onPress={onPress}>
      <Text
        style={[
          styles.text,
          { color: isSelected ? textColor : contentColor },
          { fontWeight: isSelected ? 'bold' : 'normal' },
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
  },
})
