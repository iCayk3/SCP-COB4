import { useState } from 'react';
import { useNavigate } from 'react-router';
// MUI
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
// MUI ICON COMPONENT
import Search from '@mui/icons-material/Search';
// CUSTOM COMPONENTS
import TabButton from '../TabButton';
import { FlexBetween, FlexBox } from '@/components/flexbox';
// CUSTOM PAGE SECTION COMPONENTS
import Faq from '../Faq';
import Tickets from '../Tickets';
import Contact from '../Contact';
import Overview from '../Overview';
// TYPES

export default function SupportPageView() {
  const navigate = useNavigate();
  const [active, setActive] = useState('OVERVIEW');
  const handleChange = value => () => setActive(value);
  return <div className="py-3">
      <Card sx={{
      p: 3,
      mb: 3
    }}>
        {/* HEADING AREA */}
        <Grid container spacing={3} alignItems="center">
          <Grid size={{
          lg: 4,
          md: 5,
          xs: 12
        }}>
            <Box textAlign="center" minHeight={200}>
              <img src="/static/illustration/support.svg" alt="support" />
            </Box>
          </Grid>

          <Grid size={{
          lg: 4,
          md: 5,
          xs: 12
        }}>
            <div>
              <Typography variant="h5" fontWeight={500} sx={{
              mb: 2
            }}>
                How Can We Help You?
              </Typography>

              <TextField fullWidth placeholder="Ask your questions" slotProps={{
              input: {
                startAdornment: <Search />
              }
            }} />
            </div>
          </Grid>
        </Grid>

        {/* TAB BUTTON LIST */}
        <FlexBetween sx={{
        p: 2,
        mt: 4,
        gap: 2,
        flexWrap: 'wrap',
        borderRadius: 3,
        backgroundColor: 'action.hover'
      }}>
          <FlexBox flexWrap="wrap" rowGap={2} columnGap={2}>
            <TabButton title="OVERVIEW" active={active} handleChange={handleChange} />
            <TabButton title="TICKETS" active={active} handleChange={handleChange} />
            <TabButton title="FAQ" active={active} handleChange={handleChange} />
            <TabButton title="CONTACT" active={active} handleChange={handleChange} />
          </FlexBox>

          <Button onClick={() => navigate('/dashboard/create-ticket')}>Create Ticket</Button>
        </FlexBetween>
      </Card>

      {/* BODY CONTENTS  */}
      {active === 'OVERVIEW' && <Overview />}
      {active === 'TICKETS' && <Tickets />}
      {active === 'FAQ' && <Faq />}
      {active === 'CONTACT' && <Contact />}
    </div>;
}