import MuiModal from '@mui/material/Modal';
import { StyledScrollbar, Wrapper } from './styles';
export function Modal({
  children,
  open,
  sx,
  handleClose
}) {
  return <MuiModal open={open} onClose={handleClose}>
      <Wrapper sx={sx}>
        <StyledScrollbar>{children}</StyledScrollbar>
      </Wrapper>
    </MuiModal>;
}