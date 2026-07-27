import { useTranslation } from 'react-i18next';
// MUI
import Card from '@mui/material/Card';
import Avatar from '@mui/material/Avatar';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import { styled } from '@mui/material/styles';
// CUSTOM COMPONENTS
import { FlexBox, FlexBetween } from '@/components/flexbox';

// STYLED COMPONENTS
const StyledRoot = styled(Card)(({
  theme
}) => ({
  padding: theme.spacing(3),
  '& .item-content': {
    flexGrow: 1
  },
  '& .download-btn': {
    color: theme.palette.primary.main
  },
  '& .cancel-btn': {
    color: theme.palette.error.main
  }
}));
const DOWNLOAD_LIST = [{
  id: 0,
  size: 4.5,
  name: 'ReactJS-for-beginner.pdf',
  image: '/static/files-icon/pdf.svg',
  isDownloading: true
}, {
  id: 1,
  size: 3.5,
  name: 'Wordpress for beginner',
  image: '/static/files-icon/pdf.svg',
  isDownloading: false
}, {
  id: 2,
  size: 3.9,
  name: 'Master in Node.js',
  image: '/static/files-icon/doc.svg',
  isDownloading: false
}, {
  id: 3,
  size: 4.9,
  name: 'Vue Zero to Hero',
  image: '/static/files-icon/doc.svg',
  isDownloading: false
}];
export default function Downloads() {
  const {
    t
  } = useTranslation();
  return <StyledRoot>
      <Typography variant="body1" fontWeight={500}>
        {t('Your Downloads')}
      </Typography>

      {DOWNLOAD_LIST.map(item => <FlexBox alignItems="center" mt={2.5} gap={1} key={item.id}>
          <Avatar variant="rounded" src={item.image} alt={item.name} />

          <div className="item-content">
            <FlexBetween mb={0.5}>
              <Typography variant="body2" fontWeight={500}>
                {item.name}
              </Typography>

              {item.isDownloading ? <ButtonBase disableRipple disableTouchRipple className="cancel-btn">
                  Cancel
                </ButtonBase> : null}
            </FlexBetween>

            <FlexBetween gap={2}>
              <Typography variant="caption" color="text.secondary">
                4.5 MB
              </Typography>

              {item.isDownloading ? <FlexBetween gap={2} flex={1}>
                  <LinearProgress variant="determinate" value={60} sx={{
              flexGrow: 1
            }} />
                  <Typography variant="caption" fontWeight={600}>
                    60%
                  </Typography>
                </FlexBetween> : <ButtonBase disableRipple disableTouchRipple className="download-btn">
                  Download
                </ButtonBase>}
            </FlexBetween>
          </div>
        </FlexBox>)}
    </StyledRoot>;
}