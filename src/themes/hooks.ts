import { useThemeModePref } from '../preferences/storages'
import { ThemeSchemeContext } from './ThemeSchemeContext'
import type { ThemeScheme, ThemeSchemeTypo } from './types'
import { useContext, useMemo } from 'react'
import { StatusBarStyle, TextStyle, useColorScheme } from 'react-native'

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

export function useThemeSelector(darkColor: string, lightColor: string) {
  return useThemeDark() ? darkColor : lightColor
}

export function useThemeScheme(): ThemeScheme {
  return useContext(ThemeSchemeContext)
}

export function useThemeColor(typo: ThemeSchemeTypo): string {
  return useContext(ThemeSchemeContext)[typo]
}

export function useThemeTextStyle(typo: ThemeSchemeTypo): TextStyle {
  const theme = useThemeScheme()
  return useMemo<TextStyle>(() => ({ color: theme[typo] }), [theme, typo])
}
