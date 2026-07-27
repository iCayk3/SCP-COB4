import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import North from '@mui/icons-material/North';
import South from '@mui/icons-material/South';
// CUSTOM COMPONENTS
import { Percentage } from '@/components/percentage';
import { FlexBetween, FlexBox } from '@/components/flexbox';

// CUSTOM DUMMY DATA SET
const CHANNELS = [{
  value: 4.67,
  id: 'UIQrmEkA-UquXd4c9P2dI',
  title: 'Twitter',
  subtitle: 'Social Media',
  image: '/static/social-media/twitter.svg'
}, {
  value: 3.37,
  error: true,
  id: 'XGqh8xdtfCXuQ_wzYicRS',
  title: 'Linked In',
  subtitle: 'Social Media',
  image: '/static/social-media/027-linkedin.svg'
}, {
  value: 2.19,
  id: 'ZvkSH_hC8MMKJSUlGT_1k',
  title: 'Dribble',
  subtitle: 'Community',
  image: '/static/social-media/dribble.svg'
}, {
  value: 2.68,
  error: true,
  id: '17iSIyqnDiuC2xawKVJqC',
  title: 'Facebook',
  subtitle: 'Social Media',
  image: '/static/social-media/036-facebook.svg'
}, {
  value: 3.33,
  id: 'nWv0Tc6vPuWoUMaDas5bF',
  title: 'Instagram',
  subtitle: 'Community',
  image: '/static/social-media/029-instagram.svg'
}];
export default function AllChannels() {
  return <Card className="p-3">
      <Typography variant="h6">All Channels</Typography>
      <Typography variant="body2" fontSize={13} color="text.secondary">
        Users from all channels
      </Typography>

      <Stack spacing={3} mt={4}>
        {CHANNELS.map(({
        id,
        image,
        title,
        subtitle,
        value,
        error
      }) => <FlexBetween key={id}>
            <FlexBox gap={1.5} overflow="hidden" whiteSpace="nowrap" textOverflow="ellipsis">
              <Avatar variant="rounded" alt={title} src={image} />

              <Box textOverflow="ellipsis" whiteSpace="nowrap" overflow="hidden">
                <Typography variant="body2" lineHeight={1} fontWeight={500}>
                  {title}
                </Typography>

                <Typography variant="caption" fontWeight={500} color="text.secondary">
                  {subtitle}
                </Typography>
              </Box>
            </FlexBox>

            <Percentage type={error ? 'error' : 'success'}>
              {error ? <South sx={{
            fontSize: 11
          }} /> : <North sx={{
            fontSize: 11
          }} />} {value}%
            </Percentage>
          </FlexBetween>)}
      </Stack>
    </Card>;
}