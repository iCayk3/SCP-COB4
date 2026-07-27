import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
// CUSTOM UTILS METHODS
import { currency } from '@/utils/currency';

// STYLED COMPONENTS
const AsiaBox = styled('div')(({
  theme
}) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 180,
  height: 180,
  color: 'white',
  margin: 'auto',
  borderRadius: '50%',
  position: 'relative',
  flexDirection: 'column',
  border: '1.5px solid white',
  boxShadow: theme.shadows[1],
  backgroundColor: theme.palette.primary.main
}));
const EuropeBox = styled('div')(({
  theme
}) => ({
  width: 120,
  height: 120,
  top: '60%',
  right: '60%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '50%',
  position: 'absolute',
  flexDirection: 'column',
  border: '1.5px solid white',
  boxShadow: theme.shadows[1],
  color: theme.palette.text.primary,
  backgroundColor: theme.palette.grey[200],
  ...theme.applyStyles('dark', {
    backgroundColor: theme.palette.grey[500]
  })
}));
const AfricaBox = styled('div')(({
  theme
}) => ({
  width: 100,
  height: 100,
  top: '90%',
  borderRadius: '50%',
  position: 'absolute',
  flexDirection: 'column',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '1.5px solid white',
  boxShadow: theme.shadows[1],
  backgroundColor: theme.palette.grey[700]
}));
export default function TopActivity() {
  return <Card sx={{
    p: 3,
    minHeight: 370,
    height: '100%'
  }}>
      <Typography variant="h6" sx={{
      textAlign: 'center'
    }}>
        Top Activity
      </Typography>

      <Box pl={3} width="100%" mt={3}>
        <AsiaBox>
          <Typography lineHeight={1} variant="body1" fontWeight={500}>
            {currency(1725258.69, {
            maximumFractionDigits: 0
          })}
          </Typography>

          <Typography variant="caption">Asia</Typography>

          <EuropeBox>
            <Typography lineHeight={1} variant="body1" fontWeight={500}>
              {currency(2525.25, {
              maximumFractionDigits: 0
            })}
            </Typography>

            <Typography variant="caption">Europe</Typography>
          </EuropeBox>

          <AfricaBox>
            <Typography lineHeight={1} variant="body1" fontWeight={500}>
              {currency(525, {
              maximumFractionDigits: 0
            })}
            </Typography>

            <Typography variant="caption">Africa</Typography>
          </AfricaBox>
        </AsiaBox>
      </Box>
    </Card>;
}