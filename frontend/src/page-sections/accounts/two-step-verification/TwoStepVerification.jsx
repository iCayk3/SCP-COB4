import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
export default function TwoStepVerification() {
  return <Card>
      <div className="p-3">
        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography variant="body1" fontWeight={500}>
            Two-step verification
          </Typography>

          <Switch defaultChecked />
        </Stack>

        <Typography variant="body2" color="text.secondary">
          Start by entering your password so that we know it's you. Then we'll walk you through two
          more simple steps.
        </Typography>
      </div>

      <Divider />

      <Box px={3} py={4} maxWidth={450}>
        <TextField fullWidth label="Account Password" value="Enter Current Password" />

        <Typography variant="caption" sx={{
        display: 'inline-block',
        mt: 1,
        color: 'text.secondary'
      }}>
          This is the password you use to log in to your Front account.
        </Typography>

        <Stack direction="row" spacing={2} mt={4}>
          <Button variant="contained">Save Changes</Button>
          <Button variant="outlined">Cancel</Button>
        </Stack>
      </Box>
    </Card>;
}