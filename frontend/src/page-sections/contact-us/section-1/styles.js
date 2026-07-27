import { styled } from '@mui/material/styles';
export const StyledRoot = styled('div')(({
  theme
}) => ({
  color: 'white',
  position: 'relative',
  paddingBottom: theme.spacing(16),
  '& .content': {
    zIndex: 1,
    position: 'relative',
    '& .title': {
      fontSize: 42,
      marginTop: '5rem',
      [theme.breakpoints.down('sm')]: {
        fontSize: 36
      },
      [theme.breakpoints.down('md')]: {
        marginTop: '2rem'
      }
    },
    '& .description': {
      fontSize: 18,
      marginBottom: '4rem',
      [theme.breakpoints.down('sm')]: {
        fontSize: 16
      }
    }
  },
  '& .map': {
    right: 0,
    bottom: 0,
    width: '80%',
    opacity: 0.7,
    position: 'absolute'
  },
  [theme.breakpoints.down('md')]: {
    paddingBottom: theme.spacing(4),
    '& .map': {
      display: 'none'
    }
  }
}));