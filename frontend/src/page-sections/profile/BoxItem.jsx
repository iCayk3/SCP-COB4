import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
const StyledStack = styled('div')(({
  theme
}) => ({
  width: 130,
  borderRadius: '8px',
  textAlign: 'center',
  padding: '1rem .5rem',
  border: `1px solid ${theme.palette.divider}`,
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    marginBottom: 8
  }
}));

// ============================================================================================

// ============================================================================================

export default function BoxItem({
  title,
  amount,
  color
}) {
  return <StyledStack>
      <Typography variant="body1" fontWeight={500} color={color}>
        {amount}
      </Typography>

      <Typography variant="body2" color="text.secondary">
        {title}
      </Typography>
    </StyledStack>;
}