import { colors } from '../res/colors'
import { ThemeScheme } from './types'

export const LIGHT_THEME_SCHEME: ThemeScheme = {
  dark: false,

  text: colors.black,
  text2: colors.c33,
  text3: colors.c66,
  text4: colors.c99,
  textActive: colors.black,
  textInactive: colors.c99,

  tint: colors.black,
  tint2: colors.c54,
  tint3: colors.c9F,
  tint4: colors.cE2,
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
  backgroundCell: colors.white,
  backgroundItem: colors.white,
  backgroundItemDeep: colors.cED,
  backgroundIndicator: colors.black,
  backgroundModal: colors.cF7,
  backgroundBar: colors.cF7,
  divider: colors.cCC,

  error: colors.warning,
  placeholder: colors.placeholderLight,
}

export const DARK_THEME_SCHEME: ThemeScheme = {
  dark: true,

  text: colors.white,
  text2: colors.cCC,
  text3: colors.c99,
  text4: colors.c54,
  textActive: colors.white,
  textInactive: colors.c66,

  tint: colors.white,
  tint2: colors.cF7,
  tint3: colors.cED,
  tint4: colors.cCB,
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
  backgroundCell: colors.c18,
  backgroundItem: colors.c18,
  backgroundItemDeep: colors.c21,
  backgroundIndicator: colors.white,
  backgroundModal: colors.c1C,
  backgroundBar: colors.c1F,
  divider: colors.c33,

  error: colors.warning,
  placeholder: colors.placeholderDark,
}
