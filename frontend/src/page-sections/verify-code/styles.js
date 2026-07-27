import { styled } from '@mui/material/styles';
export const MainContent = styled('div')(({
  theme
}) => ({
  textAlign: 'center',
  paddingBlock: '3rem',
  '& .img-wrapper': {
    maxWidth: 120,
    margin: 'auto'
  },
  '& .form-wrapper': {
    maxWidth: 450,
    margin: 'auto',
    marginTop: '3rem'
  },
  '& .title': {
    fontSize: 32,
    marginTop: '2rem',
    marginBottom: '1rem'
  },
  '& .description': {
    maxWidth: 650,
    margin: 'auto',
    marginTop: theme.spacing(0.5),
    color: theme.palette.text.secondary
  },
  '& .have-code': {
    fontSize: 16,
    marginTop: '2rem',
    marginBottom: '.25rem'
  },
  '& .resend': {
    fontWeight: 500,
    cursor: 'pointer',
    color: theme.palette.error.main
  },
  [theme.breakpoints.down('sm')]: {
    paddingBlock: '2rem',
    '& .description': {
      fontSize: 14
    },
    '& .title': {
      marginTop: '1rem',
      fontSize: 27
    }
  }
}));