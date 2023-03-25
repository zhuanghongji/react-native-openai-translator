import { SvgIcon, SvgIconName } from '../../components/SvgIcon'
import { dimensions } from '../../res/dimensions'
import { useImageThemeColor } from '../../themes/hooks'
import React from 'react'
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native'

export interface ToolButtonProps {
  style?: StyleProp<ViewStyle>
  name: SvgIconName
  onPress: () => void
}

export function ToolButton(props: ToolButtonProps) {
  const { style, name, onPress } = props
  const tintSecondary = useImageThemeColor('tintSecondary')
  return (
    <TouchableOpacity style={[styles.container, style]} onPress={onPress}>
      <SvgIcon size={dimensions.iconSmall} color={tintSecondary} name={name} />
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
    // backgroundColor: 'red',
  },
})
