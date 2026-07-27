import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
// MUI ICON COMPONENTS
import Edit from '@mui/icons-material/Edit';
import Flag from '@mui/icons-material/Flag';
import ChatBubble from '@mui/icons-material/ChatBubble';
// CUSTOM COMPONENTS
import { FlexBox } from '@/components/flexbox';
import ProjectCard3 from '../project-card-3';
import Teams from '../team-member/Teams';
import UserBio from '../team-member/UserBio';
import TodoItem from '../team-member/TodoItem';
import ListItemCard from '../team-member/ListItemCard';
import RecommendedCard from '../team-member/RecommendedCard';
import ActivityListItem from '../team-member/ActivityListItem';
export default function TeamMemberPageView() {
  return <div className="pt-2 pb-4">
      {/* USER INFORMATION SECTION */}
      <UserBio />

      <Grid container spacing={3} pt={3}>
        <Grid size={{
        md: 8,
        xs: 12
      }}>
          <Stack spacing={3}>
            {/* EXPERIENCES SECTION */}
            <Card className="p-3">
              <Typography variant="body1" fontWeight={500} sx={{
              mb: 2
            }}>
                Experiences
              </Typography>

              <Grid container spacing={2}>
                {experienceList.map(item => <Grid size={{
                sm: 6,
                xs: 12
              }} key={item.id}>
                    <ListItemCard item={item} />
                  </Grid>)}
              </Grid>
            </Card>

            {/* PROJECTS SECTION */}
            <Card className="p-3">
              <Typography variant="body1" fontWeight={500} sx={{
              mb: 2
            }}>
                Projects
              </Typography>

              <Grid container spacing={3}>
                {projectList.map((item, index) => <Grid size={{
                sm: 6,
                xs: 12
              }} key={index}>
                    <ProjectCard3 project={item} />
                  </Grid>)}
              </Grid>
            </Card>

            {/* SKILLS SECTION */}
            <Card className="p-3">
              <Typography variant="body1" fontWeight={500} sx={{
              mb: 2
            }}>
                Skills
              </Typography>

              <FlexBox flexWrap="wrap" rowGap={2} columnGap={2}>
                {skills.map((skill, i) => <Chip key={i} label={skill} color="secondary" />)}
              </FlexBox>
            </Card>

            {/* TEAM SECTION */}
            <Card className="p-3">
              <Typography variant="body1" fontWeight={500} sx={{
              mb: 2
            }}>
                Teams
              </Typography>

              <Teams />
            </Card>

            {/* RECOMMENDED SECTION */}
            <Card className="p-3">
              <Typography variant="body1" fontWeight={500} sx={{
              mb: 2
            }}>
                Recommended
              </Typography>

              <Grid container spacing={3}>
                {[1, 2].map(item => <Grid size={{
                sm: 6,
                xs: 12
              }} key={item}>
                    <RecommendedCard />
                  </Grid>)}
              </Grid>
            </Card>
          </Stack>
        </Grid>

        <Grid size={{
        md: 4,
        xs: 12
      }}>
          <Card sx={{
          padding: 3,
          mb: 3
        }}>
            <Typography variant="body1" fontWeight={500} sx={{
            mb: 2
          }}>
              Recent Activity
            </Typography>

            {recentActivity.map(({
            Icon,
            date,
            id,
            title
          }) => <ActivityListItem Icon={Icon} title={title} date={date} key={id} />)}
          </Card>

          <Card sx={{
          padding: 3,
          mb: 3
        }}>
            <Typography variant="body1" fontWeight={500}>
              Project Stack
            </Typography>

            <Stack spacing={2} mt={2}>
              {stacks.map(item => <ListItemCard item={item} key={item.id} />)}
            </Stack>
          </Card>

          <Card className="p-3">
            <Typography variant="body1" fontWeight={500}>
              Todo List
            </Typography>

            <Stack spacing={2} mt={2}>
              {todoList.map(item => <TodoItem key={item.id} title={item.title} date={item.date} />)}
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </div>;
}
const experienceList = [{
  id: 1,
  company: 'Discord Nitro',
  image: '/static/brands/nitro.svg',
  position: 'Comtec Specialist'
}, {
  id: 2,
  company: 'Invision',
  image: '/static/brands/invision.svg',
  position: 'Design prototype'
}, {
  id: 3,
  company: 'Amazon',
  image: '/static/brands/amazon.svg',
  position: 'Delivery'
}, {
  id: 4,
  company: 'Github',
  image: '/static/brands/github.svg',
  position: 'Developer'
}];
const projectList = [{
  id: 1,
  name: 'Website Redesign',
  status: 'in-progress',
  startDate: '2024-01-15',
  endDate: '2024-03-30',
  progress: 45,
  description: 'Revamping the company website for improved usability and design.',
  members: ['/static/user/user-16.png', '/static/user/user-17.png', '/static/user/user-18.png', '/static/user/user-19.png', '/static/user/user-17.png', '/static/user/user-18.png']
}, {
  id: 2,
  name: 'Mobile App Development',
  status: 'upcoming',
  startDate: '2024-04-01',
  endDate: '2024-09-15',
  progress: 0,
  description: 'Developing a new app to enhance customer engagement.',
  members: ['/static/user/user-16.png', '/static/user/user-17.png', '/static/user/user-18.png', '/static/user/user-19.png', '/static/user/user-17.png', '/static/user/user-18.png']
}];
const skills = ['Adobe Illustrator', 'Sketch', 'Adobe Photoshop', 'Adobe XD', 'Figma', 'Adobe Illustrator', 'Sketch', 'Adobe Photoshop', 'Adobe XD', 'Figma'];
const recentActivity = [{
  id: 1,
  date: 'Aug 10',
  Icon: ChatBubble,
  title: 'Karen leave some comments on Konsep Ilustrasi'
}, {
  id: 2,
  Icon: Edit,
  date: 'Aug 10',
  title: 'Karen change project info on Project Homepage'
}, {
  id: 3,
  Icon: Flag,
  date: 'Aug 10',
  title: 'Andrea change the due date of Project Homepage'
}];
const stacks = [{
  id: 1,
  company: 'HTML5',
  image: '/static/files-icon/html.svg',
  position: 'Code'
}, {
  id: 2,
  company: 'VueJS',
  image: '/static/files-icon/vue.svg',
  position: 'Code'
}, {
  id: 3,
  company: 'Sass',
  image: '/static/files-icon/sass.svg',
  position: 'Code'
}];
const todoList = [{
  id: 1,
  title: 'Create Minimal Logo',
  date: 'Due In 2 Days',
  status: 'Pending'
}, {
  id: 2,
  title: 'Stock Market Exchange',
  date: 'Due In 3 Days',
  status: 'Processing'
}, {
  id: 3,
  title: 'Shopping & Groccery',
  date: 'Due In 5 days',
  status: 'Pending'
}, {
  id: 4,
  title: 'Football Match',
  date: 'Due In 1 Day',
  status: 'Completed'
}];