import { useTextThemeStyle } from '../themes/hooks'
import { TextThemeType } from '../themes/themes'
import React from 'react'
import { Text, TextProps } from 'react-native'

export type TTextProps = TextProps & { type: TextThemeType }

/**
 * Theme Text
 */
export function TText(props: TTextProps) {
  const { style, type, ...restProps } = props
  const textStyle = useTextThemeStyle(type)
  return <Text style={[style, textStyle]} {...restProps} />
}
