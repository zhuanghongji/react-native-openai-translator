import { dimensions } from '../res/dimensions'
import { useImageThemeColor, useViewThemeColor } from '../themes/hooks'
import { SvgIcon, SvgIconName } from './SvgIcon'
import React from 'react'
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native'

export interface SelectButtonProps {
  style?: StyleProp<ViewStyle>
  name: SvgIconName
  selected: boolean
  onPress: () => void
}

export function ModeButton(props: SelectButtonProps) {
  const { style, name, selected, onPress } = props
  const backgroundColor = useViewThemeColor('backdropSecondary')
  const tint = useImageThemeColor('tint')
  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor }, style]}
      onPress={onPress}>
      <SvgIcon size={dimensions.iconSmall} color={tint} name={name} />
    </TouchableOpacity>
  )
}

type Styles = {
  container: ViewStyle
}

const styles = StyleSheet.create<Styles>({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 32,
    height: 32,
    borderRadius: 8,
  },
})
