import { styled } from '@mui/material/styles';
export const StyledRoot = styled('div')(({
  theme
}) => ({
  paddingBlock: '5rem',
  backgroundColor: theme.palette.grey[50],
  [theme.breakpoints.down('sm')]: {
    paddingBlock: '3rem'
  },
  ...theme.applyStyles('dark', {
    backgroundColor: theme.palette.grey[900]
  })
}));
export const TestimonialItem = styled('div')(({
  theme
}) => ({
  padding: '1rem',
  textAlign: 'center',
  '& .quotation': {
    display: 'inline-block'
  },
  '& .review-text': {
    maxWidth: 700,
    margin: 'auto',
    fontSize: 18,
    marginTop: '1rem',
    marginBottom: '3rem',
    [theme.breakpoints.down('sm')]: {
      fontSize: 16
    }
  },
  '& .reviewer-img': {
    width: 80,
    height: 80,
    margin: 'auto',
    marginBottom: '1rem',
    boxShadow: theme.shadows[2]
  },
  '& .reviewer-name': {
    fontWeight: 500,
    fontSize: 18
  },
  '& .reviewer-designation': {
    fontSize: 14,
    color: theme.palette.text.secondary
  }
}));