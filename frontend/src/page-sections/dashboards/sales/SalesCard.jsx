import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { alpha, styled } from '@mui/material/styles';
// CUSTOM UTILS METHOD
import { formatK } from '@/utils/currency';

// STYLED COMPONENTS
const StyledRoot = styled(Card)(({
  theme
}) => ({
  height: '100%',
  padding: theme.spacing(3),
  '& .content': {
    marginTop: '1rem',
    textAlign: 'center'
  }
}));
const IconWrapper = styled('div')(({
  theme,
  color
}) => ({
  width: 40,
  height: 40,
  flexShrink: 0,
  borderRadius: 6,
  display: 'flex',
  margin: 'auto',
  alignItems: 'center',
  justifyContent: 'center',
  ...(color === 'primary' && {
    color: theme.palette.primary.main,
    backgroundColor: alpha(theme.palette.primary.main, 0.2)
  }),
  ...(color === 'success' && {
    color: theme.palette.success.main,
    backgroundColor: alpha(theme.palette.success.main, 0.2)
  }),
  ...(color === 'error' && {
    color: theme.palette.error.main,
    backgroundColor: alpha(theme.palette.error.main, 0.2)
  })
}));

// ==============================================================

// ==============================================================

export default function SalesCard({
  list
}) {
  return <Grid container spacing={3}>
      {list.map(({
      Icon,
      amount,
      color,
      id,
      title
    }) => <Grid size={{
      sm: 4,
      xs: 12
    }} key={id}>
          <StyledRoot>
            <IconWrapper color={color}>
              <Icon color="inherit" />
            </IconWrapper>

            <div className="content">
              <Typography noWrap variant="body2" color="text.secondary" fontWeight={500}>
                {title}
              </Typography>

              <Typography variant="h6" fontWeight={700} color={color}>
                {formatK(amount)}
              </Typography>
            </div>
          </StyledRoot>
        </Grid>)}
    </Grid>;
}