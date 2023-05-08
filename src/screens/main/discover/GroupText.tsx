import { dimensions } from '../../../res/dimensions'
import { useThemeScheme } from '../../../themes/hooks'
import React from 'react'
import { StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native'

export type GroupTextProps = {
  style?: StyleProp<ViewStyle>
  value: string
}

export function GroupText(props: GroupTextProps) {
  const { style, value } = props
  const { backgroundChat: backgroundColor, text3 } = useThemeScheme()

  return (
    <View style={[styles.container, { backgroundColor }, style]}>
      <Text style={[styles.text, { color: text3 }]}>{value}</Text>
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
  },
  text: {
    fontSize: 12,
    marginVertical: dimensions.edge / 2,
    marginLeft: dimensions.edge,
  },
})
