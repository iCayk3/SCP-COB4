import { useNavigate } from 'react-router';
// MUI
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
// CUSTOM ICON COMPONENTS
import Apps from '@/icons/Apps';
import FormatBullets from '@/icons/FormatBullets';

//  STYLED COMPONENTS
const Wrapper = styled('div')(({
  theme
}) => ({
  gap: '1rem',
  display: 'flex',
  alignItems: 'center',
  paddingBlock: '1.5rem',
  paddingInline: '1rem',
  '.select': {
    flex: '1 1 200px'
  },
  '.navigation': {
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    backgroundColor: theme.palette.grey[50],
    ...theme.applyStyles('dark', {
      backgroundColor: theme.palette.grey[700]
    }),
    [theme.breakpoints.down(440)]: {
      display: 'none'
    }
  }
}));

// ==============================================================

// ==============================================================

const FILTER_VALUES = [{
  id: 1,
  name: 'All',
  value: ''
}, {
  id: 2,
  name: 'Published',
  value: 'published'
}, {
  id: 3,
  name: 'Draft',
  value: 'draft'
}];
export default function ProductTableActions({
  handleChangeFilter,
  filter
}) {
  const navigate = useNavigate();
  return <Wrapper>
      <TextField select fullWidth label="Publish" className="select" value={filter.publish} onChange={e => handleChangeFilter('publish', e.target.value)}>
        {FILTER_VALUES.map(({
        id,
        name,
        value
      }) => <MenuItem key={id} value={value}>
            {name}
          </MenuItem>)}
      </TextField>

      <TextField fullWidth label="Search by product name..." value={filter.search} onChange={e => handleChangeFilter('search', e.target.value)} />

      <div className="navigation">
        <IconButton disableRipple>
          <FormatBullets color="primary" />
        </IconButton>

        <IconButton disableRipple onClick={() => navigate('/dashboard/product-grid')}>
          <Apps />
        </IconButton>
      </div>
    </Wrapper>;
}