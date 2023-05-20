import { colors } from '../res/colors'
import { dimensions } from '../res/dimensions'
import { useThemeDark, useThemeScheme } from '../themes/hooks'
import { SvgIcon, SvgIconName } from './SvgIcon'
import React from 'react'
import { Pressable, StyleProp, StyleSheet, Text, TextStyle, ViewStyle } from 'react-native'

export type CellViewProps = {
  style?: StyleProp<ViewStyle>
  icon?: SvgIconName
  iconColor?: string
  title: string
  onPress: () => void
}

export function CellView(props: CellViewProps) {
  const { style, icon, iconColor, title, onPress } = props

  const { text, tint } = useThemeScheme()

  const dark = useThemeDark()
  const backgroundColor = dark ? colors.black : colors.white

  return (
    <Pressable style={[styles.container, { backgroundColor }, style]} onPress={onPress}>
      {icon ? (
        <SvgIcon
          style={{ marginRight: dimensions.edge }}
          size={dimensions.iconMedium}
          color={iconColor ?? tint}
          name={icon}
        />
      ) : null}
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
    height: dimensions.cellHeight,
    alignItems: 'center',
    paddingHorizontal: dimensions.edge,
  },
  title: {
    flex: 1,
    fontSize: 15,
  },
})
