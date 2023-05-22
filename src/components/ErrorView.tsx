import { colors } from '../res/colors'
import { dimensions } from '../res/dimensions'
import { SvgIcon } from './SvgIcon'
import React from 'react'
import { StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native'

export type ErrorViewProps = {
  style?: StyleProp<ViewStyle>
  title?: string
  subtitle?: string
}

export function ErrorView(props: ErrorViewProps) {
  const { style, title, subtitle } = props

  const color = colors.warning

  return (
    <View style={[styles.container, style]}>
      <SvgIcon style={styles.icon} size={64} name="empty" color={color} />
      <Text style={[styles.title, { color }]}>{title ?? "LOST ONE'S WAY"}</Text>
      <Text style={[styles.subtitle, { color }]}>
        {subtitle ?? "Love's loading bar encountered an error"}
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
    fontSize: 14,
    marginTop: dimensions.edge,
  },
})
