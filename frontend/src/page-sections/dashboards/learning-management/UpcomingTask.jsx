import { NavLink } from 'react-router';
import { useTranslation } from 'react-i18next';
// MUI ICON COMPONENT
import MoreHoriz from '@mui/icons-material/MoreHoriz';
// MUI
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
// CUSTOM COMPONENTS
import { FlexBetween } from '@/components/flexbox';

// STYLED COMPONENTS
const StyledRoot = styled(Card)(({
  theme
}) => ({
  height: '100%',
  padding: theme.spacing(3),
  '& .link': {
    fontSize: 14
  }
}));
const TodoContent = styled('div')(({
  theme
}) => ({
  paddingLeft: '1rem',
  position: 'relative',
  '&::after': {
    top: 0,
    left: 0,
    width: '4px',
    content: '""',
    height: '100%',
    borderRadius: 16,
    position: 'absolute',
    backgroundColor: theme.palette.primary.main
  }
}));
const TASKS = [{
  id: 1,
  title: 'Meet with Simple',
  time: '01:00 PM - 02:00 PM'
}, {
  id: 2,
  title: 'Fitness Run',
  time: '03:00 PM - 04:00 PM'
}, {
  id: 3,
  title: 'Dental Care',
  time: '06:00 PM - 07:00 PM'
}, {
  id: 4,
  title: 'Dinner Date',
  time: '09:00 PM - 11:00 PM'
}];
export default function UpcomingTask() {
  const {
    t
  } = useTranslation();
  return <StyledRoot>
      <FlexBetween pb={1}>
        <Typography variant="body1" fontWeight={500}>
          {t('Upcoming Task')}
        </Typography>

        <NavLink to="#" className="link">
          View all
        </NavLink>
      </FlexBetween>

      <div>
        {TASKS.map(item => <FlexBetween mt={2.5} key={item.id}>
            <TodoContent>
              <Typography variant="body2" fontWeight={500}>
                {item.title}
              </Typography>

              <Typography variant="caption" color="text.secondary">
                {item.time}
              </Typography>
            </TodoContent>

            <IconButton>
              <MoreHoriz fontSize="small" />
            </IconButton>
          </FlexBetween>)}
      </div>
    </StyledRoot>;
}