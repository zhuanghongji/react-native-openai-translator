import { colors } from '../res/colors'
import { dimensions } from '../res/dimensions'
import { useThemeScheme, useThemeSelector } from '../themes/hooks'
import React, { PropsWithChildren } from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

export type CellGroupProps = PropsWithChildren<{
  style?: StyleProp<ViewStyle>
}>

export function CellGroup(props: CellGroupProps) {
  const { style, children } = props

  const { backgroundChat } = useThemeScheme()
  const backgroundColor = useThemeSelector(colors.black, colors.white)
  const count = React.Children.count(children)

  return (
    <View style={[styles.container, { backgroundColor }, style]}>
      {React.Children.map(children, (child, index) => {
        return (
          <>
            {child}
            {index !== count - 1 && (
              <View style={[styles.divider, { backgroundColor: backgroundChat }]} />
            )}
          </>
        )
      })}
    </View>
  )
}

type Styles = {
  container: ViewStyle
  divider: ViewStyle
}

const styles = StyleSheet.create<Styles>({
  container: {
    width: '100%',
  },
  divider: {
    width: '100%',
    height: StyleSheet.hairlineWidth * 2,
    transform: [
      {
        translateX: dimensions.edge,
      },
    ],
  },
})
