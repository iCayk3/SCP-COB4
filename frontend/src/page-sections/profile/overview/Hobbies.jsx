import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
const HOBBIES = ['Dota 2', 'Dog', 'Basketball', 'Football', 'Cricket', 'Skateboarding', 'Rock Climbing', 'Painting', 'Cars', 'Video Games', 'Climbing', 'Hockey', 'Table Tennis'];
export default function Hobbies() {
  return <Card className="p-3">
      <Typography variant="body1" fontWeight={500} sx={{
      mb: 3
    }}>
        Hobbies
      </Typography>

      <Stack direction="row" gap={2} flexWrap="wrap">
        {HOBBIES.map(item => <Chip color="secondary" key={item} label={item} />)}
      </Stack>
    </Card>;
}