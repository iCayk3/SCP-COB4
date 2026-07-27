import { StyledScrollBar } from './styles';
export function Scrollbar({
  children,
  sx,
  ...props
}) {
  return <StyledScrollBar sx={sx} {...props}>
      {children}
    </StyledScrollBar>;
}