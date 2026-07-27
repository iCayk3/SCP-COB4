import { styled } from '@mui/material/styles';
export const StyledRoot = styled('div')(({
  theme
}) => ({
  paddingBlock: '5rem',
  [theme.breakpoints.down('sm')]: {
    paddingBlock: '3rem'
  },
  '& .title-wrapper': {
    marginBottom: '1rem',
    '& p': {
      fontSize: 18,
      textAlign: 'center',
      color: theme.palette.text.secondary,
      [theme.breakpoints.down('sm')]: {
        fontSize: 16
      }
    }
  }
}));
export const TeamItem = styled('div')(({
  theme
}) => ({
  padding: '2rem 1rem',
  '& .member-card': {
    padding: '2rem',
    boxShadow: theme.shadows[3]
  },
  '& .member-img-wrapper': {
    overflow: 'hidden',
    borderRadius: theme.spacing(1),
    '& img': {
      objectFit: 'contain',
      display: 'block'
    }
  },
  '& .member-info': {
    marginTop: '1rem',
    textAlign: 'center',
    h6: {
      fontSize: 16,
      fontWeight: 500,
      marginBottom: 4
    },
    p: {
      fontSize: 14,
      lineHeight: 1,
      color: theme.palette.text.secondary
    }
  }
}));