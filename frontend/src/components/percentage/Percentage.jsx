import { StyledSpan } from './styles';
export function Percentage({
  children,
  type = 'success'
}) {
  return <StyledSpan type={type}>{children}</StyledSpan>;
}