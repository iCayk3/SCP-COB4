import { useTranslation } from 'react-i18next';
// MUI
import Card from '@mui/material/Card';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
// CUSTOM COMPONENTS
import { FlexBox, FlexBetween } from '@/components/flexbox';

// STYLED COMPONENTS
const StyledRoot = styled(Card)(({
  theme
}) => ({
  height: '100%',
  padding: theme.spacing(3),
  '& .dot': {
    width: 10,
    height: 10,
    flexShrink: 0,
    borderRadius: '50%',
    backgroundColor: theme.palette.primary.main
  },
  '& .progress-wrapper': {
    flexGrow: 1,
    marginInline: '1rem'
  }
}));
const RESULTS = [{
  id: 1,
  progress: 10,
  title: 'Application'
}, {
  id: 2,
  progress: 80,
  title: 'Shortlisted'
}, {
  id: 3,
  progress: 60,
  title: 'Certified'
}, {
  id: 4,
  progress: 70,
  title: 'On hold'
}, {
  id: 5,
  progress: 20,
  title: 'Rejected'
}, {
  id: 6,
  progress: 60,
  title: 'Hired'
}];
export default function Acquisitions() {
  const {
    t
  } = useTranslation();
  return <StyledRoot>
      <Typography variant="body1" fontWeight={500}>
        {t('Acquisitions')}
      </Typography>

      {RESULTS.map(item => <FlexBetween mt={3} key={item.id}>
          <FlexBox gap={1} alignItems="center" width={100}>
            <div className="dot" />
            <Typography variant="body2" noWrap fontWeight={500}>
              {item.title}
            </Typography>
          </FlexBox>

          <div className="progress-wrapper">
            <LinearProgress variant="determinate" value={item.progress} />
          </div>

          <Typography variant="body2" fontWeight={500}>
            {item.progress}%
          </Typography>
        </FlexBetween>)}
    </StyledRoot>;
}