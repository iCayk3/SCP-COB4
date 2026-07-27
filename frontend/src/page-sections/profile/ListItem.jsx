import Typography from '@mui/material/Typography';
// CUSTOM COMPONENT
import { FlexBox } from '@/components/flexbox';

// ============================================================================================

// ============================================================================================

export default function ListItem({
  title,
  Icon
}) {
  return <FlexBox gap={1} alignItems="center">
      <Icon sx={{
      fontSize: 14,
      color: 'text.secondary'
    }} />
      <Typography variant="body2" color="text.secondary">
        {title}
      </Typography>
    </FlexBox>;
}