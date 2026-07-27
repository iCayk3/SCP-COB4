import { memo, useCallback } from 'react';
import { useNavigate } from 'react-router';
// MUI
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
// CUSTOM COMPONENTS
import PopoverLayout from './_PopoverLayout';
import { FlexBox } from '@/components/flexbox';
import { AvatarLoading } from '@/components/avatar-loading';
// CUSTOM DEFINED HOOK
import { useAuth } from '@/hooks/useAuth';

// STYLED COMPONENTS
const Text = styled('p')(({
  theme
}) => ({
  fontSize: 13,
  display: 'block',
  cursor: 'pointer',
  padding: '5px 1rem',
  '&:hover': {
    backgroundColor: theme.palette.action.hover
  }
}));
const AVATAR_STYLES = {
  width: 35,
  height: 35
};
export default memo(function ProfilePopover() {
  const navigate = useNavigate();
  const {
    logout
  } = useAuth();
  const SELECT_BUTTON = <AvatarLoading alt="Aaron Cooper" src="/static/user/user-11.png" percentage={60} sx={AVATAR_STYLES} />;
  const TITLE = <FlexBox alignItems="center" gap={1} p={2} pt={1}>
      <Avatar src="/static/user/user-11.png" alt="Aaron Cooper" sx={AVATAR_STYLES} />

      <div>
        <Typography variant="body2" fontWeight={500}>
          Aaron Cooper
        </Typography>

        <Typography variant="body2" color="text.secondary" fontSize={12}>
          aaron@example.com
        </Typography>
      </div>
    </FlexBox>;
  const RENDER_CONTENT = useCallback(onClose => {
    const handleMenuItem = path => () => {
      navigate(path);
      onClose();
    };
    return <Box pt={1}>
          <Text onClick={handleMenuItem('/dashboard/profile')}>Set Status</Text>
          <Text onClick={handleMenuItem('/dashboard/profile')}>Profile & Account</Text>
          <Text onClick={handleMenuItem('/dashboard/account')}>Settings</Text>
          <Text onClick={handleMenuItem('/dashboard/profile')}>Manage Team</Text>
          <Divider sx={{
        my: 1
      }} />
          <Text onClick={logout}>Sign Out</Text>
        </Box>;
  }, [navigate, logout]);
  return <PopoverLayout maxWidth={230} minWidth={200} showMoreButton={false} selectButton={SELECT_BUTTON} title={TITLE} renderContent={RENDER_CONTENT} />;
});