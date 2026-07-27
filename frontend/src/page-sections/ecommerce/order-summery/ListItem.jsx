import Typography from '@mui/material/Typography';
import { FlexBetween } from '@/components/flexbox';
import { currency } from '@/utils/currency';

// ==============================================================

// ==============================================================

export default function ListItem({
  title,
  value,
  valueColor
}) {
  return <FlexBetween>
      <Typography variant="body2" color="textSecondary">
        {title}
      </Typography>

      <Typography variant="body2" fontWeight={500} color={valueColor}>
        {currency(value)}
      </Typography>
    </FlexBetween>;
}