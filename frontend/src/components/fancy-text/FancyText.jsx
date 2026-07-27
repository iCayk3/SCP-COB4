import { StyledFancyText } from './style';
export function FancyText({
  children,
  ...props
}) {
  return <StyledFancyText {...props}>{children}</StyledFancyText>;
}