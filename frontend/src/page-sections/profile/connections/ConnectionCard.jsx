import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
// MUI ICON COMPONENT
import Add from '@mui/icons-material/Add';
// CUSTOM COMPONENTS
import AmountCard from './AmountCard';
import { FlexBetween } from '@/components/flexbox';
// CUSTOM ICON COMPONENTS
import ChartBar4 from '@/icons/ChartBar4';
import DollarOutlined from '@/icons/DollarOutlined';
// STYLED COMPONENT
import { StyledCard } from './styles';

// ====================================================================

// ====================================================================

export default function ConnectionCard({
  img,
  name,
  position,
  connected
}) {
  return <StyledCard>
      <Avatar src={img} alt={name} sx={{
      width: 60,
      height: 60
    }} />

      <Typography variant="body2" sx={{
      fontWeight: 500,
      mt: 1.5
    }}>
        {name}
      </Typography>

      <Typography variant="caption" color="text.secondary">
        {position}
      </Typography>

      <Stack width="100%" maxWidth={{
      xl: '80%',
      lg: '90%',
      xs: '80%'
    }}>
        <FlexBetween mb={3}>
          <AmountCard Icon={DollarOutlined} title="Avg Income" amount={14500} />
          <AmountCard Icon={ChartBar4} title="Avg Income" amount={26500} />
        </FlexBetween>

        <Button fullWidth startIcon={<Add />} color={connected ? 'primary' : 'secondary'} variant={connected ? 'contained' : 'outlined'}>
          {connected ? 'Connected' : 'Connect'}
        </Button>
      </Stack>
    </StyledCard>;
}