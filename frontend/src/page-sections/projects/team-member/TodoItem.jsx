import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
// MUI ICON COMPONENT
import MoreHoriz from '@mui/icons-material/MoreHoriz';
// CUSTOM COMPONENTS
import { FlexBox } from '@/components/flexbox';

// ==============================================================

// ==============================================================

export default function TodoItem({
  date,
  title
}) {
  return <FlexBox justifyContent="space-between" alignItems="center">
      <FlexBox alignItems="center" gap={2}>
        <Avatar variant="rounded" sx={{
        width: 32,
        height: 32
      }}>
          {title[0]}
        </Avatar>

        <div>
          <Typography variant="body2" fontWeight={500} lineHeight={1.5}>
            {title}
          </Typography>

          <Typography variant="body2" fontSize={12} color="text.secondary">
            {date}
          </Typography>
        </div>
      </FlexBox>

      <IconButton>
        <MoreHoriz fontSize="small" />
      </IconButton>
    </FlexBox>;
}