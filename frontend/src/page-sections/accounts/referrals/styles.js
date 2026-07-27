import InputBase from '@mui/material/InputBase';
import { styled } from '@mui/material/styles';
export const EarningBox = styled('div')(({
  theme
}) => ({
  paddingBlock: 12,
  textAlign: 'center',
  borderRadius: '8px',
  border: `1px solid ${theme.palette.divider}`
}));
export const StyledInputBase = styled(InputBase)(({
  theme
}) => ({
  fontSize: 12,
  fontWeight: 500,
  borderRadius: 8,
  padding: '.5rem 1rem',
  backgroundColor: theme.palette.action.hover,
  '.MuiInputBase-input.Mui-disabled': {
    WebkitTextFillColor: theme.palette.text.secondary
  }
}));