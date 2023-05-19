import { useThemeColor } from '../themes/hooks'
import { ThemeSchemeTypo } from '../themes/types'
import React from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

export type DividerProps = {
  style?: StyleProp<ViewStyle>
  typo?: ThemeSchemeTypo
  wing?: number
}

export function Divider(props: DividerProps) {
  const { style, typo = 'backgroundChat', wing = 0 } = props

  const backgroundColor = useThemeColor(typo)

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor,
          transform: [{ translateX: wing }],
        },
        style,
      ]}
    />
  )
}

type Styles = {
  container: ViewStyle
}

const styles = StyleSheet.create<Styles>({
  container: {
    width: '100%',
    height: StyleSheet.hairlineWidth * 2,
  },
})
