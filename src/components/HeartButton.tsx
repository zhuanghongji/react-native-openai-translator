import { hapticSoft } from '../haptic'
import { dimensions } from '../res/dimensions'
import { useThemeColor } from '../themes/hooks'
import { ThemeSchemeTypo } from '../themes/types'
import { SvgIcon, SvgIconName } from './SvgIcon'
import React from 'react'
import { Insets, Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native'

export type HeartStatus = 'none' | 'checked' | 'minus' | 'plus'

export interface HeartButtonProps {
  style?: StyleProp<ViewStyle>
  containerSize?: number
  iconSize?: number
  tintTypo?: ThemeSchemeTypo
  hitSlop?: Insets
  disabled?: boolean
  status: HeartStatus
  onPress?: (status: HeartStatus) => void
}

export function HeartButton(props: HeartButtonProps) {
  const {
    style,
    containerSize = 32,
    iconSize = dimensions.iconSmall,
    tintTypo = 'tint2',
    hitSlop,
    disabled = false,
    status,
    onPress,
  } = props

  const tintColor = useThemeColor(tintTypo)

  let iconName: SvgIconName = 'heart-none'
  if (status === 'plus') {
    iconName = 'heart-plus'
  } else if (status === 'minus') {
    iconName = 'heart-minus'
  } else if (status === 'checked') {
    iconName = 'heart-checked'
  }

  const _disabled = disabled || status === 'none'
  const _onPress = () => {
    if (!onPress) {
      return
    }
    hapticSoft()
    onPress(status)
  }

  return (
    <Pressable
      style={[
        styles.container,
        {
          width: containerSize,
          height: containerSize,
          opacity: _disabled ? dimensions.disabledOpacity : 1,
        },
        style,
      ]}
      hitSlop={hitSlop}
      disabled={_disabled}
      onPress={_onPress}>
      <SvgIcon size={iconSize} color={tintColor} name={iconName} />
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
