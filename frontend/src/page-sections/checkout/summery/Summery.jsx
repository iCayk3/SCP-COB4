import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import GppGoodOutlined from '@mui/icons-material/GppGoodOutlined';
// CUSTOM COMPONENTS
import ListItem from './ListItem';
// STYLED COMPONENTS
import { StyledParagraph, StyledRoot } from './styles';
// CUSTOM UTILS METHOD
import { currency } from '@/utils/currency';
const CURRENCY_OPTIONS = {
  minimumFractionDigits: 2
};
export default function Summery() {
  return <StyledRoot>
      <Typography variant="h6">Summary</Typography>

      <Stack spacing={1.7} mb={3} mt={2}>
        <ListItem title="Subscription" value={<Chip label="Starter" />} />
        <ListItem title="Billed in month" value={currency(14.0, CURRENCY_OPTIONS)} />
        <Divider />
        <ListItem title="Total Bill" value={currency(15.0, CURRENCY_OPTIONS)} />
        <ListItem title="Taxes" value={currency(1.0, CURRENCY_OPTIONS)} />
        <Divider />
        <ListItem title="Total Billed" value={<Typography variant="h6" color="error">
              {currency(15.0, CURRENCY_OPTIONS)}
            </Typography>} />
      </Stack>

      <Button size="large" fullWidth>
        Upgrade Plan
      </Button>

      <StyledParagraph>
        <GppGoodOutlined className="icon" /> Secure credit card payment
      </StyledParagraph>

      <Typography variant="body2" sx={{
      textAlign: 'center',
      color: 'text.secondary'
    }}>
        This is a secure encrypted payment
      </Typography>
    </StyledRoot>;
}