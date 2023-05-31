import { colors } from '../res/colors'
import { dimensions } from '../res/dimensions'
import { useThemeScheme, useThemeSelector } from '../themes/hooks'
import { SvgIcon } from './SvgIcon'
import React from 'react'
import {
  Pressable,
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native'

export type InputProps = {
  style?: StyleProp<ViewStyle>
  textStyle?: StyleProp<TextStyle>
} & Omit<TextInputProps, 'style'>

export const Input = React.forwardRef<TextInput, InputProps>((props, ref) => {
  const { style, textStyle, value, onChangeText, ...restProps } = props

  const { border: borderColor, text: textColor, placeholder: placeholderColor } = useThemeScheme()
  const iconColor = useThemeSelector(colors.cE2, colors.c24)

  const clearDisabled = value ? false : true

  return (
    <View style={[styles.container, { borderColor }, style]}>
      <TextInput
        hitSlop={dimensions.hitSlop}
        value={value}
        placeholderTextColor={placeholderColor}
        onChangeText={onChangeText}
        {...restProps}
        ref={ref}
        style={[styles.text, { color: textColor }, textStyle]}
      />
      <Pressable
        style={{ marginLeft: dimensions.edge, opacity: clearDisabled ? 0 : 1 }}
        hitSlop={dimensions.hitSlop}
        disabled={clearDisabled}
        onPress={() => onChangeText?.('')}>
        <SvgIcon size={dimensions.iconMedium} color={iconColor} name="close" />
      </Pressable>
    </View>
  )
})

type Styles = {
  container: ViewStyle
  text: TextStyle
}

const styles = StyleSheet.create<Styles>({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    // borderWidth: StyleSheet.hairlineWidth,
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: dimensions.edge,
    borderRadius: dimensions.borderRadius,
  },
  text: {
    flex: 1,
    fontSize: 15,
    includeFontPadding: false,
    padding: 0,
  },
})
