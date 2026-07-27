import { useNavigate } from 'react-router';
// MUI
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
export default function UserPermissionView() {
  const navigate = useNavigate();
  return <Container>
      <Box textAlign="center" py={6}>
        <Typography variant="body1" fontWeight={600} fontSize={{
        sm: 52,
        xs: 42
      }}>
          Permission Denied!
        </Typography>

        <Typography variant="body2" sx={{
        mt: 1,
        fontSize: 18,
        fontWeight: 600,
        color: 'text.secondary'
      }}>
          Sorry! You do not have permission to access this page
        </Typography>

        <Box py={10} maxWidth={600} margin="auto">
          <img src="/static/pages/error.svg" alt="error" width="100%" />
        </Box>

        <Button onClick={() => navigate('/')}>Go Home</Button>
      </Box>
    </Container>;
}