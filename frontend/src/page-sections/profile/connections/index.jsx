import Grid from '@mui/material/Grid';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
// CUSTOM COMPONENTS
import ConnectionCard from './ConnectionCard';
import { FlexBetween } from '@/components/flexbox';

// CUSTOM DUMMY DATA
const CONNECTION_LIST = [{
  id: 1,
  connected: false,
  name: 'Miphoshka',
  position: 'Visual Designer',
  img: '/static/user/user-11.png'
}, {
  id: 2,
  connected: true,
  name: 'Tim Carrey',
  position: 'Visual Designer',
  img: '/static/user/user-10.png'
}, {
  id: 3,
  connected: false,
  name: 'Edward Norton',
  position: 'Visual Designer',
  img: '/static/user/user-9.png'
}, {
  id: 4,
  connected: true,
  name: 'Eva Mendes',
  position: 'Visual Designer',
  img: '/static/user/user-8.png'
}, {
  id: 5,
  connected: false,
  name: 'Vida Lao',
  position: 'Visual Designer',
  img: '/static/user/user-7.png'
}, {
  id: 6,
  connected: false,
  name: 'Angelina',
  position: 'Visual Designer',
  img: '/static/user/user-6.png'
}];
export default function Connections() {
  return <Grid container spacing={3}>
      <Grid size={12}>
        <FlexBetween flexWrap="wrap">
          <Typography variant="body1" sx={{
          mb: 1,
          fontWeight: 500,
          span: {
            fontSize: 14,
            fontWeight: 400,
            color: 'text.secondary'
          }
        }}>
            My Connections <span>(100+ Resources)</span>
          </Typography>

          <Select defaultValue="active" size="small">
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="deactivate">Deactivate</MenuItem>
          </Select>
        </FlexBetween>
      </Grid>

      {CONNECTION_LIST.map(item => <Grid size={{
      md: 4,
      sm: 6,
      xs: 12
    }} key={item.id}>
          <ConnectionCard img={item.img} name={item.name} position={item.position} connected={item.connected} />
        </Grid>)}
    </Grid>;
}