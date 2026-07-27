import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
// CUSTOM UTILS METHOD
import { currency } from '@/utils/currency';

// STYLED COMPONENTS
const StyledRoot = styled(Card)(({
  theme
}) => ({
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(3),
  justifyContent: 'space-between',
  '& .content': {
    flex: 1
  },
  '& .img-wrapper': {
    height: 120,
    '& img': {
      objectFit: 'cover',
      objectPosition: 'bottom'
    }
  },
  [theme.breakpoints.down('sm')]: {
    textAlign: 'center',
    rowGap: theme.spacing(5),
    flexDirection: 'column-reverse'
  }
}));
export default function EarningCard() {
  return <StyledRoot>
      <div className="content">
        <Typography variant="body1" fontWeight={600} color="text.secondary">
          Earnings
        </Typography>

        <Typography variant="body2" sx={{
        mb: 3,
        mt: 0.5,
        fontSize: 24,
        fontWeight: 600
      }}>
          {currency(74438.78)}
        </Typography>

        <Button variant="contained">Download</Button>
      </div>

      <div className="img-wrapper">
        <img src="/static/illustration/sales-earning.svg" width="100%" alt="Earnings" />
      </div>
    </StyledRoot>;
}