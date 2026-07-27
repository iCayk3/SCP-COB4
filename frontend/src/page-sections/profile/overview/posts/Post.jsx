import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
// MUI ICON COMPONENT
import Add from '@mui/icons-material/Add';
// CUSTOM COMPONENTS
import PostItem from './PostItem';
import { FlexBetween } from '@/components/flexbox';
const POST_LIST = [{
  id: 1,
  category: 'Esports',
  date: 'Nov 21, 2021',
  imgLink: '/static/post/1.png',
  title: 'The International on the way 2021'
}, {
  id: 2,
  category: 'Environment',
  date: 'Aug 21, 2021',
  imgLink: '/static/post/2.png',
  title: 'Global Warming Conclusion'
}, {
  id: 3,
  category: 'Environment',
  date: 'Jun 21, 2021',
  imgLink: '/static/post/3.png',
  title: 'Crypto is the future'
}];
export default function Post() {
  return <Card className="p-3">
      <FlexBetween flexWrap="wrap" gap={1}>
        <Typography variant="body1" fontWeight={500}>
          Posts
        </Typography>

        <Button color="secondary" variant="outlined" startIcon={<Add />}>
          Create a post
        </Button>
      </FlexBetween>

      <Stack spacing={3} mt={2}>
        {POST_LIST.map(item => <PostItem key={item.id} date={item.date} title={item.title} imgLink={item.imgLink} category={item.category} />)}
      </Stack>
    </Card>;
}