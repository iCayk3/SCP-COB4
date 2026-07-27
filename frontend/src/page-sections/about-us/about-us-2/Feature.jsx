import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
// CUSTOM ICON COMPONENTS
import Recycle from '@/icons/Recycle';
import Database from '@/icons/Database';
import Minimize from '@/icons/Minimize';

// STYLED COMPONENT
const StyledCard = styled(Card)(({
  theme
}) => ({
  display: 'flex',
  textAlign: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(3),
  boxShadow: theme.shadows[0],
  border: `1px solid ${theme.palette.divider}`,
  h6: {
    fontSize: 16,
    fontWeight: 500,
    paddingBlock: theme.spacing(1)
  },
  p: {
    fontSize: 14,
    color: theme.palette.text.secondary
  }
}));

// CUSTOM DUMMY DATA
const features = [{
  id: '001',
  title: 'Easy',
  Icon: Minimize,
  description: 'Building and deploying should be as easy as a single tap.'
}, {
  id: '002',
  Icon: Recycle,
  title: 'Universal',
  description: 'To connect the world, sites should be fast from everywhere.'
}, {
  id: '003',
  Icon: Database,
  title: 'Accessible',
  description: 'Great care in user experience and design enables everyone.'
}];
export default function Feature() {
  return <Grid container spacing={3}>
      {features.map(({
      Icon,
      id,
      title,
      description
    }) => <Grid size={{
      md: 4,
      xs: 12
    }} key={id}>
          <StyledCard>
            <Icon fontSize="small" color="action" />
            <h6>{title}</h6>
            <p>{description}</p>
          </StyledCard>
        </Grid>)}
    </Grid>;
}