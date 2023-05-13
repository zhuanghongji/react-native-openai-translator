import { dimensions } from '../res/dimensions'
import { useThemeColor } from '../themes/hooks'
import { ThemeSchemeTypo } from '../themes/types'
import { SvgIcon, SvgIconName } from './SvgIcon'
import React from 'react'
import { Insets, Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native'

export interface ToolButtonProps {
  style?: StyleProp<ViewStyle>
  containerSize?: number
  iconSize?: number
  tintTypo?: ThemeSchemeTypo
  hitSlop?: Insets
  disabled?: boolean
  name: SvgIconName
  onPress: () => void
}

export function ToolButton(props: ToolButtonProps) {
  const {
    style,
    containerSize = 32,
    iconSize = dimensions.iconSmall,
    tintTypo = 'tint2',
    hitSlop,
    disabled,
    name,
    onPress,
  } = props

  const tintColor = useThemeColor(tintTypo)

  return (
    <Pressable
      style={[
        styles.container,
        {
          width: containerSize,
          height: containerSize,
          opacity: disabled ? dimensions.disabledOpacity : 1,
        },
        style,
      ]}
      hitSlop={hitSlop}
      disabled={disabled}
      onPress={onPress}>
      <SvgIcon size={iconSize} color={tintColor} name={name} />
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
  },
})
