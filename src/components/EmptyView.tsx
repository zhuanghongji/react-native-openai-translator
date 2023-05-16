import { dimensions } from '../res/dimensions'
import { useThemeScheme } from '../themes/hooks'
import { SvgIcon } from './SvgIcon'
import React from 'react'
import { StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native'

export type EmptyViewProps = {
  style?: StyleProp<ViewStyle>
  title?: string
  subtitle?: string
}

export function EmptyView(props: EmptyViewProps) {
  const { style, title, subtitle } = props

  const { tint3: color } = useThemeScheme()

  return (
    <View style={[styles.container, style]}>
      <SvgIcon style={styles.icon} size={64} name="empty" color={color} />
      <Text style={[styles.title, { color }]}>{title ?? 'NO DATA'}</Text>
      <Text style={[styles.subtitle, { color }]}>
        {subtitle ?? 'Just you and me, lost in the moment'}
      </Text>
    </View>
  )
}

type Styles = {
  container: ViewStyle
  icon: ViewStyle
  title: TextStyle
  subtitle: TextStyle
}

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    opacity: 0.9,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: dimensions.edge,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: dimensions.edge,
  },
})
