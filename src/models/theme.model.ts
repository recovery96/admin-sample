import type {
  PaletteColor,
  Color,
  PaletteOptions,
  TypeAction,
  TypeText,
} from '@mui/material'

export interface ExtendedPaletteColor extends PaletteColor {
  lightest: string
  darkest: string
}

export interface ExtendedPalletteColorWithAlphas extends ExtendedPaletteColor {
  alpha4: string
  alpha8: string
  alpha12: string
  alpha30: string
  alpha50: string
}

export interface ExtendedPaletteOptions extends PaletteOptions {
  neutral: Partial<Color>
  primary: ExtendedPalletteColorWithAlphas
  success: ExtendedPalletteColorWithAlphas
  info: ExtendedPalletteColorWithAlphas
  error: ExtendedPalletteColorWithAlphas
  warning: ExtendedPalletteColorWithAlphas
  action: Partial<TypeAction>
  text: Partial<TypeText>
}
