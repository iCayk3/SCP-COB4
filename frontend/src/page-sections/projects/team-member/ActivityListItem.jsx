import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

// STYLED COMPONENT
const StyledRoot = styled('div')(({
  theme
}) => ({
  gap: '1rem',
  display: 'flex',
  marginBottom: '1rem',
  '&:last-child': {
    marginBottom: 0
  },
  '& .icon-wrapper': {
    width: 30,
    height: 30,
    display: 'flex',
    marginTop: '5px',
    borderRadius: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.palette.action.hover,
    '.icon': {
      fontSize: 16,
      color: theme.palette.text.secondary
    }
  }
}));

// ==============================================================

// ==============================================================

export default function ActivityListItem({
  title,
  Icon,
  date
}) {
  return <StyledRoot>
      <div>
        <div className="icon-wrapper">
          <Icon className="icon" />
        </div>
      </div>

      <div>
        <Typography variant="body2" fontWeight={500}>
          {title}
        </Typography>

        <Typography variant="body2" fontSize={13} color="text.secondary" sx={{
        mt: 0.75
      }}>
          {date}
        </Typography>
      </div>
    </StyledRoot>;
}