import { dimensions } from '../../res/dimensions'
import { useThemeScheme } from '../../themes/hooks'
import React from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

export type SeperatorProps = {
  style?: StyleProp<ViewStyle>
}

export function Seperator(props: SeperatorProps) {
  const { style } = props
  const { border2 } = useThemeScheme()
  return <View style={[styles.container, { backgroundColor: border2 }, style]} />
}

type Styles = {
  container: ViewStyle
}

const styles = StyleSheet.create<Styles>({
  container: {
    width: '100%',
    height: StyleSheet.hairlineWidth,
    transform: [{ translateX: dimensions.edge }],
  },
})
