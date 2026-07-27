import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import AlertTitle from '@mui/material/AlertTitle';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
// MUI ICON COMPONENTS
import Info from '@mui/icons-material/Info';
// CUSTOM COMPONENTS
import { FlexBetween } from '@/components/flexbox';
export default function BillingAddress() {
  return <div className="p-3">
      <Alert severity="info" variant="outlined" icon={<Info />} action={<Button>Add Payment Method</Button>}>
        <AlertTitle>We Need Your Attention</AlertTitle>
        Your payment was declined. To start using tools, please add Payment Method
      </Alert>

      <Stack spacing={2.5} maxWidth={400} py={4}>
        <div>
          <FlexBetween mb={0.5}>
            <Typography variant="body2" fontWeight={500}>
              Users
            </Typography>

            <Typography variant="body2" fontWeight={500} color="primary.main">
              50%
            </Typography>
          </FlexBetween>

          <LinearProgress value={50} variant="determinate" />

          <Typography variant="body2" sx={{
          mt: 1,
          fontSize: 13,
          color: 'text.secondary'
        }}>
            14 Users remaining until your plan requires update
          </Typography>
        </div>

        <div>
          <Typography variant="body2" fontWeight={500}>
            Active until Dec 09, 2021
          </Typography>

          <Typography variant="body2" sx={{
          mt: 0.5,
          fontSize: 13,
          color: 'text.secondary'
        }}>
            We will send you a notification upon Subscription expiration
          </Typography>
        </div>

        <div>
          <Typography variant="body2" fontWeight={500}>
            $24.99 Per Month
          </Typography>

          <Typography variant="body2" sx={{
          mt: 0.5,
          fontSize: 13,
          color: 'text.secondary'
        }}>
            Extended Pro Package. Up to 100 Agents & 25 Projects
          </Typography>
        </div>
      </Stack>

      <Stack direction="row" spacing={3}>
        <Button variant="contained">Upgrade Plan</Button>
        <Button variant="outlined">Cancel</Button>
      </Stack>
    </div>;
}