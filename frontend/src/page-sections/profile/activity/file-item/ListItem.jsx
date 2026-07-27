import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// ===================================================================================

// ===================================================================================

export default function ListItem({
  title,
  icon,
  size
}) {
  return <Stack direction="row" alignItems="center" spacing={1} mr={6}>
      <Box width={35} flexShrink={0} display="flex">
        <img src={icon} width="100%" alt={title} />
      </Box>

      <div>
        <Typography variant="body2" lineHeight={1} color="primary.main">
          {title}
        </Typography>

        <Typography variant="caption" color="grey.500">
          {size} mb
        </Typography>
      </div>
    </Stack>;
}