import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import AvatarGroup from '@mui/material/AvatarGroup';
// CUSTOM COMPONENTS
import Heading from './Heading';
// CUSTOM UTILS METHODS
import { currency } from '@/utils/currency';
// STYLED COMPONENT
import { CardWrapper } from './styles';
const images = [{
  id: 1,
  name: 'Remy Sharp',
  image: '/static/user/user-11.png'
}, {
  id: 2,
  name: 'Travis Howard',
  image: '/static/user/user-10.png'
}, {
  id: 3,
  name: 'Cindy Baker',
  image: '/static/user/user-13.png'
}, {
  id: 4,
  name: 'Agnes Walker',
  image: '/static/user/user-14.png'
}, {
  id: 5,
  name: 'Trevor Henderson',
  image: '/static/user/user-15.png'
}];
export default function Customers() {
  return <CardWrapper>
      <Heading percentage="-1.9%" percentageType="error" subtitle="New Customer" title={currency(568)} />

      <Box mt={4}>
        <Typography variant="caption" pb={1}>
          Top Customers
        </Typography>

        <AvatarGroup max={4}>
          {images.map(image => <Avatar key={image.id} alt={image.name} src={image.image} />)}
        </AvatarGroup>
      </Box>
    </CardWrapper>;
}