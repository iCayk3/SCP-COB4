import { Fragment } from 'react';
import Menu from '@mui/material/Menu';
import IconButton from '@mui/material/IconButton';
import MoreVert from '@mui/icons-material/MoreVert';
export function TableMoreMenu({
  open,
  children,
  handleClose,
  handleOpen
}) {
  return <Fragment>
      <IconButton color="secondary" onClick={handleOpen}>
        <MoreVert fontSize="small" />
      </IconButton>

      <Menu anchorEl={open} open={Boolean(open)} onClose={handleClose} transformOrigin={{
      vertical: 'center',
      horizontal: 'right'
    }}>
        {children}
      </Menu>
    </Fragment>;
}