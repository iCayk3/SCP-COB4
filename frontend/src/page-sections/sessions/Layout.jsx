import { Fragment } from 'react';
// MUI
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
// CUSTOM COMPONENTS
import { FlexRowAlign } from '@/components/flexbox';

// =========================================================================

// =========================================================================

export default function Layout({
  children,
  login
}) {
  return <Grid container height="100%">
      <Grid size={{
      md: 6,
      xs: 12
    }}>
        <FlexRowAlign bgcolor="primary.main" height="100%">
          <Box color="white" p={6} maxWidth={700}>
            {login ? <Typography variant="h4">Hi, Welcome Back!</Typography> : <Fragment>
                <img width={80} alt="uko" src="/static/logo/logo-white-svg.svg" />

                <Typography variant="h4" sx={{
              mt: 3,
              maxWidth: 450
            }}>
                  Technology is best when it brings people together.
                </Typography>

                <Divider sx={{
              borderColor: 'white',
              my: 3
            }} />
              </Fragment>}

            <Box my={4}>
              <Typography variant="body1" fontWeight={500} fontSize={20}>
                You are in a good company
              </Typography>

              <Typography variant="body2">
                A product is something a brand is something that is bought by the customer.
              </Typography>
            </Box>

            <img src="/static/footer-brands.svg" alt="footer" />
          </Box>
        </FlexRowAlign>
      </Grid>

      <Grid size={{
      md: 6,
      xs: 12
    }}>
        <FlexRowAlign bgcolor="background.paper" height="100%">
          {children}
        </FlexRowAlign>
      </Grid>
    </Grid>;
}