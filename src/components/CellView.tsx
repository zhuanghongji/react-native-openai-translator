import { colors } from '../res/colors'
import { dimensions } from '../res/dimensions'
import { useThemeDark, useThemeScheme } from '../themes/hooks'
import { SvgIcon } from './SvgIcon'
import React from 'react'
import { Pressable, StyleProp, StyleSheet, Text, TextStyle, ViewStyle } from 'react-native'

export type CellViewProps = {
  style?: StyleProp<ViewStyle>
  title: string
  onPress: () => void
}

export function CellView(props: CellViewProps) {
  const { style, title, onPress } = props

  const { text, tint } = useThemeScheme()

  const dark = useThemeDark()
  const backgroundColor = dark ? colors.black : colors.white

  return (
    <Pressable style={[styles.container, { backgroundColor }, style]} onPress={onPress}>
      <Text style={[styles.title, { color: text }]} numberOfLines={1}>
        {title}
      </Text>
      <SvgIcon size={dimensions.iconMedium} color={tint} name="navigate-next" />
    </Pressable>
  )
}

type Styles = {
  container: ViewStyle
  title: TextStyle
}

const styles = StyleSheet.create<Styles>({
  container: {
    flexDirection: 'row',
    width: '100%',
    height: 48,
    alignItems: 'center',
    paddingHorizontal: dimensions.edge,
  },
  title: {
    flex: 1,
    fontSize: 15,
  },
})
