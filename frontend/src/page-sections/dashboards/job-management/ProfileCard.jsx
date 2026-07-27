import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
// MUI ICON COMPONENTS
import MoreHoriz from '@mui/icons-material/MoreHoriz';
// CUSTOM COMPONENTS
import { Link } from '@/components/link';
import { AvatarLoading } from '@/components/avatar-loading';
import { FlexBox, FlexBetween, FlexRowAlign } from '@/components/flexbox';
// CUSTOM ICON COMPONENTS
import MapMarkerIcon from '@/icons/MapMarkerIcon';
export default function ProfileCard() {
  return <Card className="p-3 h-full">
      <FlexRowAlign flexDirection="column" gap={1.5}>
        <AvatarLoading src="/static/user/user-11.png" percentage={60} sx={{
        width: 55,
        height: 55
      }} />

        <Chip label="Pro" size="small" />

        <div>
          <Typography variant="h6">Nabed Khan</Typography>

          <Typography variant="body2" fontSize={12} fontWeight={500} color="text.secondary">
            UI / UX Designer
          </Typography>
        </div>

        <FlexBox gap={0.5} alignItems="center">
          <MapMarkerIcon color="primary" fontSize="small" />
          <Typography variant="caption" fontWeight={600} color="primary.main">
            New York, US
          </Typography>
        </FlexBox>
      </FlexRowAlign>

      <FlexBetween mt={4} fontSize={14}>
        <Typography variant="body2" fontWeight={500}>
          Recent Job Posted
        </Typography>

        <Link href="#">View all</Link>
      </FlexBetween>

      {['Sr. Android Developer', 'UI / UX Designer'].map((item, i) => <FlexBetween mt={2.5} key={item}>
          <FlexBox alignItems="center" gap={2}>
            <FlexRowAlign sx={{
          width: 50,
          height: 50,
          borderRadius: '8px',
          backgroundColor: 'primary.50'
        }}>
              <Typography variant="h5" fontSize={24} color="primary.main">
                {95 + i}
              </Typography>
            </FlexRowAlign>

            <div>
              <Typography variant="body2" fontWeight={500}>
                {item}
              </Typography>

              <Typography variant="body2" lineHeight={1.7} color="text.secondary">
                Total Applications
              </Typography>
            </div>
          </FlexBox>

          <IconButton>
            <MoreHoriz fontSize="small" />
          </IconButton>
        </FlexBetween>)}

      <FlexBetween mt={4} gap={3}>
        <Button fullWidth size="large" variant="outlined">
          Message
        </Button>

        <Button fullWidth size="large" variant="contained">
          Connect
        </Button>
      </FlexBetween>
    </Card>;
}