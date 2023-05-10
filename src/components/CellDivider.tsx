import { dimensions } from '../res/dimensions'
import React from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

export type CellDividerProps = {
  style?: StyleProp<ViewStyle>
}

export function CellDivider(props: CellDividerProps) {
  const { style } = props

  return <View style={[styles.container, style]} />
}

type Styles = {
  container: ViewStyle
}

const styles = StyleSheet.create<Styles>({
  container: {
    width: '100%',
    height: dimensions.edge,
  },
})
