import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
// CUSTOM COMPONENTS
import Posts from './posts';
import Teams from './teams';
import Skills from './skills';
import Hobbies from './Hobbies';
import Summery from './Summery';
import Portfolio from './portfolios';
import MyConnections from './my-connection';
import AdditionalDetails from './additional-details';
export default function Overview() {
  return <Grid container spacing={3}>
      <Grid size={{
      lg: 9,
      md: 8,
      xs: 12
    }}>
        <Stack spacing={3}>
          <Summery />
          <Skills />
          <Teams />
          <Hobbies />
          <Posts />
          <Portfolio />
        </Stack>
      </Grid>

      <Grid size={{
      lg: 3,
      md: 4,
      xs: 12
    }}>
        <Stack spacing={3}>
          <MyConnections />
          <AdditionalDetails />
        </Stack>
      </Grid>
    </Grid>;
}