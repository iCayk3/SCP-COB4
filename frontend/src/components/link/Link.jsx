import { Link as RouterLink } from 'react-router';
export function Link({
  ref,
  href,
  ...others
}) {
  return <RouterLink ref={ref} to={href} {...others} />;
}