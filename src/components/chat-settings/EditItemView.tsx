import { dimensions } from '../../res/dimensions'
import { useThemeScheme } from '../../themes/hooks'
import { SvgIcon } from '../SvgIcon'
import React from 'react'
import { Pressable, StyleProp, StyleSheet, Text, TextStyle, ViewStyle } from 'react-native'

export type EditItemViewProps = {
  style?: StyleProp<ViewStyle>
  title: string
  subtitle?: string
  selected: boolean
  onPress: () => void
}

export function EditItemView(props: EditItemViewProps) {
  const { style, title, subtitle = '', selected, onPress } = props

  const { tint, tint2 } = useThemeScheme()

  return (
    <Pressable style={[styles.container, style]} onPress={onPress}>
      <Text
        style={[
          styles.title,
          {
            color: tint,
            fontWeight: selected ? 'bold' : 'normal',
          },
        ]}>
        <Text>{title}</Text>
        <Text style={{ color: tint2 }}>{subtitle}</Text>
      </Text>
      {selected ? (
        <SvgIcon style={styles.icon} size={dimensions.iconMedium} color={tint} name="check" />
      ) : null}
    </Pressable>
  )
}

type Styles = {
  container: ViewStyle
  title: TextStyle
  icon: ViewStyle
}

const styles = StyleSheet.create<Styles>({
  container: {
    flexDirection: 'row',
    width: '100%',
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: dimensions.edge,
  },
  title: {
    flex: 1,
    fontSize: 16,
  },
  icon: {
    marginLeft: dimensions.edge,
  },
})
