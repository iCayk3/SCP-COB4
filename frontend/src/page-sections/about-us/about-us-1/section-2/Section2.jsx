import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
// MUI ICON COMPONENT
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
// CUSTOM COMPONENTS
import ProgressItem from './ProgressItem';
import { SectionTitle } from '@/components/section-title';
// STYLED COMPONENT
import { ImageWrapper, ProgressWrapper } from './styles';
export default function Section2() {
  return <div className="py-10">
      <Grid container spacing={3} alignItems="center">
        <Grid size={{
        xl: 5,
        lg: 4,
        xs: 12
      }}>
          <SectionTitle title="Who we are?" />

          <Typography variant="body1" color="text.secondary" pr={7}>
            Uko is a pre-designed UI used to build web app front-ends. It includes ready-to-use
            components like menus, charts, tables, and forms for efficient UI design and
            development.
          </Typography>

          <ProgressWrapper>
            <ProgressItem title="Design" value={70} />
            <ProgressItem title="Development" value={56} />
            <ProgressItem title="Marketing" value={30} />
          </ProgressWrapper>

          <Button variant="outlined" color="primary">
            Check our Work <KeyboardArrowRight />
          </Button>
        </Grid>

        <Grid size={{
        xl: 7,
        lg: 8,
        xs: 12
      }}>
          <ImageWrapper>
            <img src="/static/cover/about-1.jpg" alt="about" width="100%" />
            <img src="/static/cover/about-2.jpg" alt="about" width="100%" />
          </ImageWrapper>
        </Grid>
      </Grid>
    </div>;
}