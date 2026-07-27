import Card from '@mui/material/Card';
import { useTheme } from '@mui/material/styles';
// CUSTOM COMPONENTS
import { Carousel } from '@/components/carousel';
import { SectionTitle } from '@/components/section-title';
// CUSTOM DUMMY DATA
import { TEAM_MEMBERS } from './data';
// STYLED COMPONENTS
import { StyledRoot, TeamItem } from './styles';
export default function Section3() {
  const {
    breakpoints
  } = useTheme();

  // CAROUSEL BREAKPOINTS FOR RESPONSIVE
  const responsive = [{
    breakpoint: breakpoints.values.lg,
    settings: {
      slidesToShow: 3
    }
  }, {
    breakpoint: breakpoints.values.md,
    settings: {
      slidesToShow: 2
    }
  }, {
    breakpoint: breakpoints.values.sm,
    settings: {
      slidesToShow: 1
    }
  }];
  return <StyledRoot>
      <div className="title-wrapper">
        <SectionTitle centered title="Meet Our Team" />

        <p>
          If you face any problem, our support team will help you <br />
          within a business working day.
        </p>
      </div>

      <Carousel slidesToShow={4} spaceBetween={0} responsive={responsive}>
        {TEAM_MEMBERS.map(({
        designation,
        id,
        image,
        name
      }) => <TeamItem key={id}>
            <Card className="member-card">
              <div className="member-img-wrapper">
                <img alt={name} src={image} width="100%" height="100%" />
              </div>

              <div className="member-info">
                <h6>{name}</h6>
                <p>{designation}</p>
              </div>
            </Card>
          </TeamItem>)}
      </Carousel>
    </StyledRoot>;
}