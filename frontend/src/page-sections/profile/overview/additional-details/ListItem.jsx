import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';

// ===========================================================================

// ===========================================================================

export default function ListItem({
  title,
  subTitle,
  Icon,
  color
}) {
  return <Stack direction="row" alignItems="center" spacing={1.5}>
      <Avatar variant="rounded" sx={{
      backgroundColor: alpha(color, 0.2)
    }}>
        <Icon sx={{
        color
      }} />
      </Avatar>

      <div>
        <Typography variant="body2" fontSize={12} color="text.secondary">
          {title}
        </Typography>

        <Typography variant="body2" fontWeight={500} lineHeight={1.7}>
          {subTitle}
        </Typography>
      </div>
    </Stack>;
}