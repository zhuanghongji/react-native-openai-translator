import { dimensions } from '../../../res/dimensions'
import { useThemeScheme } from '../../../themes/hooks'
import React from 'react'
import { StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native'

export type EmptyViewProps = {
  style?: StyleProp<ViewStyle>
}

export function EmptyView(props: EmptyViewProps) {
  const { style } = props
  const { backgroundChat: backgroundColor, text3 } = useThemeScheme()

  return (
    <View style={[styles.container, { backgroundColor }, style]}>
      <Text style={[styles.text, { color: text3 }]}>Not Found</Text>
    </View>
  )
}

type Styles = {
  container: ViewStyle
  text: TextStyle
}

const styles = StyleSheet.create<Styles>({
  container: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 14,
    marginVertical: dimensions.edge,
  },
})
