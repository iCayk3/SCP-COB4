import { Status } from './styles';
export function StatusBadge({
  children,
  type,
  ...props
}) {
  return <Status type={type} {...props}>
      {children}
    </Status>;
}