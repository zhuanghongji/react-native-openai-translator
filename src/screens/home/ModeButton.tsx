import { SvgIcon, SvgIconName } from '../../components/SvgIcon'
import { dimensions } from '../../res/dimensions'
import { TranslateMode } from '../../res/settings'
import { useImageThemeColor, useViewThemeColor } from '../../themes/hooks'
import React from 'react'
import { Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native'

export interface SelectButtonProps {
  style?: StyleProp<ViewStyle>
  icon: SvgIconName
  mode: TranslateMode
  currentMode: TranslateMode
  onPress: (mode: TranslateMode) => void
}

export function ModeButton(props: SelectButtonProps) {
  const { style, icon, mode, currentMode, onPress } = props
  const backdropSecondaryColor = useViewThemeColor('backdropSecondary')
  const backdropSelectedColor = useViewThemeColor('backdropSelected')
  const tint = useImageThemeColor('tint')
  const tintSelected = useImageThemeColor('tintSelected')

  const selected = mode === currentMode
  return (
    <Pressable
      style={[
        styles.container,
        {
          backgroundColor: selected
            ? backdropSelectedColor
            : backdropSecondaryColor,
        },
        style,
      ]}
      onPress={() => onPress(mode)}>
      <SvgIcon
        size={dimensions.iconSmall}
        color={selected ? tintSelected : tint}
        name={icon}
      />
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
    borderRadius: 8,
  },
})