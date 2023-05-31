export interface ThemeScheme {
  dark: boolean

  // text
  text: string
  text2: string
  text3: string
  text4: string
  textActive: string
  textInactive: string

  // image
  tint: string
  tint2: string
  tint3: string
  tint4: string
  tintSelected: string

  // view
  border: string
  border2: string
  backdrop: string
  backdrop2: string
  backdropSelected: string
  background: string
  background2: string
  backgroundChat: string
  backgroundMessage: string
  backgroundCell: string
  backgroundItem: string
  backgroundItemDeep: string
  backgroundIndicator: string
  backgroundModal: string
  backgroundBar: string
  divider: string

  // others
  error: string
  placeholder: string
}

export type ThemeSchemeTypo = keyof Omit<ThemeScheme, 'dark'>
