import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
// MUI ICON COMPONENT
import CheckCircle from '@mui/icons-material/CheckCircle';
// CUSTOM COMPONENTS
import { FlexBox } from '@/components/flexbox';
// STYLED COMPONENTS
import { StyledCard, StyledChip } from './styles';
// CUSTOM UTILS FUNCTION
import { currency } from '@/utils/currency';

// ==============================================================

// ==============================================================

export default function PricingCard({
  title,
  price,
  popular,
  icon,
  features
}) {
  return <StyledCard active={popular ? 1 : 0}>
      {/* PLAN POPULAR TAG */}
      {popular ? <StyledChip label="POPULAR" /> : null}

      {/* PLAN TITLE */}
      <p className="plan-title">{title}</p>

      {/* PLAN PRICE */}
      {price ? <h1 className="plan-price">
          {currency(price)}
          <span>/month</span>
        </h1> : <h1 className="plan-price">Free</h1>}

      {/* ICON */}
      <img src={icon} alt="shape" />

      {/* FEATURE LIST */}
      <Stack spacing={2} mt={5} mb={6}>
        {features.map(item => <FlexBox alignItems="center" gap={1} key={item}>
            <CheckCircle color="success" />
            <p>{item}</p>
          </FlexBox>)}
      </Stack>

      <Button size="large" fullWidth color={popular ? 'primary' : 'secondary'}>
        Choose Plan
      </Button>
    </StyledCard>;
}