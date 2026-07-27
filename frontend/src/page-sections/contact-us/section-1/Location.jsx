// MUI
import Typography from '@mui/material/Typography';
import PlaceOutlined from '@mui/icons-material/PlaceOutlined';
// CUSTOM COMPONENTS
import { FlexBox } from '@/components/flexbox';

// ==============================================================

// ==============================================================

export default function Location({
  country,
  address
}) {
  return <FlexBox gap={1} alignItems="flex-start" color="white">
      <PlaceOutlined sx={{
      color: 'white',
      fontSize: 25
    }} />

      <div>
        <Typography variant="body1" lineHeight={1.2} fontSize={20} fontWeight={600}>
          {country}
        </Typography>

        <Typography variant="body1" sx={{
        mt: 1.5
      }}>
          {address}
        </Typography>
      </div>
    </FlexBox>;
}