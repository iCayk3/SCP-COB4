import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
// MUI ICON COMPONENTS
import CameraAlt from '@mui/icons-material/CameraAlt';
import MoreHoriz from '@mui/icons-material/MoreHoriz';
// CUSTOM ICON COMPONENTS
import DateRange from '@/icons/DateRange';
import Bratislava from '@/icons/Bratislava';
import MapMarkerIcon from '@/icons/MapMarkerIcon';
// CUSTOM COMPONENTS
import InfoItem from './InfoItem';
import { AvatarBadge } from '@/components/avatar-badge';
import { AvatarLoading } from '@/components/avatar-loading';
import { FlexBetween, FlexBox } from '@/components/flexbox';
// STYLED COMPONENTS
import { ProgressWrapper, ContentWrapper } from '../styles';
export default function UserInfo() {
  return <ContentWrapper>
      <FlexBox justifyContent="center">
        <AvatarBadge badgeContent={<label htmlFor="icon-button-file">
              <input type="file" accept="image/*" id="icon-button-file" style={{
          display: 'none'
        }} />

              <IconButton aria-label="upload picture" component="span">
                <CameraAlt sx={{
            fontSize: 16,
            color: 'grey.400'
          }} />
              </IconButton>
            </label>}>
          <AvatarLoading borderSize={2} percentage={60} alt="Team Member" src="/static/user/user-11.png" sx={{
          width: 100,
          height: 100
        }} />
        </AvatarBadge>
      </FlexBox>

      <Box mt={2}>
        <Typography variant="body1" fontSize={18} fontWeight={600} textAlign="center">
          Pixy Krovasky
        </Typography>

        <FlexBetween maxWidth={360} flexWrap="wrap" margin="auto" mt={1}>
          <InfoItem Icon={Bratislava} title="Developer" />
          <InfoItem Icon={MapMarkerIcon} title="New York" />
          <InfoItem Icon={DateRange} title="Joined March 17" />
        </FlexBetween>

        <FlexBetween marginTop={6} flexWrap="wrap">
          <ProgressWrapper>
            <Typography variant="body2" mb={0.5}>
              Profile Completion
            </Typography>

            <FlexBox alignItems="center" gap={1}>
              <LinearProgress value={60} color="success" variant="determinate" />
              <Typography variant="caption" fontWeight={500}>
                60%
              </Typography>
            </FlexBox>
          </ProgressWrapper>

          <FlexBox gap={1}>
            <Button size="small" color="secondary">
              Follow
            </Button>

            <Button size="small">Hire Me</Button>

            <Button size="small" color="secondary" sx={{
            minWidth: 0,
            borderRadius: 2
          }}>
              <MoreHoriz fontSize="small" />
            </Button>
          </FlexBox>
        </FlexBetween>
      </Box>
    </ContentWrapper>;
}