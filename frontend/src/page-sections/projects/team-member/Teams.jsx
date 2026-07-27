import { memo } from 'react';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import AvatarGroup from '@mui/material/AvatarGroup';
import { styled } from '@mui/material/styles';

// STYLED COMPONENT
const StyledAvatarGroup = styled(AvatarGroup)({
  marginTop: 8,
  justifyContent: 'flex-end'
});

// ==============================================================

// ==============================================================

const TEAM_GROUPS = [{
  name: 'Discord Nitro',
  members: [{
    id: '1',
    name: 'Remy Sharp',
    avatar: '/static/user/user-16.png'
  }, {
    id: '2',
    name: 'Travis Howard',
    avatar: '/static/user/user-10.png'
  }, {
    id: '3',
    name: 'Cindy Baker',
    avatar: '/static/user/user-11.png'
  }, {
    id: '4',
    name: 'Agnes Walker',
    avatar: '/static/user/user-17.png'
  }, {
    id: '5',
    name: 'Trevor Henderson',
    avatar: '/static/user/user-18.png'
  }]
}, {
  name: 'Github',
  members: [{
    id: '6',
    name: 'John Doe',
    avatar: '/static/user/user-17.png'
  }, {
    id: '7',
    name: 'Jane Smith',
    avatar: '/static/user/user-18.png'
  }, {
    id: '8',
    name: 'Mike Johnson',
    avatar: '/static/user/user-19.png'
  }, {
    id: '9',
    name: 'Sarah Wilson',
    avatar: '/static/avatar/008-clown.svg'
  }, {
    id: '10',
    name: 'Tom Brown',
    avatar: '/static/avatar/009-firefighter.svg'
  }, {
    id: '11',
    name: 'Lisa Davis',
    avatar: '/static/avatar/011-man-2.svg'
  }]
}];
export default function Teams() {
  return <Grid container spacing={3}>
      {TEAM_GROUPS.map(group => <TeamGroup key={group.name} name={group.name} members={group.members} />)}
    </Grid>;
}
const TeamGroup = memo(function ({
  name,
  members
}) {
  return <Grid size={{
    sm: 6,
    xs: 12
  }}>
      <Typography variant="body2" fontWeight={500} color="text.secondary">
        {name}
      </Typography>

      <StyledAvatarGroup max={4}>
        {members.map(member => <Avatar key={member.id} alt={member.name} src={member.avatar} />)}
      </StyledAvatarGroup>
    </Grid>;
});