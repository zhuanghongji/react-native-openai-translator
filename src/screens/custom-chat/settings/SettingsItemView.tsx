import { SvgIcon, SvgIconName } from '../../../components/SvgIcon'
import { dimensions } from '../../../res/dimensions'
import { useThemeScheme } from '../../../themes/hooks'
import { useSettingsSelectorContext } from './SettingsSelectorProvider'
import React from 'react'
import { Pressable, StyleProp, StyleSheet, Text, TextStyle, ViewStyle } from 'react-native'

export type SettingsItemViewProps = {
  style?: StyleProp<ViewStyle>
  index: number
  title: string
  subtitle?: string
  iconName?: SvgIconName
  onSelectedNotify: (index: number) => void
}

export function SettingsItemView(props: SettingsItemViewProps) {
  const { style, index, title, subtitle = '', iconName, onSelectedNotify } = props

  const { handleItemPress } = useSettingsSelectorContext()

  const { text: titleColor, text3: subtitleColor } = useThemeScheme()

  return (
    <Pressable
      style={[styles.container, style]}
      onPress={() => {
        onSelectedNotify(index)
        handleItemPress(index)
      }}>
      <Text style={[styles.title, { color: titleColor }]}>{title}</Text>
      <Text style={[styles.subtitle, { color: subtitleColor }]}>{subtitle}</Text>
      {iconName ? (
        <SvgIcon
          style={styles.icon}
          size={dimensions.iconSmall}
          color={subtitleColor}
          name={iconName}
        />
      ) : null}
    </Pressable>
  )
}

type Styles = {
  container: ViewStyle
  title: TextStyle
  subtitle: TextStyle
  icon: ViewStyle
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
    fontSize: 16,
  },
  subtitle: {
    fontSize: 13,
    marginLeft: dimensions.edge,
  },
  icon: {
    marginLeft: dimensions.edge,
  },
})
