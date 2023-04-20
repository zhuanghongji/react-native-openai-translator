import React from 'react'
import { StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native'

export type TemplateProps = {
  style?: StyleProp<ViewStyle>
}

export function Template(props: TemplateProps) {
  const { style } = props

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.text}>Template</Text>
    </View>
  )
}

type Styles = {
  container: ViewStyle
  text: TextStyle
}

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
  },
  text: {
    fontSize: 14,
  },
})
