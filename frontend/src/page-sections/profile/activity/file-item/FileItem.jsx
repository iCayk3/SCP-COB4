import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
// CUSTOM COMPONENTS
import ListItem from './ListItem';
import ItemLayout from '../ItemLayout';
// CUSTOM ICON COMPONENT
import Link from '@/icons/Link';
// STYLED COMPONENTS
import { StyledStack } from './styles';
export default function FileItem() {
  return <ItemLayout Icon={<Link sx={{
    fontSize: 16
  }} />}>
      <Typography variant="body2" fontWeight={500} mb={0.5}>
        Invitation for crafting engaging designs that speak human workshop
      </Typography>

      <Stack mt={0.5} direction="row" alignItems="center" spacing={1}>
        <Typography variant="caption" color="text.secondary">
          Added at 4.23 PM by
        </Typography>

        <Avatar src="/static/user/user-9.png" sx={{
        width: 16,
        height: 16
      }} />
      </Stack>

      <StyledStack direction="row">
        <ListItem title="Finance KPI App" icon="/static/files-icon/pdf.svg" size={90} />
        <ListItem title="Css File Yoga App" icon="/static/files-icon/css.svg" size={90} />
        <ListItem title="All JPGS From Yoga App" icon="/static/files-icon/jpg.svg" size={90} />
      </StyledStack>
    </ItemLayout>;
}