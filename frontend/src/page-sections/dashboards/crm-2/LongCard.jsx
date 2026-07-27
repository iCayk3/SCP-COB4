import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
// STYLED COMPONENTS
const StyledStack = styled(Stack)(({
  theme
}) => ({
  [theme.breakpoints.down('sm')]: {
    alignItems: 'flex-start',
    '& hr': {
      display: 'none'
    }
  }
}));
const ListItem = styled('div')(({
  theme
}) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5)
}));
const LisItemIcon = styled('div', {
  shouldForwardProp: prop => prop !== 'type'
})(({
  theme,
  type
}) => ({
  width: 40,
  height: 40,
  flexShrink: 0,
  borderRadius: 8,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.common.white,
  ...(type === 'info' && {
    backgroundColor: theme.palette.info.main
  }),
  ...(type === 'error' && {
    backgroundColor: theme.palette.error.main
  }),
  ...(type === 'primary' && {
    backgroundColor: theme.palette.primary.main
  }),
  ...(type === 'warning' && {
    backgroundColor: theme.palette.warning.main
  }),
  ...(type === 'secondary' && {
    backgroundColor: theme.palette.text.secondary
  })
}));

// ==============================================================

// ==============================================================

export default function LongCard({
  list
}) {
  return <Card className="p-3 h-full">
      <StyledStack spacing={2} height="100%" alignItems="center" justifyContent="space-between" direction={{
      sm: 'row',
      xs: 'column'
    }} divider={<Divider flexItem orientation="vertical" />}>
        {list.map(({
        Icon,
        amount,
        id,
        title,
        color
      }) => <ListItem key={id}>
            <LisItemIcon type={color}>
              <Icon color="inherit" />
            </LisItemIcon>

            <div>
              <Typography variant="body2" noWrap fontWeight={500}>
                {title}
              </Typography>

              <Typography variant="h6" fontSize={20} fontWeight={600} lineHeight={1.4} color={color === 'secondary' ? 'text.secondary' : `${color}.main`}>
                {amount}
              </Typography>
            </div>
          </ListItem>)}
      </StyledStack>
    </Card>;
}