import Typography from '@mui/material/Typography';
// CUSTOM COMPONENTS
import { FlexBox } from '@/components/flexbox';

// ==============================================================

// ==============================================================

export default function InfoItem({
  title,
  Icon
}) {
  return <FlexBox alignItems="center" gap={1} color="grey.500">
      <Icon sx={{
      fontSize: 18
    }} />
      <Typography variant="body2">{title}</Typography>
    </FlexBox>;
}