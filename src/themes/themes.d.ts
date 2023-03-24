import type { ColorValue } from 'react-native'

export interface TextThemeScheme {
  title: ColorValue
  subtitle: ColorValue
  text: ColorValue
  content: ColorValue
  error: ColorValue
}

export interface ImageThemeScheme {
  tint: ColorValue
  tintSecondary: ColorValue
  tintTertiary: ColorValue
}

export interface ViewThemeScheme {
  border: ColorValue
  borderSecondary: ColorValue
  backdrop: ColorValue
  backdropSecondary: ColorValue
  background: ColorValue
}

export type TextThemeType = keyof TextThemeScheme

export type ImageThemeType = keyof ImageThemeScheme

export type ViewThemeType = keyof ViewThemeScheme

export type ThemeScheme = TextThemeScheme & ImageThemeScheme & ViewThemeScheme
