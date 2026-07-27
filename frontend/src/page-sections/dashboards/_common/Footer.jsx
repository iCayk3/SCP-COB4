import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
// MUI ICON COMPONENTS
import GitHub from '@mui/icons-material/GitHub';
import Twitter from '@mui/icons-material/Twitter';
import LinkedIn from '@mui/icons-material/LinkedIn';
import FacebookRounded from '@mui/icons-material/FacebookRounded';
// CUSTOM COMPONENTS
import { Link } from '@/components/link';
import { FlexBox } from '@/components/flexbox';

// STYLED COMPONENT
const StyledCard = styled(Card)(({
  theme
}) => ({
  gap: 16,
  padding: 24,
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'space-between',
  '& .buttons': {
    textAlign: 'right',
    marginBottom: '1rem'
  },
  '& .link': {
    fontSize: 14,
    transition: 'color 300ms',
    color: theme.palette.text.secondary,
    '&:hover': {
      color: theme.palette.text.primary
    }
  },
  [theme.breakpoints.down(635)]: {
    textAlign: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    '& .buttons': {
      textAlign: 'center'
    }
  }
}));
export default function Footer() {
  return <StyledCard>
      <div>
        <Typography variant="body1" fontSize={20} fontWeight={500}>
          Uko Admin Template
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{
        mb: 3
      }}>
          Clean UI & well documented
        </Typography>

        <Button href="https://mui.com/store/items/uko-client-admin-dashboard/">Buy Now</Button>
      </div>

      <div>
        <div className="buttons">
          <IconButton>
            <Twitter />
          </IconButton>

          <IconButton>
            <LinkedIn />
          </IconButton>

          <IconButton>
            <FacebookRounded />
          </IconButton>

          <IconButton>
            <GitHub />
          </IconButton>
        </div>

        <FlexBox alignItems="center" gap={2}>
          <Link className="link" href="/about">
            About
          </Link>

          <Link className="link" href="/">
            Support
          </Link>

          <Link className="link" href="/">
            Terms & Conditions
          </Link>
        </FlexBox>
      </div>
    </StyledCard>;
}