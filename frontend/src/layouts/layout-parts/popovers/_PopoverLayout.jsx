import { Fragment, memo, useCallback, useMemo, useRef, useState } from 'react';
// MUI
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Popover from '@mui/material/Popover';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

// STYLED COMPONENTS
const PopoverTitle = styled(Typography)(({
  theme
}) => ({
  padding: theme.spacing(2),
  paddingTop: theme.spacing(1.5),
  fontWeight: 500
}));
const PopoverFooter = styled('div')(({
  theme
}) => ({
  padding: theme.spacing(1),
  paddingBottom: theme.spacing(0.5)
}));

// ===================================================================

// ===================================================================

export default memo(function PopoverLayout({
  title,
  selectButton,
  renderContent,
  minWidth = 250,
  maxWidth = 375,
  showMoreButton = true
}) {
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const handleOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => setOpen(false), []);
  const SLOT_PROPS = {
    paper: {
      sx: {
        minWidth,
        maxWidth,
        width: '100%',
        padding: '0.5rem 0'
      }
    }
  };
  const content = useMemo(() => renderContent(handleClose), [renderContent, handleClose]);
  return <Fragment>
      <IconButton onClick={handleOpen} ref={anchorRef}>
        {selectButton}
      </IconButton>

      <Popover open={open} onClose={handleClose} anchorEl={anchorRef.current} anchorOrigin={{
      horizontal: 'left',
      vertical: 'bottom'
    }} slotProps={SLOT_PROPS}>
        {typeof title === 'string' ? <PopoverTitle variant="body1">{title}</PopoverTitle> : title}

        <Divider />

        {content}

        {showMoreButton && <PopoverFooter>
            <Button variant="text" fullWidth disableRipple>
              View all Notifications
            </Button>
          </PopoverFooter>}
      </Popover>
    </Fragment>;
});