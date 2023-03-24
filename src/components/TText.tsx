import { useTextThemeStyle } from '../themes/hooks'
import { TextThemeType } from '../themes/themes'
import * as React from 'react'
import { Text, TextProps } from 'react-native'

/**
 * Theme Text
 */
export function TText(props: TextProps & { type: TextThemeType }) {
  const { style, type, ...restProps } = props
  const themeStyle = useTextThemeStyle(type)
  return <Text style={[style, themeStyle]} {...restProps} />
}
