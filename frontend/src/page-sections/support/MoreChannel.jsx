import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
// CUSTOM COMPONENTS
import { Link } from '@/components/link';
import { FlexBox } from '@/components/flexbox';
// CUSTOM DUMMY DATA
import { CHANNELS } from './data';
export default function MoreChannel() {
  return <Card className="p-3">
      <Typography variant="body1" fontWeight={500}>
        More Channel
      </Typography>

      <Stack spacing={2} mt={2}>
        {CHANNELS.map(({
        id,
        image,
        title
      }) => <FlexBox alignItems="center" gap={1.5} key={id}>
            <Avatar src={image} alt={title} sx={{
          width: 30,
          height: 30
        }} />

            <div>
              <Typography variant="body2" fontWeight={500}>
                {title}
              </Typography>

              <Typography variant="body2" fontSize={12} color="text.secondary">
                Follow us at <Link href="#">UI-Lib</Link>
              </Typography>
            </div>
          </FlexBox>)}
      </Stack>
    </Card>;
}