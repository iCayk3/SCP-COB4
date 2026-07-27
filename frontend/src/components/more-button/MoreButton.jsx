import { useState, useCallback } from 'react';
import Menu from '@mui/material/Menu';
import Fade from '@mui/material/Fade';
import MenuItem from '@mui/material/MenuItem';
import MoreVert from '@mui/icons-material/MoreVert';
import { StyledIconButton } from './styles';
const optionList = ['Create', 'Edit', 'Delete'];
export function MoreButton({
  size = 'large',
  Icon = MoreVert,
  options = optionList,
  renderOptions,
  ...props
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClose = useCallback(() => setAnchorEl(null), []);
  return <div>
      <StyledIconButton size={size} aria-label="more" aria-haspopup="true" onClick={e => setAnchorEl(e.currentTarget)} {...props}>
        <Icon fontSize="small" />
      </StyledIconButton>

      <Menu anchorEl={anchorEl} onClose={handleClose} open={Boolean(anchorEl)} slots={{
      transition: Fade
    }}>
        {renderOptions ? renderOptions(handleClose) : options.map(option => <MenuItem key={option} onClick={handleClose}>
                {option}
              </MenuItem>)}
      </Menu>
    </div>;
}