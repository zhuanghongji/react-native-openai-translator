import { useThemeModePref } from '../preferences/storages'
import { colors } from '../res/colors'
import { ThemeSchemeContext } from './ThemeSchemeProvider'
import type { ThemeScheme, ThemeSchemeTypo } from './themes'
import { useContext, useMemo } from 'react'
import { StatusBarStyle, TextStyle, useColorScheme } from 'react-native'

export const LIGHT_THEME_SCHEME: ThemeScheme = {
  text: colors.black,
  text2: colors.c33,
  text3: colors.c66,

  tint: colors.black,
  tint2: colors.c54,
  tint3: colors.c9F,
  tintSelected: colors.white,

  border: colors.black,
  border2: colors.cEB,
  backdrop: colors.cF6,
  backdrop2: colors.cEE,
  backdropSelected: colors.black,
  background: colors.white,
  background2: colors.cED,
  backgroundChat: colors.cED,
  backgroundMessage: colors.white,

  error: colors.warning,
  placeholder: colors.placeholderLight,
}

export const DARK_THEME_SCHEME: ThemeScheme = {
  text: colors.white,
  text2: colors.cCC,
  text3: colors.c99,

  tint: colors.white,
  tint2: colors.cCB,
  tint3: colors.cED,
  tintSelected: colors.black,

  border: colors.cE2,
  border2: colors.c24,
  backdrop: colors.c29,
  backdrop2: colors.c33,
  backdropSelected: colors.white,
  background: colors.black,
  background2: colors.c1D,
  backgroundChat: colors.black,
  backgroundMessage: colors.c2C,

  error: colors.warning,
  placeholder: colors.placeholderDark,
}

export function useThemeDark() {
  const isDark = useColorScheme() === 'dark'
  const [themeMode] = useThemeModePref()
  if (themeMode === 'system') {
    return isDark
  }
  return themeMode === 'dark'
}

export function useStatusBarStyle(): StatusBarStyle {
  return useThemeDark() ? 'light-content' : 'dark-content'
}

export function useThemeScheme(): ThemeScheme {
  return useContext(ThemeSchemeContext)
}

export function useThemeTextStyle(typo: ThemeSchemeTypo): TextStyle {
  const theme = useThemeScheme()
  return useMemo<TextStyle>(() => ({ color: theme[typo] }), [theme, typo])
}
