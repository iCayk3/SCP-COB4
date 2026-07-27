import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { FlexBetween, FlexBox } from '@/components/flexbox';
import { format } from '@/utils/currency';
const COUNTRIES = [{
  id: 'fDlPa6iYWBoB54b2TnZvw',
  name: 'USA',
  total: 68258,
  percentage: 4.67,
  subtitle: '30% visits',
  image: '/static/flags/usa-round.png'
}, {
  id: '0CvMqzNx_0mMkMCtuhR1Y',
  name: 'UK',
  total: 50683,
  percentage: 2.59,
  subtitle: '20% visits',
  image: '/static/flags/uk-round.png'
}, {
  id: '7pHEOJzPDYWx0L01zpqf6',
  name: 'Germany',
  total: 62053,
  percentage: -1.18,
  subtitle: '28% visits',
  image: '/static/flags/germany-round.png'
}, {
  id: '4q0d-DN1DVW8EZnl6nKWW',
  name: 'Spain',
  total: 40369,
  percentage: -2.98,
  subtitle: '18% visits',
  image: '/static/flags/spain-round.png'
}, {
  id: 'aKYZHCUVlq4PIr2cjCcoB',
  total: 3258,
  name: 'China',
  percentage: 1.22,
  subtitle: '4% visits',
  image: '/static/flags/china-round.png'
}];
export default function VisitsByCountry() {
  return <Card className="p-3 h-full">
      <Typography variant="h6">Visits by country</Typography>

      <Typography variant="body2" fontSize={13} color="text.secondary">
        Total 200 countries visits
      </Typography>

      <Stack spacing={2} mt={3}>
        {COUNTRIES.map(({
        id,
        image,
        name,
        total,
        subtitle,
        percentage
      }) => <FlexBetween key={id}>
            <FlexBox gap={1.5} overflow="hidden" whiteSpace="nowrap" textOverflow="ellipsis">
              <Avatar variant="rounded" alt={name} src={image} />

              <Box textOverflow="ellipsis" whiteSpace="nowrap" overflow="hidden">
                <Typography variant="body2" noWrap lineHeight={1} fontWeight={500}>
                  {name}
                </Typography>

                <Typography variant="caption" noWrap fontWeight={500} color="text.secondary">
                  {subtitle}
                </Typography>
              </Box>
            </FlexBox>

            <Box textAlign="end">
              <Typography variant="body2" fontWeight={500}>
                {format(total)}
              </Typography>

              <Typography fontWeight={500} variant="caption" color={percentage < 0 ? 'error.main' : 'success.main'}>
                {percentage}
              </Typography>
            </Box>
          </FlexBetween>)}
      </Stack>
    </Card>;
}