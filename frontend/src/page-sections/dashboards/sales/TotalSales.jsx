import { useTranslation } from 'react-i18next';
// MUI
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { alpha, styled } from '@mui/material/styles';
// MUI ICON COMPONENTS
import ArrowUpward from '@mui/icons-material/ArrowUpward';
import AutoAwesome from '@mui/icons-material/AutoAwesome';
// CUSTOM COMPONENTS
import { FlexRowAlign } from '@/components/flexbox';
// CUSTOM UTILS METHOD
import { currency } from '@/utils/currency';

// STYLED COMPONENTS
const StyledRoot = styled(Card)(({
  theme
}) => ({
  height: '100%',
  textAlign: 'center',
  padding: theme.spacing(3),
  '& .icon-wrapper': {
    width: 45,
    height: 45,
    margin: 'auto',
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: alpha(theme.palette.primary.main, 0.1)
  },
  '& .arrow-icon': {
    width: 25,
    height: 25,
    display: 'flex',
    borderRadius: '50%',
    alignItems: 'center',
    marginBlock: '.75rem',
    justifyContent: 'center',
    backgroundColor: alpha(theme.palette.success.main, 0.1)
  }
}));
export default function TotalSales() {
  const {
    t
  } = useTranslation();
  return <StyledRoot>
      <Typography variant="h6" sx={{
      mb: 3
    }}>
        {t('Total Sales')}
      </Typography>

      <div className="icon-wrapper">
        <AutoAwesome color="primary" fontSize="small" />
      </div>

      <Typography variant="h5" sx={{
      fontWeight: 600,
      mt: 3
    }}>
        {currency(26543)}
      </Typography>

      <FlexRowAlign gap={0.5}>
        <div className="arrow-icon">
          <ArrowUpward color="success" sx={{
          fontSize: 16
        }} />
        </div>

        <Typography variant="body2" color="success.main" fontWeight={600}>
          +10.23%
        </Typography>
      </FlexRowAlign>

      <Typography variant="body2" sx={{
      mt: 1,
      mb: 3,
      color: 'text.secondary'
    }}>
        {t('Calculated in last 7 days')}
      </Typography>

      <Button size="large" variant="contained" fullWidth>
        {t('View Full Report')}
      </Button>
    </StyledRoot>;
}