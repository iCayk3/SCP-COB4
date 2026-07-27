import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import AvatarGroup from '@mui/material/AvatarGroup';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Add from '@mui/icons-material/Add';
import MoreHoriz from '@mui/icons-material/MoreHoriz';
// CUSTOM COMPONENTS
import { Link } from '@/components/link';
import { FlexBetween } from '@/components/flexbox';
import { MoreButton } from '@/components/more-button';
// STYLED COMPONENT
import { StyledRoot } from './styles';
// CUSTOM DATA TYPES

const DATE_FORMAT_OPTIONS = {
  day: 'numeric',
  month: 'short',
  year: 'numeric'
};
const TYPOGRAPHY_STYLES = {
  mb: 1,
  fontSize: 18,
  fontWeight: 500,
  color: 'text.primary'
};

// ==============================================================

// ==============================================================

export default function ProjectCard2({
  project
}) {
  return <StyledRoot>
      <FlexBetween>
        <Typography variant="body2" fontWeight={500} color="text.secondary">
          {new Date(project.endDate).toLocaleDateString('en-US', DATE_FORMAT_OPTIONS)}
        </Typography>

        <MoreButton Icon={MoreHoriz} />
      </FlexBetween>

      <Link href="/dashboard/projects/details">
        <div className="content">
          <Typography variant="body1" sx={TYPOGRAPHY_STYLES}>
            {project.name}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {project.description}
          </Typography>
        </div>
      </Link>

      <FlexBetween py={1}>
        <Typography variant="body2" fontWeight={500}>
          Project Progress
        </Typography>

        <Typography variant="body2" fontWeight={500}>
          {project.progress}%
        </Typography>
      </FlexBetween>

      <LinearProgress variant="determinate" value={32} />

      <FlexBetween pt="1.5rem">
        <AvatarGroup max={4}>
          {project.members.map((member, index) => <Avatar key={index} alt={member} src={member} />)}
        </AvatarGroup>

        <IconButton className="add-btn">
          <Add fontSize="small" />
        </IconButton>
      </FlexBetween>
    </StyledRoot>;
}