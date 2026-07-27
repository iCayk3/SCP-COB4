// MUI
import Container from '@mui/material/Container';
import { styled } from '@mui/material/styles';
// CUSTOM DEFINED HOOK
import useLayout from '@/layouts/layout-2/context/useLayout';
// UTILS
import { SECONDARY_SIDEBAR_GAP, SECONDARY_SIDEBAR_WIDTH } from '@/utils/constants';
const space = SECONDARY_SIDEBAR_WIDTH + SECONDARY_SIDEBAR_GAP;

// STYLED COMPONENT
const RootStyled = styled('div', {
  shouldForwardProp: prop => prop !== 'compact'
})(({
  theme,
  compact
}) => ({
  marginLeft: compact ? `${space}px` : '80px',
  transition: 'margin-left 0.3s ease-in-out',
  [theme.breakpoints.down(1200)]: {
    marginLeft: 0
  }
}));
export default function LayoutBodyWrapper({
  children
}) {
  const {
    openSecondarySideBar
  } = useLayout();
  return <RootStyled compact={openSecondarySideBar}>
      <Container maxWidth="lg">{children}</Container>
    </RootStyled>;
}