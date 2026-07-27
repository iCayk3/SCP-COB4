import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
// CUSTOM COMPONENTS
import ListItem from './ListItem';
const CONNECTIONS = [{
  id: 1,
  name: 'Martha Hawk',
  position: 'Developer',
  imageUrl: '/static/user/user-11.png'
}, {
  id: 2,
  name: 'Samantha Hopes',
  position: 'Developer',
  imageUrl: '/static/user/user-15.png'
}, {
  id: 3,
  name: 'Chris Pine',
  position: 'Developer',
  imageUrl: '/static/user/user-17.png'
}, {
  id: 4,
  name: 'Sun Myi',
  position: 'Developer',
  imageUrl: '/static/user/user-13.png'
}];
export default function MyConnections() {
  return <Card className="p-3">
      <Typography variant="body1" fontWeight={500} lineHeight={1}>
        My Connections
      </Typography>

      <Stack spacing={3} mt={3}>
        {CONNECTIONS.map(item => <ListItem key={item.id} name={item.name} position={item.position} imageUrl={item.imageUrl} />)}
      </Stack>
    </Card>;
}