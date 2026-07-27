import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
export const StyledCard = styled(Card)(({
  theme
}) => ({
  padding: '1rem',
  height: '100%',
  minHeight: 100,
  display: 'flex',
  boxShadow: 'none',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: theme.palette.grey[100],
  ...theme.applyStyles('dark', {
    backgroundColor: theme.palette.grey[700]
  }),
  '& .content': {
    minWidth: '60%'
  }
}));
export default function NewAddressCard() {
  return <StyledCard>
      <div className="content">
        <Typography variant="body2" fontWeight={500} fontSize={14}>
          Enter a new address
        </Typography>

        <Typography variant="caption" color="grey.500">
          Add your new destination..
        </Typography>
      </div>

      <Button variant="contained">New Address</Button>
    </StyledCard>;
}