import Card from '@mui/material/Card';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
// MUI ICON COMPONENTS
import Twitter from '@mui/icons-material/Twitter';
import Instagram from '@mui/icons-material/Instagram';
import SportsBasketball from '@mui/icons-material/SportsBasketball';
import FacebookOutlined from '@mui/icons-material/FacebookOutlined';

// STYLED COMPONENTS
const StyledRoot = styled(Card)(({
  theme
}) => ({
  padding: '1.5rem',
  textAlign: 'center',
  boxShadow: theme.shadows[0],
  border: `1px solid ${theme.palette.divider}`,
  '& .avatar': {
    width: 50,
    height: 50,
    margin: 'auto'
  },
  '& .icon-group': {
    marginTop: '1rem'
  }
}));
export default function RecommendedCard() {
  return <StyledRoot>
      <Avatar alt="User" variant="rounded" src="/static/user/user-11.png" className="avatar" />

      <Typography variant="body2" sx={{
      mt: 2,
      fontWeight: 500
    }}>
        Selena Gomez
      </Typography>

      <Typography variant="body2" fontSize={13} color="text.secondary">
        Marketing Manager
      </Typography>

      <div className="icon-group">
        <IconButton>
          <FacebookOutlined fontSize="small" />
        </IconButton>

        <IconButton>
          <Twitter fontSize="small" />
        </IconButton>

        <IconButton>
          <Instagram fontSize="small" />
        </IconButton>

        <IconButton>
          <SportsBasketball fontSize="small" />
        </IconButton>
      </div>
    </StyledRoot>;
}