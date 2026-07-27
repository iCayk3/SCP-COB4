import { StyledBadge } from './styles';
export function AvatarBadge({
  ref,
  children,
  width = 25,
  height = 25,
  ...others
}) {
  return <StyledBadge ref={ref} width={width} height={height} overlap="circular" anchorOrigin={{
    vertical: 'bottom',
    horizontal: 'right'
  }} {...others}>
      {children}
    </StyledBadge>;
}