import { SvgIcon, SvgIconName } from '../../components/SvgIcon'
import { dimensions } from '../../res/dimensions'
import { useThemeColor } from '../../themes/hooks'
import React from 'react'
import { Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native'

export interface ToolButtonProps {
  style?: StyleProp<ViewStyle>
  disabled?: boolean
  name: SvgIconName
  onPress: () => void
}

export function ToolButton(props: ToolButtonProps) {
  const { style, disabled, name, onPress } = props
  const tint2 = useThemeColor('tint2')

  return (
    <Pressable
      style={[styles.container, { opacity: disabled ? dimensions.disabledOpacity : 1 }, style]}
      disabled={disabled}
      onPress={onPress}>
      <SvgIcon size={dimensions.iconSmall} color={tint2} name={name} />
    </Pressable>
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
  },
})
