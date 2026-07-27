import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import { styled } from '@mui/material/styles';

// STYLED COMPONENT
export const StyledContainer = styled(Container)(({
  theme
}) => ({
  paddingBlock: '5rem',
  '& .heading': {
    textAlign: 'center',
    marginBottom: '3rem',
    '& > p': {
      fontSize: 18,
      color: theme.palette.text.secondary
    }
  }
}));
export const StyledCard = styled(Card)(({
  theme
}) => ({
  padding: '1.5rem',
  transition: 'all 300ms',
  boxShadow: theme.shadows[0],
  border: `1px solid ${theme.palette.divider}`,
  '&:hover': {
    boxShadow: theme.shadows[4],
    borderColor: theme.palette.primary.main
  },
  '& .title': {
    fontSize: 18,
    fontWeight: 500,
    marginBottom: '.5rem'
  },
  '& .description': {
    fontSize: 14,
    marginBottom: '2rem',
    color: theme.palette.text.secondary,
    lineClamp: 3,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical'
  }
}));