import { alpha } from '@mui/material/styles';

// ==============================================================

// ==============================================================

const grey = {
  25: '#F9FAFB',
  50: '#F6F7F8',
  100: '#f3f4f6',
  200: '#e5e7eb',
  300: '#d1d5db',
  400: '#9ca3af',
  500: '#6b7280',
  600: '#4b5563',
  700: '#374151',
  800: '#1f2937',
  900: '#111827'
};
export const primary = {
  25: '#FAFAFF',
  50: '#F4F4FF',
  100: '#EAEAFE',
  200: '#D4D4FE',
  300: '#B9B9FD',
  400: '#9D9DFC',
  500: '#8282FB',
  600: '#5151D3',
  700: '#5151D3',
  800: '#3D3DAA',
  900: '#2D2D85',
  main: '#6868EB'
};
export const success = {
  25: '#F0FDF5',
  50: '#DCFCE8',
  100: '#BBF7D1',
  200: '#86EFAD',
  300: '#4ADE80',
  400: '#22C55E',
  500: '#16A34A',
  600: '#15803D',
  700: '#166534',
  800: '#14532D',
  900: '#052E16',
  main: '#22C55E'
};
export const warning = {
  25: '#FFFBEB',
  50: '#FEF3C7',
  100: '#FDE68A',
  200: '#FCD34D',
  300: '#FBBF24',
  400: '#F59E0B',
  500: '#D97706',
  600: '#B45309',
  700: '#92400E',
  800: '#78350F',
  900: '#451A03',
  main: '#F59E0B'
};
export const error = {
  25: '#FEF2F2',
  50: '#FEE2E2',
  100: '#FECACA',
  200: '#FCA5A5',
  300: '#F87171',
  400: '#EF4444',
  500: '#DC2626',
  600: '#B91C1C',
  700: '#991B1B',
  800: '#7F1D1D',
  900: '#450A0A',
  main: '#EF4444'
};
export const secondary = {
  ...grey,
  main: '#F6F7F8'
};
export const info = {
  light: '#EAEAFE',
  main: '#8282FB',
  dark: '#5151D3'
};

// FOR LIGHT THEME TEXT COLORS
export const textLight = {
  primary: '#111827',
  disabled: '#d1d5db',
  secondary: '#6b7280'
};

// FOR DARK THEME TEXT COLORS
export const textDark = {
  primary: '#F9FAFB',
  disabled: '#9ca3af',
  secondary: '#d1d5db'
};

// FOR LIGHT THEME ACTION COLORS
export const actionLight = {
  focusOpacity: 0.12,
  hoverOpacity: 0.04,
  selected: grey[50],
  disabled: grey[300],
  disabledOpacity: 0.38,
  selectedOpacity: 0.08,
  activatedOpacity: 0.12,
  focus: alpha('#111827', 0.12),
  hover: alpha('#111827', 0.04),
  active: alpha('#111827', 0.54),
  disabledBackground: alpha('#111827', 0.12)
};

// FOR DARK THEME ACTION COLORS
export const actionDark = {
  focusOpacity: 0.12,
  hoverOpacity: 0.08,
  selected: grey[800],
  disabledOpacity: 0.38,
  selectedOpacity: 0.16,
  activatedOpacity: 0.24,
  disabled: grey[600],
  focus: alpha(grey[100], 0.12),
  hover: alpha(grey[100], 0.08),
  active: alpha(grey[100], 0.54),
  disabledBackground: alpha(grey[100], 0.12)
};

// COMMON COLOR PALETTE
const basePalette = {
  grey,
  info,
  error,
  primary,
  success,
  warning,
  secondary
};

// LIGHT THEME COLOR PALETTE
export const lightPalette = {
  ...basePalette,
  mode: 'light',
  text: textLight,
  divider: grey[200],
  action: actionLight,
  background: {
    paper: '#FFFFFF',
    default: '#F9FAFB'
  }
};

// DARK THEME COLOR PALETTE
export const darkPalette = {
  ...basePalette,
  mode: 'dark',
  text: textDark,
  divider: grey[800],
  action: actionDark,
  background: {
    paper: '#111827',
    default: '#0D1117'
  }
};