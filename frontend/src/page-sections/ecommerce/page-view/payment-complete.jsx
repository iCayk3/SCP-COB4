import { useNavigate } from 'react-router';
// MUI
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
// CUSTOM COMPONENTS
import { FlexBox } from '@/components/flexbox';
// CUSTOM ICON COMPONENTS
import ChevronLeft from '@/icons/ChevronLeft';
import DownloadTo from '@/icons/DownloadTo';
export default function PaymentCompletePageView() {
  const navigate = useNavigate();
  const down500 = useMediaQuery(theme => theme.breakpoints.down(512));
  return <Card sx={{
    mt: 1,
    padding: 4,
    minHeight: 600,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '.content': {
      maxWidth: 400,
      textAlign: 'center'
    }
  }}>
      <div className="content">
        <img src="/static/illustration/payment-complete.svg" width="100%" alt="Payment Complete" />

        <Typography variant="h5" fontWeight={600} sx={{
        mt: 4
      }}>
          Thanks for placing order 🎉
        </Typography>

        <Typography variant="body1" color="primary.main" sx={{
        my: 2
      }}>
          #AOSIDY2
        </Typography>

        <Typography variant="body2">
          We will contact you soon <br /> when the shipment arrives
        </Typography>

        <Divider sx={{
        my: 3
      }} />

        <FlexBox gap={2} flexWrap="wrap">
          <Button color="secondary" variant="outlined" fullWidth={down500} startIcon={<ChevronLeft />} onClick={() => navigate('/dashboard/shop')}>
            Continue Shopping
          </Button>

          <Button color="success" variant="contained" fullWidth={down500} startIcon={<DownloadTo />}>
            Download as PDF
          </Button>
        </FlexBox>
      </div>
    </Card>;
}