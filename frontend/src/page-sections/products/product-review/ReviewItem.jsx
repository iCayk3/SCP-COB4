import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import Star from '@mui/icons-material/Star';

// ==============================================================

// ==============================================================

export default function ReviewItem({
  rating,
  comment,
  createdAt,
  user,
  images
}) {
  return <Stack direction="row" alignItems="start" spacing={5}>
      <Stack alignItems="center" flexShrink={0}>
        <Avatar src={user.image} alt={user.name} sx={{
        width: 50,
        height: 50
      }} />

        <Typography variant="body2" fontWeight={500} sx={{
        mt: 1
      }}>
          {user.name}
        </Typography>

        <Typography variant="body2" fontSize={13} color="text.secondary">
          {createdAt}
        </Typography>
      </Stack>

      <div>
        <Rating readOnly value={rating} emptyIcon={<Star sx={{
        opacity: 0.4,
        fontSize: 'inherit'
      }} />} sx={{
        color: 'warning.main',
        fontSize: 20
      }} />

        <Typography variant="body2">{comment}</Typography>

        {images && <Stack direction="row" gap={2} mt={2}>
            {images.map((image, i) => <Avatar key={i} src={image} variant="rounded" sx={{
          width: 50,
          height: 50
        }} />)}
          </Stack>}
      </div>
    </Stack>;
}