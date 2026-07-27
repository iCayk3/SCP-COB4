import Card from '@mui/material/Card';
import ButtonBase from '@mui/material/ButtonBase';
import { styled } from '@mui/material/styles';

// STYLED COMPONENTS
const StyledRoot = styled(Card)(({
  theme
}) => ({
  height: '100%',
  position: 'relative',
  padding: '1rem 1.5rem',
  background: 'linear-gradient(250.16deg, #FFFFFF 2.51%, rgba(213, 241, 255, 0.54) 96.8%)',
  ...theme.applyStyles('dark', {
    background: theme.palette.background.paper
  }),
  '& .img-wrapper': {
    right: 0,
    width: 150,
    bottom: -10,
    position: 'absolute'
  },
  '& .content': {
    width: '100%',
    maxWidth: 200,
    h6: {
      fontSize: 18,
      fontWeight: 500,
      marginBottom: '1rem',
      span: {
        color: theme.palette.primary.main
      }
    }
  }
}));
const StyledButton = styled(ButtonBase)(({
  theme
}) => ({
  fontWeight: 500,
  borderRadius: '8px',
  padding: '0.8rem 2rem',
  color: theme.palette.common.white,
  background: 'linear-gradient(180deg, rgba(0, 172, 255, 0.46) 0%, rgba(189, 0, 255, 0.345) 100%)'
}));
export default function UpgradeCard() {
  return <StyledRoot>
      <div className="content">
        <h6>
          Upgrade to <span>PRO</span> for more resources
        </h6>

        <StyledButton>Upgrade Now</StyledButton>
      </div>

      <div className="img-wrapper">
        <img src="/static/illustration/upgrade-pro.png" width="100%" alt="Upgrade Pro" />
      </div>
    </StyledRoot>;
}