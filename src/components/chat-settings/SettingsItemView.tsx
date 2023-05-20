import { colors } from '../../res/colors'
import { dimensions } from '../../res/dimensions'
import { useThemeSelector } from '../../themes/hooks'
import { useSettingsSelectorContext } from './SettingsSelectorProvider'
import React from 'react'
import { Pressable, StyleProp, StyleSheet, Text, TextStyle, ViewStyle } from 'react-native'

export type SettingsItemViewProps = {
  style?: StyleProp<ViewStyle>
  index: number
  title: string
  onSelectedNotify: (index: number) => void
}

export function SettingsItemView(props: SettingsItemViewProps) {
  const { style, index, title, onSelectedNotify } = props

  const { handleItemPress } = useSettingsSelectorContext()

  const color = useThemeSelector(colors.white, colors.black)

  return (
    <Pressable
      style={[styles.container, style]}
      onPress={() => {
        onSelectedNotify(index)
        handleItemPress(index)
      }}>
      <Text style={[styles.title, { color }]}>{title}</Text>
    </Pressable>
  )
}

type Styles = {
  container: ViewStyle
  title: TextStyle
}

const styles = StyleSheet.create<Styles>({
  container: {
    width: '100%',
    height: 48,
    justifyContent: 'center',
    paddingHorizontal: dimensions.edge,
  },
  title: {
    fontSize: 16,
  },
})
