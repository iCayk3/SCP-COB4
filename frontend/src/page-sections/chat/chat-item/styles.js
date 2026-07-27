import { styled } from '@mui/material/styles';

// STYLED COMPONENT
export const Wrapper = styled('div')(({
  theme
}) => ({
  gap: 12,
  display: 'flex',
  padding: '1rem',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: theme.palette.action.selected
  },
  '.chat-info': {
    flexGrow: 1
  }
}));
export const UnseenMsgWrapper = styled('div')(({
  theme
}) => ({
  width: 15,
  height: 15,
  color: 'white',
  display: 'flex',
  borderRadius: '50%',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.primary.main
}));