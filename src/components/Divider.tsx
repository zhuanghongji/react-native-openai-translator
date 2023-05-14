import { dimensions } from '../res/dimensions'
import { useThemeColor } from '../themes/hooks'
import { ThemeSchemeTypo } from '../themes/types'
import React from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

export type TemplateProps = {
  style?: StyleProp<ViewStyle>
  typo?: ThemeSchemeTypo
}

export function Divider(props: TemplateProps) {
  const { style, typo = 'backgroundChat' } = props

  const backgroundColor = useThemeColor(typo)

  return <View style={[styles.container, { backgroundColor }, style]} />
}

type Styles = {
  container: ViewStyle
}

const styles = StyleSheet.create<Styles>({
  container: {
    width: '100%',
    height: StyleSheet.hairlineWidth * 2,
    transform: [
      {
        translateX: dimensions.edge,
      },
    ],
  },
})
