import { styled } from '@mui/material/styles';
export const LinkList = styled('div')(({
  theme
}) => ({
  gap: 12,
  display: 'flex',
  flexDirection: 'column',
  a: {
    fontSize: 14,
    color: theme.palette.grey[700],
    transition: theme.transitions.create(['color', 'margin-left'], {
      duration: theme.transitions.duration.standard
    }),
    ...theme.applyStyles('dark', {
      color: theme.palette.grey[300]
    }),
    ':hover': {
      marginLeft: 5,
      color: theme.palette.primary.main
    }
  }
}));
export const StyledRoot = styled('div')(({
  theme
}) => ({
  paddingTop: '5rem',
  '.divider': {
    marginTop: '4rem'
  },
  '.brand': {
    gap: '.5rem',
    display: 'flex',
    alignItems: 'center',
    marginBottom: '1rem'
  },
  ...theme.applyStyles('dark', {
    backgroundColor: theme.palette.grey[800]
  }),
  [theme.breakpoints.down('sm')]: {
    paddingTop: '4rem',
    '.divider': {
      marginTop: '3rem'
    }
  }
}));