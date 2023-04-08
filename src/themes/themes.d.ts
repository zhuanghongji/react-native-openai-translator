import type { ColorValue } from 'react-native'

export interface ThemeScheme {
  // text
  text: ColorValue
  text2: ColorValue

  // image
  tint: ColorValue
  tint2: ColorValue
  tint3: ColorValue
  tintSelected: ColorValue

  // view
  border: ColorValue
  border2: ColorValue
  backdrop: ColorValue
  backdrop2: ColorValue
  backdropSelected: ColorValue
  background: ColorValue
  background2: ColorValue
  backgroundChat: ColorValue
  backgroundMessage: ColorValue

  // others
  error: ColorValue
  placeholder: ColorValue
}

export type ThemeSchemeTypo = keyof ThemeScheme
