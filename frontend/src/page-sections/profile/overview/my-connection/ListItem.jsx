import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

// =======================================================================================

// =======================================================================================

export default function ListItem({
  name,
  imageUrl,
  position
}) {
  return <Stack direction="row" alignItems="center" spacing={1}>
      <Avatar src={imageUrl} alt={name} />

      <div>
        <Typography variant="body2" fontWeight={500} lineHeight={1.7}>
          {name}
        </Typography>

        <Typography variant="body2" fontSize={12} color="text.secondary">
          {position}
        </Typography>
      </div>
    </Stack>;
}