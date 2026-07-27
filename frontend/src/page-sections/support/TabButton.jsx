import ButtonBase from '@mui/material/ButtonBase';
import { styled } from '@mui/material/styles';
// TYPES

// STYLED COMPONENTS
const StyledButton = styled(ButtonBase, {
  shouldForwardProp: prop => prop !== 'active'
})(({
  theme,
  active
}) => ({
  fontSize: 14,
  fontWeight: 600,
  borderRadius: 8,
  padding: '.5rem 1rem',
  color: theme.palette.grey[500],
  ...(active && {
    backgroundColor: 'white',
    color: theme.palette.primary.main,
    ...theme.applyStyles('dark', {
      backgroundColor: theme.palette.grey[600]
    })
  })
}));

// ==============================================================

// ==============================================================

export default function TabButton({
  active,
  handleChange,
  title
}) {
  return <StyledButton disableRipple onClick={handleChange(title)} active={active === title}>
      {title}
    </StyledButton>;
}