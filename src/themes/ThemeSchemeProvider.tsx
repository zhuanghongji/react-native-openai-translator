import { DARK_THEME_SCHEME, LIGHT_THEME_SCHEME, useThemeDark } from './hooks'
import React, { PropsWithChildren, createContext } from 'react'

export const ThemeSchemeContext = createContext(DARK_THEME_SCHEME)

export type ThemeSchemeProviderProps = PropsWithChildren<{}>

export function ThemeSchemeProvider(props: ThemeSchemeProviderProps) {
  const { children } = props

  const dark = useThemeDark()
  const value = dark ? DARK_THEME_SCHEME : LIGHT_THEME_SCHEME

  return <ThemeSchemeContext.Provider value={value}>{children}</ThemeSchemeContext.Provider>
}
