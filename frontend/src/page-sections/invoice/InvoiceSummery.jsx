import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
// CUSTOM COMPONENTS
import { FlexBetween } from '@/components/flexbox';
// CUSTOM UTILS METHOD
import { currency } from '@/utils/currency';
export default function InvoiceSummery() {
  return <Box maxWidth={320}>
      <Typography variant="body1" fontWeight={500}>
        Amount
      </Typography>

      <SummeryItem label="Subtotal" value={currency(428)} />
      <SummeryItem label="Discount (BLACKFRIDAY)" value={currency(-8)} />
      <SummeryItem label="VAT (Flat)" value={currency(20)} />
      <Divider sx={{
      my: 2
    }} />
      <SummeryItem label="Total" value={currency(200)} />
    </Box>;
}
function SummeryItem({
  label,
  value
}) {
  return <FlexBetween my={1}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>

      <Typography variant="body2" fontWeight={500}>
        {value}
      </Typography>
    </FlexBetween>;
}