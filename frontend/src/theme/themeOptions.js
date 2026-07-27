import { THEMES } from '@/utils/constants';
import { darkPalette, lightPalette } from './colors';
export const themesOptions = {
  [THEMES.LIGHT]: {
    palette: lightPalette
  },
  [THEMES.DARK]: {
    palette: darkPalette
  }
};