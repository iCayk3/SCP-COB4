import { useTranslation } from 'react-i18next';
// MUI
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import { styled } from '@mui/material/styles';
// CUSTOM COMPONENTS
import { FlexBox, FlexBetween } from '@/components/flexbox';
const RESULTS = [{
  id: 1,
  progress: 40,
  title: 'React',
  date: '20 March'
}, {
  id: 2,
  progress: 80,
  title: 'Angular',
  date: '15 March'
}, {
  id: 3,
  progress: 60,
  title: 'Vue',
  date: '10 March'
}, {
  id: 4,
  progress: 90,
  title: 'Html',
  date: '1 March'
}, {
  id: 5,
  progress: 80,
  title: 'Css',
  date: '5 March'
}];

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
  '& .title': {
    overflow: 'hidden'
  },
  '& .progress-wrapper': {
    flexGrow: 1,
    marginInline: '1rem'
  }
}));
export default function Results() {
  const {
    t
  } = useTranslation();
  return <StyledRoot>
      <Typography variant="body1" fontWeight={500}>
        {t('Results')}
      </Typography>

      {RESULTS.map(item => <FlexBetween mt={2} key={item.id}>
          <FlexBox gap={1} alignItems="center" width={100}>
            <div className="dot" />

            <div className="title">
              <Typography variant="body2" lineHeight={1} fontWeight={500}>
                {item.title}
              </Typography>

              <Typography lineHeight={1} variant="caption">
                {item.date}
              </Typography>
            </div>
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