import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
// MUI ICON COMPONENT
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
// CUSTOM COMPONENTS
import { FlexBetween } from '@/components/flexbox';
// CUSTOM DUMMY DATA SET
import { PREFERENCES } from './data';
export default function Preferences() {
  return <Card>
      <Typography variant="body1" fontWeight={500} className="p-3">
        General Preferences
      </Typography>

      <Divider />

      <Box padding={3}>
        <Grid container spacing={4}>
          <Grid size={{
          sm: 6,
          xs: 12
        }}>
            <TextField select fullWidth value="english" label="Language" variant="outlined" placeholder="Language" slotProps={{
            select: {
              native: true,
              IconComponent: KeyboardArrowDown
            }
          }}>
              <option value="english">English</option>
              <option value="bangla">Bangla</option>
              <option value="hindi">Hindi</option>
            </TextField>
          </Grid>

          <Grid size={{
          sm: 6,
          xs: 12
        }}>
            <TextField variant="outlined" label="Time Zone" fullWidth value="12:00 AM" />
          </Grid>

          <Grid size={{
          sm: 6,
          xs: 12
        }}>
            <FlexBetween>
              <div>
                <Typography variant="body2" fontWeight={500}>
                  Early release
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Get included on new features.
                </Typography>
              </div>

              <Switch defaultChecked />
            </FlexBetween>

            <FlexBetween mt={2}>
              <div>
                <Typography variant="body2" fontWeight={500}>
                  See info about people who view my profile
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  More about viewer info.
                </Typography>
              </div>

              <Switch defaultChecked />
            </FlexBetween>
          </Grid>
        </Grid>
      </Box>

      {/* EMAIL PREFERENCES SECTION */}
      <Typography variant="body2" sx={{
      fontWeight: 500,
      p: 3,
      pt: 0
    }}>
        Email Preferences
      </Typography>

      <Divider />

      <Stack spacing={2} p={3} pl={2}>
        {PREFERENCES.map(({
        id,
        title,
        subtitle,
        checked
      }) => <Stack direction="row" alignItems="center" spacing={1} key={id}>
            <Checkbox checked={checked} />

            <div>
              <Typography variant="body2" fontWeight={500} lineHeight={1}>
                {title}
              </Typography>

              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            </div>
          </Stack>)}
      </Stack>

      <Stack direction="row" spacing={3} padding={3}>
        <Button variant="contained">Save Changes</Button>
        <Button variant="outlined">Cancel</Button>
      </Stack>
    </Card>;
}