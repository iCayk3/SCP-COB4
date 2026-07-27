import { Wrapper } from './styles';
export function IconWrapper({
  ref,
  children,
  ...props
}) {
  return <Wrapper ref={ref} {...props}>
      {children}
    </Wrapper>;
}