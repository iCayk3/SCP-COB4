import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
// CUSTOM COMPONENTS
import ItemLayout from './ItemLayout';
// CUSTOM ICON COMPONENT
import Pin from '@/icons/Pin';
export default function PinItem() {
  return <ItemLayout Icon={<Pin sx={{
    fontSize: 16
  }} />}>
      <Typography variant="body2" fontWeight={600}>
        Invitation for crafting engaging designs that speak human workshop
      </Typography>

      <Stack mt={0.5} direction="row" alignItems="center" spacing={1}>
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