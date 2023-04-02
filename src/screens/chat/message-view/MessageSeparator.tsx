import React from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

export type MessageSeparatorProps = {
  style?: StyleProp<ViewStyle>
}

export function MessageSeparator(props: MessageSeparatorProps) {
  const { style } = props

  return <View style={[style, styles.container]} />
}

type Styles = {
  container: ViewStyle
}

const styles = StyleSheet.create<Styles>({
  container: {
    height: 4,
  },
})
