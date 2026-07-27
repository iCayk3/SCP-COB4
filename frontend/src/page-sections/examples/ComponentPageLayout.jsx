import { Fragment } from 'react';
import { useNavigate } from 'react-router';
// MUI
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
// MUI ICON COMPONENTS
import KeyboardBackspace from '@mui/icons-material/KeyboardBackspace';
import InsertDriveFileOutlined from '@mui/icons-material/InsertDriveFileOutlined';

// ==============================================================

// ==============================================================

export default function ComponentPageLayout({
  title,
  children,
  fullLink
}) {
  const navigate = useNavigate();
  const url = fullLink ?? `https://mui.com/material-ui/react-${title.toLowerCase()}`;
  return <Fragment>
      <Box sx={theme => ({
      py: {
        sm: 10,
        xs: 5
      },
      backgroundColor: theme.palette.grey[50],
      ...theme.applyStyles('dark', {
        backgroundColor: theme.palette.grey[900]
      })
    })}>
        <Container>
          <Typography variant="body1" sx={{
          mb: 2,
          fontWeight: 600,
          fontSize: 24
        }}>
            {title}
          </Typography>

          <Button onClick={() => navigate('/components')} startIcon={<KeyboardBackspace fontSize="small" />} sx={{
          mr: 2
        }}>
            Go Back
          </Button>

          <Button href={url} target="_blank" color="secondary" variant="outlined" startIcon={<InsertDriveFileOutlined />}>
            Browse {title} Doc
          </Button>
        </Container>
      </Box>

      <Divider />

      <Container component={Stack} spacing={6} sx={{
      py: {
        sm: 10,
        xs: 5
      }
    }}>
        {children}
      </Container>

      <Divider />
    </Fragment>;
}