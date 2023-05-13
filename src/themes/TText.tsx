import { useThemeTextStyle } from './hooks'
import { ThemeSchemeTypo } from './types'
import React from 'react'
import { Text, TextProps } from 'react-native'

export type TTextProps = TextProps & { typo: ThemeSchemeTypo }

/**
 * Theme Text
 */
export function TText(props: TTextProps) {
  const { style, typo, children, ...restProps } = props
  const textStyle = useThemeTextStyle(typo)
  return (
    <Text style={[textStyle, style]} {...restProps}>
      {children}
    </Text>
  )
}
