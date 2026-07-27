import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { FlexBetween, FlexBox } from '@/components/flexbox';
import { format } from '@/utils/currency';
const TRANSPORTATION_LIST = [{
  id: '-8kf9VbsEs9YXIk2Z2BiM',
  title: 'Ships',
  weight: 50368258,
  total: '500 ships',
  image: '/static/transportation/1.png'
}, {
  id: 'LCppmPK7xFgmy9MXPPcR_',
  title: 'Planes',
  weight: 2336569,
  total: '25 planes',
  image: '/static/transportation/2.png'
}, {
  id: 'qWkWAHHDy5XEGLm_CU27o',
  title: 'Trucks',
  weight: 36566547,
  total: '2500 Trucks',
  image: '/static/transportation/3.png'
}, {
  id: 'GMIF83b5vLvizQZwTsXpb',
  title: 'Trains',
  weight: 10236482,
  total: '1000 trains',
  image: '/static/transportation/4.png'
}];
export default function OurTransportation() {
  return <Card className="p-3">
      <Typography variant="h6">Our Transportation</Typography>

      <Typography variant="body2" fontSize={13} color="text.secondary">
        Total 5,200 vehicles
      </Typography>

      <Stack spacing={3} mt={3}>
        {TRANSPORTATION_LIST.map(({
        id,
        image,
        title,
        total,
        weight
      }) => <FlexBetween key={id}>
            <FlexBox gap={1.5} overflow="hidden" whiteSpace="nowrap" textOverflow="ellipsis">
              <Avatar variant="rounded" alt={title} src={image} />

              <Box textOverflow="ellipsis" whiteSpace="nowrap" overflow="hidden">
                <Typography variant="body2" noWrap fontWeight={500}>
                  {title}
                </Typography>

                <Typography noWrap variant="caption" fontWeight={500} color="text.secondary">
                  {total}
                </Typography>
              </Box>
            </FlexBox>

            <Box textAlign="end">
              <Typography variant="body2">{format(weight)}</Typography>
              <Typography variant="caption" color="text.secondary">
                Tons
              </Typography>
            </Box>
          </FlexBetween>)}
      </Stack>
    </Card>;
}