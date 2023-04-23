export interface ThemeScheme {
  // text
  text: string
  text2: string
  text3: string

  // image
  tint: string
  tint2: string
  tint3: string
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

  // others
  error: string
  placeholder: string
}

export type ThemeSchemeTypo = keyof ThemeScheme
