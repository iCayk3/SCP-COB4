import Avatar from '@mui/material/Avatar';
import Container from '@mui/material/Container';
// CUSTOM COMPONENTS
import { Carousel } from '@/components/carousel';
import { SectionTitle } from '@/components/section-title';
// STYLED COMPONENTS
import { StyledRoot, TestimonialItem } from './styles';
// DATA
import { TESTIMONIALS } from './data';
export default function Section4() {
  return <StyledRoot>
      <Container maxWidth="lg">
        <SectionTitle centered title="What Our Customer Says" mb={6} />

        <Carousel dots slidesToShow={1}>
          {TESTIMONIALS.map(testimonial => <TestimonialItem key={testimonial.id}>
              <img src="/static/quotation.svg" alt="Quotation" className="quotation" />

              <p className="review-text">{testimonial.comment}</p>

              <Avatar src={testimonial.user.image} alt={testimonial.user.name} className="reviewer-img" />

              <p className="reviewer-name">{testimonial.user.name}</p>
              <p className="reviewer-designation">{testimonial.user.designation}</p>
            </TestimonialItem>)}
        </Carousel>
      </Container>
    </StyledRoot>;
}