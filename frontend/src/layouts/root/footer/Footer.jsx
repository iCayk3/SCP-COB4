import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
// CUSTOM COMPONENTS
import LinksWidget from './LinksWidget';
// STYLED COMPONENTS
import { StyledRoot } from './styles';
// CUSTOM DATA
import { PRODUCT_LINKS, FEATURE_LINKS, EXPLORE_LINKS } from '@/data/footer';
export default function Footer() {
  return <StyledRoot>
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          <Grid size={{
          md: 4,
          xs: 12
        }}>
            <div className="brand">
              <img alt="logo" width={35} height={35} src="/static/logo/logo-svg.svg" />

              <Typography variant="h6" fontSize={22}>
                Uko
              </Typography>
            </div>

            <Typography variant="body2" sx={{
            lineHeight: 1.7,
            color: 'text.secondary',
            pr: {
              lg: 5,
              md: 2,
              xs: 0
            }
          }}>
              Uko SaaS template is a powerful and versatile software application that provides a
              comprehensive framework for building and delivering cloud-based solutions.
            </Typography>
          </Grid>

          <Grid size={{
          md: 3,
          sm: 4,
          xs: 12
        }}>
            <LinksWidget title="Products" links={PRODUCT_LINKS} />
          </Grid>

          <Grid size={{
          md: 3,
          sm: 4,
          xs: 12
        }}>
            <LinksWidget title="Features" links={FEATURE_LINKS} />
          </Grid>

          <Grid size={{
          md: 2,
          sm: 4,
          xs: 12
        }}>
            <LinksWidget title="Explore" links={EXPLORE_LINKS} />
          </Grid>
        </Grid>
      </Container>

      <Divider className="divider" />

      <Typography variant="body2" sx={{
      py: 4,
      textAlign: 'center'
    }}>
        Copyright © 2023{' '}
        <a href="https://ui-lib.com" target="_blank" rel="noreferrer">
          UI Lib
        </a>
        . All rights reserved
      </Typography>
    </StyledRoot>;
}