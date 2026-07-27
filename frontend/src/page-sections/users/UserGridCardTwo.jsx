import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
// CUSTOM DATA TYPES

// STYLED COMPONENTS
const StyledRoot = styled('div', {
  shouldForwardProp: prop => prop !== 'isSelected'
})(({
  theme,
  isSelected
}) => ({
  padding: '1rem',
  height: '100%',
  borderRadius: 8,
  cursor: 'pointer',
  transition: 'all 0.4s',
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: isSelected ? theme.palette.primary.main : 'transparent',
  '.truncate': {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis'
  }
}));

// ==============================================================

// ==============================================================

export default function UserGridCardTwo({
  user,
  isSelected,
  handleSelectUser
}) {
  return <StyledRoot onClick={handleSelectUser} isSelected={isSelected}>
      <Stack direction="row" alignItems="center" spacing={1} className="truncate">
        <Avatar src={user.avatar} variant="rounded" sx={{
        width: 32,
        height: 32
      }} />

        <div className="truncate">
          <Typography noWrap variant="body2" fontWeight={500} color={isSelected ? 'white' : 'text.primary'}>
            {user.name}
          </Typography>

          <Typography variant="body2" fontSize={13} color={isSelected ? 'white' : 'text.secondary'}>
            {user.position}
          </Typography>
        </div>
      </Stack>
    </StyledRoot>;
}