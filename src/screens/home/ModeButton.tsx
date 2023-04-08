import { SvgIcon, SvgIconName } from '../../components/SvgIcon'
import { TranslatorMode } from '../../preferences/options'
import { dimensions } from '../../res/dimensions'
import { useThemeColor } from '../../themes/hooks'
import React from 'react'
import { Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native'

export interface SelectButtonProps {
  style?: StyleProp<ViewStyle>
  icon: SvgIconName
  mode: TranslatorMode
  currentMode: TranslatorMode
  onPress: (mode: TranslatorMode) => void
}

export function ModeButton(props: SelectButtonProps) {
  const { style, icon, mode, currentMode, onPress } = props

  const tint = useThemeColor('tint')
  const tintSelected = useThemeColor('tintSelected')
  const backdropColor = useThemeColor('backdrop2')
  const backdropSelectedColor = useThemeColor('backdropSelected')

  const selected = mode === currentMode
  return (
    <Pressable
      style={[
        styles.container,
        {
          backgroundColor: selected ? backdropSelectedColor : backdropColor,
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
