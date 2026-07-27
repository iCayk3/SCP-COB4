import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
// MUI ICON COMPONENTS
import GitHub from '@mui/icons-material/GitHub';
import LinkedIn from '@mui/icons-material/LinkedIn';
// CUSTOM ICON COMPONENTS
import Twitter from '@/icons/social/Twitter';
import Facebook from '@/icons/social/Facebook';

// STYLED COMPONENT
const StyledRoot = styled('div')(({
  theme
}) => ({
  gap: 2,
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
  justifyContent: 'center',
  marginTop: theme.spacing(3),
  borderRadius: theme.spacing(1),
  paddingBlock: theme.spacing(3),
  backgroundColor: theme.palette.grey[100],
  '& .icon': {
    color: theme.palette.text.secondary
  },
  ...theme.applyStyles('dark', {
    backgroundColor: theme.palette.action.hover
  })
}));
const SOCIAL_LINKS = [{
  id: 1,
  Icon: Facebook,
  url: '#'
}, {
  id: 2,
  Icon: Twitter,
  url: '#'
}, {
  id: 3,
  Icon: LinkedIn,
  url: '#'
}, {
  id: 4,
  Icon: GitHub,
  url: '#'
}];
export default function FollowMore() {
  return <StyledRoot>
      <Typography variant="body1" fontWeight={500}>
        Follow More
      </Typography>

      <div>
        {SOCIAL_LINKS.map(({
        id,
        Icon
      }) => <IconButton key={id}>
            <Icon className="icon" />
          </IconButton>)}
      </div>
    </StyledRoot>;
}