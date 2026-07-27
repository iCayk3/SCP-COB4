import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
// CUSTOM COMPONENTS
import ItemLayout from './ItemLayout';
// CUSTOM ICON COMPONENT
import Layers from '@/icons/Layers';
export default function LayerItem() {
  return <ItemLayout Icon={<Layers sx={{
    fontSize: 16
  }} />}>
      <Typography variant="body2" fontWeight={500} sx={{
      mb: 0.5,
      span: {
        color: 'primary.main'
      }
    }}>
        Task <span>#45890</span> merged with <span>#45890</span> in “Ads Pro Admin Dashboard
        project:
      </Typography>

      <Stack direction="row" alignItems="center" spacing={1}>
        <Typography variant="caption" color="text.secondary">
          Added at 4.23 PM by
        </Typography>

        <Avatar src="/static/user/user-11.png" sx={{
        width: 16,
        height: 16
      }} />
      </Stack>
    </ItemLayout>;
}