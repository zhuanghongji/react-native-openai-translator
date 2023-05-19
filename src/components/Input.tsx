import { dimensions } from '../res/dimensions'
import { useThemeScheme } from '../themes/hooks'
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
  textStyle?: StyleProp<ViewStyle>
} & Omit<TextInputProps, 'style'>

export const Input = React.forwardRef<TextInput, InputProps>((props, ref) => {
  const { style, textStyle, value, onChangeText, ...restProps } = props
  const { tint } = useThemeScheme()

  const clearDisabled = value ? false : true

  return (
    <View style={[styles.container, style]}>
      <TextInput
        hitSlop={dimensions.hitSlop}
        value={value}
        onChangeText={onChangeText}
        {...restProps}
        ref={ref}
        style={[styles.text, textStyle]}
      />
      <Pressable
        style={{ marginLeft: dimensions.edge, opacity: clearDisabled ? 0 : 1 }}
        hitSlop={dimensions.hitSlop}
        disabled={clearDisabled}
        onPress={() => onChangeText?.('')}>
        <SvgIcon size={dimensions.iconMedium} color={tint} name="close" />
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
    borderWidth: 1,
    borderColor: 'black',
    paddingVertical: 8,
    paddingHorizontal: dimensions.edge,
    borderRadius: dimensions.borderRadius,
  },
  text: {
    flex: 1,
    includeFontPadding: false,
    padding: 0,
  },
})
