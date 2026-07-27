import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
// CUSTOM COMPONENT
import { FlexBox } from '@/components/flexbox';
export default function CardForm() {
  return <Stack spacing={2} pt={3}>
      <TextField fullWidth label="Card No" placeholder="xxxx xxxx xxxx xxxx" />
      <TextField fullWidth label="Card Holder" placeholder="John Doe" />
      <FlexBox gap={2}>
        <TextField fullWidth label="Expiry Date" placeholder="MM/YY" />
        <TextField fullWidth label="Card CVC" placeholder="***" />
      </FlexBox>
    </Stack>;
}