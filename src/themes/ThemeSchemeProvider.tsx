import { ThemeSchemeContext } from './ThemeSchemeContext'
import { useThemeDark } from './hooks'
import { DARK_THEME_SCHEME, LIGHT_THEME_SCHEME } from './schemes'
import React, { PropsWithChildren } from 'react'

export type ThemeSchemeProviderProps = PropsWithChildren<{}>

export function ThemeSchemeProvider(props: ThemeSchemeProviderProps) {
  const { children } = props

  const dark = useThemeDark()
  const value = dark ? DARK_THEME_SCHEME : LIGHT_THEME_SCHEME

  return <ThemeSchemeContext.Provider value={value}>{children}</ThemeSchemeContext.Provider>
}
