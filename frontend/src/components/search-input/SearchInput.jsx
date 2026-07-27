import SearchIcon from '@/icons/SearchIcon';
import { StyledInputBase } from './styles';
export function SearchInput({
  ref,
  bordered = true,
  ...props
}) {
  // SEARCH ICON
  const ADORNMENT = <SearchIcon sx={{
    mr: 1,
    fontSize: 18,
    color: 'text.secondary'
  }} />;
  return <StyledInputBase ref={ref} border={bordered} startAdornment={ADORNMENT} {...props} />;
}