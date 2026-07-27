import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
// CUSTOM COMPONENTS
import { FlexBox } from '@/components/flexbox';
// CUSTOM DUMMY DATA
import { DOCUMENTATIONS } from './data';
export default function Documentation() {
  return <Card sx={{
    p: 3,
    mt: 3
  }}>
      <Typography variant="body1" fontWeight={500}>
        Documentations
      </Typography>

      <Stack spacing={2} mt={2}>
        {DOCUMENTATIONS.map(item => <FlexBox alignItems="center" gap={1} key={item}>
            <Box width={8} height={8} borderRadius="50%" bgcolor="grey.300" />
            <Typography lineHeight={1.2} variant="body2" color="grey.500" fontWeight={500}>
              {item}
            </Typography>
          </FlexBox>)}
      </Stack>
    </Card>;
}