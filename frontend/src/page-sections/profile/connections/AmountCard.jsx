import Typography from '@mui/material/Typography';
// UTILS METHOD
import { currency } from '@/utils/currency';
// STYLED COMPONENT
import { StyledStack } from './styles';

// =====================================================================

// =====================================================================

export default function AmountCard({
  Icon,
  amount,
  title
}) {
  return <StyledStack>
      <Icon className="icon" />

      <Typography variant="body2" fontWeight={500} mt={0.5}>
        {currency(amount)}
      </Typography>

      <Typography noWrap variant="caption" color="grey.500">
        {title}
      </Typography>
    </StyledStack>;
}