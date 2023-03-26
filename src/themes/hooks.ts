import type {
  ImageThemeType,
  TextThemeType,
  ThemeScheme,
  ViewThemeType,
} from './themes'
import {
  ColorValue,
  StatusBarStyle,
  TextStyle,
  useColorScheme,
} from 'react-native'

const LIGHT_THEME_SCHEME: ThemeScheme = {
  title: '#000000',
  subtitle: '#545454',
  text: '#000000',
  content: '#545454',
  error: '#FF0000',

  tint: '#000000',
  tintSecondary: '#545454',
  tintTertiary: '#9F9F9F',
  tintSelected: '#FFFFFF',

  border: '#000000',
  borderSecondary: '#EBEBEB',
  backdrop: '#F6F6F6',
  backdropSecondary: '#EEEEEE',
  backdropSelected: '#000000',
  background: '#FFFFFF',
}

const DARK_THEME_SCHEME: ThemeScheme = {
  title: '#FFFFFF',
  subtitle: '#545454',
  text: '#FFFFFF',
  content: '#545454',
  error: '#FF0000',

  tint: '#FFFFFF',
  tintSecondary: '#545454',
  tintTertiary: '#9F9F9F',
  tintSelected: '#000000',

  border: '#FFFFFF',
  borderSecondary: '#EBEBEB',
  backdrop: '#F6F6F6',
  backdropSecondary: '#EEEEEE',
  backdropSelected: '#FFFFFF',
  background: '#000000',
}

export function useThemeScheme(): ThemeScheme {
  const isDark = useColorScheme() === 'dark'
  return isDark ? DARK_THEME_SCHEME : LIGHT_THEME_SCHEME
}

export function useTextThemeStyle(type: TextThemeType): TextStyle {
  const scheme = useThemeScheme()
  return { color: scheme[type] }
}

export function useTextThemeColor(type: TextThemeType): ColorValue {
  return useThemeScheme()[type]
}

export function useImageThemeColor(type: ImageThemeType): ColorValue {
  return useThemeScheme()[type]
}

export function useViewThemeColor(type: ViewThemeType): ColorValue {
  return useThemeScheme()[type]
}

export function useStatusBarStyle(): StatusBarStyle {
  return useColorScheme() === 'dark' ? 'light-content' : 'dark-content'
}
