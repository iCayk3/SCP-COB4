import Typography from '@mui/material/Typography';
// CUSTOM COMPONENTS
import { FlexBetween } from '@/components/flexbox';

// ==============================================================

// ==============================================================

export default function ListItem({
  title,
  value
}) {
  return <FlexBetween>
      <Typography variant="body2" color="text.secondary">
        {title}
      </Typography>

      {typeof value === 'string' ? <Typography variant="body2" fontWeight={500}>
          {value}
        </Typography> : value}
    </FlexBetween>;
}