import Grid from '@mui/material/Grid';
// CUSTOM COMPONENT
import ProjectCard from './ProjectCard';
// CUSTOM DUMMY DATA
import { PROJECT_LIST } from './data';
export default function Projects() {
  return <Grid container spacing={3}>
      {PROJECT_LIST.map(item => <Grid size={{
      md: 4,
      sm: 6,
      xs: 12
    }} key={item.id}>
          <ProjectCard due={item.due} Icon={item.icon} users={item.users} title={item.title} value={item.value} status={item.status} description={item.description} />
        </Grid>)}
    </Grid>;
}