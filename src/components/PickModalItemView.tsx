import { colors } from '../res/colors'
import { useTextThemeColor, useViewThemeColor } from '../themes/hooks'
import React from 'react'
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle,
} from 'react-native'

export type PickModalItemViewProps = {
  style?: StyleProp<ViewStyle>
  text: string
  isSelected: boolean
  onPress: () => void
}

export const PickModalItemView = React.memo((props: PickModalItemViewProps) => {
  const { style, text, isSelected, onPress } = props

  const textColor = useTextThemeColor('text')
  const contentColor = useTextThemeColor('content')
  const backdropSecondaryColor = useViewThemeColor('backdropSecondary')

  return (
    <Pressable
      style={[
        style,
        {
          backgroundColor: isSelected
            ? backdropSecondaryColor
            : colors.transparent,
        },
      ]}
      onPress={onPress}>
      <Text
        style={[
          styles.text,
          { color: isSelected ? textColor : contentColor },
          { fontWeight: isSelected ? 'bold' : 'normal' },
        ]}>
        {text}
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
