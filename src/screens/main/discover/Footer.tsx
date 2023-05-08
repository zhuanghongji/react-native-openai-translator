import { useThemeScheme } from '../../../themes/hooks'
import React from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

export type FooterProps = {
  style?: StyleProp<ViewStyle>
}

export function Footer(props: FooterProps) {
  const { style } = props
  const { backgroundChat: backgroundColor, border2 } = useThemeScheme()

  return (
    <View style={[styles.container, { backgroundColor }, style]}>
      <View style={{ width: '100%', height: StyleSheet.hairlineWidth, backgroundColor: border2 }} />
    </View>
  )
}

type Styles = {
  container: ViewStyle
}

const styles = StyleSheet.create<Styles>({
  container: {
    width: '100%',
    paddingBottom: 48,
  },
})
