import { createTheme } from '@mui/material/styles';

// ==============================================================
// Theme Dependencies
// ==============================================================
import { merge } from '@/utils/helpers';
import { THEMES } from '@/utils/constants';
import { shadows } from '@/theme/shadows';
import { themesOptions } from '@/theme/themeOptions';
import { componentsOverride } from '@/theme/components';

// ==============================================================
// Font Imports
// ==============================================================
import '@fontsource/public-sans/400.css';
import '@fontsource/public-sans/500.css';
import '@fontsource/public-sans/600.css';
import '@fontsource/public-sans/700.css';

// ==============================================================
// Base Theme Configuration
// ==============================================================
const baseOptions = {
  direction: 'ltr',
  typography: {
    fontFamily: "'Public Sans', sans-serif",
    body1: {
      fontSize: 16
    },
    body2: {
      fontSize: 14
    },
    h1: {
      fontSize: 48,
      fontWeight: 700,
      lineHeight: 1.5
    },
    h2: {
      fontSize: 40,
      fontWeight: 700,
      lineHeight: 1.5
    },
    h3: {
      fontSize: 36,
      fontWeight: 700,
      lineHeight: 1.5
    },
    h4: {
      fontSize: 32,
      fontWeight: 600
    },
    h5: {
      fontSize: 28,
      fontWeight: 600,
      lineHeight: 1
    },
    h6: {
      fontSize: 18,
      fontWeight: 500
    }
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536
    }
  }
};

// ==============================================================
// Theme Settings Type
// ==============================================================

// ==============================================================
// Theme Factory Function
// ==============================================================
export function createCustomTheme(settings) {
  // Get theme configuration or fallback to light theme
  const themeOption = themesOptions[settings.theme] || themesOptions[THEMES.LIGHT];

  // Merge base options with theme options and user settings
  const mergedThemeOptions = merge({}, baseOptions, themeOption, {
    direction: settings.direction
  });

  // Create theme instance
  const theme = createTheme(mergedThemeOptions);

  // Override shadows
  theme.shadows = shadows(theme);

  // Override components
  theme.components = componentsOverride(theme);
  return theme;
}