import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Switch from '@mui/material/Switch';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import AlertTitle from '@mui/material/AlertTitle';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';
// CUSTOM COMPONENTS
import Keys from './components/Keys';
import LoginSessions from './components/LoginSessions';
import { FlexBetween } from '@/components/flexbox';
import { Link } from '@/components/link';
// CUSTOM ICON COMPONENTS
import NotificationAlert from '@/icons/NotificationAlert';
export default function ApiKeys() {
  return <Card>
      <FlexBetween px={3} py={2}>
        <Typography variant="body1" fontWeight={500}>
          API Overview
        </Typography>

        <FormControlLabel label="Test Mode" control={<Switch defaultChecked />} slotProps={{
        typography: {
          fontSize: 14
        }
      }} />
      </FlexBetween>

      <Divider />

      <div className="p-3">
        {/* FEATURE SECTION */}
        <Grid container spacing={4} mb={3}>
          <Grid size={{
          md: 6,
          xs: 12
        }}>
            <Typography variant="body2" fontWeight={500} mb={0.5}>
              How to set Api
            </Typography>

            <Typography variant="body2" fontSize={13} color="text.secondary" mb={2}>
              Use images to enhance your post, improve its flow, add humor and explain complex
              topics
            </Typography>

            <Button variant="contained">Get Started</Button>
          </Grid>

          <Grid size={{
          md: 6,
          xs: 12
        }}>
            <Typography variant="body2" fontWeight={500} mb={0.5}>
              Developer Tools
            </Typography>

            <Typography variant="body2" fontSize={13} color="text.secondary" mb={2}>
              Plan your blog post by choosing a topic, creating an outline conduct research, and
              checking facts
            </Typography>

            <Button variant="contained">Create Rule</Button>
          </Grid>
        </Grid>

        {/* ALERT SECTION */}
        <Alert severity="info" variant="outlined" icon={<NotificationAlert />}>
          <AlertTitle>Two Factor Authentication</AlertTitle>
          Adds an extra layer of security to your account. To log in, in you'll need to provide a 4
          digit amazing and create outstanding products to serve your clients{' '}
          <Link href="#">Learn More</Link>.
        </Alert>
      </div>

      {/* LOGIN SESSION TABLE SECTION */}
      <FlexBetween px={3} py={2}>
        <Typography variant="body2" fontWeight={500}>
          Login Sessions
        </Typography>

        <Select defaultValue={2022} size="small">
          <MenuItem value={2022}>2022</MenuItem>
          <MenuItem value={2021}>2021</MenuItem>
          <MenuItem value={2020}>2020</MenuItem>
        </Select>
      </FlexBetween>

      <LoginSessions />

      <Divider sx={{
      my: 2
    }} />

      {/* API KEYS TABLE SECTION */}
      <Typography variant="body2" fontWeight={500} className="p-3">
        API Keys
      </Typography>

      <Keys />
    </Card>;
}