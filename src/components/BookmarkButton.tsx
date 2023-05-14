import { hapticSoft } from '../haptic'
import { dimensions } from '../res/dimensions'
import { useThemeColor } from '../themes/hooks'
import { ThemeSchemeTypo } from '../themes/types'
import { SvgIcon, SvgIconName } from './SvgIcon'
import React from 'react'
import { Insets, Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native'

export type BookmarkStatus = 'none' | 'add' | 'added' | 'remove'

export interface BookmarkButtonProps {
  style?: StyleProp<ViewStyle>
  containerSize?: number
  iconSize?: number
  tintTypo?: ThemeSchemeTypo
  hitSlop?: Insets
  disabled?: boolean
  status: BookmarkStatus
  onPress?: (status: BookmarkStatus) => void
}

export function BookmarkButton(props: BookmarkButtonProps) {
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

  let iconName: SvgIconName = 'bookmark-add'
  if (status === 'add') {
    iconName = 'bookmark-add'
  } else if (status === 'added') {
    iconName = 'bookmark-added'
  } else if (status === 'remove') {
    iconName = 'bookmark-remove'
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
