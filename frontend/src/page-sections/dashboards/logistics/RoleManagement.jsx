import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import ManageAccounts from '@mui/icons-material/ManageAccounts';
import { FlexBetween, FlexBox, FlexRowAlign } from '@/components/flexbox';
const ROLE_MANAGEMENTS = [{
  id: 'V7c6DeV3Z5U0-OXqprCh1',
  title: 'Material sourcing',
  image: '/static/role/1.png',
  subtitle: 'Material sourcing involves'
}, {
  id: 'GtvUcxEo-_TWqNePmZU0t',
  title: 'Transportation',
  image: '/static/role/2.png',
  subtitle: 'The best carrier based cost'
}, {
  id: 'zYnHBbmfG2-IgXPlypPhp',
  title: 'Order fulfillment',
  image: '/static/role/3.png',
  subtitle: 'The process comprise order'
}, {
  id: 'XLUIHG_K02OW6JOZxp_6o',
  title: 'Warehousing',
  image: '/static/role/4.png',
  subtitle: 'Planners consider warehouse'
}, {
  id: 'aZW8zfRD5v-fXw7qzAU7C',
  title: 'Supply management',
  image: '/static/role/5.png',
  subtitle: 'Logistics is an important link'
}];
export default function RoleManagement() {
  const theme = useTheme();
  return <Card className="p-3">
      <Typography variant="h6">Role Management</Typography>

      <Typography variant="body2" fontSize={13} color="text.secondary">
        The important 5 logistics role
      </Typography>

      <Stack spacing={3} mt={3}>
        {ROLE_MANAGEMENTS.map(({
        id,
        image,
        title,
        subtitle
      }) => <FlexBetween key={id}>
            <FlexBox gap={1.5} overflow="hidden" whiteSpace="nowrap" textOverflow="ellipsis">
              <Avatar variant="rounded" alt={title} src={image} />

              <Box textOverflow="ellipsis" whiteSpace="nowrap" overflow="hidden">
                <Typography variant="body2" noWrap lineHeight={1} fontWeight={500}>
                  {title}
                </Typography>

                <Typography variant="caption" noWrap fontWeight={500} color="text.secondary">
                  {subtitle}
                </Typography>
              </Box>
            </FlexBox>

            <FlexRowAlign sx={{
          width: 25,
          height: 25,
          flexShrink: 0,
          borderRadius: 1,
          backgroundColor: 'grey.100',
          ...theme.applyStyles('dark', {
            backgroundColor: 'grey.700'
          })
        }}>
              <ManageAccounts sx={{
            fontSize: 17,
            color: 'grey.400'
          }} />
            </FlexRowAlign>
          </FlexBetween>)}
      </Stack>
    </Card>;
}