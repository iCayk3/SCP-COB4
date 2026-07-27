import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Add from '@mui/icons-material/Add';
// CUSTOM COMPONENTS
import PortfolioItem from './PortfolioItem';
import { FlexBetween } from '@/components/flexbox';
const PORTFOLIO_LIST = [{
  id: 1,
  tag: 'Minimal',
  title: 'Hollow Purple',
  date: '12:00 Nov 21, 2021',
  imgLink: '/static/portfolio/1.png'
}, {
  id: 2,
  tag: 'Dark',
  title: 'Red Blood',
  date: '12:00 Nov 21, 2021',
  imgLink: '/static/portfolio/2.png'
}, {
  id: 3,
  tag: 'Light',
  title: 'Lime Blue',
  date: '12:00 Nov 21, 2021',
  imgLink: '/static/portfolio/3.png'
}];
export default function Portfolio() {
  return <Card className="p-3">
      <FlexBetween mb={3}>
        <Typography variant="body1" fontWeight={500}>
          Portfolio
        </Typography>

        <Button color="secondary" variant="outlined" startIcon={<Add />}>
          Add New
        </Button>
      </FlexBetween>

      <Grid container spacing={3}>
        {PORTFOLIO_LIST.map(item => <Grid size={{
        lg: 4,
        md: 6,
        xs: 12
      }} key={item.id}>
            <PortfolioItem tag={item.tag} date={item.date} title={item.title} imgLink={item.imgLink} />
          </Grid>)}
      </Grid>
    </Card>;
}