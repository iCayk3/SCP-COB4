// MUI ICON COMPONENTS
import Add from '@mui/icons-material/Add';
import MoreHoriz from '@mui/icons-material/MoreHoriz';
// MUI
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
// CUSTOM COMPONENTS
import { Link } from '@/components/link';
import { MoreButton } from '@/components/more-button';
import { FlexBetween } from '@/components/flexbox';
// STYLED COMPONENTS
import { StyledAvatarGroup, StyledRoot } from './styles';
// CUSTOM DATA TYPES

const DATE_FORMAT_OPTIONS = {
  day: 'numeric',
  month: 'short',
  year: '2-digit'
};
const DESCRIPTION_STYLES = {
  my: 3,
  fontWeight: 500,
  lineHeight: 1.5,
  color: 'text.secondary',
  display: '-webkit-box',
  WebkitLineClamp: 3,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden'
};

// ==============================================================

// ==============================================================

export default function ProjectCard1({
  project
}) {
  return <StyledRoot>
      <FlexBetween gap={2}>
        <div className="truncate">
          <Link href="/dashboard/projects/details">
            <Typography noWrap variant="body1" sx={{
            fontWeight: 500,
            color: 'text.primary'
          }}>
              {project.name}
            </Typography>
          </Link>

          <Typography variant="body2" fontWeight={500} color="text.secondary">
            Due on {new Date(project.endDate).toLocaleDateString('en-US', DATE_FORMAT_OPTIONS)}
          </Typography>
        </div>

        <MoreButton size="small" Icon={MoreHoriz} />
      </FlexBetween>

      <Typography variant="body2" sx={DESCRIPTION_STYLES}>
        {project.description}
      </Typography>

      <FlexBetween pb={1}>
        <Typography variant="body2" fontWeight={500}>
          Project Progress
        </Typography>

        <Typography variant="body2" fontWeight={500}>
          {project.progress}%
        </Typography>
      </FlexBetween>

      <LinearProgress variant="determinate" value={project.progress} />

      <FlexBetween pt={3}>
        <StyledAvatarGroup max={4}>
          {project.members.map((member, index) => <Avatar key={index} alt={member} src={member} />)}
        </StyledAvatarGroup>

        <IconButton className="add-btn">
          <Add fontSize="small" />
        </IconButton>
      </FlexBetween>
    </StyledRoot>;
}