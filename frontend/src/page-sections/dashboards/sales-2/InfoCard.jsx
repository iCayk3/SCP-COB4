import { useTranslation } from 'react-i18next';
// MUI
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { styled, alpha } from '@mui/material/styles';
// MUI ICON COMPONENTS
import ArrowUpward from '@mui/icons-material/ArrowUpward';
import ArrowDownward from '@mui/icons-material/ArrowDownward';

// STYLED COMPONENTS
const StyledRoot = styled(Card)(() => ({
  padding: '1rem 1.5rem',
  '& .analytics': {
    gap: 4,
    display: 'flex',
    alignItems: 'center'
  }
}));
const IconWrapper = styled('div', {
  shouldForwardProp: prop => prop !== 'isDown'
})(({
  theme,
  isDown
}) => ({
  width: 20,
  height: 20,
  display: 'flex',
  borderRadius: '50%',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: alpha(theme.palette.success.main, 0.1),
  ...(isDown && {
    backgroundColor: alpha(theme.palette.error.main, 0.1)
  })
}));

// ==============================================================

// ==============================================================

export default function InfoCard({
  title,
  percentage,
  amount,
  trend
}) {
  const {
    t
  } = useTranslation();
  const color = trend === 'up' ? 'success.main' : 'error.main';
  return <StyledRoot>
      <Typography variant="body2" color="text.secondary" fontWeight={500}>
        {t(title)}
      </Typography>

      <Typography variant="h5" fontSize={24} sx={{
      py: 2
    }}>
        {amount}
      </Typography>

      <div className="analytics">
        <IconWrapper isDown={trend === 'down'}>
          {trend === 'up' && <ArrowUpward className="icon" sx={{
          fontSize: 14,
          color
        }} />}
          {trend === 'down' && <ArrowDownward sx={{
          fontSize: 14,
          color
        }} />}
        </IconWrapper>

        <Typography variant="caption" fontWeight={600} color={color}>
          {trend === 'down' ? `-${percentage}%` : `+${percentage}%`}
        </Typography>
      </div>
    </StyledRoot>;
}