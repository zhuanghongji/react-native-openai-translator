import { SvgIcon } from '../../../components/SvgIcon'
import { dimensions } from '../../../res/dimensions'
import { TText } from '../../../themes/TText'
import { useThemeScheme } from '../../../themes/hooks'
import React from 'react'
import { StyleProp, StyleSheet, TextStyle, View, ViewStyle } from 'react-native'

export type AddTipProps = {
  style?: StyleProp<ViewStyle>
}

export function AddTip(props: AddTipProps) {
  const { style } = props

  const { tint3 } = useThemeScheme()

  return (
    <View style={[styles.container, style]}>
      <SvgIcon style={{}} name="pan-alt" size={dimensions.iconLarge} color={tint3} />
      <TText style={[styles.text, { color: tint3 }]} typo="text">
        {'There is no chat yet,\nclick to create one.'}
      </TText>
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
    alignItems: 'flex-end',
    paddingRight: 14,
  },
  text: {
    textAlign: 'right',
    fontSize: 14,
    lineHeight: 22,
  },
})
