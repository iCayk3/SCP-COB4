import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
export default function DeleteAccount() {
  return <Card sx={{
    pb: 3
  }}>
      <div className="p-3">
        <Typography variant="body1" fontWeight={500}>
          Delete Your Account
        </Typography>

        <Typography variant="body1" sx={{
        fontSize: 13,
        maxWidth: 600,
        color: 'text.secondary'
      }}>
          When you delete your account, you lose access to Front account services, and we
          permanently delete your personal data. You can cancel the deletion for 14 days.
        </Typography>
      </div>

      <Divider />

      <Stack direction="row" alignItems="center" padding={3} pl={2}>
        <Checkbox />

        <Typography variant="body2" fontWeight={500}>
          Confirm that I want to delete my account.
        </Typography>
      </Stack>

      <Box pl={3} maxWidth={120}>
        <Button color="error" fullWidth>
          Delete
        </Button>
      </Box>
    </Card>;
}