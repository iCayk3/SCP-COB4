import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Typography from '@mui/material/Typography';
// CUSTOM COMPONENTS
import { Link } from '@/components/link';
import { FlexBetween } from '@/components/flexbox';
// STYLED COMPONENTS
import { StyledRoot } from './styles';
// CUSTOM DATA TYPES

// ==============================================================

// ==============================================================

export default function ProjectCard3({
  project
}) {
  return <StyledRoot>
      <div className="img-wrapper">
        <img src="/static/thumbnail/thumbnail-1.png" alt="Project Thumbnail" />
      </div>

      <div className="content">
        <Link href="/dashboard/projects/details">
          <Typography variant="body1" sx={{
          mb: 1,
          fontWeight: 500,
          color: 'text.primary'
        }}>
            {project.name}
          </Typography>
        </Link>

        <Typography variant="body2" color="text.secondary">
          {project.description}
        </Typography>

        <FlexBetween flexWrap="wrap" pt="1rem" gap={1}>
          <AvatarGroup max={4}>
            {project.members.map((member, index) => <Avatar key={index} alt={member} src={member} />)}
          </AvatarGroup>

          <Chip label="3 Weeks Left" color="secondary" />
        </FlexBetween>
      </div>
    </StyledRoot>;
}