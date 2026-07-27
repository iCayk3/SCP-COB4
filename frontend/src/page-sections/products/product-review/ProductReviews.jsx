import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Rating from '@mui/material/Rating';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import Star from '@mui/icons-material/Star';
// CUSTOM COMPONENTS
import ReviewItem from './ReviewItem';
import ReviewForm from './ReviewForm';
import RatingDetails from './RatingDetails';

// STYLED COMPONENTS
const ContainerGrid = styled(Grid)(({
  theme
}) => ({
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column-reverse'
  }
}));
const FirstGrid = styled(Grid)(({
  theme
}) => ({
  [theme.breakpoints.up('md')]: {
    borderRight: `1px solid ${theme.palette.divider}`
  },
  [theme.breakpoints.down('md')]: {
    marginTop: 24,
    borderTop: `1px solid ${theme.palette.grey[300]}`
  }
}));
const REVIEWS = [{
  id: '1',
  rating: 4,
  createdAt: '14 Nov, 2021',
  user: {
    name: 'Christina Perry',
    image: '/static/user/user-11.png'
  },
  comment: 'Thank you very fast shipping from Poland only 3days. Very Grateful. Was this review helpful to you?.',
  images: ['/static/products/apple-watch.png', '/static/products/apple-watch.png']
}, {
  id: '2',
  rating: 4,
  createdAt: '14 Nov, 2021',
  user: {
    name: 'Christina Perry',
    image: '/static/user/user-15.png'
  },
  comment: 'Thank you very fast shipping from Poland only 3days. Very Grateful. Was this review helpful to you?.'
}, {
  id: '3',
  rating: 4,
  createdAt: '14 Nov, 2021',
  user: {
    name: 'Christina Perry',
    image: '/static/user/user-17.png'
  },
  comment: 'Thank you very fast shipping from Poland only 3days. Very Grateful. Was this review helpful to you?.'
}];
export default function ProductReviews() {
  return <ContainerGrid container>
      {/* ALL REVIEW LIST */}
      <FirstGrid size={{
      md: 8,
      xs: 12
    }}>
        <Stack spacing={5} p={3}>
          {REVIEWS.map(review => <ReviewItem key={review.id} user={review.user} rating={review.rating} images={review.images} comment={review.comment} createdAt={review.createdAt} />)}
        </Stack>
      </FirstGrid>

      {/* AVERAGE RATING INFO */}
      <Grid size={{
      md: 4,
      xs: 12
    }}>
        <Stack alignItems="center" p={3}>
          <Typography variant="body1" fontWeight={500}>
            Average rating
          </Typography>

          <Typography variant="h3" fontWeight={700} sx={{
          my: 1,
          color: 'primary.main'
        }}>
            4/5
          </Typography>

          <Rating readOnly value={4} emptyIcon={<Star sx={{
          opacity: 0.4
        }} />} sx={{
          fontSize: 20
        }} />

          <Typography variant="body2" color="text.secondary">
            (8.24k reviews)
          </Typography>
        </Stack>

        <Box maxWidth={300} margin="auto" pt={4}>
          <Stack spacing={1}>
            <RatingDetails title="5 star" progressValue={74} totalReview={32000} />
            <RatingDetails title="4 star" progressValue={54} totalReview={54000} />
            <RatingDetails title="3 star" progressValue={34} totalReview={37000} />
            <RatingDetails title="2 star" progressValue={24} totalReview={42000} />
            <RatingDetails title="1 star" progressValue={14} totalReview={65000} />
          </Stack>
        </Box>
      </Grid>

      <Grid size={12}>
        <Divider />
      </Grid>

      {/* CREATE REVIEW FORM */}
      <Grid size={12}>
        <Box p={3}>
          <Typography variant="body1" fontWeight={500}>
            Add Review
          </Typography>

          <ReviewForm />
        </Box>
      </Grid>
    </ContainerGrid>;
}