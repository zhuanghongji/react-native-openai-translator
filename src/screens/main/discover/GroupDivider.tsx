import { dimensions } from '../../../res/dimensions'
import { useThemeScheme } from '../../../themes/hooks'
import React from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

export type GroupDividerProps = {
  style?: StyleProp<ViewStyle>
}

export function GroupDivider(props: GroupDividerProps) {
  const { style } = props
  const { backgroundChat: backgroundColor } = useThemeScheme()

  return <View style={[styles.container, { backgroundColor }, style]} />
}

type Styles = {
  container: ViewStyle
}

const styles = StyleSheet.create<Styles>({
  container: {
    width: '100%',
    height: dimensions.edge * 1.5,
  },
})
