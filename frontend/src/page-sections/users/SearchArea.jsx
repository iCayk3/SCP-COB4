import { useLocation, useNavigate } from 'react-router';
// MUI
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import Search from '@mui/icons-material/Search';
// CUSTOM COMPONENTS
import { FlexBetween } from '@/components/flexbox';
// CUSTOM ICON COMPONENTS
import Apps from '@/icons/Apps';
import FormatBullets from '@/icons/FormatBullets';

// STYLED COMPONENTS
const SearchTextField = styled(TextField)({
  maxWidth: 400,
  width: '100%'
});
const ActionButtons = styled('div')(({
  theme
}) => ({
  flexShrink: 0,
  borderRadius: 8,
  backgroundColor: theme.palette.action.hover
}));

// ==========================================================================================

// ==========================================================================================

export default function SearchArea({
  value = '',
  onChange,
  gridRoute,
  listRoute
}) {
  const navigate = useNavigate();
  const {
    pathname
  } = useLocation();
  const activeColor = path => pathname === path ? 'primary.main' : 'grey.400';
  return <FlexBetween gap={1} my={3}>
      {/* SEARCH BOX */}
      <SearchTextField value={value} onChange={onChange} placeholder="Search..." slotProps={{
      input: {
        startAdornment: <Search />
      }
    }} />

      {/* NAVIGATION BUTTONS */}
      <ActionButtons className="actions">
        <IconButton disableRipple onClick={() => navigate(listRoute)}>
          <FormatBullets sx={{
          color: activeColor(listRoute)
        }} />
        </IconButton>

        <IconButton disableRipple onClick={() => navigate(gridRoute)}>
          <Apps sx={{
          color: activeColor(gridRoute)
        }} />
        </IconButton>
      </ActionButtons>
    </FlexBetween>;
}