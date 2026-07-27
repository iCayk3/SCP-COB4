import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
// CUSTOM COMPONENTS
import ListItem from './ListItem';
import { FlexBetween } from '@/components/flexbox';
// CUSTOM ICON COMPONENTS
import Edit from '@/icons/Edit';
import ShoppingCart from '@/icons/ShoppingCart';

// ===================================================================

// ===================================================================

export default function OrderSummery({
  showCoupon,
  showEditBtn,
  buttonText,
  handleClick
}) {
  return <Card className="p-3">
      <FlexBetween mb={2}>
        <Typography lineHeight={1.5} variant="h6">
          Order Summery
        </Typography>

        {showEditBtn && <IconButton>
            <Edit sx={{
          fontSize: 16,
          color: 'text.secondary'
        }} />
          </IconButton>}
      </FlexBetween>

      <Stack spacing={1.5} mb={5}>
        <ListItem title="Items" value={230} />
        <ListItem title="VATS 0%" value={0} />
        <ListItem title="Sub Total" value={230} />
        <Divider />
        <ListItem title="Total" value={230} valueColor="error.main" />
      </Stack>

      {showCoupon && <TextField fullWidth placeholder="Apply Coupon" sx={{
      mb: 3
    }} slotProps={{
      input: {
        endAdornment: <Button variant="text">Apply</Button>
      }
    }} />}

      <Button fullWidth size="large" variant="contained" onClick={handleClick} startIcon={<ShoppingCart />}>
        {buttonText}
      </Button>
    </Card>;
}